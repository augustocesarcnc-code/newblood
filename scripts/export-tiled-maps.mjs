import {writeFile,mkdir} from 'node:fs/promises';
import {maps,W,H,tile,walkable,portals} from '../mmo/world.js';
import {npcs} from '../mmo/village.js';
import {monsterFor} from '../mmo/bestiary.js';
const types=['grass','path','town','crypt','wall','water','house','tree','portal'],tileSize=38;
const properties=values=>Object.entries(values).map(([name,value])=>({name,type:typeof value==='number'?'int':'string',value}));
await mkdir(new URL('../assets/maps/',import.meta.url),{recursive:true});
for(const [id,map]of Object.entries(maps)){
 let nextId=1;const object=(name,x,y,props={})=>({id:nextId++,name,type:'point',point:true,x:x*tileSize,y:y*tileSize,width:0,height:0,rotation:0,visible:true,properties:properties(props)}),terrain=[],collision=[];
 for(let y=0;y<H;y++)for(let x=0;x<W;x++){terrain.push(types.indexOf(tile(x,y,id))+1);collision.push(walkable(x,y,id)?0:1);}
 const spawns=[];for(let i=0;i<(id==='cinzaveu'?10:16);i++){const type=monsterFor(id,i);if(type.boss&&spawns.some(s=>s.properties.some(p=>p.name==='species'&&p.value===type.species)))continue;let x=17+i*7%20,y=3+i*11%24,attempts=0;while(!walkable(x,y,id)&&attempts++<500){x=(x+1)%38+1;y=(y+3)%28+1;}if(attempts<500)spawns.push(object(type.name,x,y,{species:type.species}));}
 const data={type:'map',version:'1.10',tiledversion:'1.10.2',orientation:'orthogonal',renderorder:'right-down',width:W,height:H,tilewidth:tileSize,tileheight:tileSize,infinite:false,nextobjectid:nextId,properties:properties({id,displayName:map.name,subtitle:map.subtitle}),tilesets:[{firstgid:1,name:'Eclipse semantic tiles',tilewidth:38,tileheight:38,tilecount:types.length,columns:0,tiles:types.map((type,i)=>({id:i,type,image:'../terrain/'+({grass:'grass.png',path:'dirt.png',town:'stone.png',crypt:'dungeon.jpg',wall:'rock.png',water:'water.png',house:'brick.png',tree:'grass.png',portal:'stone.png'}[type]),imagewidth:38,imageheight:38}))}],layers:[{type:'tilelayer',name:'terrain',width:W,height:H,data:terrain},{type:'tilelayer',name:'collision',width:W,height:H,visible:false,data:collision},{type:'objectgroup',name:'spawn',objects:[object('player',...map.spawn)]},{type:'objectgroup',name:'npcs',objects:npcs.filter(n=>n.map===id).map(n=>object(n.name,n.x,n.y,{id:n.id,title:n.title,kind:n.kind,icon:n.icon}))},{type:'objectgroup',name:'teleports',objects:portals.filter(p=>p.map===id).map(p=>object(p.to,p.x,p.y,{to:p.to,tx:p.tx,ty:p.ty}))},{type:'objectgroup',name:'monsters',objects:spawns}]};
 data.layers.forEach((layer,index)=>layer.id=index+1);data.nextobjectid=nextId;data.nextlayerid=data.layers.length+1;
 await writeFile(new URL('../assets/maps/'+id+'.json',import.meta.url),JSON.stringify(data));
}console.log('Six playable Tiled-compatible maps exported.');
