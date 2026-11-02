"""New village services must work in the same real client/server/SQLite build."""
from pathlib import Path
import os,subprocess,tempfile,time,json,urllib.request
from playwright.sync_api import sync_playwright
ROOT=Path(__file__).resolve().parents[2];OUT=ROOT/'docs/previews/visual-direction';OUT.mkdir(parents=True,exist_ok=True);base='http://localhost:3041';checks=[]
with tempfile.TemporaryDirectory(prefix='eclipse-services-') as data:
 with open('/tmp/eclipse-services-qa.log','w') as log:
  def start():
   process=subprocess.Popen(['node','apps/server/src/main.ts'],cwd=ROOT,env=dict(os.environ,PORT='3041',PUBLIC_BASE_URL=base,ECLIPSE_DEV='1',BLOODMOON_DATA_DIR=data),stdout=log,stderr=log)
   for _ in range(150):
    try:
     if urllib.request.urlopen(base+'/api/health').status==200:return process
    except Exception:time.sleep(.1)
   raise RuntimeError('server startup failed')
  server=start()
  try:
   with sync_playwright() as pw:
    browser=pw.chromium.launch(executable_path='/usr/bin/chromium',args=['--no-sandbox']);page=browser.new_page(viewport={'width':1440,'height':900});errors=[];missing=[];page.on('pageerror',lambda e:errors.append(str(e)));page.on('response',lambda r:missing.append(r.url) if r.status>=400 and '/assets/' in r.url else None)
    def state():return page.request.get(base+'/api/state').json()['self']
    def action(body):
     time.sleep(.16);r=page.request.post(base+'/api/action',data=body);assert r.status==200,(body,r.status,r.text());return r.json()
    def place(x,y):action({'type':'admin','text':f'/teleport cinzaveu {x} {y}'});page.wait_for_timeout(400)
    def close():
     if page.locator('#modal').is_visible():page.keyboard.press('Escape');page.wait_for_timeout(150)
    def enter():page.locator('.character-choice button').first.click();page.wait_for_function("document.querySelector('#connection').textContent==='MUNDO CONECTADO'")
    page.goto(base);page.locator('#loginEmail').fill('admin');page.locator('#loginPassword').fill('admin123');page.locator('#loginForm [type=submit]').click();enter();place(13,21);page.keyboard.press('e');page.get_by_role('button',name='DEPOSITAR OURO',exact=True).wait_for()
    gold=state()['gold'];page.get_by_role('button',name='DEPOSITAR OURO',exact=True).click();page.wait_for_timeout(400);assert state()['gold']==gold-25;assert state()['bank']['gold']==25
    sword=next(i for i in state()['inventory'] if i['base']=='espada');page.locator('.item-card').filter(has_text='Espada de ferro').get_by_role('button',name='DEPOSITAR ITEM',exact=True).click();page.wait_for_timeout(400);assert any(i['id']==sword['id'] for i in state()['bank']['items']);assert not any(i['id']==sword['id'] for i in state()['inventory']);checks.append('bank UI deposits real gold and an unequipped item')
    page.wait_for_timeout(400);page.screenshot(path=str(OUT/'village-bank.png'))
    # Save a dragged window position, close and restore the same panel.
    handle=page.locator('.modal-head');box=handle.bounding_box();page.mouse.move(box['x']+100,box['y']+40);page.mouse.down();page.mouse.move(box['x']+125,box['y']+60,steps=6);page.mouse.up();saved=page.evaluate("JSON.parse(localStorage.getItem('eclipse-window-positions')||'{}').bank");assert saved is not None;close();page.keyboard.press('e');page.wait_for_timeout(300);rect=page.locator('#modal').bounding_box();assert abs(rect['x']-saved['left'])<3;checks.append('dragged bank window restores its saved position');close()
    place(3,22);page.keyboard.press('e');page.locator('#modalTitle').filter(has_text='Elara').wait_for();gold=state()['gold'];page.locator('.item-card').filter(has_text='Ração de viagem').get_by_role('button',name='COMPRAR',exact=True).click();page.wait_for_timeout(350);assert state()['gold']==gold-8;assert any(i['base']=='racao' for i in state()['inventory']);checks.append('tavern food purchase uses normal inventory and gold');close()
    place(10,21);page.keyboard.press('e');page.locator('#modalTitle').filter(has_text='Mural').wait_for();page.get_by_role('button',name='VER CONTRATOS',exact=True).click();page.locator('.quest-card').first.wait_for();checks.append('notice board opens the actual quest log');close()
    place(13,15);page.locator('[data-panel=village]').click();page.locator('.map-card').filter(has_text='Hector').get_by_role('button',name='CONVERSAR',exact=True).click();page.get_by_role('button',name='ABRIR CLÃS',exact=True).click();page.locator('#modalTitle').filter(has_text='Clãs').wait_for();checks.append('guild hall opens the actual clan system');close()
    wallet=state()['gold'];r=page.request.post(base+'/api/action',data={'type':'bank-gold','direction':'withdraw','quantity':1});assert r.status==400;assert state()['gold']==wallet;checks.append('bank rejects remote withdrawals')
    server.terminate();server.wait(timeout=20);server=start();page.reload();enter();assert state()['bank']['gold']==25;assert any(i['id']==sword['id'] for i in state()['bank']['items']);checks.append('SQLite restart preserves bank currency, item identity and custody')
    place(13,21);page.keyboard.press('e');page.get_by_role('button',name='RETIRAR OURO',exact=True).wait_for();page.get_by_role('button',name='RETIRAR OURO',exact=True).click();page.wait_for_timeout(350);assert state()['bank']['gold']==0;page.locator('.item-card').filter(has_text='Espada de ferro').get_by_role('button',name='RETIRAR ITEM',exact=True).click();page.wait_for_timeout(350);assert any(i['id']==sword['id'] for i in state()['inventory']);assert not state()['bank']['items'];checks.append('bank UI withdrawal returns custody exactly once');close()
    page.set_viewport_size({'width':390,'height':844});page.keyboard.press('i');page.locator('.inventory-cell').first.wait_for();page.wait_for_timeout(450);assert page.evaluate('document.documentElement.scrollWidth')<=390;page.screenshot(path=str(OUT/'mobile-inventory.png'));checks.append('inventory remains usable at mobile viewport without document overflow')
    assert not errors,errors;assert not missing,missing;(OUT/'services-validation.json').write_text(json.dumps({'checks':checks,'errors':errors,'missingAssets':missing},ensure_ascii=False,indent=2));print(json.dumps(checks,ensure_ascii=False,indent=2));browser.close()
  finally:server.terminate();server.wait(timeout=20)
