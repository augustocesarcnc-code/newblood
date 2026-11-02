import {test} from 'node:test';
import assert from 'node:assert/strict';
import {create,migrate} from '../mmo/world.js';
import {npcBuy} from '../mmo/village.js';
import {equip,equipmentStats} from '../mmo/items.js';
import {appearanceFor} from '../mmo/appearance.js';
import {normalizeInventory} from '../mmo/inventory.js';
import {markAction} from '../mmo/actions.js';
import {readFile} from 'node:fs/promises';

test('cape purchase, equip, save migration and unequip preserve the existing armor and item IDs',()=>{
 const p=migrate(create('Hunter','cacador'));p.gold=1000;npcBuy(p,'couro');npcBuy(p,'capa');normalizeInventory(p);const [armor,cape]=p.inventory;
 equip(p,armor.id);const before=equipmentStats(p).armor;equip(p,cape.id);assert.equal(p.gold,865);assert.equal(p.equipment.chest,armor.id);assert.equal(p.equipment.cape,cape.id);assert.equal(appearanceFor(p).cape.base,'capa');assert.equal(equipmentStats(p).armor,before+1);
 const saved=JSON.parse(JSON.stringify(p));migrate(saved);normalizeInventory(saved);assert.equal(saved.equipment.cape,cape.id);equip(saved,cape.id);assert.equal(appearanceFor(saved).cape,null);assert.equal(saved.equipment.chest,armor.id);assert.equal(saved.inventory.length,2);
});

test('melee alternates attack presentations without changing weapon, inventory or attack timestamps',()=>{
 const p=migrate(create('Hunter','cacador'));p.lastAttack=500;const inventory=JSON.stringify(p.inventory);markAction(p,'swing',1000,{x:10,y:16});assert.equal(p.actionState,'swing');markAction(p,'swing',2000,{x:10,y:16});assert.equal(p.actionState,'attack2');markAction(p,'swing',3000);assert.equal(p.actionState,'swing');assert.equal(p.lastAttack,500);assert.equal(JSON.stringify(p.inventory),inventory);markAction(p,'shoot',4000);assert.equal(p.actionState,'shoot');
});

test('the five player forms and visual equipment contain the second attack with common ground anchors',async()=>{
 const manifest=JSON.parse(await readFile(new URL('../assets/eclipse/manifest.json',import.meta.url)));
 const anchors=[];for(const model of ['hunter','vampire-human','vampire-form','wolf-human','werewolf']){const clip=manifest.entries[model].attack2;assert.ok(clip);anchors.push(clip.anchor);assert.notEqual(clip.image,manifest.entries[model].attack.image);}
 assert.ok(anchors.every(a=>JSON.stringify(a)===JSON.stringify(anchors[0])));
 for(const base of ['capa','couro','espada','arco','besta','escudo']){const clips=manifest.equipment[base];for(const state of ['idle','walk','run','attack','attack2','hit','death']){assert.ok(clips[state],base+' '+state);assert.equal(clips[state].anchor[1],anchors[0][1]);}}
});

test('Lunar Power is clock-authoritative on descent and Eclipse occurs on its rare cycle',async()=>{
 const {lunar,lunarBonus}=await import('../mmo/world.js');const rise=lunar(180000*2+89999),fall=lunar(180000*2+90000);
 assert.equal(rise.power,false);assert.equal(fall.power,true);assert.ok(rise.orbit<fall.orbit);assert.equal(lunarBonus('cacador',fall),lunarBonus('cacador',rise)*1.05);assert.equal(lunar(180000*63).eclipse,true);assert.equal(lunar(180000*64).eclipse,false);assert.equal(lunar(180000*4).name,'Lua de Sangue');assert.equal(lunar(180000*12).name,'Lua cheia');assert.equal(lunar(180000*12).blood,false);
});

test('Troll regeneration is rate limited, bounded by max HP and cannot revive a corpse',async()=>{
 const {updateMonster}=await import('../mmo/monster-ai.js');const {monsterTypes}=await import('../mmo/bestiary.js');const m={...monsterTypes.troll,map:'floresta',x:8,y:15,homeX:8,homeY:15,maxHP:320,hp:316,lastMove:0,lastAttack:0};const opts={occupied:()=>false,onHit:()=>{},onWarning:()=>{}};
 updateMonster(m,[],1000,opts);assert.equal(m.hp,319);updateMonster(m,[],1500,opts);assert.equal(m.hp,319);updateMonster(m,[],2000,opts);assert.equal(m.hp,320);m.hp=0;m.deadUntil=9000;updateMonster(m,[],3000,opts);assert.equal(m.hp,0);
});

test('Minotaur charge telegraphs, respects occupied cells and cannot double hit on impact',async()=>{
 const {updateMonster}=await import('../mmo/monster-ai.js');const {monsterTypes}=await import('../mmo/bestiary.js');const {walkable}=await import('../mmo/world.js');
 const m={...monsterTypes.minotaur,map:'floresta',x:8,y:15,homeX:8,homeY:15,maxHP:440,lastMove:0,lastAttack:0};const p={map:'floresta',x:12,y:15,hp:100};const hits=[],warnings=[];const opts={occupied:(x,y)=>x===p.x&&y===p.y,onHit:(_,amount)=>hits.push(amount),onWarning:(_,point)=>warnings.push(point)};
 updateMonster(m,[p],1000,opts);assert.equal(warnings.length,1);assert.equal(hits.length,0);updateMonster(m,[p],1900,opts);assert.equal(hits.length,1);assert.equal(hits[0],m.damage*1.8);assert.ok(walkable(m.x,m.y,m.map));assert.notEqual(m.x,p.x);assert.ok(m.x-8<=3);
});

test('Witch blink cannot land on occupants or move through blocked intermediate cells',async()=>{
 const {updateMonster}=await import('../mmo/monster-ai.js');const {monsterTypes}=await import('../mmo/bestiary.js');const {walkable}=await import('../mmo/world.js');
 const m={...monsterTypes.witch,map:'floresta',x:8,y:15,homeX:8,homeY:15,maxHP:150,lastMove:0,lastAttack:0};const p={map:'floresta',x:9,y:15,hp:100};updateMonster(m,[p],1000,{occupied:(x,y)=>x===10&&y===15,onHit:()=>{},onWarning:()=>{}});assert.ok(walkable(m.x,m.y,m.map));assert.ok(m.x!==10||m.y!==15);assert.ok(Math.max(Math.abs(m.x-8),Math.abs(m.y-15))<=2);assert.ok(m.nextBlink>1000);
});
