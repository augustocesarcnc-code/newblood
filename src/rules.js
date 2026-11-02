export const clamp = (v,min,max) => Math.max(min,Math.min(max,v));
export const levelCost = level => 6 + level * 4;
export const waveAt = seconds => Math.min(5,1 + Math.floor(seconds / 24));
export function direction(x,y){const length=Math.hypot(x,y);return length ? {x:x/length,y:y/length} : {x:0,y:0};}
