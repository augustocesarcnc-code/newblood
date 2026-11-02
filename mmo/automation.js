import {potionCount} from './inventory.js';
import {skillWeaponReady} from './skillbook.js';
import {W,H,walkable,safe,distance,line,portals,maxHP,skills} from './world.js';
import {attackRange,equipmentStats} from './items.js';
export const botFlags=['autoPotion','autoTarget','autoAttack','autoSkills','autoBuff','autoHunt','autoLure','huntPvp'];
export const botDefaults=()=>({enabled:false,autoPotion:true,autoTarget:true,autoAttack:true,autoSkills:true,autoBuff:false,autoHunt:false,autoLure:false,huntPvp:false,potionAt:50,radius:8});
export function stopBot(p,reason='Automação pausada.'){p.bot??=botDefaults();p.bot.enabled=false;p.bot.status=reason;p.target=null;}
export function configureBot(p,settings,now){
 if(!settings||typeof settings!=='object'||Array.isArray(settings))throw Error('Configuração inválida.');
 if(!(p.vipUntil>now))throw Error('A automação exige um Pacto VIP ativo.');
 const allowed=[...botFlags,'enabled','potionAt','radius'];if(Object.keys(settings).some(k=>!allowed.includes(k)))throw Error('Opção de automação inválida.');
 const next={...botDefaults(),...p.bot};for(const key of ['enabled',...botFlags])if(key in settings){if(typeof settings[key]!=='boolean')throw Error('Use verdadeiro ou falso nas opções.');next[key]=settings[key];}
 for(const [key,min,max] of [['potionAt',10,90],['radius',3,12]])if(key in settings){if(!Number.isInteger(settings[key])||settings[key]<min||settings[key]>max)throw Error(key==='potionAt'?'Vida da poção: 10 a 90%.':'Raio de caça: 3 a 12 casas.');next[key]=settings[key];}
 if(next.enabled&&next.huntPvp&&!p.pvp)throw Error('Ative seu PvP antes de iniciar a caça PvP.');
 next.anchor={map:p.map,x:p.x,y:p.y};next.status=next.enabled?'Automação iniciada.':'Automação pausada.';next.lastStep=0;p.bot=next;return next;
}
export function combatArmor(p,now){const base=equipmentStats(p).armor;return base+(p.buffUntil>now?Math.max(3,Math.ceil(base*(p.guardPower||.2))):0);}
function legalTarget(p,t,bot){return t&&t.id!==p.id&&t.hp>0&&t.map===p.map&&!safe(t.x,t.y,t.map)&&(!t.kind||(bot.huntPvp&&p.pvp&&t.pvp))&&distance(p,t)<=bot.radius&&distance(bot.anchor,t)<=bot.radius;}
// Bounded breadth-first search avoids walls, occupied cells, corner cutting,
// portals and safe areas; automation never teleports or changes maps.
export function pathStep(p,goal,occupied=()=>false,limit=12){
 const queue=[{x:p.x,y:p.y,first:null}],seen=new Set([p.x+','+p.y]);
 for(let i=0;i<queue.length&&i<W*H;i++){
  const cell=queue[i];if(cell.first&&goal(cell))return cell.first;
  for(const [dx,dy] of [[0,-1],[1,0],[0,1],[-1,0],[1,-1],[1,1],[-1,1],[-1,-1]]){
   const x=cell.x+dx,y=cell.y+dy,key=x+','+y;if(x<1||y<1||x>=W-1||y>=H-1||seen.has(key)||distance(p,{x,y})>limit)continue;
   const blocked=(x,y)=>!walkable(x,y,p.map)||safe(x,y,p.map)||occupied(x,y)||portals.some(v=>v.map===p.map&&v.x===x&&v.y===y);
   if(blocked(x,y)||(dx&&dy&&(blocked(cell.x+dx,cell.y)||blocked(cell.x,cell.y+dy))))continue;
   seen.add(key);queue.push({x,y,first:cell.first||{type:'move',dx,dy}});
  }
 }return null;
}
// Return ordinary commands; the backend reuses all manual combat validation.
export function planBot(p,{now,monsters=[],players=[],occupied=()=>false,trading=false}){
 const bot=p.bot;if(!bot?.enabled)return [];
 if(!(p.vipUntil>now)){stopBot(p,'VIP expirado.');return [];}
 if(p.hp<=0){stopBot(p,'Automação encerrada por derrota.');return [];}
 if(!bot.anchor||bot.anchor.map!==p.map){stopBot(p,'Mapa alterado. Inicie novamente.');return [];}
 if(trading){stopBot(p,'Automação pausada durante a troca.');return [];}
 if(safe(p.x,p.y,p.map)){bot.status='Saia da zona segura e inicie na área de caça.';return [];}
 const actions=[];
 if(bot.autoPotion&&p.hp/maxHP(p)*100<=bot.potionAt&&potionCount(p)>0&&now-p.lastHeal>=1500)actions.push({type:'potion'});
 if(bot.autoBuff){const index=[6,1,4].find(i=>{const s=skills[p.kind][i],active=s.type==='fury'?p.furyUntil:p.buffUntil;return p.level>=s.level&&!(active>now)&&(p.cooldowns[i]||0)<=now&&p.mana>=s.cost;});if(index!==undefined)actions.push({type:'skill',index});}
 const pool=[...monsters,...(bot.huntPvp?players:[])].filter(t=>legalTarget(p,t,bot));
 let target=pool.find(t=>t.id===p.target);
 if(!target&&(bot.autoTarget||bot.autoHunt||bot.huntPvp)){
  // Prefer visible, reachable candidates instead of locking onto enemies behind walls.
  const sorted=pool.sort((a,b)=>(bot.huntPvp?Number(!!b.kind)-Number(!!a.kind):0)||distance(p,a)-distance(p,b));target=sorted.find(t=>line(p,t)||pathStep(p,q=>distance(q,t)<=attackRange(p)&&line({...q,map:p.map},t),occupied,bot.radius));
  if(target)actions.push({type:'target',id:target.id});
 }
 if(!target){bot.status='Aguardando alvo na área de caça.';return actions;}
 bot.status=target.kind?'Caçando jogador com PvP ativo.':'Caçando '+target.name+'.';
 const inRange=distance(p,target)<=attackRange(p)&&line(p,target);
 if(bot.autoSkills&&!actions.some(a=>a.type==='skill')){const index=skills[p.kind].findIndex((s,i)=>['strike','drain','area'].includes(s.type)&&(!s.requiresTransform||p.transformed)&&skillWeaponReady(p,s)&&p.level>=s.level&&(p.cooldowns[i]||0)<=now&&p.mana>=s.cost&&distance(p,target)<=(s.range||1)&&line(p,target));if(index>=0)actions.push({type:'skill',index});}
 if(now-(bot.lastStep||0)<350)return actions;
 if(bot.autoHunt||bot.huntPvp){
  let step;
  if(bot.autoLure&&!target.kind&&monsters.filter(t=>t.hp>0&&t.map===p.map&&distance(p,t)<=5).length>=2&&distance(p,bot.anchor)>1){
   step=pathStep(p,q=>distance(q,bot.anchor)<=1,occupied,bot.radius);if(step)bot.status='Lure: reunindo monstros no ponto de caça.';
  }else if(!inRange)step=pathStep(p,q=>distance(q,target)<=attackRange(p)&&line({...q,map:p.map},target),occupied,bot.radius);
  if(step){const destination={x:p.x+step.dx,y:p.y+step.dy};if(distance(destination,bot.anchor)<=bot.radius){actions.push(step);bot.lastStep=now;}}
 }
 return actions;
}
