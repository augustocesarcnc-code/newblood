"""Visual character gate: real game, five forms, equipment visible to another player."""
from pathlib import Path
import os,subprocess,tempfile,time,json,urllib.request
from playwright.sync_api import sync_playwright
ROOT=Path(__file__).resolve().parents[2];OUT=ROOT/'docs/previews/visual-direction';OUT.mkdir(parents=True,exist_ok=True)
base='http://localhost:3039';checks=[]
with tempfile.TemporaryDirectory(prefix='eclipse-character-') as data:
 with open('/tmp/eclipse-character-qa.log','w') as log:
  server=subprocess.Popen(['node','apps/server/src/main.ts'],cwd=ROOT,env=dict(os.environ,PORT='3039',PUBLIC_BASE_URL=base,ECLIPSE_DEV='1',BLOODMOON_DATA_DIR=data),stdout=log,stderr=log)
  try:
   for _ in range(150):
    try:
     if urllib.request.urlopen(base+'/api/health').status==200:break
    except Exception:time.sleep(.1)
   with sync_playwright() as pw:
    browser=pw.chromium.launch(executable_path='/usr/bin/chromium',args=['--no-sandbox']);context=browser.new_context(viewport={'width':1440,'height':900});page=context.new_page();errors=[];missing=[]
    def watch(p):
     p.on('pageerror',lambda e:errors.append(str(e)));p.on('response',lambda r:missing.append(r.url) if r.status>=400 and '/assets/' in r.url else None)
    watch(page)
    def post(p,path,body):
     time.sleep(.14);r=p.request.post(base+path,data=body);assert r.status==200,(path,body,r.status,r.text());return r.json()
    def action(body):return post(page,'/api/action',body)
    def admin(text):return action({'type':'admin','text':text})
    def state(p=page):return p.request.get(base+'/api/state').json()
    def shot(name):page.wait_for_timeout(650);page.screenshot(path=str(OUT/(name+'.png')))
    def close():
     if page.locator('#modal').is_visible():page.keyboard.press('Escape');page.wait_for_timeout(100)
    def enter(name=None):
     card=page.locator('.character-choice')
     if name:card=card.filter(has_text=name)
     card.locator('button').first.click();page.wait_for_function("document.querySelector('#connection').textContent==='MUNDO CONECTADO'");page.wait_for_timeout(500)
    page.goto(base);page.locator('#loginEmail').fill('admin');page.locator('#loginPassword').fill('admin123');page.locator('#loginForm [type=submit]').click();enter()
    # A separate ordinary account observes public appearance; no secret inventory data is exposed.
    peer_context=browser.new_context(viewport={'width':1440,'height':900});peer=peer_context.new_page();watch(peer)
    post(peer,'/api/auth/register',{'email':'observer@example.test','password':'observer-test-1234','name':'Observador','kind':'cacador'})
    peer.goto(base);peer.locator('.character-choice button').first.click();peer.wait_for_function("document.querySelector('#connection').textContent==='MUNDO CONECTADO'")
    admin('/teleport cinzaveu 7 15');before=state()['self']['gold'];action({'type':'npc-buy','product':'capa','quantity':1,'npc':'merchant'});assert state()['self']['gold']==before-55
    cape=next(i for i in state()['self']['inventory'] if i['base']=='capa');action({'type':'equip','id':cape['id']});page.wait_for_timeout(350)
    public=next(p for p in state(peer)['players'] if p['id']==state()['self']['id']);assert public['appearance']['cape']['base']=='capa';assert 'inventory' not in public
    action({'type':'equip','id':cape['id']});page.wait_for_timeout(250);public=next(p for p in state(peer)['players'] if p['id']==state()['self']['id']);assert public['appearance']['cape'] is None
    action({'type':'equip','id':cape['id']});checks.append('cape purchase/equip/unequip synchronizes to an ordinary second player without inventory IDs')
    action({'type':'inventory-sort'});assert sorted(i['slot'] for i in state()['self']['inventory'])==list(range(len(state()['self']['inventory'])));checks.append('server-side inventory sorting preserves occupied slots')
    admin('/teleport cinzaveu 12 16');action({'type':'move','dx':0,'dy':1});shot('01-hunter-front')
    action({'type':'move','dx':0,'dy':-1});shot('02-hunter-back');checks.append('hunter front and actual back use authoritative facing')
    admin('/teleport cinzaveu 12 16');page.keyboard.down('Shift');page.keyboard.down('d');page.wait_for_timeout(300);page.screenshot(path=str(OUT/'03-hunter-run.png'));page.keyboard.up('d');page.keyboard.up('Shift');assert state()['self']['running'];checks.append('hunter run uses the actual running state')
    page.keyboard.press('i');page.locator('.inventory-cell').first.wait_for();page.get_by_role('button',name='ORGANIZAR',exact=True).wait_for();shot('04-hunter-equipment');close()
    # Both melee attacks are actual server actions, not manually drawn laboratory frames.
    sword=next(i for i in state()['self']['inventory'] if i['base']=='espada');action({'type':'equip','id':sword['id']});admin('/setlevel 1');admin('/teleport floresta 12 15');admin('/spawn skeleton');enemy=next(m for m in state()['monsters'] if m['id'].startswith('dev-') and m['hp']>0);action({'type':'target','id':enemy['id']});seen=set()
    for _ in range(40):
     view=state();seen.add(view['self'].get('actionState'))
     if 'attack2' in seen:page.screenshot(path=str(OUT/'05-hunter-attack2.png'));break
     time.sleep(.08)
    assert 'attack2' in seen,seen;checks.append('actual melee server combat broadcasts attack2 after attack1')
    action({'type':'target','id':None})
    for name,kind,filename in [('Nocturna','vampiro','vampire'),('Fenris','lobisomem','wolf')]:
     post(page,'/api/auth/character-create',{'name':name,'kind':kind});page.reload();enter(name);admin('/setlevel 10');admin('/teleport cinzaveu 12 16');action({'type':'move','dx':0,'dy':1});shot(filename+'-human');action({'type':'transform'});page.wait_for_timeout(180);page.screenshot(path=str(OUT/(filename+'-transforming.png')));shot(filename+'-form');assert state()['self']['transformed'];checks.append(kind+': actual human form, transition and transformed form at level 10')
     await_model={'vampiro':'vampire-form','lobisomem':'werewolf'}[kind]
     diagnostics=page.evaluate("async()=>{const s=await import('/mmo/eclipse-sprites.js');return s.spriteDiagnostics()}");assert not diagnostics['missing'],diagnostics
     action({'type':'transform'});assert not state()['self']['transformed']
    assert not errors,errors;assert not missing,missing;checks.append('no JavaScript errors, missing asset requests or sprite load failures')
    (OUT/'validation.json').write_text(json.dumps({'checks':checks,'errors':errors,'missingAssets':missing,'fixture':'isolated DEV account, actual gameplay actions; second ordinary observer'},ensure_ascii=False,indent=2));print(json.dumps(checks,ensure_ascii=False,indent=2));browser.close()
  finally:server.terminate();server.wait(timeout=20)
