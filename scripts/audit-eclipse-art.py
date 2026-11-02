from pathlib import Path
from PIL import Image
import json,hashlib
root=Path(__file__).resolve().parents[1];folder=root/'assets/eclipse';m=json.loads((folder/'manifest.json').read_text());w,h=m['cell'];issues=[];duplicates=[];count=0
for model,states in m['entries'].items():
 for state,clip in states.items():
  im=Image.open(folder/clip['image']).convert('RGBA');assert im.size==(w*8,h*8)
  clip['bounds']=[]
  for d in range(8):
   hashes=[];row=[]
   for f in range(8):
    frame=im.crop((f*w,d*h,(f+1)*w,(d+1)*h));bounds=frame.getchannel('A').getbbox();count+=1
    if not bounds or bounds[0]<=0 or bounds[1]<=0 or bounds[2]>=w or bounds[3]>=h:issues.append([model,state,d,f,bounds])
    hashes.append(hashlib.sha256(frame.tobytes()).hexdigest());row.append(bounds)
   clip['bounds'].append(row)
   if len(set(hashes))<8:duplicates.append([model,state,d,len(set(hashes))])
gearIssues=[];gearFrames=0;fileHashes={}
for group in [m['entries'],m['equipment']]:
 for name,clips in group.items():
  for state,clip in clips.items():fileHashes[clip['image']]=hashlib.sha256((folder/clip['image']).read_bytes()).hexdigest()
for item,clips in m['equipment'].items():
 for state,clip in clips.items():
  im=Image.open(folder/clip['image']).convert('RGBA');gw,gh=clip.get('cell',m['cell'])
  for d in range(8):
   for f in range(8):
    box=im.crop((f*gw,d*gh,(f+1)*gw,(d+1)*gh)).getchannel('A').getbbox();gearFrames+=1
    if box and (box[0]<=0 or box[1]<=0 or box[2]>=gw or box[3]>=gh):gearIssues.append([item,state,d,f,box])
report={'equipmentFrames':gearFrames,'equipmentBoundsIssues':gearIssues,'fileHashes':fileHashes,'bodyFrames':count,'boundsIssues':issues,'repeatedPoseRows':duplicates,'equipmentSheets':sum(len(s)for s in m['equipment'].values())}
(folder/'manifest.json').write_text(json.dumps(m,separators=(',',':')))
(root/'docs/art/frame-audit.json').write_text(json.dumps(report,indent=2));print(json.dumps({'frames':count,'boundsIssues':len(issues),'repeatedRows':len(duplicates),'equipmentBounds':gearIssues[:10],'firstBounds':issues[:10],'firstRepeated':duplicates[:10]}))
