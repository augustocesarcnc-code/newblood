import {test} from 'node:test';
import assert from 'node:assert/strict';
import {botDefaults,configureBot,stopBot,planBot,pathStep,combatArmor} from '../mmo/automation.js';
import {create,migrate,distance,maxHP,safe,walkable,portals} from '../mmo/world.js';
const now=100000;
function player(extra={}){return Object.assign(migrate(create('BotTester','cacador')),{map:'floresta',x:3,y:15,vipUntil:now+10000,level:3,lastHeal:0,mana:100},extra);}
const monster=(extra={})=>({id:'m',name:'Goblin',map:'floresta',x:7,y:15,hp:100,...extra});
function start(p,settings={}){configureBot(p,{...botDefaults(),enabled:true,...settings},now);return p;}
function plan(p,extra={}){return planBot(p,{now,monsters:[],...extra});}
test('VIP entitlement is authoritative, settings are typed and no client anchor is accepted',()=>{
 assert.throws(()=>start(player({vipUntil:now})),/VIP/);
 for(const settings of [{enabled:1},{radius:13},{radius:2},{potionAt:0},{potionAt:91},{autoAttack:'true'},{anchor:{x:0,y:0}},{vipUntil:now+999999}])assert.throws(()=>start(player(),settings));
 const p=start(player(),{radius:12,potionAt:90});assert.deepEqual(p.bot.anchor,{map:'floresta',x:3,y:15});assert.equal(p.bot.radius,12);
});
test('expired VIP, map changes and trading stop automation and clear its target',()=>{
 for(const reason of ['expiry','map','trade']){const p=start(player());p.target='m';if(reason==='expiry')p.vipUntil=now;if(reason==='map')p.map='cripta';assert.deepEqual(plan(p,{trading:reason==='trade'}),[]);assert.equal(p.bot.enabled,false);assert.equal(p.target,null);}
});
test('autopotion respects threshold, supply and ordinary healing cooldown',()=>{
 const p=start(player({hp:40}),{autoSkills:false});assert.ok(plan(p).some(a=>a.type==='potion'));
 p.lastHeal=now-1499;assert.ok(!plan(p).some(a=>a.type==='potion'));p.lastHeal=0;p.potions=0;assert.ok(!plan(p).some(a=>a.type==='potion'));p.potions=3;p.hp=maxHP(p);assert.ok(!plan(p).some(a=>a.type==='potion'));
});
test('offensive skill requires target range, level, mana and cooldown',()=>{
 const p=start(player(),{autoTarget:true}),m=monster({x:4});p.inventory=[{id:'bow',base:'besta',rarity:'comum'}];p.equipment.weapon='bow';assert.ok(plan(p,{monsters:[m]}).some(a=>a.type==='skill'&&a.index===0));
 for(const extra of [{mana:0},{cooldowns:[now+1,0]}]){Object.assign(p,extra);assert.ok(!plan(p,{monsters:[m]}).some(a=>a.type==='skill'&&a.index===0));p.mana=100;p.cooldowns=[0,0];}
 assert.ok(!plan(p,{monsters:[monster({x:9})]}).some(a=>a.type==='skill'&&a.index===0));
});
test('autobuff uses the level-three skill and does not refresh an active buff',()=>{
 const p=start(player(),{autoBuff:true});assert.ok(plan(p).some(a=>a.type==='skill'&&a.index===1));
 p.buffUntil=now+1;assert.ok(!plan(p).some(a=>a.type==='skill'));p.buffUntil=0;p.level=1;assert.ok(!plan(p).some(a=>a.type==='skill'));p.level=3;p.mana=0;assert.ok(!plan(p).some(a=>a.type==='skill'));
 p.buffUntil=now+1;assert.equal(combatArmor(p,now),3);assert.equal(combatArmor(p,now+1),0);
});
test('PvP hunting requires both players to opt in and excludes protected/dead/foreign targets',()=>{
 assert.throws(()=>start(player(),{huntPvp:true}),/PvP/);
 const p=start(player({pvp:true}),{huntPvp:true}),q=player({id:'enemy',x:5,pvp:true});
 assert.ok(plan(p,{players:[q]}).some(a=>a.type==='target'&&a.id===q.id));
 for(const extra of [{pvp:false},{hp:0},{map:'cripta'},{x:30}])assert.ok(!plan(p,{players:[{...q,...extra}]}).some(a=>a.type==='target'));
 const normal=start(player());assert.ok(!plan(normal,{players:[q]}).some(a=>a.type==='target'));
});
test('safe zones pause routines and never select protected creatures',()=>{
 const p=start(player({map:'cinzaveu',x:9,y:16,hp:10}));assert.equal(safe(p.x,p.y,p.map),true);assert.deepEqual(plan(p,{monsters:[monster({map:'cinzaveu',x:10,y:16})]}),[]);
});
test('auto hunt walks toward a reachable target and respects its movement interval',()=>{
 const p=start(player(),{autoHunt:true});const actions=plan(p,{monsters:[monster()]});assert.ok(actions.some(a=>a.type==='target'));const step=actions.find(a=>a.type==='move');assert.ok(step);assert.ok(distance({x:p.x+step.dx,y:p.y+step.dy},monster())<distance(p,monster()));
 assert.ok(!plan(p,{monsters:[monster()]}).some(a=>a.type==='move'));
});
test('pathfinding avoids occupied cells, portals and diagonal corner cutting',()=>{
 const p=player();const step=pathStep(p,q=>q.x===6&&q.y===15,(x,y)=>x===4&&y===15);assert.ok(step);assert.notDeepEqual(step,{type:'move',dx:1,dy:0});
 assert.equal(pathStep(p,q=>q.x===2&&q.y===15),null);
 const blocked=(x,y)=>Math.max(Math.abs(x-p.x),Math.abs(y-p.y))===1;assert.equal(pathStep(p,q=>q.x===6&&q.y===15,blocked),null);
 const next={x:p.x+step.dx,y:p.y+step.dy};assert.ok(walkable(next.x,next.y,p.map));assert.ok(!portals.some(v=>v.map===p.map&&v.x===next.x&&v.y===next.y));
});
test('lure returns a nearby group toward its original hunting point',()=>{
 const p=start(player({x:5}),{autoHunt:true,autoLure:true});p.x=8;p.target='m';const actions=plan(p,{monsters:[monster({x:9}),monster({id:'m2',x:10})]});assert.match(p.bot.status,/Lure/);const step=actions.find(a=>a.type==='move');assert.ok(step);assert.ok(distance({x:p.x+step.dx,y:p.y+step.dy},p.bot.anchor)<distance(p,p.bot.anchor));
});
test('all toggles disabled produce no autonomous selection, movement, healing or casting',()=>{
 const p=start(player({hp:10}),{autoPotion:false,autoTarget:false,autoAttack:false,autoSkills:false,autoBuff:false,autoHunt:false,autoLure:false,huntPvp:false});assert.deepEqual(plan(p,{monsters:[monster({x:4})]}),[]);stopBot(p);assert.equal(p.bot.enabled,false);
});
test('restart migration keeps settings but never restarts an unattended bot',()=>{
 const p=start(player(),{autoHunt:true});p.buffUntil=now+1000;migrate(p);assert.equal(p.bot.enabled,false);assert.equal(p.bot.autoHunt,true);assert.equal(p.buffUntil,0);
});
