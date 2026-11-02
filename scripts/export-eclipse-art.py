"""Export original articulated models through the local Vite art studio.
Run npm run dev, then python scripts/export-eclipse-art.py. No proprietary input art.
"""
from pathlib import Path
from playwright.sync_api import sync_playwright
from PIL import Image
import json,time,hashlib,sys,argparse
parser=argparse.ArgumentParser();parser.add_argument('--models');parser.add_argument('--layers');parser.add_argument('--states');parser.add_argument('--with-equipment',action='store_true');parser.add_argument('--equipment-only',action='store_true');parser.add_argument('--first',action='store_true');parser.add_argument('--force',action='store_true');args=parser.parse_args()
ROOT=Path(__file__).resolve().parents[1];OUT=ROOT/'assets/eclipse';OUT.mkdir(exist_ok=True)
manifest={'version':1,'source':'Original ECLIPSE articulated miniature rigs','cell':[128,192],'directions':['S','SW','W','NW','N','NE','E','SE'],'frames':8,'entries':{},'equipment':{}}
if (OUT/'manifest.json').exists():manifest=json.loads((OUT/'manifest.json').read_text())
with sync_playwright() as p:
 browser=p.chromium.launch(executable_path='/usr/bin/chromium',args=['--no-sandbox','--enable-unsafe-swiftshader','--disable-dev-shm-usage']);page=browser.new_page();page.goto('http://localhost:5173/tools/art/studio.html');page.wait_for_function('!!window.eclipseArt');models=page.evaluate('window.eclipseArt.models');states=page.evaluate('window.eclipseArt.states');equipment=page.evaluate('window.eclipseArt.equipment');count=0;start=time.time()
 tasks=[]
 for model in models:
  available=states if model in ['hunter','vampire-human','wolf-human','vampire-form','werewolf'] else ['idle','walk','attack','hit','death','special'] if model in ['executioner','minotaur'] else ['idle','walk','attack','hit','death']
  for state in available:tasks.append((model,state,'body'))
 for layer in equipment:
  for state in states:tasks.append(('hunter',state,layer))
 if '--equipment-only' in sys.argv:
  tasks=[t for t in tasks if t[2]!='body'];manifest=json.loads((OUT/'manifest.json').read_text())
 if args.models:
  selected=set(args.models.split(','));tasks=[t for t in tasks if t[0] in selected and (t[2]=='body' or args.with_equipment)]
 if args.layers:
  selected_layers=set(args.layers.split(','));tasks=[t for t in tasks if t[2] in selected_layers]
 if args.states:
  selected_states=set(args.states.split(','));tasks=[t for t in tasks if t[1] in selected_states]
 if '--first' in sys.argv:tasks=tasks[:1]
 for model,state,layer in tasks:
  filename=f'{model}-{state}.png' if layer=='body' else f'gear-{layer}-{state}.png';path=OUT/filename
  if path.exists() and '--force' not in sys.argv:
   saved=(manifest['entries'] if layer=='body' else manifest['equipment']).get(model if layer=='body' else layer,{}).get(state,{});anchor=saved.get('anchor',page.evaluate('window.eclipseArt.anchor'));cell=saved.get('cell',[128,192] if layer=='body' else [192,192])
  else:
   result=page.evaluate('args=>window.eclipseArt.sheet(...args)',[model,state,layer]);path.write_bytes(bytes(result['bytes']));anchor=result['anchor'];cell=result['cell']
  target=manifest['entries'] if layer=='body' else manifest['equipment'];key=model if layer=='body' else layer;target.setdefault(key,{})[state]={'image':filename,'anchor':anchor,'cell':cell,'ms':65 if state=='run' else 95 if state=='walk' else 100 if state in ['attack','attack2','cast','jump','special','transform','death','hit','shoot'] else 180}
  count+=1
  if count%10==0 or count==1:print(f'{count}/{len(tasks)} {filename} {time.time()-start:.1f}s',flush=True)
 browser.close()
(OUT/'manifest.json').write_text(json.dumps(manifest,separators=(',',':')))
print(f'Export complete: {count} sheets, {count*64} individually posed direction frames.',flush=True)
