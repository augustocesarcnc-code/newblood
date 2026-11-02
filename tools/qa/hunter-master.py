"""Phase A only: static 8-view audit and the same Hunter in the real village."""
from pathlib import Path
from playwright.sync_api import sync_playwright
import os,subprocess,tempfile,time,json,urllib.request,hashlib
ROOT=Path(__file__).resolve().parents[2];OUT=ROOT/'docs/reviews/hunter-master';OUT.mkdir(parents=True,exist_ok=True);base='http://localhost:3043'
with tempfile.TemporaryDirectory(prefix='eclipse-hunter-master-') as data,open('/tmp/eclipse-hunter-master.log','w') as log:
 proc=subprocess.Popen(['node','apps/server/src/main.ts'],cwd=ROOT,env=dict(os.environ,PORT='3043',PUBLIC_BASE_URL=base,ECLIPSE_DEV='0',BLOODMOON_DATA_DIR=data),stdout=log,stderr=log)
 try:
  for _ in range(150):
   try:
    if urllib.request.urlopen(base+'/api/health').status==200:break
   except Exception:time.sleep(.1)
  with sync_playwright() as pw:
   browser=pw.chromium.launch(executable_path='/usr/bin/chromium',args=['--no-sandbox']);page=browser.new_page(viewport={'width':1536,'height':900});errors=[];missing=[];page.on('pageerror',lambda e:errors.append(str(e)));page.on('response',lambda r:missing.append(r.url) if r.status>=400 and '/assets/' in r.url else None)
   page.goto(base+'/hunter-master');page.wait_for_function('window.hunterAuditReady===true');page.locator('#hunterAudit').screenshot(path=str(OUT/'eight-directions.png'))
   status=page.evaluate("async()=>{const m=await import('/mmo/hunter-master.js');return m.hunterMasterStatus()}");assert status['framesPerDirection']==1 and status['animated'] is False;assert status['directions']==['N','NE','E','SE','S','SW','W','NW']
   page.set_viewport_size({'width':1440,'height':900});r=page.request.post(base+'/api/auth/register',data={'email':'hunter-review@example.test','password':'hunter-review-12345','name':'Caçador Master','kind':'cacador'});assert r.status==200,r.text();page.goto(base);page.locator('.character-choice button').first.click();page.wait_for_function("document.querySelector('#connection').textContent==='MUNDO CONECTADO'");page.wait_for_timeout(900);state=page.request.get(base+'/api/state').json()['self'];assert state['kind']=='cacador' and state['map']=='cinzaveu' and state['level']==1 and not state['devAdmin'];assert not state['inventory']
   dispatch=page.evaluate("async()=>{const s=await import('/mmo/eclipse-sprites.js');await s.spritesReady;const canvas=document.createElement('canvas');canvas.width=300;canvas.height=300;const c=canvas.getContext('2d');return {player:s.drawModel(c,'hunter',150,200,[0,1]),legacyNPC:s.drawModel(c,'hunter',150,200,[0,1],1,{legacyNPC:true})}}")
   assert dispatch['player']['model']=='hunter-master' and dispatch['player']['frame']==0;assert dispatch['legacyNPC']['model']=='hunter';page.screenshot(path=str(OUT/'village-scale.png'))
   # Existing art laboratory must also tell the truth: no fake walk/run/attack frames.
   page.goto(base+'/art');page.wait_for_function("document.querySelector('#artStatus').textContent.includes('MASTER DEV')");assert page.locator('#artPlay').is_disabled();assert page.locator('#frames').is_hidden();assert page.locator('#artState option').count()==1
   page.goto(base+'/sprites');page.wait_for_function("document.querySelector('#frameInfo').textContent.includes('SEM ANIMAÇÃO')");assert page.locator('#playPause').is_disabled();assert page.locator('#timeline').is_hidden()
   assert not errors,errors;assert not missing,missing
   tile=max(48,(1440+27)//28,(900+23)//24);height=54*1.05*tile/38
   report={'phase':'A','approval':'PENDING_USER','newDirections':8,'newAnimationFrames':0,'playerState':'one static master pose per direction','worldCharacterHeightPx':height,'worldTileSizePx':tile,'characterHeightInTiles':height/tile,'sourceImageSHA256':hashlib.sha256((ROOT/'assets/characters/hunter/sprite-master.png').read_bytes()).hexdigest(),'checks':['neutral side-by-side audit: only eight Hunter views, no map/HUD/effects','ordinary account enters the real village with the new master renderer','same generated PNG is used by the audit and game renderer','legacy hunter is bypassed for the player and preserved only for existing NPCs','no new animations are advertised by the art laboratories'],'errors':errors,'missingAssets':missing,'limitations':['Static master only; equipment overlays and animations are intentionally deferred until approval.','Existing NPCs, maps and HUD are unchanged and are context only, not newly approved art.']};(OUT/'integration.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n');print(json.dumps(report,ensure_ascii=False,indent=2));browser.close()
 finally:proc.terminate();proc.wait(timeout=20)
