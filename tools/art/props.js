import * as T from 'three';
const mat=new Map();function M(c){if(!mat.has(c))mat.set(c,new T.MeshLambertMaterial({color:c,flatShading:true}));return mat.get(c);}
const stone='#626671',edge='#96918b',roof='#403549',wood='#55483e',gold='#ac8a58';
function mesh(g,type,p,s,c,r=[0,0,0]){let geo=type==='box'?new T.BoxGeometry(...s):type==='cone'?new T.ConeGeometry(s[0],s[1],s[2]||8):type==='sphere'?new T.IcosahedronGeometry(s[0],1):new T.CylinderGeometry(s[0],s[1],s[2],s[3]||10);const o=new T.Mesh(geo,M(c));o.position.set(...p);o.rotation.set(...r);g.add(o);return o;}
const B=(g,p,s,c=stone,r)=>mesh(g,'box',p,s,c,r),C=(g,p,s,c=stone,r)=>mesh(g,'cylinder',p,s,c,r);
function limb(g,a,b,width,c){const A=new T.Vector3(...a),D=new T.Vector3(...b),o=C(g,A.clone().add(D).multiplyScalar(.5).toArray(),[width,width,A.distanceTo(D),7],c);o.quaternion.setFromUnitVectors(new T.Vector3(0,1,0),D.sub(A).normalize());}
function arch(g,x,y,z,w,h,c=stone){const shape=new T.Shape();shape.moveTo(-w/2,0);shape.lineTo(-w/2,h*.6);shape.quadraticCurveTo(-w/2,h*.88,0,h);shape.quadraticCurveTo(w/2,h*.88,w/2,h*.6);shape.lineTo(w/2,0);const hole=new T.Path();hole.moveTo(-w*.32,0);hole.lineTo(-w*.32,h*.6);hole.quadraticCurveTo(-w*.32,h*.78,0,h*.85);hole.quadraticCurveTo(w*.32,h*.78,w*.32,h*.6);hole.lineTo(w*.32,0);shape.holes.push(hole);const o=new T.Mesh(new T.ExtrudeGeometry(shape,{depth:.18,bevelEnabled:true,bevelThickness:.025,bevelSize:.025,bevelSegments:1,steps:1}),M(c));o.position.set(x,y,z);g.add(o);}
function lamp(g,x=0,z=0){C(g,[x,.8,z],[.04,.065,1.6],wood);B(g,[x,1.7,z],[.25,.3,.25],gold);B(g,[x,1.72,z+.13],[.15,.2,.01],'#ffc580');mesh(g,'cone',[x,1.97,z],[.22,.2,4],roof,[0,Math.PI/4,0]);C(g,[x,.08,z],[.18,.21,.16],stone);}
function column(g,x,z,h=2){C(g,[x,h/2,z],[.16,.19,h],stone);for(const y of [.1,h-.08])B(g,[x,y,z],[.48,.2,.48],edge);}
function wall(g,x,z,w=2,h=1){B(g,[x,h/2,z],[w,h,.25],stone);B(g,[x,h+.06,z],[w+.08,.12,.33],edge);for(let y=.2;y<h;y+=.24)for(let i=0;i<Math.ceil(w/.3);i++)B(g,[x-w/2+i*.32+(y%.4<.2?.1:0),y,z+.135],[.29,.012,.01],'#333947');}
function house(g,temple=false){B(g,[0,.8,0],[2.5,1.6,1.7],stone);for(const x of [-1.12,1.12])B(g,[x,.9,.89],[.15,1.8,.21],edge);mesh(g,'cone',[0,2.1,0],[1.9,1.15,4],roof,[0,Math.PI/4,0]);for(let i=0;i<6;i++){const y=1.65+i*.16,w=1.7*(1-i/7);B(g,[0,y,.85-i*.12],[w*2,.025,.025],'#6b5669');}arch(g,0,0,.92,.7,1.4,edge);B(g,[0,.55,.91],[.4,1.0,.04],wood);for(const x of [-.8,.8]){arch(g,x,.55,.9,.42,.9,edge);B(g,[x,.98,.9],[.22,.55,.02],'#c99774');}B(g,[.75,2.1,-.4],[.3,1.1,.3],stone);if(temple){C(g,[0,2,0],[.42,.45,2],stone);mesh(g,'cone',[0,3.3,0],[.65,.9,8],roof);limb(g,[0,3.7,0],[0,4.2,0],.035,gold);limb(g,[-.15,4,0],[.15,4,0],.035,gold);arch(g,0,1.6,.48,.5,1.0,edge);} }
function tree(g,dead=false,pine=false){const bark='#524943';limb(g,[0,0,0],[.02,1.9,0],.13,bark);for(let i=0;i<7;i++){const a=i*2.399,x=Math.cos(a),z=Math.sin(a),y=.9+i*.15;limb(g,[0,y-.3,0],[x*.55,y+.3,z*.55],.065,bark);limb(g,[x*.55,y+.3,z*.55],[x*.85,y+.55,z*.85],.035,bark);if(!dead&&!pine){const o=mesh(g,'sphere',[x*.55,y+.5,z*.55],[.55],['#354c43','#445950','#59644e'][i%3]);o.scale.y=.8;}}
 if(pine)for(let i=0;i<4;i++)mesh(g,'cone',[0,1+i*.45,0],[.9-i*.15,1.3,9],['#2f4840','#3a534a'][i%2]);for(let i=0;i<5;i++){const a=i*1.256;limb(g,[0,.15,0],[Math.cos(a)*.45,.02,Math.sin(a)*.45],.055,bark);}}
