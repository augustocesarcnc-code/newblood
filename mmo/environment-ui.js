let fog;
export function drawEnvironment(c,environment,now,width,height){if(!environment)return;const darkness={DIA:.02,ENTARDECER:.12,NOITE:.23,AMANHECER:.08}[environment.phase]||0;c.fillStyle=`rgba(9,9,25,${darkness})`;c.fillRect(0,0,width,height);const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
 if(['CHUVA','TEMPESTADE'].includes(environment.weather)&&!reduced){c.save();c.strokeStyle='#aec1d244';c.lineWidth=1;c.beginPath();for(let i=0;i<75;i++){const x=((i*193+now*.13)% (width+70))-35,y=(i*337+now*.55)%(height+60)-30;c.moveTo(x,y);c.lineTo(x-7,y+17);}c.stroke();if(environment.weather==='TEMPESTADE'&&now%9000<70){c.fillStyle='#b9c3ed16';c.fillRect(0,0,width,height);}c.restore();}
 if(environment.weather==='NÉVOA'||environment.weather==='TEMPESTADE'){if(!fog){fog=document.createElement('canvas');fog.width=512;fog.height=256;const ctx=fog.getContext('2d'),g=ctx.createRadialGradient(256,128,0,256,128,256);g.addColorStop(0,'#c3c3d933');g.addColorStop(1,'#c3c3d900');ctx.fillStyle=g;ctx.fillRect(0,0,512,256);}for(let i=0;i<4;i++){const x=(i*width/3+(reduced?0:now*.012))%(width+300)-150;c.drawImage(fog,x,height*(i%3)/3,width*.7,height*.5);}}
}

// Background sky band: 2D layers only, under world objects and actors.
export function drawCelestial(c,moon,environment,width,height){
 if(!moon)return;
 const orbit=moon.orbit??0,night=environment?.phase==='NOITE',radius=moon.eclipse?29:24,x=width*(.34+orbit*.28),y=155-Math.sin(orbit*Math.PI)*72;
 c.save();const sky=c.createLinearGradient(0,45,0,225);sky.addColorStop(0,moon.eclipse?'#080a18c9':night?'#0c152891':'#14213544');sky.addColorStop(1,'#10142100');c.fillStyle=sky;c.fillRect(0,45,width,180);
 c.globalAlpha=(night||moon.eclipse) ? .9 : .55;const glow=c.createRadialGradient(x,y,radius*.5,x,y,radius*3.6);glow.addColorStop(0,moon.blood?'#9d344945':'#8aaaca44');glow.addColorStop(1,'#00000000');c.fillStyle=glow;c.fillRect(x-radius*4,y-radius*4,radius*8,radius*8);
 c.fillStyle=moon.blood?'#bd6875':'#bcc6d2';c.beginPath();c.arc(x,y,radius,0,Math.PI*2);c.fill();
 if(moon.eclipse){c.strokeStyle='#bc9c88';c.lineWidth=2;c.stroke();c.fillStyle='#111421';c.beginPath();c.arc(x+2,y-1,radius-2,0,Math.PI*2);c.fill();}
 else if(moon.index!==4){const phase=moon.index/8;c.save();c.beginPath();c.arc(x,y,radius,0,Math.PI*2);c.clip();c.fillStyle='#151d2d';c.beginPath();c.ellipse(x+(phase<.5?-1:1)*radius*(1-Math.abs(.5-phase)*2),y,radius*(1-Math.sin(phase*Math.PI)*.5),radius*1.02,0,0,Math.PI*2);c.fill();c.restore();}
 c.restore();
 if(moon.eclipse){c.save();c.fillStyle='#0a0c2840';c.fillRect(0,0,width,height);c.restore();}
}
