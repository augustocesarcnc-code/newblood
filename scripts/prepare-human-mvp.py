"""Measure existing approved-design art; no PNG edits or new body generation."""
from pathlib import Path
from PIL import Image
from hunter_art_measurements import body_box
import json,hashlib,statistics
ROOT=Path(__file__).resolve().parents[1];folder=ROOT/'assets/characters/human';views={};sources={}
for d in ['N','NE','E','SE','S','SW','W','NW']:
 p=folder/f'walk-{d}.png';im=Image.open(p).convert('RGBA');w,h=im.size;frames=[]
 for f in range(8):
  x0=round((f%4)*w/4);x1=round((f%4+1)*w/4);y0=round((f//4)*h/2);y1=round((f//4+1)*h/2);tile=im.crop((x0,y0,x1,y1));l,t,r,b=body_box(tile);a=tile.getchannel('A');pixels=a.load();centers=[]
  for y in range(t+round((b-t)*.23),t+round((b-t)*.38)):
   xs=[x for x in range(l,r) if pixels[x,y]>160]
   if xs:centers.append((min(xs)+max(xs))/2)
  frames.append({'rect':[x0,y0,x1-x0,y1-y0],'pivot':[statistics.median(centers),b],'bounds':[l,t,r,b]})
 ground=max(v['pivot'][1] for v in frames);height=statistics.median(v['bounds'][3]-v['bounds'][1] for v in frames)
 for v in frames:v['pivot'][1]=ground
 views[d]={'asset':f'/assets/characters/human/walk-{d}.png','referenceHeight':height,'frames':frames};sources[d]={'sha256':hashlib.sha256(p.read_bytes()).hexdigest(),'size':[w,h]}
master=json.loads((ROOT/'assets/characters/hunter/master.json').read_text());master['image']='/assets/characters/hunter/'+master['asset']
manifest={'version':1,'status':'MVP_DEV','rig':'hunter-approved-shared-v1','sourceDesign':'Approved Hunter; no new human anatomy','cell':[128,192],'anchor':[64,174],'bodyHeight':132,'worldHeight':54,'walkFrames':8,'walkMs':125,'walk':views,'sources':sources,'master':master,'states':{'idle':'APPROVED_MASTER_STATIC','walk':'MVP_DEV_EIGHT_FRAME_REUSE','attack':'TEMP_PROCEDURAL_FEEDBACK','hit':'TEMP_PROCEDURAL_FEEDBACK','death':'TEMP_PROCEDURAL_FEEDBACK','run':'TEMP_WALK_REUSE'},'layers':'Composite BODY plus synchronized TEMP skin/gear overlays; extraction of independent painted clothing layers is deferred.'}
(folder/'manifest.json').write_text(json.dumps(manifest,indent=2)+'\n');print('Prepared one human rig, 8 directions x 8 walk frames, shared by all classes.')
