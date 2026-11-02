import {test} from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp,writeFile,rm,readFile} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {spawn} from 'node:child_process';
import {once} from 'node:events';
import {setTimeout as delay} from 'node:timers/promises';
import net from 'node:net';
import {create,migrate} from '../mmo/world.js';
import {createDemoWorld,demoPassword} from '../mmo/demo-world.js';
import {checkPassword} from '../mmo/auth.js';
test('server validates VIP, runs potion/buff and pauses on manual movement or stream loss',{timeout:20000},async()=>{
 const dir=await mkdtemp(join(tmpdir(),'bloodmoon-bot-'));const vip=Object.assign(migrate(create('VipBot','cacador')),{map:'floresta',x:3,y:15,hp:40,level:3,vipUntil:Date.now()+60000}),free=Object.assign(migrate(create('FreeBot','vampiro')),{map:'cinzaveu',x:10,y:16});
 await writeFile(join(dir,'world.json'),JSON.stringify({players:{vip,free},listings:[]}));
 const probe=net.createServer();probe.listen(0,'127.0.0.1');await once(probe,'listening');const port=probe.address().port;await new Promise(r=>probe.close(r));
 const child=spawn(process.execPath,['server.js'],{cwd:new URL('../',import.meta.url),env:{...process.env,PORT:String(port),BLOODMOON_DATA_DIR:dir,PUBLIC_BASE_URL:'http://127.0.0.1:'+port},stdio:'ignore'}),base='http://127.0.0.1:'+port;let reader;
 async function post(path,body,token,status=200){await delay(85);const r=await fetch(base+path,{method:'POST',headers:{'Content-Type':'application/json',...(token?{Authorization:'Bearer '+token}:{})},body:JSON.stringify(body)}),data=await r.json();assert.equal(r.status,status,data.error);return data;}
 const act=(body,status=200)=>post('/api/action',body,'vip',status);
 try{
  for(let i=0;i<80;i++){try{if((await fetch(base)).ok)break;}catch{}await delay(40);}
  await post('/api/join',{token:'free'});await post('/api/action',{type:'bot-config',settings:{enabled:true,vipUntil:Date.now()+99999}},'free',400);
  await post('/api/join',{token:'vip'});const stream=await fetch(base+'/api/events?token=vip');reader=stream.body.getReader();await reader.read();
  await act({type:'bot-config',settings:{enabled:true,huntPvp:true}},400);await act({type:'bot-config',settings:{enabled:true,anchor:{x:0,y:0}}},400);
  await act({type:'bot-config',settings:{enabled:true,autoPotion:true,autoBuff:true,autoSkills:false,autoTarget:false,autoAttack:false,potionAt:50}});await delay(350);
  let view=(await act({type:'chat',text:'bot check'})).self;assert.ok(view.hp>40);assert.equal(view.potions,2);assert.ok(view.buffUntil>Date.now());assert.ok(view.stats.armor>=3);assert.equal(view.bot.enabled,true);
  view=(await act({type:'move',dx:0,dy:1,automated:true})).self;assert.equal(view.bot.enabled,false);assert.match(view.bot.status,/manual/);
  await act({type:'bot-config',settings:{enabled:true}});await reader.cancel();reader=null;await delay(350);view=(await(await fetch(base+'/api/state',{headers:{Authorization:'Bearer vip'}})).json()).self;assert.equal(view.bot.enabled,false);assert.equal(view.target,null);
  await act({type:'bot-stop'});
 }finally{if(reader)await reader.cancel();const ended=once(child,'exit');child.kill();await ended;await rm(dir,{recursive:true,force:true});}
});
test('local demo creates separate hashed test accounts and never overwrites progress',async()=>{
 const dir=await mkdtemp(join(tmpdir(),'bloodmoon-demo-'));
 try{const first=await createDemoWorld(dir);assert.equal(first.created,true);const before=await readFile(join(dir,'world.json'),'utf8'),data=JSON.parse(before);assert.equal(Object.keys(data.accounts).length,3);assert.equal(Object.keys(data.authSessions).length,0);for(const account of Object.values(data.accounts)){assert.ok(await checkPassword(demoPassword,account.password));const p=data.players[account.playerKey];assert.ok(p.vipUntil>Date.now());assert.ok(p.potions>0);}assert.equal((await createDemoWorld(dir)).created,false);assert.equal(await readFile(join(dir,'world.json'),'utf8'),before);}finally{await rm(dir,{recursive:true,force:true});}
});
