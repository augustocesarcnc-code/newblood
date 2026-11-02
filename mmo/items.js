export const rarities={comum:{name:'Comum',color:'#aaa6a1',mult:1},incomum:{name:'Incomum',color:'#83b591',mult:1.3},raro:{name:'Raro',color:'#7cafff',mult:1.7},epico:{name:'Épico',color:'#bd87ed',mult:2.3},lendario:{name:'Lendário',color:'#edb460',mult:3.2},mitico:{name:'Mítico',color:'#ff557b',mult:4.5}};
export const definitions={garra:{name:'Garras do exílio',slot:'weapon',kind:'lobisomem',icon:'爪',attack:6,range:1},cetro:{name:'Cetro carmesim',slot:'weapon',kind:'vampiro',icon:'♜',attack:6,range:3},besta:{name:'Besta de prata',slot:'weapon',kind:'cacador',icon:'⌖',attack:6,range:5},manto:{name:'Manto da noite',slot:'chest',icon:'♟',armor:3},amuleto:{name:'Amuleto lunar',slot:'charm',icon:'☽',attack:2,armor:1}};
Object.assign(definitions,{arco:{name:'Arco de guerra',slot:'weapon',kind:'cacador',icon:'⌖',attack:7,range:6},espada:{name:'Espada de ferro',slot:'weapon',icon:'⚔',attack:8,range:1},couro:{name:'Armadura de couro',slot:'chest',icon:'⛨',armor:5},cota:{name:'Cota de malha',slot:'chest',icon:'⛨',armor:8},placas:{name:'Armadura de placas',slot:'chest',icon:'⛨',armor:12}});
Object.assign(definitions,{
 capa:{name:'Capa da Vigília',slot:'cape',type:'equipment',icon:'♟',armor:1,value:55},
 capuz:{name:'Capuz da vigília',slot:'head',type:'equipment',icon:'⛨',armor:2,requiredLevel:1},
 calcas:{name:'Grevas da vigília',slot:'legs',type:'equipment',icon:'⛨',armor:3},
 botas:{name:'Botas do errante',slot:'boots',type:'equipment',icon:'⛨',armor:2,dexterity:2},
 luvas:{name:'Luvas da sentinela',slot:'gloves',type:'equipment',icon:'爪',attack:1,armor:1,strength:2},
 escudo:{name:'Escudo de ferro',slot:'offhand',type:'equipment',icon:'⛨',armor:4},
 anel:{name:'Anel do eclipse',slot:'ring',type:'equipment',icon:'◉',attack:2,intelligence:2},
 cinto:{name:'Cinto do viajante',slot:'belt',type:'equipment',icon:'▰',armor:1,vitality:2},
 pocao:{name:'Poção de vida',type:'consumable',icon:'✚',stackable:true,maxStack:50,value:12},
 mana:{name:'Poção de mana',type:'consumable',icon:'◈',stackable:true,maxStack:50,value:15},
 racao:{name:'Ração de viagem',type:'consumable',icon:'♧',stackable:true,maxStack:50,value:8},
 fragmento:{name:'Fragmento lunar',type:'material',icon:'◇',stackable:true,maxStack:99,value:5}
});
for(const def of Object.values(definitions)){def.type??=def.slot?'equipment':'material';def.description??=def.slot?def.name+' · equipamento da vigília.':def.name+' · suprimento de viagem.';def.requiredLevel??=1;def.value??=Math.max(1,8+(def.attack||0)*3+(def.armor||0)*4);def.stackable??=false;def.maxStack??=1;}
export const INVENTORY_LIMIT=40;
export function attackRange(p){const weapon=p.inventory?.find(i=>i.id===p.equipment?.weapon);return weapon?definitions[weapon.base]?.range||1:1;}

export function item(base,rarity='comum'){return {id:crypto.randomUUID(),base,rarity};}
export function describe(i){const d=definitions[i.base],r=rarities[i.rarity];return {...i,...d,slot:i.slot,equipmentSlot:d.slot,rarityName:r.name,color:r.color,name:d.name+(i.upgrade?' +'+i.upgrade:''),attack:Math.round((d.attack||0)*r.mult)+(d.attack?(i.upgrade||0)*2:0),quantity:i.quantity||1,value:d.value||Math.max(1,8+(d.attack||0)*3+(d.armor||0)*4),armor:Math.round((d.armor||0)*r.mult)+(d.armor?(i.upgrade||0):0)};}
export function equipmentStats(p){let attack=0,armor=0;for(const id of new Set(Object.values(p.equipment||{}))){const i=p.inventory?.find(i=>i.id===id);if(i){const d=describe(i);attack+=d.attack;armor+=d.armor;}}return {attack,armor};}
export function available(p,id){const i=p.inventory.find(i=>i.id===id);if(!i)throw Error('Item não encontrado.');if(Object.values(p.equipment).includes(id))throw Error('Desequipe o item primeiro.');return i;}
export function equip(p,id){const i=p.inventory.find(v=>v.id===id);if(!i)throw Error('Item não encontrado.');const d=describe(i),slot=d.equipmentSlot;if(!slot)throw Error('Este item não é equipável.');if(d.requiredLevel&&p.level<d.requiredLevel)throw Error('Nível insuficiente para o equipamento.');if(d.kind&&d.kind!==p.kind)throw Error('Este item pertence a outra classe.');const current=slot==='chest'?(p.equipment.chest??p.equipment.armor):p.equipment[slot];p.equipment[slot]=current===id?null:id;if(slot==='chest')p.equipment.armor=p.equipment.chest;}
export function rollLoot(random=Math.random){const r=random(),rarity=r<.001?'mitico':r<.01?'lendario':r<.06?'epico':r<.2?'raro':r<.5?'incomum':'comum';const bases=Object.keys(definitions);return item(bases[Math.floor(random()*bases.length)],rarity);}
