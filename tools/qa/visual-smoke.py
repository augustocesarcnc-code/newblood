from pathlib import Path
import os,subprocess,tempfile,time,signal,urllib.request,math
from playwright.sync_api import sync_playwright
ROOT=str(Path(__file__).resolve().parents[2]);OUT=Path(ROOT)/'docs/previews';OUT.mkdir(exist_ok=True)
# Vite can remain on its art port; use a separate standalone HTTP server for real game validation.
with tempfile.TemporaryDirectory(prefix='eclipse-art-browser-') as data:
 log=open('/tmp/eclipse-visual-full-server.log','w');base='http://localhost:3035';proc=subprocess.Popen(['node','apps/server/src/main.ts'],cwd=ROOT,env=dict(os.environ,PORT='3035',PUBLIC_BASE_URL=base,ECLIPSE_DEV='1',BLOODMOON_DATA_DIR=data),stdout=log,stderr=log,start_new_session=True)
 try:
  for n in range(150):
   try:
    if urllib.request.urlopen(base+'/api/health').status==200:break
   except Exception:time.sleep(.1)
  with sync_playwright() as p:
   browser=p.chromium.launch(**({'executable_path':'/usr/bin/chromium'} if Path('/usr/bin/chromium').exists() else {}),args=['--no-sandbox']);page=browser.new_page(viewport={'width':1440,'height':900});errors=[];missing=[];page.on('pageerror',lambda e:errors.append(str(e)));page.on('response',lambda r:missing.append(r.url) if r.status>=400 and '/assets/' in r.url else None)
   page.goto(base);page.screenshot(path=str(OUT/'eclipse-login.png'));page.locator('#loginEmail').fill('admin');page.locator('#loginPassword').fill('admin123');page.locator('#loginForm [type=submit]').click();page.locator('.character-choice').wait_for();page.wait_for_timeout(600);page.screenshot(path=str(OUT/'eclipse-selection.png'));page.locator('.character-choice button').first.click();page.wait_for_function("document.querySelector('#connection').textContent==='MUNDO CONECTADO'")
   def post(path,body):
    time.sleep(.12);r=page.request.post(base+path,data=body);assert r.status==200,(path,r.status,r.text());return r.json()
   def action(body):return post('/api/action',body)
   def state():return page.request.get(base+'/api/state').json()
   action({'type':'admin','text':'/setlevel 80'});before=state()['self'];page.keyboard.down('s');page.wait_for_timeout(450);page.keyboard.up('s');after=state()['self'];assert after['y']>before['y'];page.keyboard.press('Space');page.wait_for_timeout(250);assert state()['self']['jumpUntil']>0;page.wait_for_timeout(600);page.screenshot(path=str(OUT/'eclipse-village.png'));page.keyboard.press('i');assert page.locator('.inventory-cell').count()==40;page.screenshot(path=str(OUT/'eclipse-equipment.png'));page.keyboard.press('Escape')
   for name,kind in [('Nocturna','vampiro'),('Fenris','lobisomem')]:
    post('/api/auth/character-create',{'name':name,'kind':kind});page.reload();page.locator('.character-choice').filter(has_text=name).locator('button').click();page.wait_for_function("document.querySelector('#connection').textContent==='MUNDO CONECTADO'");action({'type':'admin','text':'/setlevel 80'});page.wait_for_timeout(500);page.screenshot(path=str(OUT/('eclipse-'+kind+'-human.png')));page.keyboard.press('r');page.wait_for_timeout(500);assert state()['self']['transformed'];assert state()['self']['transformAt']>0;page.screenshot(path=str(OUT/('eclipse-'+kind+'-form.png')));action({'type':'admin','text':'/teleport floresta 3 15'});page.keyboard.press('Space');page.wait_for_timeout(300);page.screenshot(path=str(OUT/('eclipse-'+kind+'-jump.png')));page.wait_for_timeout(700);action({'type':'transform'})
   # Screenshots of all six live regions. This is the same authoritative map, not a static scene.
   for region in ['cinzaveu','floresta','cripta','caverna','ruinas','castelo']:
    placed=False
    for x in [24,23,25,26,22]:
     time.sleep(.12);r=page.request.post(base+'/api/action',data={'type':'admin','text':f'/teleport {region} {x} 15'})
     if r.status==200:placed=True;break
    assert placed,region
    page.wait_for_timeout(900);page.screenshot(path=str(OUT/('eclipse-map-'+region+'.png')))
   # Real basic attack -> death -> physical loot -> pickup.
   action({'type':'admin','text':'/teleport floresta 3 15'});action({'type':'admin','text':'/giveitem espada 1 mitico'});sword=next(i for i in state()['self']['inventory'] if i['base']=='espada');action({'type':'equip','id':sword['id']});action({'type':'admin','text':'/spawn rat'});rat=next(m for m in state()['monsters'] if m['id'].startswith('dev-') and m['hp']>0);action({'type':'target','id':rat['id']})
   for n in range(50):
    view=state()
    if not any(m['id']==rat['id'] and m['hp']>0 for m in view['monsters']):break
    time.sleep(.1)
   loot=next(l for l in view['groundLoot'] if l['x']==rat['x'] and l['y']==rat['y']);page.screenshot(path=str(OUT/'eclipse-loot.png'));action({'type':'pickup','id':loot['id']})
   # Equip a ranged weapon for the boss, witness special and then defeat it.
   action({'type':'admin','text':'/setlevel 400'});action({'type':'admin','text':'/giveitem arco 1 mitico'});bow=next(i for i in state()['self']['inventory'] if i['base']=='arco');
   # Wolf cannot equip a hunter bow; an epic sword and close combat keep class rules intact.
   action({'type':'admin','text':'/teleport castelo 3 15'});boss=next(m for m in state()['monsters'] if m['species']=='executioner');
   # Find a valid neighbouring destination via server validation.
   placed=False
   for dx,dy in [(1,0),(-1,0),(0,1),(0,-1),(1,1),(-1,-1)]:
    time.sleep(.12);r=page.request.post(base+'/api/action',data={'type':'admin','text':f"/teleport castelo {boss['x']+dx} {boss['y']+dy}"})
    if r.status==200:placed=True;break
   assert placed;visit=int(time.time()*1000);witnessed=False
   for n in range(70):
    live=next(m for m in state()['monsters'] if m['id']==boss['id'])
    if live.get('charging'):
     witnessed=True;page.wait_for_timeout(150);page.screenshot(path=str(OUT/'eclipse-boss-special.png'))
    if live.get('specialAt',0)>visit:break
    time.sleep(.15)
   assert witnessed and live.get('specialAt',0)>visit,'boss special was not witnessed';assert page.locator('#bossPanel').is_visible();page.wait_for_timeout(250);page.screenshot(path=str(OUT/'eclipse-boss-impact.png'));live=next(m for m in state()['monsters'] if m['id']==boss['id']);player=state()['self'];size=max(48,math.ceil(1440/28),math.ceil(900/24));cx=max(0,min(40-1440/size,player['x']-1440/size/2));cy=max(0,min(30-900/size,player['y']-900/size/2));px=(live['x']-cx+.5)*size;py=(live['y']-cy+.5)*size-55*size/38;page.locator('#world').click(position={'x':px,'y':py});page.wait_for_timeout(120);assert state()['self']['target']==boss['id'],'click on boss body must select it'
   defeated=False
   for n in range(100):
    view=state()
    if not any(m['id']==boss['id'] and m['hp']>0 for m in view['monsters']):defeated=True;break
    time.sleep(.15)
   assert defeated,'boss did not die';assert any(l['item']['rarity']=='lendario' for l in view['groundLoot']);page.screenshot(path=str(OUT/'eclipse-boss-loot.png'))
   assert not errors,errors;assert not missing,missing
   print('Visual gameplay passed: login, animated selection, 5 player forms, movement/jump, 6 regions, equipment, actual kills, pickup, boss special/HP bar/defeat/legendary loot; no JS errors or missing assets.');browser.close()
 finally:proc.terminate();proc.wait(timeout=20);log.close()
