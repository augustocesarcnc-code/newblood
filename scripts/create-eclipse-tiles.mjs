import {writeFile,mkdir,readFile} from 'node:fs/promises';
const out=new URL('../assets/eclipse/',import.meta.url);await mkdir(out,{recursive:true});
const types={village:['#45444a','#69656a'],forest:['#293d35','#435145'],cemetery:['#383b42','#5c6066'],cave:['#30313c','#555563'],castle:['#3d3541','#675665'],ruins:['#3c4443','#616963'],dirt:['#403a35','#5e5043'],water:['#1a303c','#3b5862'],wood:['#3d3633','#665447'],cursed:['#352b3b','#635063'],grass:['#293a33','#465448'],road:['#44464b','#747173']};
let seed=3011;const random=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;};
for(const [name,[base,light]]of Object.entries(types)){let shapes='';for(let y=0;y<128;y+=16)for(let x=-20;x<128;x+=32){const dx=(y/16)%2*16,w=30+random()*2,h=14+random()*2;if(['village','road','castle','cemetery','ruins'].includes(name)){shapes+=`<path d="M${x+dx+1} ${y+1}l${w-3} -1 2 ${h-3}-3 3-${w-4} -1Z" fill="${light}" opacity="${.23+random()*.22}" stroke="#101922" stroke-opacity=".35"/>`;if(random()<.3)shapes+=`<path d="m${x+dx+4} ${y+4} 9 3-2 6 10 2" fill="none" stroke="#1e242c" opacity=".6"/>`;}}
 for(let n=0;n<420;n++){const x=random()*128,y=random()*128;shapes+=`<ellipse cx="${x}" cy="${y}" rx="${.2+random()*1.6}" ry="${.2+random()*.6}" fill="${random()<.5?light:'#121920'}" opacity="${.1+random()*.3}"/>`;}
 if(['grass','forest'].includes(name))for(let n=0;n<80;n++){const x=random()*128,y=random()*128;shapes+=`<path d="m${x} ${y} -2-5 3 3 2-4" fill="none" stroke="${light}" opacity=".5" stroke-width=".7"/>`;}
 if(name==='wood')for(let x=0;x<128;x+=16)shapes+=`<path d="M${x} 0v128m4-125v122" stroke="#181b22" opacity=".6"/>`;
 if(name==='water')for(let n=0;n<34;n++){const x=random()*128,y=random()*128;shapes+=`<path d="M${x} ${y}q8-3 18 0" stroke="${light}" stroke-width=".6" fill="none" opacity=".6"/>`;}
 const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" viewBox="0 0 128 128"><rect width="128" height="128" fill="${base}"/>${shapes}</svg>`;await writeFile(new URL('tile-'+name+'.svg',out),svg);
}
console.log('12 original semantic terrain tiles created.');
