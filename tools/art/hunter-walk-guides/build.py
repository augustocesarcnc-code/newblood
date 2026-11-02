"""Original skeletal authoring guides. No game sprite pixels or rejected rigs used."""
from pathlib import Path
import math,subprocess
out=Path(__file__).resolve().parent
facings={'N':(0,-1),'NE':(.707,-.707),'E':(1,0),'SE':(.707,.707),'S':(0,1),'SW':(-.707,.707),'W':(-1,0),'NW':(-.707,-.707)}
stride=[40,20,0,-20,-40,-20,0,20];lift=[0,0,0,0,0,18,25,15]
for name,(dx,dy) in facings.items():
 shapes=['<svg xmlns="http://www.w3.org/2000/svg" width="1040" height="800" viewBox="0 0 1040 800"><rect width="1040" height="800" fill="#eee"/>']
 for frame in range(8):
  ox=(frame%4)*260+130;oy=(frame//4)*400+365
  def p(lat,f,z):return ox-lat*dy+f*dx,oy+lat*dx*.2+f*dy*.4-z
  def line(a,b,color,width=9):shapes.append(f'<path d="M{a[0]:.2f},{a[1]:.2f} L{b[0]:.2f},{b[1]:.2f}" stroke="{color}" stroke-width="{width}" stroke-linecap="round"/>')
  def circle(a,r,color):shapes.append(f'<circle cx="{a[0]:.2f}" cy="{a[1]:.2f}" r="{r}" fill="{color}"/>')
  line(p(0,0,116),p(0,0,237),'#777',25);line(p(-24,0,227),p(24,0,227),'#777',15);line(p(-15,0,116),p(15,0,116),'#777',13);line(p(0,0,237),p(0,0,265),'#777',12);circle(p(0,0,286),21,'#777');line(p(0,0,287),p(0,22,287),'#222',4)
  # Draw far side first so the diagrams preserve occlusion.
  sides=[(-1,'#2476dd',4),(1,'#df3b35',0)]
  if (-dy)<0:sides.reverse()
  for side,color,phase in sides:
   i=(frame+phase)%8;f=stride[i];z=lift[i];length=math.hypot(f,z-116);bend=math.sqrt(max(0,65**2-(length/2)**2));kf=f*.5+(116-z)/length*bend;kz=116+(z-116)*.5+f/length*bend
   hip=p(side*15,0,116);knee=p(side*15,kf,kz);ankle=p(side*15,f,z);line(hip,knee,color,11);line(knee,ankle,color,10);line(ankle,p(side*15,f+15,z),color,10)
   for joint in (hip,knee,ankle):circle(joint,4,'white')
   handf=-f*.75;shoulder=p(side*25,0,227);elbow=p(side*27,handf*.55+7,182);hand=p(side*27,handf,140);line(shoulder,elbow,color,9);line(elbow,hand,color,8);circle(hand,6,color)
  shapes.append(f'<text x="{ox-115}" y="{oy-330}" font-family="sans-serif" font-size="18">{frame+1}</text>')
 shapes.append('</svg>');svg=out/f'{name}.svg';svg.write_text(''.join(shapes));subprocess.run(['inkscape',str(svg),'--export-filename='+str(out/f'{name}.png')],check=True)
