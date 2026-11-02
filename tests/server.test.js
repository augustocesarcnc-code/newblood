import {geared} from './helpers.js';
import {test} from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp,writeFile,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {spawn} from 'node:child_process';
import {once} from 'node:events';
import {setTimeout as delay} from 'node:timers/promises';
import net from 'node:net';
import {create,migrate} from '../mmo/world.js';

test('server: marketplace, trade, PvP, skills, portals and persistence', {timeout:30000}, async()=>{
 const dir=await mkdtemp(join(tmpdir(),'bloodmoon-test-'));
 const players={};for(const [token,name,kind,map,x,y] of [['alice','Alice','vampiro','cinzaveu',9,16],['bob','Bob','cacador','cinzaveu',10,16],['a','Ares','lobisomem','floresta',3,5],['b','Nyx','vampiro','floresta',4,5],['atlas','Atlas','cacador','cinzaveu',15,16],['smith','Ferreiro','vampiro','cinzaveu',11,16],['tele','Viajante','cacador','cinzaveu',7,18]]){players[token]=Object.assign(geared(name,kind),{map,x,y,gold:200,level:3,shards:10});}
 await writeFile(join(dir,'world.json'),JSON.stringify({players,listings:[]}));
 const probe=net.createServer();probe.listen(0,'127.0.0.1');await once(probe,'listening');const port=probe.address().port;await new Promise(r=>probe.close(r));
 const base='http://127.0.0.1:'+port;let child;
 async function start(){child=spawn(process.execPath,['server.js'],{cwd:new URL('../',import.meta.url),env:{...process.env,PORT:String(port),BLOODMOON_DATA_DIR:dir},stdio:'ignore'});for(let n=0;n<60;n++){try{if((await fetch(base)).ok)return;}catch{}await delay(50);}throw Error('Servidor não iniciou.');}
 async function stop(){const end=once(child,'exit');child.kill();await end;}
 async function post(path,body,token,status=200){if(token)await delay(85);const r=await fetch(base+path,{method:'POST',headers:{'Content-Type':'application/json',...(token?{Authorization:'Bearer '+token}:{})},body:JSON.stringify(body)});const data=await r.json();assert.equal(r.status,status,data.error);return data;}
 const login=async t=>(await post('/api/join',{token:t})).player;
 const act=(t,b,s)=>post('/api/action',b,t,s);
 async function snapshot(t){const r=await fetch(base+'/api/events?token='+t),reader=r.body.getReader();let text='';try{while(!text.includes('\n\n'))text+=new TextDecoder().decode((await reader.read()).value);return JSON.parse(text.split('\n')[0].slice(6));}finally{await reader.cancel();}}
 try{await start();const alice=await login('alice'),bob=await login('bob'),relic=alice.inventory[2];
  assert.ok((await snapshot('alice')).players.every(p=>!('inventory' in p)&&!('gold' in p)));
  await act('alice',{type:'list',id:relic.id,price:60});const listing=(await snapshot('bob')).market[0];
  await act('bob',{type:'buy',id:listing.id});await act('bob',{type:'buy',id:listing.id},400);assert.equal((await login('alice')).gold,260);assert.equal((await login('bob')).gold,140);
  await act('alice',{type:'trade-invite',id:bob.id});await act('alice',{type:'trade-offer',ids:[],gold:20});await act('bob',{type:'trade-offer',ids:[relic.id],gold:0});const t=(await snapshot('bob')).trade;
  await act('alice',{type:'trade-accept',revision:t.revision-1},400);await act('alice',{type:'trade-accept',revision:t.revision});await act('bob',{type:'trade-accept',revision:t.revision});assert.equal((await snapshot('bob')).trade,null);assert.equal((await login('alice')).gold,240);assert.equal((await login('bob')).gold,160);
  await login('atlas');await act('atlas',{type:'move',dx:1,dy:0});assert.equal((await login('atlas')).map,'floresta');
  const a=await login('a'),b=await login('b');await act('a',{type:'target',id:b.id});await delay(1000);assert.equal((await snapshot('b')).self.hp,b.hp);
  await act('a',{type:'pvp'});await act('b',{type:'pvp'});await act('a',{type:'target',id:b.id});await delay(300);assert.ok((await snapshot('b')).self.hp<b.hp);
  const cast=await act('a',{type:'skill',index:0});assert.ok(cast.self.mana<100);await act('a',{type:'skill',index:0},400);await act('a',{type:'pvp'},400);await act('alice',{type:'vip-checkout'},503);await post('/api/payments/mercadopago/webhook?data.id=123',{type:'payment',data:{id:123}},null,503);
  const smith=await login('smith');const sword=smith.equipment.weapon;
  const refined=await act('smith',{type:'forge',id:sword});assert.equal(refined.self.inventory.find(i=>i.id===sword).upgrade,1);assert.equal(refined.self.gold,170);assert.equal(refined.self.shards,8);
  await act('smith',{type:'npc-buy',product:'potion'},400);
  const buyer=await act('alice',{type:'npc-buy',product:'potion'});assert.equal(buyer.self.gold,228);assert.equal(buyer.self.potions,4);
  await login('tele');const teleported=await act('tele',{type:'teleport',destination:'cripta'});assert.equal(teleported.self.map,'cripta');assert.equal(teleported.self.gold,140);
  await act('smith',{type:'teleport',destination:'floresta'},400);
  assert.equal((await act('smith',{type:'skill-slot',slot:3,index:0})).self.skillSlots[3],0);await act('smith',{type:'skill-slot',slot:0,index:9},400);await act('smith',{type:'skill-slot',slot:9,index:0},400);
  const accountResponse=await fetch(base+'/api/auth/register',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email:'account@example.com',password:'test-password-12345',name:'Cuenta',kind:'vampiro'})});assert.equal(accountResponse.status,200);const cookie=accountResponse.headers.get('set-cookie').split(';')[0];assert.ok(accountResponse.headers.get('set-cookie').includes('HttpOnly'));
  const accountReq=async(path,body,status=200)=>{await delay(85);const r=await fetch(base+path,{method:'POST',headers:{'Content-Type':'application/json',Cookie:cookie},body:JSON.stringify(body)});assert.equal(r.status,status);return r.json();};
  const entered=await accountReq('/api/join',{});assert.ok(!('token' in entered));assert.equal(entered.player.transformed,false);assert.equal(entered.player.appearance.weapon,null);assert.equal(entered.player.inventory.length,0);const running=await accountReq('/api/action',{type:'move',dx:0,dy:1,running:true});assert.equal(running.self.running,true);assert.equal(running.self.moveDuration,200);
  await accountReq('/api/action',{type:'transform'},400);

  const cross=await fetch(base+'/api/action',{method:'POST',headers:{'Content-Type':'application/json',Cookie:cookie,Origin:'https://evil.example'},body:JSON.stringify({type:'pvp'})});assert.equal(cross.status,403);
  await accountReq('/api/auth/logout',{});await accountReq('/api/join',{},401);
  await stop();await start();const restored=await login('alice');assert.equal(restored.gold,228);assert.ok(restored.inventory.some(i=>i.id===relic.id));assert.equal(restored.vip,false);
 }finally{if(child&&child.exitCode===null)await stop();await rm(dir,{recursive:true,force:true});}
});
