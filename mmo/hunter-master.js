import {directionIndex,directionNames} from './directions.js';
let metadata,image;
export const hunterMasterReady=fetch('/assets/characters/hunter/master.json').then(r=>{if(!r.ok)throw Error('Sprite Master do Caçador indisponível.');return r.json();}).then(async data=>{metadata=data;image=await new Promise((resolve,reject)=>{const asset=new Image();asset.onload=()=>resolve(asset);asset.onerror=()=>reject(Error('Imagem Master do Caçador indisponível.'));asset.src='/assets/characters/hunter/'+data.asset;});});
// Phase A has one static pose per direction. Never present these views as animation.
export function drawHunterMaster(c,x,y,facing=[0,1],scale=1){
 if(!metadata||!image)return false;const direction=directionNames[directionIndex(facing)],view=metadata.views[direction];if(!view)return false;
 const [sx,sy,w,h]=view.rect,[px,py]=view.pivot,[left,top,right,bottom]=view.bodyBounds,s=metadata.worldHeightAtScaleOne*scale/(bottom-top);
 c.save();c.imageSmoothingEnabled=false;c.drawImage(image,sx,sy,w,h,x-px*s,y-py*s,w*s,h*s);c.restore();
 return {rect:[x+(left-sx-px)*s,y+(top-sy-py)*s,(right-left)*s,(bottom-top)*s],model:'hunter-master',state:'master',frame:0,direction};
}
export function hunterMasterStatus(){return {ready:!!image,phase:'A',framesPerDirection:1,animated:false,status:metadata?.status||'LOADING',directions:metadata?.directionOrder||[]};}
export async function drawHunterAudit(canvas){await hunterMasterReady;canvas.width=1536;canvas.height=340;const c=canvas.getContext('2d');c.fillStyle='#777b80';c.fillRect(0,0,canvas.width,canvas.height);const names=['N','NE','E','SE','S','SW','W','NW'],facing=[[0,-1],[1,-1],[1,0],[1,1],[0,1],[-1,1],[-1,0],[-1,-1]];for(let i=0;i<8;i++){const x=96+i*192;drawHunterMaster(c,x,294,facing[i],4.3);c.fillStyle='#171b21';c.font='15px sans-serif';c.textAlign='center';c.fillText(names[i],x,324);}}
