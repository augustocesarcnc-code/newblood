"""Focused ordinary-player death/respawn check. DEV only arranges the encounter."""
from pathlib import Path
from playwright.sync_api import sync_playwright
import os,json,subprocess,tempfile,time,urllib.request
ROOT=Path(__file__).resolve().parents[2];OUT=ROOT/'docs/mvp';base='http://localhost:3063'
with tempfile.TemporaryDirectory(prefix='mvp-death-') as data,open('/tmp/mvp-death-server.log','w') as log:
 proc=subprocess.Popen(['node','apps/server/src/main.ts'],cwd=ROOT,env=dict(os.environ,PORT='3063',PUBLIC_BASE_URL=base,ECLIPSE_DEV='1',BLOODMOON_DATA_DIR=data),stdout=log,stderr=log)
 try:
  for _ in range(150):
   try:
    if urllib.request.urlopen(base+'/api/health').status==200:break
   except Exception:time.sleep(.1)
  with sync_playwright() as pw:
   browser=pw.chromium.launch(executable_path='/usr/bin/chromium',args=['--no-sandbox']);admin=browser.new_page();admin.goto(base);admin.locator('#loginEmail').fill('admin');admin.locator('#loginPassword').fill('admin123');admin.locator('#loginForm [type=submit]').click();admin.locator('.character-choice button').first.click();admin.wait_for_function("document.querySelector('#connection').textContent==='MUNDO CONECTADO'")
   context=browser.new_context(viewport={'width':1440,'height':900});r=context.request.post(base+'/api/auth/register',data={'email':'death@mvp.test','password':'mvp-fixture-12345','name':'MvpVictim','kind':'vampiro'});assert r.status==200;r=context.request.get(base+'/api/state');page=context.new_page();page.goto(base);page.locator('.character-choice button').first.click();page.wait_for_function("document.querySelector('#connection').textContent==='MUNDO CONECTADO'");errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
   def command(text):
    time.sleep(.16);r=admin.request.post(base+'/api/action',data={'type':'admin','text':text});assert r.status==200,r.text()
   from collections import deque
   def walk_to(target):
    world=context.request.get(base+'/api/state').json();p=world['self'];grid=page.evaluate("async map=>{const w=await import('/mmo/world.js');return Array.from({length:30},(_,y)=>Array.from({length:40},(_,x)=>w.walkable(x,y,map)));}",p['map']);occupied={(v['x'],v['y']) for v in world['npcs']+world['monsters']+world['players'] if v.get('id')!=p['id']};start=(p['x'],p['y']);queue=deque([start]);previous={start:None}
    while queue and target not in previous:
     x,y=queue.popleft()
     for dx,dy in [(1,0),(-1,0),(0,1),(0,-1)]:
      n=(x+dx,y+dy)
      if 0<=n[0]<40 and 0<=n[1]<30 and grid[n[1]][n[0]] and n not in occupied and n not in previous:previous[n]=(x,y);queue.append(n)
    assert target in previous;route=[];n=target
    while previous[n] is not None:route.append(n);n=previous[n]
    for n in reversed(route):
     time.sleep(.33);p=context.request.get(base+'/api/state').json()['self'];r=context.request.post(base+'/api/action',data={'type':'move','dx':n[0]-p['x'],'dy':n[1]-p['y']});assert r.status==200,r.text()
   walk_to((16,16));assert context.request.get(base+'/api/state').json()['self']['map']=='floresta';walk_to((5,15));world=context.request.get(base+'/api/state').json();taken={(v['x'],v['y']) for v in world['monsters']+world['players']};spot=next(p for p in [(6,15),(6,16),(5,16),(4,16)] if p not in taken);command(f'/teleport floresta {spot[0]} {spot[1]}');command('/spawn necromancer');command('/teleport cinzaveu 9 16');hp=[];initial=context.request.get(base+'/api/state').json()['self'];assert not initial['devAdmin'] and initial['level']==1
   for _ in range(250):
    p=context.request.get(base+'/api/state').json()['self'];hp.append(p['hp'])
    if p.get('lastDeathAt',0)>0 and p['map']=='cinzaveu':break
    page.wait_for_timeout(120)
   else:raise AssertionError('Ordinary player did not die/respawn')
   assert min(hp)<initial['maxHP'];assert p['hp']==p['maxHP'];page.wait_for_timeout(450);page.screenshot(path=str(OUT/'screenshots/11-death-respawn.png'));assert not errors
   command('/setlevel MvpVictim 10');command('/giveitem MvpVictim espada');items=context.request.get(base+'/api/state').json()['self']['inventory'];weapon=next(i for i in items if i['base']=='espada');r=context.request.post(base+'/api/action',data={'type':'equip','id':weapon['id']});assert r.status==200,r.text();time.sleep(.2);r=context.request.post(base+'/api/action',data={'type':'transform'});assert r.status==200,r.text();page.wait_for_timeout(1000)
   form=context.request.get(base+'/api/state').json()['self'];assert form['transformed']
   proof=page.evaluate("""async appearance=>{const s=await import('/mmo/eclipse-sprites.js');await s.spritesReady;const canvas=document.createElement('canvas');canvas.width=300;canvas.height=300;const c=canvas.getContext('2d');const d=s.drawSprite(c,'vampiro',150,240,[0,1],0,2,true,{state:'idle',time:0,appearance});const geared=canvas.toDataURL();c.clearRect(0,0,300,300);s.drawSprite(c,'vampiro',150,240,[0,1],0,2,true,{state:'idle',time:0,appearance:{}});return {model:d.model,rig:d.rig,weaponVisible:geared!==canvas.toDataURL()};}""",form['appearance']);assert proof['model']=='human-shared' and proof['weaponVisible'];page.screenshot(path=str(OUT/'screenshots/12-vampire-buff.png'))
   report={'vampireBuff':proof,'result':'PASS' ,'accountRole':'ordinary player','class':'vampiro','level':p['level'],'damageObserved':min(hp)<initial['maxHP'],'serverDeathRecorded':p['lastDeathAt']>0,'respawnMap':p['map'],'respawnHP':p['hp'],'maxHP':p['maxHP'],'errors':errors,'fixture':'Ordinary player walks through the Village/Forest portal; admin positions itself and spawns an existing boss; damage, death, penalty and respawn are normal authoritative combat. A later vampire-buff check uses DEV level-10 and sword fixtures, then ordinary equip/transform actions.'};(OUT/'death-respawn.json').write_text(json.dumps(report,indent=2)+'\n');print(json.dumps(report,indent=2));browser.close()
 finally:proc.terminate();proc.wait(timeout=20)
