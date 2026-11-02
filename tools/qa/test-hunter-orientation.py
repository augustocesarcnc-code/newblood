"""Validate the NE/NW repair evidence without claiming full art approval."""
from pathlib import Path
from PIL import Image
import hashlib,json
ROOT=Path(__file__).resolve().parents[2];OUT=ROOT/'docs/reviews/hunter-motion';audit=json.loads((OUT/'audit.json').read_text());clip=audit['clips']['walk'];review=json.loads((OUT/'orientation-review-v4.json').read_text());technical=json.loads((OUT/'walk-test.json').read_text());playback=json.loads((OUT/'browser-playback.json').read_text());old=json.loads((OUT/'rejected-v3/audit.json').read_text())['clips']['walk'];gif=OUT/'walk-v4-8-directions.gif';sha=lambda p:hashlib.sha256(p.read_bytes()).hexdigest();digest=sha(gif);issues=[]
if clip['version']!=4:issues.append('Wrong active walk version')
if any(digest!=v for v in [review['gifSHA256'],technical['sha256'],playback['gifSHA256']]):issues.append('Evidence belongs to a different GIF')
if technical['technicalResult']!='PASS':issues.append('GIF technical tests failed')
if playback['result']!='PASS_ACTUAL_GIF_PLAYBACK' or playback['uniquePlaybackCaptures']<4:issues.append('Browser playback not verified')
im=Image.open(gif);frames=[]
for f in range(im.n_frames):im.seek(f);frames.append(im.convert('RGB'))
if len(frames)!=8:issues.append('Wrong number of decoded frames')
for direction,index in [('NE',1),('NW',7)]:
 r=review['directions'][direction];source=ROOT/clip['assets'][direction].lstrip('/')
 if sha(source)!=clip['sources'][direction]['sha256'] or sha(source)!=r['sourceSHA256']:issues.append(direction+': source checksum mismatch')
 if clip['sources'][direction]['relativeHeightSpread']>.05:issues.append(direction+': source size instability')
 if len(r['frames'])!=8 or {v['frame'] for v in r['frames']}!=set(range(1,9)):issues.append(direction+': incomplete frame review')
 if any(not v['backYokeRemainsVisible'] or not v['backThreeQuarterFacingMaintained'] or v['profileSwitchObserved'] for v in r['frames']):issues.append(direction+': visual orientation review failed')
 if not(OUT/r['evidence']).exists():issues.append(direction+': missing visual evidence')
 hashes=[hashlib.sha256(frame.crop((index*192,40,(index+1)*192,282)).tobytes()).hexdigest() for frame in frames]
 if len(set(hashes))!=8:issues.append(direction+': repeated decoded sprite frames')
preserved=[d for d in ['N','E','SE','S','SW','W'] if clip['sources'][d]['sha256']==old['sources'][d]['sha256']]
if len(preserved)!=6:issues.append('Unrelated direction source changed')
report={'gif':gif.name,'gifSHA256':digest,'scope':'NE/NW orientation repair only','technicalResult':technical['technicalResult'],'visualMethod':review['method'],'reviewedDirectionFrames':16,'unchangedOtherDirections':preserved,'actualBrowserPlayback':playback['result'],'result':'PASS_TARGETED_ORIENTATION_REPAIR' if not issues else 'FAIL','issues':issues,'fullVisualApproval':'PENDING','gameplayIntegration':False};(OUT/'orientation-test-v4.json').write_text(json.dumps(report,indent=2)+'\n');print(json.dumps(report,indent=2));raise SystemExit(bool(issues))
