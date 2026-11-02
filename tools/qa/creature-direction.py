"""A single new creature must run in the game before the next is exported."""
from pathlib import Path
import os,subprocess,tempfile,time,json,urllib.request,argparse
from playwright.sync_api import sync_playwright
parser=argparse.ArgumentParser();parser.add_argument('--species',required=True);args=parser.parse_args()
ROOT=Path(__file__).resolve().parents[2];OUT=ROOT/'docs/previews/visual-direction';OUT.mkdir(parents=True,exist_ok=True);base='http://localhost:3040'
with tempfile.TemporaryDirectory(prefix='eclipse-creature-') as data:
 with open('/tmp/eclipse-creature-qa.log','w') as log:
  server=subprocess.Popen(['node','apps/server/src/main.ts'],cwd=ROOT,env=dict(os.environ,PORT='3040',PUBLIC_BASE_URL=base,ECLIPSE_DEV='1',BLOODMOON_DATA_DIR=data),stdout=log,stderr=log)
  try:
   for _ in range(150):
    try:
     if urllib.request.urlopen(base+'/api/health').status==200:break
    except Exception:time.sleep(.1)
   with sync_playwright() as pw:
    browser=pw.chromium.launch(executable_path='/usr/bin/chromium',args=['--no-sandbox']);page=browser.new_page(viewport={'width':1440,'height':900});errors=[];missing=[];page.on('pageerror',lambda e:errors.append(str(e)));page.on('response',lambda r:missing.append(r.url) if r.status>=400 and '/assets/' in r.url else None)
    page.goto(base);page.locator('#loginEmail').fill('admin');page.locator('#loginPassword').fill('admin123');page.locator('#loginForm [type=submit]').click();page.locator('.character-choice button').first.click();page.wait_for_function("document.querySelector('#connection').textContent==='MUNDO CONECTADO'")
    def state():return page.request.get(base+'/api/state').json()
    def action(body):
     time.sleep(.16);r=page.request.post(base+'/api/action',data=body);assert r.status==200,(body,r.status,r.text());return r.json()
    action({'type':'admin','text':'/setlevel 15'});armor=next(i for i in state()['self']['inventory'] if i['base']=='couro');action({'type':'equip','id':armor['id']});action({'type':'admin','text':'/teleport floresta 12 15'});action({'type':'admin','text':'/spawn '+args.species});monster=next(m for m in state()['monsters'] if m['id'].startswith('dev-') and m['hp']>0);hp=state()['self']['hp'];page.wait_for_timeout(1600);assert state()['self']['hp']<hp,'monster must deal real damage';page.screenshot(path=str(OUT/(args.species+'-encounter.png')))
    action({'type':'target','id':monster['id']});page.wait_for_timeout(200);page.screenshot(path=str(OUT/(args.species+'-combat.png')))
    before_kills=state()['self']['kills'];before_death=state()['self']['lastDeathAt'];defeated=False
    for _ in range(150):
     s=state()
     assert s['self']['lastDeathAt']==before_death,'hunter died before defeating creature'
     if s['self']['kills']>before_kills and any(m['id']==monster['id'] and m['hp']<=0 for m in s['monsters']):defeated=True;break
     time.sleep(.1)
    assert defeated,'creature must be killable through authoritative combat'
    corpse=next((m for m in s['monsters'] if m['id']==monster['id']),monster);loot=next(l for l in s['groundLoot'] if l['x']==corpse['x'] and l['y']==corpse['y'])
    # Witch blink may move her death position; approach with ordinary commands.
    for _ in range(20):
     p=state()['self'];dx=loot['x']-p['x'];dy=loot['y']-p['y']
     if max(abs(dx),abs(dy))<=1:break
     action({'type':'move','dx':(dx>0)-(dx<0),'dy':(dy>0)-(dy<0)});time.sleep(.4)
    action({'type':'pickup','id':loot['id']});assert not any(l['id']==loot['id'] for l in state()['groundLoot']);assert not errors,errors;assert not missing,missing
    (OUT/(args.species+'-validation.json')).write_text(json.dumps({'species':args.species,'checks':['actual spawn and rendering','monster deals server-validated damage','player combat defeats monster','physical loot is picked up once'],'errors':errors,'missingAssets':missing},ensure_ascii=False,indent=2));print(args.species+': integrated, fought, defeated, looted; no missing assets or JS errors');browser.close()
  finally:server.terminate();server.wait(timeout=20)
