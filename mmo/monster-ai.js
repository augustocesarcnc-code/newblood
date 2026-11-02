import {distance,line,safe,walkable} from './world.js';
import {pathStep} from './automation.js';
export function updateMonster(m,players,now,{occupied,onHit,onWarning}){
 const home={x:m.homeX,y:m.homeY};if(m.hp<=0){m.state='DEAD';if(now>=m.deadUntil&&!occupied(home.x,home.y,m.map)){m.hp=m.maxHP;m.x=home.x;m.y=home.y;m.state='IDLE';m.charging=null;}return;}
 const canFight=p=>p.hp>0&&p.map===m.map&&!safe(p.x,p.y,p.map);
 if(m.charging&&now>=m.charging.at){for(const p of players.filter(canFight))if(distance(p,m.charging)<=2)onHit(p,m.damage*1.8,m);m.charging=null;m.specialAt=now;m.nextSpecial=now+8000;}
 const candidates=players.filter(p=>canFight(p)&&distance(m,p)<=(m.aggro||7)&&distance(home,p)<=(m.leash||12));const target=candidates.sort((a,b)=>distance(m,a)-distance(m,b))[0];
 if(distance(m,home)>(m.leash||12)||(!target&&['CHASE','ATTACK','RETURN'].includes(m.state))){m.state='RETURN';m.charging=null;if(distance(m,home)===0){m.hp=m.maxHP;m.state='IDLE';return;}if(now-m.lastMove>m.moveMs){const step=pathStep(m,q=>distance(q,home)===0,(x,y)=>occupied(x,y,m.map),m.leash||12);if(step){m.x+=step.dx;m.y+=step.dy;m.facing=[step.dx,step.dy];}m.lastMove=now;}return;}
 if(target){const range=m.attackRange||1;m.state='CHASE';if(m.boss&&!m.charging&&now>=(m.nextSpecial||0)){m.charging={x:target.x,y:target.y,at:now+900};onWarning(m,m.charging);}
  if(distance(m,target)<=range&&line(m,target)){m.state='ATTACK';if(now-m.lastAttack>1300){m.facing=[Math.sign(target.x-m.x),Math.sign(target.y-m.y)];m.lastAttack=now;onHit(target,m.damage,m);}}
  else if(now-m.lastMove>m.moveMs&&!m.charging){const step=pathStep(m,q=>distance(q,target)<=range&&line({...q,map:m.map},target),(x,y)=>occupied(x,y,m.map),m.aggro||7);if(step){m.x+=step.dx;m.y+=step.dy;m.facing=[step.dx,step.dy];}m.lastMove=now;}return;
 }
 if(now-m.lastMove>2500){m.state='PATROL';const dirs=[[1,0],[0,1],[-1,0],[0,-1]],offset=(Math.floor(now/2500)+m.homeX)%4;for(let i=0;i<4;i++){const [dx,dy]=dirs[(offset+i)%4],x=m.x+dx,y=m.y+dy;if(walkable(x,y,m.map)&&!safe(x,y,m.map)&&distance({x,y},home)<=3&&!occupied(x,y,m.map)){m.x=x;m.y=y;m.facing=[dx,dy];break;}}m.lastMove=now;}else m.state??='IDLE';
}
