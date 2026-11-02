// Small local synchronization smoke test, not a production capacity benchmark.
import {mkdtemp,writeFile,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import net from 'node:net';
import {spawn} from 'node:child_process';
import {once} from 'node:events';
import {setTimeout as delay} from 'node:timers/promises';
import assert from 'node:assert/strict';
import {io} from 'socket.io-client';
import {create,migrate} from '../mmo/world.js';
import {hashPassword} from '../mmo/auth.js';
import {EVENTS} from '../packages/shared/src/events.js';
const directory=await mkdtemp(join(tmpdir(),'eclipse-load-')),sockets=[],gaps=[],data={players:{},accounts:{},listings:[]},password='Local-load-test-12345',hash=await hashPassword(password);
for(let n=0;n<24;n++){const key='load-'+n,id='account-'+n;data.players[key]=migrate(create('Load'+n,'cacador'));data.accounts[id]={id,email:'load'+n+'@test.local',password:hash,characterKeys:[key],playerKey:key,role:'player',createdAt:Date.now()};}
await writeFile(join(directory,'world.json'),JSON.stringify(data));const probe=net.createServer();probe.listen(0,'127.0.0.1');await once(probe,'listening');const port=probe.address().port;await new Promise(resolve=>probe.close(resolve));const base='http://127.0.0.1:'+port,child=spawn(process.execPath,['server.js'],{cwd:new URL('../',import.meta.url),env:{...process.env,PORT:String(port),PUBLIC_BASE_URL:base,ECLIPSE_DEV:'0',BLOODMOON_DATA_DIR:directory},stdio:['ignore','ignore','pipe']});let errors='';child.stderr.on('data',chunk=>errors+=chunk);
try{
 let ready=false;for(let n=0;n<120;n++){try{if((await fetch(base+'/api/health')).ok){ready=true;break;}}catch{}await delay(50);}assert.ok(ready,errors);
 for(let n=0;n<24;n++){
  const response=await fetch(base+'/api/auth/login',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email:'load'+n+'@test.local',password})});assert.equal(response.status,200);const cookie=response.headers.get('set-cookie').split(';')[0],socket=io(base,{extraHeaders:{Cookie:cookie},transports:['websocket'],autoConnect:false});sockets.push(socket);const connected=once(socket,'connect');socket.connect();await connected;const joined=await socket.timeout(5000).emitWithAck(EVENTS.JOIN,{});assert.equal(joined.status,200,joined.error);
 }
 let samples=0;for(const socket of sockets){let previous;socket.on(EVENTS.STATE,state=>{assert.equal(state.players.length,24);if(previous)gaps.push(performance.now()-previous);previous=performance.now();samples++;});}
 await delay(3500);assert.ok(sockets.every(s=>s.connected));assert.ok(samples>=24*15);gaps.sort((a,b)=>a-b);const p95=Math.round(gaps[Math.floor(gaps.length*.95)]);assert.ok(p95<1000,'local ticks stalled');console.log(JSON.stringify({connections:24,snapshots:samples,tickIntervalP95ms:p95,durationMs:3500,scope:'local idle connections; not a production stress test'}));
}finally{for(const socket of sockets)socket.disconnect();const ended=once(child,'exit');child.kill();await ended;await rm(directory,{recursive:true,force:true});}
