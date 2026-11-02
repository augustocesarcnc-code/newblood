"""Decode the exported walk GIF and verify size, timing, motion, and reviewed gait."""
from pathlib import Path
from PIL import Image,ImageChops,ImageStat
import hashlib,json,subprocess,statistics
ROOT=Path(__file__).resolve().parents[2];OUT=ROOT/'docs/reviews/hunter-motion';path=OUT/'walk-8-directions.gif';im=Image.open(path);audit=json.loads((OUT/'audit.json').read_text());clip=audit['clips']['walk'];names=audit['directions'];hashes=[];durations=[];heights=[];decoded=[]
for frame in range(im.n_frames):
 im.seek(frame);rgb=im.convert('RGB');decoded.append(rgb);p=rgb.load();hashes.append(hashlib.sha256(rgb.tobytes()).hexdigest());durations.append(im.info.get('duration',0));row=[]
 for d in range(8):
  ys=[y for y in range(50,282) if any(max(abs(p[x,y][k]-[119,123,128][k]) for k in range(3))>65 for x in range(d*192+10,(d+1)*192-10))]
  assert ys,(frame,names[d],'empty sprite');row.append(max(ys)-min(ys)+1)
 heights.append(row)
spreads={name:max(row[d] for row in heights)-min(row[d] for row in heights) for d,name in enumerate(names)}
subprocess.run(['ffmpeg','-v','error','-i',str(path),'-f','null','-'],check=True)
issues=[]
if im.n_frames!=clip['frameCount']:issues.append('Wrong frame count')
if len(set(hashes))!=im.n_frames:issues.append('Identical full GIF frames')
if im.info.get('loop')!=0:issues.append('Loop is not infinite')
if min(durations)<=0:issues.append('Invalid frame timing')
if max(spreads.values())>8:issues.append('Silhouette height changes by >8 display pixels')
transitions={}
for d,name in enumerate(names):
 crops=[rgb.crop((d*192+10,50,(d+1)*192-10,282)) for rgb in decoded];differences=[]
 for i in range(len(crops)):
  stats=ImageStat.Stat(ImageChops.difference(crops[i],crops[(i+1)%len(crops)]));differences.append(round(sum(stats.mean)/3,4))
 median=statistics.median(differences)
 if min(differences)==0:issues.append(name+': unchanged sprite on adjacent frames')
 if differences[-1]>max(2.5*median,5):issues.append(name+': loop seam motion exceeds transition threshold')
 transitions[name]={'meanAbsolutePixelDifferencesIncludingLoop':differences,'loopToMedianRatio':round(differences[-1]/median,3) if median else None}
# Regression for the original same-boot-forward defect: S contacts at frames 1/5.
front_contacts=[]
if im.n_frames>=8:
 for f in [0,4]:
  pix=decoded[f].load();ends=[]
  for x0,x1 in [(838,861),(867,895)]:
   ys=[y for y in range(240,282) if any(max(abs(pix[x,y][k]-[119,123,128][k]) for k in range(3))>65 for x in range(x0,x1))]
   ends.append(max(ys) if ys else 239)
  front_contacts.append(ends)
 if not(front_contacts[0][0]-front_contacts[0][1]>=8 and front_contacts[1][1]-front_contacts[1][0]>=8):issues.append('S: foreground boot does not alternate between opposite contacts')
else:issues.append('Eight frames are required for the revised cycle')
technical_issues=list(issues)
checksum=hashlib.sha256(path.read_bytes()).hexdigest();reviewfile=OUT/'gait-review.json';review=json.loads(reviewfile.read_text()) if reviewfile.exists() else {};matching=review.get('gifSHA256')==checksum
if not matching:issues.append('Current GIF has no matching visual gait review')
elif any(review.get('directions',{}).get(d,{}).get('result')!='PASS' for d in names):issues.append('At least one direction failed or lacks visual gait review')
visual_failed=matching and any(v.get('result','').startswith('FAIL') for v in review.get('directions',{}).values())
visual_passed=matching and all(review.get('directions',{}).get(d,{}).get('result')=='PASS' for d in names)
report={'technicalResult':'FAIL' if technical_issues else 'PASS','technicalIssues':technical_issues,'visualResult':'FAIL' if visual_failed else ('PASS' if visual_passed else 'PENDING'),'file':path.name,'sha256':checksum,'decode':'PASS: Pillow and FFmpeg','dimensions':list(im.size),'frames':im.n_frames,'uniquePixelFrames':len(set(hashes)),'infiniteLoop':im.info.get('loop')==0,'durationsMs':durations,'loopDurationMs':sum(durations),'heightSpreadPxPerDirection':spreads,'transitions':transitions,'southContactBootExtentsFrames1And5':front_contacts,'visualReviewMatches':matching,'visualReview':review if matching else 'PENDING for current checksum','overall':'FAIL_VISUAL' if visual_failed else ('PASS_TECHNICAL_AND_REVIEW' if not issues else 'FAIL_OR_PENDING'),'issues':issues,'gameplayIntegration':False,'limitations':['Pixel differences do not certify anatomical left/right or absence of foot sliding.','Manual review is author QA, not user art approval.','Movement in the game is not exercised by this stationary GIF.']}
(OUT/'walk-test.json').write_text(json.dumps(report,indent=2)+'\n');print(json.dumps({k:report[k] for k in ['frames','heightSpreadPxPerDirection','technicalResult','visualResult','overall','issues']},indent=2));raise SystemExit(bool(issues))
