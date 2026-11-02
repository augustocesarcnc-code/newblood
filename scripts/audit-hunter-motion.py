"""Read-only source measurement; rendering/export belongs to the browser/FFmpeg."""
from pathlib import Path
from PIL import Image
import json,hashlib,statistics
root=Path(__file__).resolve().parents[1]
from hunter_art_measurements import body_box
clips={};directions=['N','NE','E','SE','S','SW','W','NW']
for state,frames,fps in [('idle',4,3),('walk',6,8),('run',6,12)]:
 p=root/'assets/characters/hunter/animation-review'/f'{state}.png'
 corrected=state=='walk' and (p.parent/'walk-v2.png').exists()
 if corrected:p=p.parent/'walk-v2.png'
 im=Image.open(p).convert('RGBA');a=im.getchannel('A');w,h=im.size;rows=8 if corrected else frames;cols=frames if corrected else 8
 projection=[sum(v>80 for v in a.crop((0,y,w,y+1)).get_flattened_data()) for y in range(h)]
 edges=[0]
 for i in range(1,rows):
  candidates=list(range(max(0,round(i*h/rows)-35),min(h,round(i*h/rows)+36)))
  minimum=min(projection[y] for y in candidates);best=[y for y in candidates if projection[y]<=minimum+2]
  edges.append(round(sum(best)/len(best)))
 edges.append(h)
 views={};issues=[]
 for col,name in enumerate(directions):
  cells=[]
  for f in range(frames):
   xcol=f if corrected else col;yrow=col if corrected else f
   x0=round(xcol*w/cols);x1=round((xcol+1)*w/cols);y0=edges[yrow];y1=edges[yrow+1]
   tile=im.crop((x0,y0,x1,y1));box=body_box(tile)
   if not box:raise ValueError('Empty '+state+name+str(f))
   l,t,r,b=box;cells.append({'rect':[x0,y0,x1-x0,y1-y0],'bodyBounds':[x0+l,y0+t,x0+r,y0+b],'pivot':[(l+r)/2,b],'bodyHeight':b-t,'sha256':hashlib.sha256(tile.tobytes()).hexdigest()})
   if min(l,t,x1-x0-r,y1-y0-b)<2:issues.append(f'{name} frame {f}: less than 2px alpha margin; inspect clipping')
  heights=[v['bodyHeight'] for v in cells];ratio=max(heights)/min(heights)
  if ratio>(1.025 if corrected else 1.1):issues.append(f'{name}: source silhouette height varies {(ratio-1)*100:.1f}% (includes pose change)')
  if len({v['sha256'] for v in cells})!=frames:issues.append(name+': duplicated pixel frames')
  if corrected:
   ground=max(v['pivot'][1] for v in cells)
   for v in cells:
    sx,sy,cw,ch=v['rect'];left,top,right,bottom=v['bodyBounds'];centers=[];pixels=a.load()
    for y in range(round(top+(bottom-top)*.23),round(top+(bottom-top)*.38)):
     xs=[x for x in range(left,right) if pixels[x,y]>160]
     if xs:centers.append((min(xs)+max(xs))/2-sx)
    v['pivot']=[statistics.median(centers),ground]
    v['pivotPolicy']='Torso center horizontally; shared contact baseline per direction; no rescaling'
  views[name]=cells
 clips[state]={'asset':'/assets/characters/hunter/animation-review/'+p.name,'sourceSHA256':hashlib.sha256(p.read_bytes()).hexdigest(),'imageSize':[w,h],'frameCount':frames,'fps':fps,'layout':'directions-in-rows' if corrected else 'directions-in-columns','rowEdges':edges,'views':views,'issues':issues}
report={'status':'DEV_AUDIT_NOT_APPROVED','approvedMaster':'3d7119a54901a13bf3c278910786ae37e21bf7cb09d563573ef0e5cbaf640a18','directions':directions,'clips':clips,'rendering':'Common pixel scale across frames; measured ground pivots. No per-frame height normalization.','limitations':['Distinct hashes do not certify correct gait or anatomy.','Stationary GIFs do not certify absence of foot sliding during world movement.','Candidates are not integrated into gameplay.']}
out=root/'docs/reviews/hunter-motion/audit.json';out.write_text(json.dumps(report,indent=2)+'\n')
for s,c in clips.items():print(s,c['imageSize'],c['frameCount'],'frames;',len(c['issues']),'audit findings')

if all((root/'assets/characters/hunter/animation-review/walk-v3'/f'{d}.png').exists() for d in directions):
 import subprocess,sys
 subprocess.run([sys.executable,str(root/'scripts/audit-hunter-walk-v3.py')],check=True)
