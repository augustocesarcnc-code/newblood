import {test} from 'node:test';
import assert from 'node:assert/strict';
import {create,migrate,maps,portals,walkable,distance,transform} from '../mmo/world.js';
import {item,equip,describe} from '../mmo/items.js';
import {addItem,splitStack,moveItem,normalizeInventory} from '../mmo/inventory.js';
import {spawnLoot,pickupLoot,dropItem} from '../mmo/ground-loot.js';
import {npcBuy,npcSell} from '../mmo/village.js';
import {inviteParty,acceptParty,leaveParty,kickParty,experienceRecipients} from '../mmo/parties.js';
import {createChatMessage,visibleMessages} from '../mmo/chat.js';
import {acceptQuest,questEvent,claimQuest} from '../mmo/quests.js';
import {updateMonster} from '../mmo/monster-ai.js';
import {monsterTypes} from '../mmo/bestiary.js';
import {mapObjects} from '../mmo/map-data.js';
import {runAdmin} from '../mmo/admin.js';
import {castSkill} from '../mmo/combat-skills.js';
import {environmentAt} from '../mmo/environment.js';
const player=(name='Tester',kind='cacador')=>{const p=migrate(create(name,kind));normalizeInventory(p);return p;};
test('stacks, splitting, swapping and full-inventory purchases conserve resources atomically',()=>{
 const p=player();p.gold=10000;addItem(p,{...item('pocao'),quantity:49});for(let n=0;n<39;n++)addItem(p,item('espada'));
 npcBuy(p,'pocao',1);assert.equal(p.inventory[0].quantity,50);const before=structuredClone(p);assert.throws(()=>npcBuy(p,'pocao',2),/cheio/);assert.deepEqual(p,before);
 assert.throws(()=>splitStack(p,p.inventory[0].id,10),/cheio/);const removed=p.inventory.pop();splitStack(p,p.inventory[0].id,10);assert.equal(p.inventory.filter(i=>i.base==='pocao').reduce((sum,i)=>sum+i.quantity,0),50);
 moveItem(p,p.inventory.at(-1).id,0);assert.equal(p.inventory.filter(i=>i.base==='pocao').length,1);assert.equal(p.inventory[0].quantity,50);addItem(p,removed);assert.equal(p.inventory.length,40);assert.equal(new Set(p.inventory.map(i=>i.slot)).size,40);
 const stack=p.inventory[0],gold=p.gold;npcSell(p,stack.id);assert.equal(p.gold,gold+50*npcSellPrice());function npcSellPrice(){const d=describe(item('pocao'));return Math.max(1,Math.floor(8+d.attack*3+d.armor*4));}
});
test('ground loot validates ownership, range, capacity, expiry and single collection',()=>{
 const data={},p=player('Owner'),q=player('Other'),now=100000;const loot=spawnLoot(data,p,{...item('fragmento'),quantity:5},[p.id],now);
 assert.throws(()=>pickupLoot(data,q,loot.id,now),/reservado/);q.x+=5;assert.throws(()=>pickupLoot(data,q,loot.id,now+31000),/Aproxime/);
 pickupLoot(data,p,loot.id,now);assert.equal(p.inventory[0].quantity,5);assert.throws(()=>pickupLoot(data,p,loot.id,now),/disponível/);
 const dropped=dropItem(data,p,p.inventory[0].id,2,now);assert.equal(p.inventory[0].quantity,3);pickupLoot(data,p,dropped.id,now);assert.equal(p.inventory[0].quantity,5);
 const expired=spawnLoot(data,p,item('anel'),[],now);assert.throws(()=>pickupLoot(data,p,expired.id,now+600000),/disponível/);
 const full=player();for(let n=0;n<40;n++)addItem(full,item('espada'));const reserved=spawnLoot(data,full,item('anel'),[],now);assert.throws(()=>pickupLoot(data,full,reserved.id,now),/cheio/);assert.ok(data.groundLoot.some(l=>l.id===reserved.id));
});
test('parties enforce invitation ownership, leadership, five members and nearby XP eligibility',()=>{
 const players=Array.from({length:7},(_,i)=>player('Member'+i)),data={players:Object.fromEntries(players.map(p=>[p.id,p]))},invites=new Map(),[leader,member,other]=players;
 const invite=inviteParty(data,leader,member,invites,1000);assert.throws(()=>acceptParty(data,other,invite.id,invites,1001),/inválido/);acceptParty(data,member,invite.id,invites,1001);assert.throws(()=>inviteParty(data,member,other,invites,1002),/líder/);
 for(const p of players.slice(2,5)){const i=inviteParty(data,leader,p,invites,1002);acceptParty(data,p,i.id,invites,1003);}assert.throws(()=>inviteParty(data,leader,players[5],invites,1004),/cinco/);
 member.map='floresta';other.x+=20;assert.equal(experienceRecipients(data,leader,players).length,3);assert.throws(()=>kickParty(data,member,leader.id),/líder/);kickParty(data,leader,other.id);leaveParty(data,leader);assert.equal(Object.values(data.parties)[0].leader,member.id);
});
test('chat isolates private, local and party messages and rate limits spam',()=>{
 const p=player('Sender'),q=player('Recipient'),outsider=player('Stranger'),data={players:{}},online=[p,q,outsider];const msg=createChatMessage(data,p,{text:'/w Recipient segredo'},online,10000);
 assert.equal(visibleMessages([msg],p).length,1);assert.equal(visibleMessages([msg],q).length,1);assert.equal(visibleMessages([msg],outsider).length,0);assert.throws(()=>createChatMessage(data,p,{text:'spam'},online,10001),/Aguarde/);
 const local=createChatMessage(data,p,{text:'oi',channel:'LOCAL'},online,12000);q.map='floresta';assert.equal(visibleMessages([local],q).length,0);assert.throws(()=>createChatMessage(data,p,{text:'x',channel:'PARTY'},online,14000),/grupo/);
 const invites=new Map(),invite=inviteParty(data,p,q,invites,14000);acceptParty(data,q,invite.id,invites,14001);const party=createChatMessage(data,p,{text:'/party grupo'},online,16000);assert.equal(visibleMessages([party],q).length,1);assert.equal(visibleMessages([party],outsider).length,0);
});
test('quests grant rewards once and delivery consumes only the required material',()=>{
 const p=player();for(let n=0;n<10;n++)questEvent(p,'kill','rat');const reward=claimQuest(p,'bloodforest');assert.equal(reward.gold,100);assert.equal(p.gold,100);assert.equal(p.inventory[0].base,'amuleto');assert.throws(()=>claimQuest(p,'bloodforest'),/concluído/);
 acceptQuest(p,'delivery');addItem(p,{...item('fragmento'),quantity:5});claimQuest(p,'delivery');assert.equal(p.inventory.find(i=>i.base==='fragmento').quantity,2);assert.throws(()=>claimQuest(p,'delivery'),/concluído/);
 acceptQuest(p,'firstforge');assert.throws(()=>claimQuest(p,'firstforge'),/concluído/);questEvent(p,'talk','forge');claimQuest(p,'firstforge');assert.equal(p.quests.firstforge.status,'claimed');
});
test('Tiled regions form connected routes with passable destinations and all required encounters',()=>{
 const reached=new Set(['cinzaveu']);for(let n=0;n<6;n++)for(const portal of portals){assert.ok(walkable(portal.x,portal.y,portal.map));assert.ok(walkable(portal.tx,portal.ty,portal.to));if(reached.has(portal.map))reached.add(portal.to);}assert.equal(reached.size,6);
 const species=new Set();for(const map of Object.keys(maps)){assert.ok(mapObjects(map,'spawn').length);for(const m of mapObjects(map,'monsters')){assert.ok(monsterTypes[m.species]);species.add(m.species);}}for(const id of ['bat','wolf','skeleton','bandit','ghoul','cultist','spider','vampire','werewolf','necromancer','executioner'])assert.ok(species.has(id),id);
});
test('monster AI returns to its exact spawn, respects collisions and respawns',()=>{
 const m={...monsterTypes.skeleton,map:'floresta',x:8,y:15,homeX:5,homeY:15,maxHP:95,hp:20,state:'CHASE',lastMove:0,lastAttack:0},options={occupied:()=>false,onHit:()=>{},onWarning:()=>{}};for(let n=1;n<20;n++){const previous={...m};updateMonster(m,[],n*1000,options);assert.ok(walkable(m.x,m.y,m.map));assert.ok(distance(m,previous)<=1);if(m.state==='IDLE'&&m.x===m.homeX&&m.y===m.homeY)break;}assert.equal(m.x,5);assert.equal(m.y,15);assert.equal(m.hp,95);
 m.hp=0;m.deadUntil=30000;updateMonster(m,[],20000,options);assert.equal(m.state,'DEAD');updateMonster(m,[],30000,options);assert.equal(m.hp,95);assert.equal(m.state,'IDLE');
});
test('boss telegraphs its area attack before damaging nearby targets',()=>{
 const m={...monsterTypes.executioner,map:'castelo',x:5,y:15,homeX:5,homeY:15,maxHP:6000,lastMove:0,lastAttack:10000},p=Object.assign(player(),{map:'castelo',x:6,y:15}),hits=[],warnings=[];const options={occupied:()=>false,onHit:(p,n)=>hits.push(n),onWarning:(m,point)=>warnings.push(point)};updateMonster(m,[p],10000,options);assert.equal(warnings.length,1);assert.equal(hits.length,0);updateMonster(m,[p],10900,options);assert.ok(hits.includes(m.damage*1.8));
});
test('admin commands validate role, item capacity, level limit and owned identities',()=>{
 const p=player(),q=player('Other'),data={players:{owner:p,other:q},accounts:{admin:{role:'admin',characterKeys:['owner']}}},context={online:[p,q],monsters:[],occupied:()=>false,kick:()=>{}};
 assert.throws(()=>runAdmin(data,q,'/givegold 999',context),/administrador/);assert.throws(()=>runAdmin(data,p,'/setlevel 401',context),/inválido/);runAdmin(data,p,'/setlevel 400',context);assert.equal(p.level,400);runAdmin(data,p,'/giveitem fragmento 5 raro',context);assert.equal(p.inventory[0].quantity,5);runAdmin(data,p,'/givegold Other 45',context);assert.equal(q.gold,45);assert.throws(()=>runAdmin(data,p,'/teleport cripta 0 0',context),/inválido/);
});
test('advanced transformation abilities are unavailable in human form',()=>{
 for(const kind of ['vampiro','lobisomem']){const p=Object.assign(player('Form',kind),{level:10,map:'floresta',x:5,y:15}),target={id:'dummy',hp:1000,map:'floresta',x:6,y:15},context={target,targets:[target],hit:(p,t,n)=>t.hp-=n};assert.throws(()=>castSkill(p,3,100000,context),/transformada/);assert.equal(p.mana,100);transform(p,100000);castSkill(p,3,100001,context);assert.ok(target.hp<1000);}
});
test('server time deterministically cycles day/night and weather',()=>{const phases=new Set(),weather=new Set();for(let t=0;t<2880000;t+=60000){const env=environmentAt(t);phases.add(env.phase);weather.add(env.weather);}assert.equal(phases.size,4);assert.equal(weather.size,4);});
