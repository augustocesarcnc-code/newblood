"""Render measured source frames in Chromium and encode real looping GIFs with FFmpeg."""
from pathlib import Path
from playwright.sync_api import sync_playwright
import subprocess,tempfile,json,http.server,threading,functools,hashlib,shutil
from PIL import Image
ROOT=Path(__file__).resolve().parents[2];OUT=ROOT/'docs/reviews/hunter-motion';report=json.loads((OUT/'audit.json').read_text())
handler=functools.partial(http.server.SimpleHTTPRequestHandler,directory=str(ROOT));server=http.server.ThreadingHTTPServer(('127.0.0.1',3045),handler);threading.Thread(target=server.serve_forever,daemon=True).start()
try:
 with tempfile.TemporaryDirectory(prefix='hunter-gif-') as temp,sync_playwright() as pw:
  browser=pw.chromium.launch(executable_path='/usr/bin/chromium',args=['--no-sandbox']);page=browser.new_page(viewport={'width':1600,'height':900});errors=[];page.on('pageerror',lambda e:errors.append(str(e)));page.goto('http://127.0.0.1:3045/hunter-motion.html');page.wait_for_function('window.hunterMotionReady===true');page.evaluate("window.auditExport=true")
  geometry=[];gif_checks=[]
  for state,clip in report['clips'].items():
   for frame in range(clip['frameCount']):
    page.evaluate('([s,f])=>{window.renderHunterMotion(s,f);}',[state,frame]);measured=page.evaluate('window.hunterMotionGeometry');geometry.extend(dict(v,state=state) for v in measured)
    if state=='walk':
     assert len(measured)==8
     assert all(v['baseline']==282 and v['aspectPreserved'] for v in measured)
    page.locator('#audit').screenshot(path=f'{temp}/{state}-{frame:02d}.png',animations='disabled')
   subprocess.run(['ffmpeg','-hide_banner','-loglevel','error','-y','-framerate',str(clip['fps']),'-i',f'{temp}/{state}-%02d.png','-filter_complex','split[a][b];[a]palettegen=stats_mode=full[p];[b][p]paletteuse=dither=none','-loop','0',str(OUT/f'{state}-8-directions.gif')],check=True)
   im=Image.open(OUT/f'{state}-8-directions.gif');hashes=[];durations=[];pixel_heights=[]
   for f in range(im.n_frames):
    im.seek(f);hashes.append(hashlib.sha256(im.convert('RGB').tobytes()).hexdigest());durations.append(im.info['duration'])
    if state=='walk':
     pixels=im.convert('RGB').load();row=[]
     for d in range(8):
      ys=[y for y in range(50,282) if any(max(abs(pixels[x,y][k]-[119,123,128][k]) for k in range(3))>65 for x in range(d*192+10,(d+1)*192-10))]
      assert ys;row.append(max(ys)-min(ys)+1)
     pixel_heights.append(row)
   assert len(set(hashes))==clip['frameCount'];assert im.info.get('loop')==0
   if state=='walk':
    flattened=[v for row in pixel_heights for v in row]
    spreads=[max(row[d] for row in pixel_heights)-min(row[d] for row in pixel_heights) for d in range(8)]
    assert max(spreads)<=12,('Unstable walk silhouette',spreads)
    (OUT/'walk-pixel-check.json').write_text(json.dumps({'method':'Decoded GIF dark silhouette threshold, excluding captions and ground guide','heightsPxByFrameAndDirection':pixel_heights,'spreadPx':max(flattened)-min(flattened),'spreadPxPerDirection':spreads,'scalePolicy':'Fixed scale within each direction; no per-frame resizing'},indent=2)+'\n')
   gif_checks.append({'file':f'{state}-8-directions.gif','frames':im.n_frames,'uniqueFrames':len(set(hashes)),'durationsMs':durations,'loop':0,'size':list(im.size)})
   print(state, 'GIF exported and verified')
  assert not errors,errors
  assert all(len({round(v['scale'],12) for v in geometry if v['state']=='walk' and v['direction']==d})==1 for d in report['directions'])
  (OUT/'render-check.json').write_text(json.dumps({'walkScalePolicy':'Fixed scale per authored direction sheet; no frame resizing','walkHeightSpread':max(v['height'] for v in geometry if v['state']=='walk')-min(v['height'] for v in geometry if v['state']=='walk'),'geometry':geometry,'pageErrors':errors},indent=2)+'\n')
  (OUT/'gif-check.json').write_text(json.dumps(gif_checks,indent=2)+'\n')
  page.goto('http://127.0.0.1:3045/docs/reviews/hunter-motion/walk-8-directions.gif');page.locator('img').wait_for();page.wait_for_function("document.querySelector('img').complete")
  playback=[]
  for i in range(8):
   playback.append(hashlib.sha256(page.locator('img').screenshot()).hexdigest());page.wait_for_timeout(140)
  assert len(set(playback))>=4,('GIF did not animate in Chromium',playback)
  (OUT/'browser-playback.json').write_text(json.dumps({'gifSHA256':hashlib.sha256((OUT/'walk-8-directions.gif').read_bytes()).hexdigest(),'captures':8,'uniquePlaybackCaptures':len(set(playback)),'captureIntervalMs':140,'result':'PASS_ACTUAL_GIF_PLAYBACK','pageErrors':errors},indent=2)+'\n')
  shutil.copyfile(OUT/'walk-8-directions.gif',OUT/f"walk-v{report['clips']['walk']['version']}-8-directions.gif")
  browser.close()
finally:server.shutdown();server.server_close()
