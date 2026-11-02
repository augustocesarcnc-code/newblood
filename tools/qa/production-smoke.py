from pathlib import Path
from playwright.sync_api import sync_playwright
import os,subprocess,tempfile,time,urllib.request,json
root=Path(__file__).resolve().parents[2];out=root/'docs/previews/visual-direction';base='http://localhost:3042'
with tempfile.TemporaryDirectory(prefix='eclipse-production-') as data,open('/tmp/eclipse-production.log','w') as log:
 proc=subprocess.Popen(['node','apps/server/src/main.ts'],cwd=root,env=dict(os.environ,NODE_ENV='production',ECLIPSE_DEV='0',PORT='3042',PUBLIC_BASE_URL=base,BLOODMOON_DATA_DIR=data),stdout=log,stderr=log)
 try:
  for _ in range(150):
   try:
    if urllib.request.urlopen(base+'/api/health').status==200:break
   except Exception:time.sleep(.1)
  with sync_playwright() as pw:
   browser=pw.chromium.launch(executable_path='/usr/bin/chromium',args=['--no-sandbox']);page=browser.new_page(viewport={'width':1440,'height':900});errors=[];missing=[];page.on('pageerror',lambda e:errors.append(str(e)));page.on('response',lambda r:missing.append(r.url) if r.status>=400 and '/assets/' in r.url else None)
   page.goto(base);assert page.locator('script[src*="/assets/index-"]').count()==1
   response=page.request.post(base+'/api/auth/register',data={'email':'build-check@example.test','password':'build-check-12345','name':'Producao','kind':'cacador'});assert response.status==200,response.text();page.reload();page.locator('.character-choice button').first.click();page.wait_for_function("document.querySelector('#connection').textContent==='MUNDO CONECTADO'");page.wait_for_timeout(800);state=page.request.get(base+'/api/state').json()['self'];assert not state['devAdmin'];assert state['level']==1;assert not state['inventory'];page.keyboard.press('i');page.wait_for_timeout(500);assert page.locator('.inventory-cell').count()==40;painted=page.locator('.inventory-loadout canvas').evaluate('(canvas)=>Array.from(canvas.getContext("2d").getImageData(0,0,canvas.width,canvas.height).data).some((v,i)=>i%4===3&&v>0)');assert painted;page.screenshot(path=str(out/'production-new-hunter.png'));assert not errors,errors;assert not missing,missing
   (out/'production-validation.json').write_text(json.dumps({'checks':['hashed production bundle served','ordinary account registration and character selection','Socket.IO connection without DEV admin','new hunter begins without free equipment','40-slot inventory and asynchronously painted paper doll'],'errors':errors,'missingAssets':missing},indent=2));print('Production bundle: ordinary registration, selection, Socket.IO, inventory and paper doll passed.');browser.close()
 finally:proc.terminate();proc.wait(timeout=20)
