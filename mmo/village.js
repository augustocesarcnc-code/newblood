import {mapObjects} from './map-data.js';
import {addItem} from './inventory.js';
import {available,item,describe,definitions,INVENTORY_LIMIT} from './items.js';
export const npcs=[{id:'merchant',name:'Mara',title:'Mercadora',map:'cinzaveu',x:8,y:14,kind:'cacador',icon:'⚖'},{id:'forge',name:'Dorian',title:'Forja da Lua',map:'cinzaveu',x:12,y:14,kind:'lobisomem',icon:'⚒'},{id:'teleport',name:'Íris',title:'Guardiã dos portais',map:'cinzaveu',x:7,y:19,kind:'vampiro',icon:'◈'}];
npcs.push({id:'healer',name:'Selene',title:'Curandeira',map:'cinzaveu',x:9,y:11,kind:'vampiro',icon:'✚'},{id:'alchemist',name:'Oren',title:'Alquimista',map:'cinzaveu',x:5,y:17,kind:'vampiro',icon:'◈'},{id:'guard',name:'Aldren',title:'Guarda',map:'cinzaveu',x:14,y:16,kind:'cacador',icon:'⛨'},{id:'master',name:'Valen',title:'Mestre de Classe',map:'cinzaveu',x:10,y:17,kind:'cacador',icon:'✧'});
npcs.splice(0,npcs.length,...mapObjects('cinzaveu','npcs').map(n=>({...n,map:'cinzaveu'})));
export const catalog=[{id:'potion',name:'Poção de vitalidade',icon:'✚',price:12,description:'Recupera até 65 de vida ao usar H.'},{id:'garra',name:'Garras do exílio',icon:'爪',price:45,kind:'lobisomem'},{id:'cetro',name:'Cetro carmesim',icon:'♜',price:45,kind:'vampiro'},{id:'besta',name:'Besta de prata',icon:'⌖',price:45,kind:'cacador'},{id:'manto',name:'Manto da noite',icon:'♟',price:35},{id:'amuleto',name:'Amuleto lunar',icon:'☽',price:40}];
catalog.push(...['capa','capuz','calcas','botas','luvas','escudo','anel','cinto','pocao','mana','racao','fragmento'].map(id=>({id,name:definitions[id].name,icon:definitions[id].icon,price:definitions[id].value||35})));
catalog.push({id:'arco',name:'Arco de guerra',icon:'⌖',price:65,kind:'cacador'},{id:'espada',name:'Espada de ferro',icon:'⚔',price:90},{id:'couro',name:'Armadura de couro',icon:'⛨',price:80},{id:'cota',name:'Cota de malha',icon:'⛨',price:180},{id:'placas',name:'Armadura de placas',icon:'⛨',price:340});
export const destinations=[{id:'floresta',name:'Floresta Amaldiçoada',map:'floresta',x:3,y:15,level:1,cost:20},{id:'cripta',name:'Cemitério',map:'cripta',x:3,y:15,level:3,cost:60}];
export const sellPrice=i=>{const d=describe(i);return Math.max(1,Math.floor(8+d.attack*3+d.armor*4));};
export const salvageYield=i=>['comum','incomum','raro','epico','lendario','mitico'].indexOf(i.rarity)+1+(i.upgrade||0);
export function forgeCost(i){const next=(i.upgrade||0)+1;return {next,gold:30*next*next,shards:next*2};}
export function npcBuy(p,id,quantity=1){
 if(!Number.isInteger(quantity)||quantity<1||quantity>20)throw Error('Quantidade deve ser de 1 a 20.');
 const entry=catalog.find(v=>v.id===id);if(!entry||entry.kind&&entry.kind!==p.kind)throw Error('Produto indisponível para sua classe.');
 const total=entry.price*quantity;if(p.gold<total)throw Error('Ouro insuficiente.');
 if(id==='potion'){if((p.potions||0)+quantity>9999)throw Error('Limite de poções atingido.');p.potions=(p.potions||0)+quantity;}
 else{const draft={...p,inventory:p.inventory.map(i=>({...i}))};addItem(draft,{...item(id),quantity});p.inventory=draft.inventory;}
 p.gold-=total;
}
export function npcSell(p,id){const i=available(p,id),price=sellPrice(i)*(i.quantity||1);p.inventory=p.inventory.filter(v=>v.id!==id);p.gold+=price;return price;}
export function salvage(p,id){const i=available(p,id);if(!definitions[i.base]?.slot)throw Error('Selecione um equipamento.');const shards=salvageYield(i);p.inventory=p.inventory.filter(v=>v.id!==id);p.shards+=shards;return shards;}
export function forge(p,id){const i=p.inventory.find(v=>v.id===id);if(!i||!definitions[i.base]?.slot)throw Error('Equipamento não encontrado.');if((i.upgrade||0)>=10)throw Error('Este equipamento já está no refino máximo (+10).');const cost=forgeCost(i);if(p.gold<cost.gold||p.shards<cost.shards)throw Error('Ouro ou fragmentos lunares insuficientes.');p.gold-=cost.gold;p.shards-=cost.shards;i.upgrade=cost.next;return cost.next;}
