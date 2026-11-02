import {walkable,safe,portals} from './world.js';
export function jump(p,dx,dy,now,occupied=()=>false){
 if(p.kind!=='lobisomem'||!p.transformed){if(p.jumpCooldown>now||p.jumpUntil>now)throw Error('Salto em recarga.');if((p.stamina??100)<12)throw Error('O salto exige 12 de stamina.');p.stamina=(p.stamina??100)-12;p.jumpFrom={x:p.x,y:p.y};p.jumpAt=now;p.jumpUntil=now+600;p.jumpCooldown=now+1600;return {x:p.x,y:p.y};}
 if(p.jumpCooldown>now||p.jumpUntil>now)throw Error('Salto em recarga.');
 if(p.mana<15)throw Error('O salto exige 15 de energia.');
 if(!Number.isInteger(dx)||!Number.isInteger(dy)||Math.abs(dx)>1||Math.abs(dy)>1||(!dx&&!dy))throw Error('Direção de salto inválida.');
 if(safe(p.x,p.y,p.map))throw Error('Saia do santuário para saltar.');
 let end={x:p.x,y:p.y};const blocked=(x,y)=>!walkable(x,y,p.map)||safe(x,y,p.map)||occupied(x,y)||portals.some(v=>v.map===p.map&&v.x===x&&v.y===y);
 for(let step=0;step<2;step++){const x=end.x+dx,y=end.y+dy;if(blocked(x,y)||(dx&&dy&&(blocked(end.x+dx,end.y)||blocked(end.x,end.y+dy))))break;end={x,y};}
 if(end.x===p.x&&end.y===p.y)throw Error('Não há espaço para saltar nessa direção.');
 p.jumpFrom={x:p.x,y:p.y};p.x=end.x;p.y=end.y;p.facing=[dx,dy];p.jumpAt=now;p.jumpUntil=now+600;p.jumpCooldown=now+4500;p.lastMove=now;p.moveDuration=600;p.mana-=15;return end;
}
