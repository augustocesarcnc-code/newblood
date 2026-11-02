"""Measure authored walk clips. No image edits and no per-frame scale normalization."""
from pathlib import Path
from PIL import Image
import json,hashlib,statistics
from hunter_art_measurements import body_box
ROOT=Path(__file__).resolve().parents[1];OUT=ROOT/'docs/reviews/hunter-motion';folder=ROOT/'assets/characters/hunter/animation-review/walk-v3'
# Reuse the measured connected-component detector, retaining the other clips.
report=json.loads((OUT/'audit.json').read_text());names=report['directions']
views={};assets={};sources={};scales={};issues=[]
repair=folder.parent/'walk-v4'
version=4 if all((repair/f'{d}.png').exists() for d in ['NE','NW']) else 3
for direction in names:
 path=(repair if version==4 and direction in ['NE','NW'] else folder)/f'{direction}.png';im=Image.open(path).convert('RGBA');w,h=im.size;a=im.getchannel('A');pix=a.load();frames=[]
 for f in range(8):
  col=f%4;row=f//4;x0=round(col*w/4);x1=round((col+1)*w/4);y0=round(row*h/2);y1=round((row+1)*h/2);tile=im.crop((x0,y0,x1,y1));l,t,r,b=body_box(tile)
  headbox=tile.getchannel('A').crop((0,t,tile.width,t+round((b-t)*.17))).point(lambda v:255 if v>160 else 0).getbbox();headwidth=headbox[2]-headbox[0]
  centers=[]
  for y in range(y0+t+round((b-t)*.23),y0+t+round((b-t)*.38)):
   xs=[x for x in range(x0+l,x0+r) if pix[x,y]>160]
   if xs:centers.append((min(xs)+max(xs))/2-x0)
  frames.append({'sourceFrame':f+1,'rect':[x0,y0,x1-x0,y1-y0],'bodyBounds':[x0+l,y0+t,x0+r,y0+b],'pivot':[statistics.median(centers),b],'bodyHeight':b-t,'headBandWidth':headwidth,'sha256':hashlib.sha256(tile.tobytes()).hexdigest()})
  if min(l,t,x1-x0-r,y1-y0-b)<2:issues.append(f'{direction}/{f+1}: source margin <2px; inspect clipping')
 ground=max(f['pivot'][1] for f in frames)
 for f in frames:f['pivot'][1]=ground
 heights=[f['bodyHeight'] for f in frames];spread=max(heights)-min(heights);ratio=max(heights)/min(heights)-1
 if ratio>.05:issues.append(f'{direction}: source height changes {ratio*100:.2f}%')
 if len({f['sha256'] for f in frames})!=8:issues.append(f'{direction}: duplicated frames')
 timeline={'N':[2,4,7,8,5,1,3,6]}.get(direction,list(range(1,9)))
 frames=[frames[i-1] for i in timeline]
 scales[direction]=205/statistics.median(heights);views[direction]=frames;assets[direction]='/assets/characters/hunter/animation-review/'+path.parent.name+'/'+path.name;sources[direction]={'sha256':hashlib.sha256(path.read_bytes()).hexdigest(),'imageSize':[w,h],'heightSpreadPx':spread,'relativeHeightSpread':ratio,'fixedDirectionScale':scales[direction],'headBandWidths':[v['headBandWidth'] for v in frames]}
clip={'asset':assets['S'],'assets':assets,'sources':sources,'scaleByDirection':scales,'frameCount':8,'fps':8,'views':views,'issues':issues,'version':version,'layout':'Separate direction sheets, 4 columns x 2 rows, row-major.','scalePolicy':'Fixed scale per authored direction sheet; same value for all its frames.','pivotPolicy':'Measured torso center x; shared contact baseline per direction.'}
report['clips']['walk']=clip;report['status']='DEV_AWAITING_GAIT_TEST';(OUT/'audit.json').write_text(json.dumps(report,indent=2)+'\n');print(json.dumps({'walkVersion':version,'frames':8,'directions':8,'issues':issues,'sources':sources},indent=2))
