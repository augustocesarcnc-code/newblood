import {create,maxHP,walkable,maps,W,H} from './world.js';
import {definitions,rarities,item} from './items.js';
import {addItem} from './inventory.js';
import {monsterTypes} from './bestiary.js';
import {stopBot} from './automation.js';
export function isAdmin(data,p){return Object.values(data.accounts||{}).some(a=>a.role==='admin'&&(a.characterKeys||[a.playerKey]).some(key=>data.players[key]?.id===p.id));}
export function runAdmin(data,p,text,{online,monsters,occupied,kick,now=Date.now()}){if(!isAdmin(data,p))throw Error('Comando restrito a administrador.');const words=[...String(text||'').matchAll(/"([^"]+)"|(\S+)/g)].map(m=>m[1]||m[2]),command=words.shift()?.toLowerCase(),find=name=>name?online.find(q=>q.name.toLocaleLowerCase()===name.toLocaleLowerCase()):p;
 const amount=(value,max=1000000)=>{const n=Number(value);if(!Number.isSafeInteger(n)||n<1||n>max)throw Error('Valor administrativo inválido.');return n;};
 if(command==='/heal'){const q=find(words[0]);if(!q)throw Error('Jogador não encontrado.');q.hp=maxHP(q);q.mana=100;q.stamina=100;}
 else if(command==='/givegold'||command==='/setlevel'){const q=find(words.length>1?words.shift():null);if(!q)throw Error('Jogador não encontrado.');const n=amount(words[0],command==='/setlevel'?400:1000000);if(command==='/givegold'){if(q.gold+n>2000000000)throw Error('Limite de ouro.');q.gold+=n;}else{q.level=n;q.xp=0;q.hp=maxHP(q);if(n<10){q.transformed=false;q.transformUntil=0;}}}
 else if(command==='/giveitem'){const q=definitions[words[0]]?p:find(words.shift());const base=words.shift(),quantity=words.length?amount(words.shift(),9999):1,rarity=words.shift()||'comum';if(!q||!definitions[base]||!rarities[rarity])throw Error('Item ou jogador inválido.');addItem(q,{...item(base,rarity),quantity});}
 else if(command==='/teleport'){const [map,xValue,yValue]=words,x=Number(xValue),y=Number(yValue);if(!maps[map]||!Number.isInteger(x)||!Number.isInteger(y)||x<1||y<1||x>=W-1||y>=H-1||!walkable(x,y,map)||occupied(x,y,map,p.id))throw Error('Destino inválido ou ocupado.');stopBot(p,'Teleporte administrativo.');p.map=map;p.x=x;p.y=y;p.jumpUntil=0;p.target=null;}
 else if(command==='/kick'){const q=find(words[0]);if(!q||q.id===p.id)throw Error('Jogador inválido.');kick(q.id);}
 else if(command==='/spawn'){const species=words[0],type=monsterTypes[species];if(!type)throw Error('Monstro desconhecido.');let point=null;for(let r=1;r<=4&&!point;r++)for(let dx=-r;dx<=r&&!point;dx++)for(let dy=-r;dy<=r;dy++){const x=p.x+dx,y=p.y+dy;if(walkable(x,y,p.map)&&!occupied(x,y,p.map)){point={x,y};break;}}if(!point)throw Error('Sem espaço para spawn.');monsters.push({...type,...point,id:'dev-'+crypto.randomUUID(),species,map:p.map,homeX:point.x,homeY:point.y,maxHP:type.hp,deadUntil:0,lastAttack:0,lastMove:0,facing:[0,1]});}
 else throw Error('Comandos: /kick /teleport /giveitem /givegold /spawn /setlevel /heal');return 'Comando executado.';
}
