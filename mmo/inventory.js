import {definitions,INVENTORY_LIMIT,available} from './items.js';
export const equipmentSlots=['head','chest','cape','legs','boots','gloves','weapon','offhand','charm','ring','belt'];
export function normalizeInventory(p){const used=new Set();for(const i of p.inventory){if(!Number.isInteger(i.slot)||i.slot<0||i.slot>=INVENTORY_LIMIT||used.has(i.slot))i.slot=Array.from({length:INVENTORY_LIMIT},(_,n)=>n).find(n=>!used.has(n));used.add(i.slot);i.quantity??=1;}p.equipment??={};p.equipment.chest??=p.equipment.armor||null;p.equipment.armor=p.equipment.chest;for(const slot of equipmentSlots)p.equipment[slot]??=null;}
export function addItem(p,item){const def=definitions[item.base];if(!def)throw Error('Item desconhecido.');const quantity=item.quantity??1,max=def.maxStack||1;if(!Number.isSafeInteger(quantity)||quantity<1||quantity>9999)throw Error('Quantidade inválida.');normalizeInventory(p);const draft=p.inventory.map(i=>({...i}));let remaining=quantity;if(def.stackable)for(const i of draft)if(i.base===item.base&&i.rarity===item.rarity&&i.quantity<max){const count=Math.min(remaining,max-i.quantity);i.quantity+=count;remaining-=count;if(!remaining)break;}
 while(remaining){if(draft.length>=INVENTORY_LIMIT)throw Error('Inventário cheio.');const slot=Array.from({length:INVENTORY_LIMIT},(_,n)=>n).find(n=>!draft.some(i=>i.slot===n)),count=Math.min(remaining,max);draft.push({...item,id:draft.some(i=>i.id===item.id)?crypto.randomUUID():item.id,slot,quantity:count});remaining-=count;}
 p.inventory=draft;return item;
}
export function consumeItem(p,id,quantity=1){const i=available(p,id);if(!Number.isInteger(quantity)||quantity<1||quantity>(i.quantity||1))throw Error('Quantidade inválida.');if((i.quantity||1)===quantity)p.inventory=p.inventory.filter(i=>i.id!==id);else i.quantity-=quantity;return {...i,quantity};}
export function splitStack(p,id,quantity){const i=available(p,id);if(!definitions[i.base]?.stackable||!Number.isInteger(quantity)||quantity<1||quantity>=i.quantity)throw Error('Quantidade de divisão inválida.');if(p.inventory.length>=INVENTORY_LIMIT)throw Error('Inventário cheio.');normalizeInventory(p);const slot=Array.from({length:INVENTORY_LIMIT},(_,n)=>n).find(n=>!p.inventory.some(i=>i.slot===n));i.quantity-=quantity;const split={...i,id:crypto.randomUUID(),quantity,slot};p.inventory.push(split);return split;}
export function moveItem(p,id,slot){if(!Number.isInteger(slot)||slot<0||slot>=INVENTORY_LIMIT)throw Error('Posição de inventário inválida.');normalizeInventory(p);const source=p.inventory.find(i=>i.id===id);if(!source)throw Error('Item não encontrado.');const target=p.inventory.find(i=>i.slot===slot&&i.id!==id);if(target&&definitions[source.base]?.stackable&&target.base===source.base&&target.rarity===source.rarity){const count=Math.min(source.quantity,definitions[source.base].maxStack-target.quantity);if(count>0){target.quantity+=count;source.quantity-=count;if(source.quantity===0)p.inventory=p.inventory.filter(i=>i.id!==id);return;}}if(target)target.slot=source.slot;source.slot=slot;}
export function potionCount(p){return (p.potions||0)+p.inventory.filter(i=>i.base==='pocao').reduce((n,i)=>n+(i.quantity||1),0);}

export function sortInventory(p){
 normalizeInventory(p);
 const rarity=['comum','incomum','raro','epico','lendario','mitico'];
 p.inventory.sort((a,b)=>{const A=definitions[a.base],B=definitions[b.base];return String(A.type).localeCompare(String(B.type))||rarity.indexOf(b.rarity)-rarity.indexOf(a.rarity)||a.base.localeCompare(b.base)||a.slot-b.slot;});
 p.inventory.forEach((item,index)=>item.slot=index);
}
