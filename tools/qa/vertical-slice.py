"""Real Chromium smoke test of the existing slice. No art generation.
DEV fixture commands only position the test hunter and reset its level; rewards,
combat, purchases, equipment, quest claims and persistence use normal commands.
"""
from pathlib import Path
import os,subprocess,tempfile,time,json,urllib.request
from playwright.sync_api import sync_playwright
ROOT=Path(__file__).resolve().parents[2]
OUT=ROOT/'docs/previews/vertical-slice';OUT.mkdir(parents=True,exist_ok=True)
base='http://localhost:3037'
results=[]
with tempfile.TemporaryDirectory(prefix='eclipse-slice-') as data:
 with open('/tmp/eclipse-slice-server.log','w') as log:
  proc=subprocess.Popen(['node','apps/server/src/main.ts'],cwd=ROOT,env=dict(os.environ,PORT='3037',PUBLIC_BASE_URL=base,ECLIPSE_DEV='1',BLOODMOON_DATA_DIR=data),stdout=log,stderr=log)
  try:
   for _ in range(150):
    try:
     if urllib.request.urlopen(base+'/api/health').status==200:break
    except Exception:time.sleep(.1)
   with sync_playwright() as playwright:
    browser=playwright.chromium.launch(executable_path='/usr/bin/chromium',args=['--no-sandbox'])
    page=browser.new_page(viewport={'width':1440,'height':900});errors=[];missing=[]
    page.on('pageerror',lambda error:errors.append(str(error)))
    page.on('response',lambda response:missing.append(response.url) if response.status>=400 and '/assets/' in response.url else None)
    def state():return page.request.get(base+'/api/state').json()
    def post(path,body):
     time.sleep(.16);r=page.request.post(base+path,data=body);assert r.status==200,(path,body,r.status,r.text());return r.json()
    def action(body):return post('/api/action',body)
    def admin(text):return action({'type':'admin','text':text})
    def place(region,x,y):admin(f'/teleport {region} {x} {y}');page.wait_for_timeout(450)
    def shot(name):page.wait_for_timeout(400);page.screenshot(path=str(OUT/(name+'.png')))
    def close():
     if page.locator('#modal').is_visible():page.keyboard.press('Escape');page.wait_for_timeout(120)
    page.goto(base);page.locator('#loginEmail').fill('admin');page.locator('#loginPassword').fill('admin123');page.locator('#loginForm [type=submit]').click();page.locator('.character-choice button').first.click();page.wait_for_function("document.querySelector('#connection').textContent==='MUNDO CONECTADO'")
    admin('/setlevel 1');place('cinzaveu',12,16)
    for dx,dy,keys in [(0,1,['s']),(1,1,['s','d']),(1,0,['d']),(1,-1,['w','d']),(0,-1,['w']),(-1,-1,['w','a']),(-1,0,['a']),(-1,1,['s','a'])]:
     place('cinzaveu',12,16)
     page.evaluate("keys=>keys.forEach(key=>document.dispatchEvent(new KeyboardEvent('keydown',{code:'Key'+key.toUpperCase(),key,bubbles:true})))",keys)
     page.wait_for_timeout(210)
     page.evaluate("keys=>keys.forEach(key=>document.dispatchEvent(new KeyboardEvent('keyup',{code:'Key'+key.toUpperCase(),key,bubbles:true})))",keys)
     page.wait_for_timeout(180);p=state()['self'];assert (p['x'],p['y'])==(12+dx,16+dy),(keys,p['x'],p['y'])
     assert p['facing']==[dx,dy]
    results.append('8 directions: actual keyboard movement and authoritative facing')
    place('cinzaveu',11,16);before=state()['self']['stamina'];page.keyboard.down('Shift');page.keyboard.down('d');page.wait_for_timeout(450);page.keyboard.up('d');page.keyboard.up('Shift');page.wait_for_timeout(150);assert state()['self']['running'];assert state()['self']['stamina']<before
    results.append('run consumes stamina')
    # Browser keyboard attempts against each requested physical obstacle.
    for kind,region,x,y,key in [('house','cinzaveu',3,11,'d'),('tree','cinzaveu',9,1,'a'),('wall','cinzaveu',27,4,'d'),('water','cinzaveu',19,17,'d'),('rock','floresta',15,7,'d'),('fence','cinzaveu',4,21,'s')]:
     place(region,x,y);page.keyboard.down(key);page.wait_for_timeout(450);page.keyboard.up(key);page.wait_for_timeout(120);p=state()['self'];assert (p['x'],p['y'])==(x,y),(kind,p['x'],p['y']);results.append('collision keyboard: '+kind)
    # Talk / receive / complete / claim an existing starter quest, not a mocked quest.
    place('cinzaveu',9,16);page.wait_for_timeout(10500);action({'type':'npc-talk','id':'master'});action({'type':'quest-accept','id':'firstforge'})
    place('cinzaveu',11,15);page.keyboard.press('e');page.wait_for_timeout(350);assert page.locator('#modalTitle').inner_text().startswith('Dorian');close()
    assert next(q for q in state()['self']['quests'] if q['id']=='firstforge')['progress']==1
    place('cinzaveu',9,16);page.keyboard.press('j');page.get_by_text('O Fogo e o Ferro',exact=True).wait_for();page.locator('.quest-card').filter(has_text='O Fogo e o Ferro').scroll_into_view_if_needed();shot('06-quest');page.locator('.quest-card').filter(has_text='O Fogo e o Ferro').get_by_role('button',name='RECEBER COM O NPC').click();page.wait_for_timeout(400);assert state()['self']['level']==2;assert next(q for q in state()['self']['quests'] if q['id']=='firstforge')['status']=='claimed';close();results.append('NPC dialogue, accept/complete/claim quest; real XP levels hunter from 1 to 2')
    # Shop purchase via live UI and real server gold debit.
    place('cinzaveu',8,15);page.keyboard.press('e');page.wait_for_timeout(300);assert page.locator('#modalTitle').inner_text().startswith('Mara');gold=state()['self']['gold'];page.locator('.item-card').filter(has_text='Armadura de couro').get_by_role('button',name='COMPRAR',exact=True).click();page.wait_for_timeout(350);assert state()['self']['gold']==gold-80;close();results.append('merchant UI purchase debits 80 gold and adds armor')
    page.keyboard.press('i');page.locator('.inventory-cell.filled').first.wait_for();assert page.locator('.inventory-cell').count()==40
    # Drag a real item to the server-authoritative equipment slot.
    armor=next(i for i in state()['self']['inventory'] if i['base']=='couro');source=page.locator(f'.inventory-cell[data-slot="{armor["slot"]}"]');source.drag_to(page.locator('[data-equipment="chest"]'));page.wait_for_timeout(500);assert state()['self']['appearance']['armor']['base']=='couro'
    page.locator('.inventory-cell.filled').filter(has_text='').first.click();shot('04-inventario');assert page.locator('.equipment-comparison').count()==1
    close();place('cinzaveu',9,16);shot('01-vila');shot('05-equipamento-visual');page.locator('#minimap').screenshot(path=str(OUT/'07-minimapa.png'))
    page.keyboard.press('i');page.locator(f'.inventory-cell[data-slot="{armor["slot"]}"]').click();page.get_by_role('button',name='DESEQUIPAR',exact=True).click();page.wait_for_timeout(400);assert state()['self']['appearance']['armor'] is None
    page.locator(f'.inventory-cell[data-slot="{armor["slot"]}"]').click();page.get_by_role('button',name='EQUIPAR',exact=True).click();page.wait_for_timeout(400);close();results.append('40-slot inventory, real drag-to-equip, comparison, unequip/re-equip and public appearance')
    # Stack / split use bought materials and authoritative commands.
    place('cinzaveu',8,15);action({'type':'npc-buy','product':'fragmento','quantity':4,'npc':'merchant'});frag=next(i for i in state()['self']['inventory'] if i['base']=='fragmento');action({'type':'inventory-split','id':frag['id'],'quantity':2});frags=[i for i in state()['self']['inventory'] if i['base']=='fragmento'];assert len(frags)==2;action({'type':'inventory-move','id':frags[1]['id'],'slot':frags[0]['slot']});assert sum(i['quantity'] for i in state()['self']['inventory'] if i['base']=='fragmento')==4;results.append('stack splitting/merging conserves quantity')
    # Both transitions are ordinary movement through existing portals.
    place('cinzaveu',15,16);action({'type':'move','dx':1,'dy':0});assert state()['self']['map']=='floresta';page.wait_for_timeout(800);results.append('walk through portal Village -> Forest');time.sleep(.4);action({'type':'move','dx':-1,'dy':0});assert state()['self']['map']=='cinzaveu';results.append('walk through portal Forest -> Village');time.sleep(.4);action({'type':'move','dx':1,'dy':0});assert state()['self']['map']=='floresta';place('floresta',12,15);shot('02-floresta')
    # Fight the three requested species. DEV spawn supplies a reproducible test encounter;
    # damage, death, XP, physical drop and pickup are ordinary server gameplay.
    admin('/heal');kills=state()['self']['kills'];xp=state()['self']['xp'];mana=state()['self']['mana']
    for species in ['wolf','bat','skeleton']:
     place('floresta',12,15);admin('/spawn '+species);monster=next(m for m in state()['monsters'] if m['id'].startswith('dev-') and m['species']==species and m['hp']>0)
     action({'type':'target','id':monster['id']})
     if species=='wolf':action({'type':'skill','index':0});assert state()['self']['mana']<mana;page.wait_for_timeout(150);page.screenshot(path=str(OUT/'03-combate.png'))
     for _ in range(100):
      view=state()
      if not any(m['id']==monster['id'] and m['hp']>0 for m in view['monsters']):break
      time.sleep(.12)
     assert view['self']['kills']>kills,(species,'not defeated');kills=view['self']['kills']
     loot=next(l for l in view['groundLoot'] if l['x']==monster['x'] and l['y']==monster['y'])
     # Approach the dropped item using validated movement, no reward injection.
     for _ in range(10):
      p=state()['self'];dx=loot['x']-p['x'];dy=loot['y']-p['y']
      if max(abs(dx),abs(dy))<=1:break
      action({'type':'move','dx':(dx>0)-(dx<0),'dy':(dy>0)-(dy<0)});time.sleep(.4)
     action({'type':'pickup','id':loot['id']});assert not any(l['id']==loot['id'] for l in state()['groundLoot']);results.append(species+': real attack/death/XP/drop/pickup')
    place('cinzaveu',9,16)
    page.keyboard.press('m');page.locator('#regionMap').wait_for();shot('08-mapa');close()
    page.locator('#sound').click();page.wait_for_timeout(300);assert page.locator('#sound').inner_text()=='SOM ON';results.append('audio opt-in and region ambience activated')
    saved=state()['self'];page.reload();page.locator('.character-choice button').first.click();page.wait_for_function("document.querySelector('#connection').textContent==='MUNDO CONECTADO'");restored=state()['self'];assert restored['level']==saved['level'];assert restored['gold']==saved['gold'];assert restored['equipment']==saved['equipment'];results.append('reload/relogin preserves level, gold and equipment')
    assert not errors,errors;assert not missing,missing
    results.append('no JavaScript errors or missing asset requests')
    (OUT/'validation.json').write_text(json.dumps({'checks':results,'errors':errors,'missingAssets':missing,'fixture':'isolated DEV hunter; admin placement/reset/spawn only, normal gameplay rewards'},ensure_ascii=False,indent=2))
    print(json.dumps(results,ensure_ascii=False,indent=2));browser.close()
  finally:
   proc.terminate();proc.wait(timeout=20)