export const propNames=['house','temple','tower','castle-gate','wall','fence','lamp','fountain','stall','forge','oak','pine','dead-tree','bush','roots','boulder','bridge','grave','cross','mausoleum','candles','crystal','bones','pillar','stairs','stained-glass','bars','ruined-arch','column','statue','altar','moss'];
export function makeProp(name){const g=new T.Group();
 if(name==='house'||name==='temple')house(g,name==='temple');
 if(['oak','pine','dead-tree'].includes(name))tree(g,name==='dead-tree',name==='pine');
 if(name==='tower'){C(g,[0,1.4,0],[.7,.8,2.8],stone);mesh(g,'cone',[0,3.3,0],[.95,1.3,8],roof);for(let i=0;i<8;i++){const a=i*Math.PI/4;B(g,[Math.sin(a)*.7,2.6,Math.cos(a)*.7],[.27,.3,.27],edge);}arch(g,0,1.2,.72,.4,1,edge);}
 if(name==='castle-gate'){for(const x of [-1.5,1.5]){const tower=makeProp('tower');tower.position.x=x;g.add(tower);}B(g,[0,2.3,0],[3,.7,.7],stone);arch(g,0,0,.5,2.4,2.6,edge);for(let x=-.9;x<=.9;x+=.2)C(g,[x,1.15,.49],[.022,.022,2.3], '#2a303c');B(g,[0,.2,.52],[2.1,.1,.08],gold);}
 if(name==='wall')wall(g,0,0,2.5,1.4);
 if(name==='fence'||name==='bars'){for(let i=0;i<9;i++){const x=-1+i*.25;C(g,[x,.65,0],[.018,.018,1.3],'#3b424f');mesh(g,'cone',[x,1.35,0],[.055,.14,4],edge);}for(const y of [.35,1])B(g,[0,y,0],[2.1,.035,.035],edge);}
 if(name==='lamp')lamp(g);
 if(name==='fountain'){C(g,[0,.08,0],[.9,.9,.16],stone);C(g,[0,.18,0],[.78,.78,.13], '#38515d');C(g,[0,.45,0],[.16,.24,.8],edge);C(g,[0,.9,0],[.5,.5,.15],stone);C(g,[0,.99,0],[.4,.4,.03],'#8da9b4');mesh(g,'sphere',[0,1.2,0],[.12],'#bd7389');}
 if(name==='stall'){for(const x of [-.8,.8])for(const z of [-.35,.35])B(g,[x,.7,z],[.06,1.4,.06],wood);B(g,[0,.5,0],[1.8,.12,.9],wood);for(let i=0;i<8;i++)B(g,[-.8+i*.23,1.5,0],[.23,.04,1.1],i%2?'#9f8a6c':'#743548',[.15,0,0]);for(let i=0;i<6;i++)mesh(g,'sphere',[-.6+i*.24,.65,.1],[.08],i%2?'#a66264':'#a99566');}
 if(name==='forge'){B(g,[-.3,.45,0],[1,.9,.75],stone);arch(g,-.3,.1,.42,.7,.7,edge);B(g,[-.3,.3,.43],[.38,.3,.03],'#d9784f');B(g,[.65,.2,.1],[.3,.4,.3],wood);B(g,[.65,.5,.1],[.65,.15,.25],edge);C(g,[-.3,1.1,0],[.22,.25,.6],stone);}
 if(name==='bush')for(let i=0;i<5;i++)mesh(g,'sphere',[(i-2)*.18,.23,Math.sin(i)*.15],[.28],['#3e5448','#566347'][i%2]);
 if(name==='roots')for(let i=0;i<7;i++){const a=i*2.399;limb(g,[0,.1,0],[Math.cos(a)*.8,.02,Math.sin(a)*.8],.07,'#5f5048');}
 if(name==='boulder'){const o=mesh(g,'sphere',[0,.35,0],[.65],stone);o.scale.set(1,.65,.8);for(let i=0;i<3;i++)mesh(g,'sphere',[.5*Math.cos(i*2),.15,.5*Math.sin(i*2)],[.24],edge);}
 if(name==='bridge'){for(let i=0;i<12;i++)B(g,[0,.12,-1.25+i*.23],[1.15,.12,.21],wood);for(const side of [-1,1]){for(let i=0;i<4;i++)C(g,[side*.63,.4,-1.1+i*.75],[.04,.05,.8],wood);limb(g,[side*.63,.75,-1.3],[side*.63,.75,1.3],.03,'#8e846e');}}
 if(name==='grave'||name==='cross'){B(g,[0,.04,.3],[.65,.08,1.1],stone);if(name==='cross'){B(g,[0,.65,-.24],[.16,1.3,.15],edge);B(g,[0,.9,-.24],[.75,.16,.15],edge);}else{B(g,[0,.42,-.24],[.6,.8,.16],stone);C(g,[0,.82,-.24],[.31,.31,.17],stone,[Math.PI/2,0,0]);B(g,[0,.5,-.14],[.08,.3,.02],edge);B(g,[0,.55,-.14],[.27,.06,.02],edge);}}
 if(name==='mausoleum'){B(g,[0,.65,0],[1.7,1.3,1.7],stone);mesh(g,'cone',[0,1.55,0],[1.4,.65,4],roof,[0,Math.PI/4,0]);arch(g,0,0,.9,.9,1.25,edge);for(const x of [-.73,.73])column(g,x,.85,1.4);B(g,[0,1.95,0],[.1,.5,.1],edge);B(g,[0,2.03,0],[.4,.1,.1],edge);}
 if(name==='candles'){for(let i=0;i<5;i++){const x=(i-2)*.14,z=(i%2)*.22;C(g,[x,.13+i*.02,z],[.045,.045,.25+i*.04],'#c5b69a');mesh(g,'cone',[x,.32+i*.04,z],[.04,.12,8],'#efba76');}}
 if(name==='crystal'){for(let i=0;i<6;i++){const a=i*2.399,x=Math.cos(a)*.3,z=Math.sin(a)*.3;mesh(g,'cone',[x,.35+i*.055,z],[.16,.75+i*.1,5],i%2?'#809db3':'#8b687e',[0,0,(i-2)*.14]);}C(g,[0,.03,0],[.5,.6,.08],stone);}
 if(name==='bones'){for(let i=0;i<7;i++){const a=i*2.399;limb(g,[Math.cos(a)*.3,.05,Math.sin(a)*.2],[Math.cos(a+1)*.5,.09,Math.sin(a+1)*.4],.035,'#c3baa4');}mesh(g,'sphere',[0,.18,0],[.19],'#c3baa4');B(g,[0,.16,.15],[.24,.08,.07],'#34333c');}
 if(name==='pillar'||name==='column')column(g,0,0,name==='pillar'?2.4:1.2);
 if(name==='stairs')for(let i=0;i<6;i++)B(g,[0,i*.1,-i*.18],[1.8,.12,.3],i%2?edge:stone);
 if(name==='stained-glass'){arch(g,0,0,0,1.4,2.6,edge);for(let i=0;i<5;i++)for(let j=0;j<7;j++)B(g,[(i-2)*.19,.3+j*.26,0],[.17,.24,.03],['#724455','#59728b','#a48a60'][(i+j)%3]);}
 if(name==='ruined-arch'){arch(g,0,0,0,2.4,2.4);for(let i=0;i<5;i++)B(g,[-1.2+i*.3,.1,Math.sin(i)*.4],[.3,.2,.3],edge,[0,i*.3,.1]);}
 if(name==='statue'){C(g,[0,.18,0],[.45,.55,.36],stone);mesh(g,'cone',[0,1,0],[.36,1.4,8],edge);mesh(g,'sphere',[0,1.8,0],[.2],stone);limb(g,[-.23,1.45,0],[-.55,1.8,.1],.07,stone);limb(g,[.23,1.45,0],[.55,1.8,.1],.07,stone);B(g,[0,2.05,.1],[1.3,.08,.3],edge);}
 if(name==='altar'){B(g,[0,.15,0],[1.7,.3,1],stone);for(const x of [-.6,.6])B(g,[x,.6,0],[.15,.9,.6],edge);B(g,[0,1,0],[1.8,.2,1],stone);B(g,[0,1.12,0],[.65,.04,.4],'#702f44');}
 if(name==='moss')for(let i=0;i<8;i++)mesh(g,'sphere',[Math.cos(i*2.399)*.45,.01,Math.sin(i*2.399)*.4],[.2],'#485847').scale.y=.1;
 return g;
}
