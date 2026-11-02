"""Index unchanged generated PNG atlases. Reads pixels; does not edit image files."""
from pathlib import Path
from PIL import Image
import json
root=Path(__file__).resolve().parents[1]
manifest={'version':1,'directions':['S','SW','W','NW','N','NE','E','SE'],'framesPerCycle':8,'animations':{}}
for kind in ['lobisomem','vampiro']:
 manifest['animations'][kind]={}
 for action in ['walk','run']:
  rows=[]
  for half in ['front','back']:
   name=f'{kind}-{action}-{half}.png';im=Image.open(root/'assets/animations'/name).convert('RGBA');w,h=im.size
   alpha=im.getchannel('A');part=[]
   for row in range(4):
    frames=[]
    for col in range(8):
     x=round(col*w/8);y=round(row*h/4);right=round((col+1)*w/8);bottom=round((row+1)*h/4)
     region=alpha.crop((x,y,right,bottom));bbox=region.point(lambda v:255 if v>60 else 0).getbbox()
     if not bbox:raise ValueError(f'Empty sprite {name}, {row}, {col}')
     frames.append({'rect':[x,y,right-x,bottom-y],'visible':list(bbox)})
    # One common baseline/scale per directional cycle prevents per-frame resizing.
    top=min(f['visible'][1] for f in frames);foot=max(f['visible'][3] for f in frames)
    rows.append({'image':name,'size':[w,h],'pivot':[w/16,foot],'height':foot-top,'frames':frames})
  manifest['animations'][kind][action]=rows
(root/'assets/animations/manifest.json').write_text(json.dumps(manifest,indent=2))
print('Indexed',sum(len(row['frames']) for animations in manifest['animations'].values() for rows in animations.values() for row in rows),'frames in eight unchanged PNGs.')
