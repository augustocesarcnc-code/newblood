import {test} from 'node:test';
import assert from 'node:assert/strict';
import {create,migrate,move,walkable,portals,safe} from '../mmo/world.js';
import {mapObjects} from '../mmo/map-data.js';
import {updateMonster} from '../mmo/monster-ai.js';
import {monsterTypes} from '../mmo/bestiary.js';

test('slice encounters match the current visual brief and keep both routes connected',()=>{
 const species=new Set();for(const map of ['cinzaveu','floresta'])for(const spawn of mapObjects(map,'monsters')){assert.ok(['wolf','bat','skeleton','zombie','ghoul','goblin'].includes(spawn.species));species.add(spawn.species);}
 assert.deepEqual([...species].sort(),['bat','ghoul','goblin','skeleton','wolf','zombie']);
 for(const [from,to] of [['cinzaveu','floresta'],['floresta','cinzaveu']]){const links=portals.filter(p=>p.map===from&&p.to===to);assert.ok(links.length);for(const p of links){assert.ok(walkable(p.x,p.y,from));assert.ok(walkable(p.tx,p.ty,to));}}
});

test('player movement rejects every solid edge and diagonal corner in both slice maps',()=>{
 let rejected=0;
 for(const map of ['cinzaveu','floresta'])for(let y=1;y<29;y++)for(let x=1;x<39;x++){
  if(!walkable(x,y,map))continue;
  for(let dy=-1;dy<=1;dy++)for(let dx=-1;dx<=1;dx++){
   if(!dx&&!dy)continue;
   if(walkable(x+dx,y+dy,map)&&(!dx||!dy||walkable(x+dx,y,map)&&walkable(x,y+dy,map)))continue;
   const p={...migrate(create('Collision','cacador')),map,x,y};
   assert.equal(move(p,dx,dy,1000),false,`${map}: ${x},${y} -> ${dx},${dy}`);assert.deepEqual([p.x,p.y],[x,y]);rejected++;
  }
 }
 assert.ok(rejected>100);
});

test('all eight slice monsters stay on walkable cells during chase, attack and return',()=>{
 for(const species of ['wolf','bat','skeleton','zombie','ghoul','goblin'])for(const map of ['cinzaveu','floresta']){
  const spawn=mapObjects(map,'monsters').find(s=>s.species===species)||mapObjects(map,'monsters')[0];
  const m={...monsterTypes[species],species,map,x:spawn.x,y:spawn.y,homeX:spawn.x,homeY:spawn.y,maxHP:monsterTypes[species].hp,lastMove:0,lastAttack:0,state:'IDLE'};
  // Match the runtime's relocation of authored spawns that land on a solid tile.
  let attempts=0;while((!walkable(m.x,m.y,map)||safe(m.x,m.y,map))&&attempts++<500){m.x=(m.x+1)%38+1;m.y=(m.y+3)%28+1;}m.homeX=m.x;m.homeY=m.y;
  for(let n=1;n<=120;n++){
   const targets=n<70?[{map,x:m.homeX+2,y:m.homeY,hp:10000}]:[];
   updateMonster(m,targets,n*1000,{occupied:()=>false,onHit:()=>{},onWarning:()=>{}});
   assert.ok(walkable(m.x,m.y,map),`${species}: ${map} ${m.x},${m.y}`);
  }
 }
});

test('visible fences and boulders in the slice have solid collision cells',()=>{
 let checked=0;for(const map of ['cinzaveu','floresta'])for(const prop of mapObjects(map,'decor'))if(['fence','boulder'].includes(prop.scenery)){assert.equal(walkable(prop.x,prop.y,map),false,`${map} ${prop.name}`);checked++;}assert.ok(checked>=3);
});

test('inventory sorting preserves quantities, IDs and equipped item references',async()=>{
 const {sortInventory}=await import('../mmo/inventory.js');
 const p={inventory:[{id:'a',base:'fragmento',rarity:'comum',quantity:17,slot:38},{id:'b',base:'espada',rarity:'epico',quantity:1,slot:4},{id:'c',base:'pocao',rarity:'comum',quantity:5,slot:20}],equipment:{weapon:'b'}};
 const before=p.inventory.map(i=>[i.id,i.base,i.quantity]).sort();sortInventory(p);
 assert.deepEqual(p.inventory.map(i=>[i.id,i.base,i.quantity]).sort(),before);assert.equal(p.equipment.weapon,'b');assert.deepEqual(p.inventory.map(i=>i.slot),[0,1,2]);
 const once=JSON.stringify(p);sortInventory(p);assert.equal(JSON.stringify(p),once);
});
