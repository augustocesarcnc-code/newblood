import {skillWeaponReady} from './skillbook.js';
import {skills,damage,lunar,maxHP,safe,distance,line} from './world.js';
export function validSkillTarget(p,t,s){return !!(t&&t.id!==p.id&&t.hp>0&&t.map===p.map&&!safe(p.x,p.y,p.map)&&!safe(t.x,t.y,t.map)&&(!t.kind||(p.pvp&&t.pvp))&&distance(p,t)<=(s.range||1)&&line(p,t));}
export function castSkill(p,index,now,{target,targets=[],hit}){
 const s=skills[p.kind]?.[index];if(!Number.isInteger(index)||!s)throw Error('Habilidade inválida.');
 if(s.requiresTransform&&!p.transformed)throw Error('Esta habilidade exige a forma transformada.');
 if(p.level<s.level)throw Error('Esta habilidade requer nível '+s.level+'.');
 if((p.cooldowns[index]||0)>now||p.mana<s.cost)throw Error('Sem energia ou habilidade em recarga.');
 if((p.lastSkill||0)+600>now)throw Error('Aguarde a animação da habilidade.');
 if(!skillWeaponReady(p,s))throw Error('Equipe a arma exigida: '+s.weapons.join(' ou ')+'.');
 const offensive=['strike','drain','area'].includes(s.type);if(offensive&&!validSkillTarget(p,target,s))throw Error('Selecione um alvo válido ao alcance da habilidade.');
 const endpoint=offensive?{x:target.x,y:target.y}:{x:p.x,y:p.y};
 if(offensive){let victims=s.type==='area'?targets.filter(t=>t.map===p.map&&distance(t,target)<=s.radius&&validSkillTarget(p,t,{...s,range:s.range+s.radius})): [target];victims=[...new Map(victims.map(t=>[t.id,t])).values()];let drained=0;for(const t of victims){const before=t.hp;hit(p,t,Math.round(damage(p,lunar(now),now)*s.power));drained+=Math.max(0,Math.min(before,before-t.hp));}if(s.type==='drain')p.hp=Math.min(maxHP(p),p.hp+Math.min(s.heal||0,drained));}
 if(s.type==='heal'||s.type==='healguard')p.hp=Math.min(maxHP(p),p.hp+s.power);
 if(s.type==='healguard'||s.type==='guard'){p.buffUntil=now+s.duration;p.guardPower=s.type==='guard'?s.power:.2;}
 if(s.type==='fury'){p.furyUntil=now+s.duration;p.furyPower=s.power;}
 p.mana-=s.cost;p.cooldowns[index]=now+s.cooldown;p.lastSkill=now;
 return {kind:p.kind,index,skill:s.id,map:p.map,from:{x:p.x,y:p.y},to:endpoint,at:now,duration:800};
}
