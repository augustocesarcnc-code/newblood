"""Analyze alpha seams; fix crop metadata without modifying approved PNG art."""
from pathlib import Path
from PIL import Image
import json,statistics
root=Path(__file__).resolve().parents[1];path=root/'assets/animations/manifest.json';m=json.loads(path.read_text())
for state in ['walk','run']:
 for d,row in enumerate(m['animations']['lobisomem'][state]):
  im=Image.open(root/'assets/animations'/row['image']).getchannel('A');w,h=im.size;direction_row=d%4;frames=[];heights=[];feet=[]
  global_projection=[sum(v>96 for v in im.crop((0,y,w,y+1)).tobytes()) for y in range(h)]
  horizontal=[0]
  for i in [1,2,3]:
   lo=int(h*i/4-40);hi=int(h*i/4+40);minimum=min(global_projection[lo:hi]);candidates=[y for y in range(lo,hi) if global_projection[y]==minimum];horizontal.append(round(statistics.median(candidates)))
  horizontal.append(h);band=im.crop((0,horizontal[direction_row],w,horizontal[direction_row+1]));band_raw=band.tobytes();vertical=[sum(band_raw[y*w+x]>96 for y in range(band.height)) for x in range(w)];columns=[0]
  for i in range(1,8):
   lo=int(w*i/8-60);hi=int(w*i/8+60);minimum=min(vertical[lo:hi]);candidates=[x for x in range(lo,hi) if vertical[x]==minimum];columns.append(round(statistics.median(candidates)))
  columns.append(w)
  for frame in range(8):
   left=columns[frame];right=columns[frame+1];column=im.crop((left,0,right,h));raw=column.tobytes();width=right-left
   projection=[sum(v>96 for v in raw[y*width:(y+1)*width]) for y in range(h)]
   bounds=[0]
   for i in [1,2,3]:
    center=h*i/4;lo=max(1,int(center-40));hi=min(h-1,int(center+40));minimum=min(projection[lo:hi]);candidates=[y for y in range(lo,hi) if projection[y]==minimum];runs=[]
    for y in candidates:
     if not runs or y!=runs[-1][-1]+1:runs.append([y])
     else:runs[-1].append(y)
    run=max(runs,key=lambda r:(len(r),-abs(statistics.mean(r)-center)));bounds.append(round(statistics.mean(run)))
   bounds.append(h);top,bottom=bounds[direction_row:direction_row+2];mask=column.crop((0,top,width,bottom)).point(lambda x:255 if x>96 else 0);bbox=mask.getbbox()
   if not bbox:raise ValueError((state,d,frame))
   x1,y1,x2,y2=bbox;heights.append(y2-y1);footmask=mask.crop((0,max(y1,y2-14),width,y2));points=[];data=footmask.tobytes()
   for y in range(footmask.height):
    points.extend(x for x in range(width) if data[y*width+x])
   feet.append(statistics.median(points) if points else (x1+x2)/2)
   frames.append({'rect':[left,top,width,bottom-top],'visible':[x1,y1,x2,y2],'pivot':[round(feet[-1],2),y2+2]})
  # Per-frame feet fix alignment; common height keeps scale stable across a cycle.
  row['frames']=frames;row['height']=max(heights);row['pivot']=[round(statistics.median(feet),2),max(f['visible'][3] for f in frames)+2]
# The generated side-running strips overlap adjacent silhouettes in their source
# PNGs. Use clean approved side-walk poses at run cadence rather than ship tails
# clipped in half. Other six run directions keep their dedicated original art.
for direction in [2,6]:
 import copy
 row=copy.deepcopy(m['animations']['lobisomem']['walk'][direction]);row['sourceState']='walk';row['note']='clean side poses at running cadence; original side-run source has overlapping figures';m['animations']['lobisomem']['run'][direction]=row
m['version']=2;m['cropConvention']='alpha seams per column, per-frame foot pivot; original PNGs unchanged'
path.write_text(json.dumps(m,indent=2)+'\n');print('Corrected 128 wolf movement frames, original PNGs unchanged.')
