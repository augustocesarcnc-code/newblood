export const MAX_LEVEL=400;
// The Eclipse specification caps progression at 400; costs accelerate after 50.
export function xpToNext(level){if(level>=MAX_LEVEL)return 0;return Math.ceil(35*level*(1+Math.max(0,level-50)/300));}
export function gainXP(p,amount,maxHealth){if(!Number.isSafeInteger(amount)||amount<0)throw Error('Experiência inválida.');if(p.level>=MAX_LEVEL){p.level=MAX_LEVEL;p.xp=0;return;}p.xp+=amount;while(p.level<MAX_LEVEL&&p.xp>=xpToNext(p.level)){p.xp-=xpToNext(p.level);p.level++;p.hp=maxHealth(p);}if(p.level===MAX_LEVEL)p.xp=0;}
