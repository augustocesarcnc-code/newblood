"""Read-only pixel/metadata audit. Never changes the generated source image."""
from pathlib import Path
from PIL import Image
import hashlib,json
ROOT=Path(__file__).resolve().parents[1];folder=ROOT/'assets/characters/hunter';meta=json.loads((folder/'master.json').read_text());path=folder/meta['asset'];im=Image.open(path).convert('RGBA');issues=[];views=[];hashes=[]
if hashlib.sha256(path.read_bytes()).hexdigest()!=meta['sha256']:issues.append('source checksum mismatch')
if meta['framesPerDirection']!=1 or meta['animated']:issues.append('Phase A must remain one static pose per direction')
if set(meta['views'])!=set(['N','NE','E','SE','S','SW','W','NW']):issues.append('missing or duplicate direction')
for name in meta['directionOrder']:
 view=meta['views'][name];x,y,w,h=view['rect'];px,py=view['pivot'];left,top,right,bottom=view['bodyBounds']
 if not(0<=x<x+w<=im.width and 0<=y<y+h<=im.height):issues.append(name+': source rectangle outside image')
 if not(x<left<right<x+w and y<top<bottom<y+h):issues.append(name+': body touches frame boundary')
 if not(0<px<w and 0<py<h):issues.append(name+': pivot outside frame')
 if py!=bottom-y:issues.append(name+': ground pivot mismatch')
 for previous in views:
  a,b,c,d=previous['rect']
  if max(x,a)<min(x+w,a+c) and max(y,b)<min(y+h,b+d):issues.append(name+': overlap with '+previous['direction'])
 # These are measurements in memory; the PNG is never cropped, repainted or resaved.
 digest=hashlib.sha256(im.crop((x,y,x+w,y+h)).tobytes()).hexdigest();hashes.append(digest);views.append({'direction':name,'rect':view['rect'],'pivot':view['pivot'],'bodyHeight':bottom-top,'sha256':digest})
if len(set(hashes))!=8:issues.append('repeated view pixels')
report={'phase':'A','status':meta['status'],'imageSize':list(im.size),'sourceSHA256':meta['sha256'],'directions':views,'uniqueViews':len(set(hashes)),'posesPerDirection':1,'animationsProduced':0,'issues':issues,'notes':['Body bounds measured from the dominant connected alpha component (alpha >= 32). Very faint isolated generated alpha noise is not treated as anatomy.','No source pixels were modified.','Distinct hashes do not prove anatomy or perspective. Human visual approval is still required.']}
out=ROOT/'docs/reviews/hunter-master/audit.json';out.parent.mkdir(parents=True,exist_ok=True);out.write_text(json.dumps(report,indent=2)+'\n');print(json.dumps({'directions':len(views),'uniqueViews':len(set(hashes)),'animationsProduced':0,'issues':issues}));raise SystemExit(bool(issues))
