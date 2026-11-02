import {W,H,tile,portals,maps} from './world.js';
import {groundTexture,terrainReady} from './terrain.js';
const cache=new Map(),colors={grass:'#202720',tree:'#202720',path:'#51484a',town:'#40383d',crypt:'#27242d',wall:'#25202a',water:'#252330',house:'#40333a',portal:'#482538'};
terrainReady.then(()=>cache.clear()).catch(()=>{});
function terrain(map,size){const key=map+':'+size;if(cache.has(key))return cache.get(key);const canvas=document.createElement('canvas');canvas.width=W*size;canvas.height=H*size;const ctx=canvas.getContext('2d');
 for(let y=0;y<H;y++)for(let x=0;x<W;x++){
  const t=tile(x,y,map),sx=x*size,sy=y*size;ctx.fillStyle=colors[t];ctx.fillRect(sx,sy,size,size);groundTexture(ctx,t,sx,sy,size,x,y,map);
  const noise=((x*73+y*37)%19)/19;ctx.fillStyle=`rgba(0,0,0,${noise*.07})`;ctx.fillRect(sx,sy,size,size);
  if(['town','path','crypt'].includes(t)){ctx.strokeStyle='#baa3a30b';for(let j=0;j<3;j++){ctx.beginPath();ctx.ellipse(sx+(x*13+y*7+j*11)%23+5,sy+j*12+5,6+noise*4,3+noise*2,.3,0,Math.PI*2);ctx.stroke();}}
  if(t==='grass'){ctx.strokeStyle='#8c9a6c1b';ctx.beginPath();ctx.moveTo(sx+8+noise*15,sy+25);ctx.lineTo(sx+5+noise*15,sy+17);ctx.stroke();}
  if(t==='water'){ctx.fillStyle='#9b627c33';ctx.fillRect(sx+5,sy+12,19,2);ctx.fillRect(sx+18,sy+26,12,2);}
  if(t==='wall'){ctx.strokeStyle='#98738a33';ctx.strokeRect(sx+2,sy+2,size-4,size/2-3);ctx.strokeRect(sx+2,sy+size/2,size-4,size/2-2);}
 }if(cache.size>=6)cache.delete(cache.keys().next().value);cache.set(key,canvas);return canvas;
}
export function drawMap(ctx,map,size,cx,cy,width,height,now){
 const layer=terrain(map,size),sx=Math.max(0,cx*size),sy=Math.max(0,cy*size),w=Math.min(width,layer.width-sx),h=Math.min(height,layer.height-sy);if(w>0&&h>0)ctx.drawImage(layer,sx,sy,w,h,0,0,w,h);
 for(const portal of portals.filter(v=>v.map===map)){const x=(portal.x-cx+.5)*size,y=(portal.y-cy+.5)*size;ctx.strokeStyle='#d887a7';ctx.lineWidth=2;ctx.beginPath();ctx.ellipse(x,y,10+Math.sin(now/350)*3,15,0,0,Math.PI*2);ctx.stroke();ctx.font='8px Georgia';ctx.textAlign='center';ctx.fillStyle='#d2a9ba';ctx.fillText(maps[portal.to].name,x,y-24);}ctx.lineWidth=1;
}
