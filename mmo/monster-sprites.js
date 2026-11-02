import {drawModel,spritesReady} from './eclipse-sprites.js';
export const monstersReady=spritesReady;
const art={vampire:'wild-vampire',werewolf:'wild-werewolf','corrupted-wolf':'corrupted-wolf'};
export function drawMonster(ctx,m,x,y,time,moving,now,scale=1){const dead=m.hp<=0,age=now-(m.deadAt||now),special=m.charging||now-(m.specialAt||0)<800,hit=now-(m.hitAt||0)<400,attack=now-(m.lastAttack||0)<800,state=dead?'death':special?'special':hit?'hit':attack?'attack':moving?'walk':'idle',elapsed=dead?age:special?now-(m.specialAt||m.charging?.at-900||now):hit?now-m.hitAt:attack?now-m.lastAttack:time,frame=['death','special','hit','attack'].includes(state)?Math.min(7,Math.max(0,Math.floor(elapsed/(state==='hit'?50:100)))):undefined;
 return drawModel(ctx,art[m.species]||m.species,x,y+10,m.facing,scale*(m.species==='executioner'?2.5:m.boss?1.45:m.elite?1.5:1),{state,frameIndex:frame,time:elapsed});
}
