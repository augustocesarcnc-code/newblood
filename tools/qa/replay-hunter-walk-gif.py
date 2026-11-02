"""Replay the existing GIF over local HTTP; never regenerate or alter image files."""
from pathlib import Path
from playwright.sync_api import sync_playwright
import json,hashlib,http.server,threading,functools
OUT=Path(__file__).resolve().parents[2]/'docs/reviews/hunter-motion';version=json.loads((OUT/'audit.json').read_text())['clips']['walk']['version'];path=OUT/f'walk-v{version}-8-directions.gif';before=hashlib.sha256(path.read_bytes()).hexdigest()
class QuietHandler(http.server.SimpleHTTPRequestHandler):
 def log_message(self,*args):pass
server=http.server.ThreadingHTTPServer(('127.0.0.1',3046),functools.partial(QuietHandler,directory=str(OUT)));threading.Thread(target=server.serve_forever,daemon=True).start()
try:
 with sync_playwright() as pw:
  browser=pw.chromium.launch(executable_path='/usr/bin/chromium',args=['--no-sandbox']);page=browser.new_page(viewport={'width':1600,'height':900});errors=[];page.on('pageerror',lambda e:errors.append(str(e)));response=page.goto('http://127.0.0.1:3046/'+path.name);assert response.status==200;page.locator('img').wait_for();page.wait_for_function("document.querySelector('img').complete");samples=[]
  for i in range(10):
   samples.append(hashlib.sha256(page.locator('img').screenshot()).hexdigest());page.wait_for_timeout(140)
  browser.close()
 after=hashlib.sha256(path.read_bytes()).hexdigest();assert before==after;assert len(set(samples))>=4;assert not errors
 r={'gifSHA256':before,'regenerated':False,'sourceUnchanged':before==after,'captures':len(samples),'uniqueCaptures':len(set(samples)),'result':'PASS_PLAYBACK_ONLY','pageErrors':errors};(OUT/'retest-playback.json').write_text(json.dumps(r,indent=2)+'\n');print(json.dumps(r,indent=2))
finally:server.shutdown();server.server_close()
