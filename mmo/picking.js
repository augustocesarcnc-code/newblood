// Rectangles come from the alpha bounds of the frame actually drawn, in CSS pixels.
export function pickRenderedUnit(units,x,y,selfId){for(let index=units.length-1;index>=0;index--){const unit=units[index];if(unit.id===selfId||!unit.npc&&!(unit.hp>0))continue;const [left,top,width,height]=unit.rect;if(x>=left&&x<=left+width&&y>=top&&y<=top+height)return unit;}return null;}
