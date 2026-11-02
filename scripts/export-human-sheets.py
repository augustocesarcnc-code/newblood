"""Export the game's layered renderer to PNG; requires a running server and Playwright."""
import argparse,base64,json
from pathlib import Path
from playwright.sync_api import sync_playwright
parser=argparse.ArgumentParser();parser.add_argument('--url',default='http://127.0.0.1:3000');parser.add_argument('--chromium',default='/usr/bin/chromium');args=parser.parse_args()
out=Path(__file__).resolve().parents[1]/'dist/humans-kit';out.mkdir(parents=True,exist_ok=True)
with sync_playwright() as p:
 browser=p.chromium.launch(executable_path=args.chromium,headless=True,args=['--no-sandbox']);page=browser.new_page();page.goto(args.url+'/sprites');manifest={}
 for kind in ['cacador','vampiro','lobisomem']:
  for armor in ['none','couro','cota','placas']:
   for weapon in ['none','class','espada']:
    png=page.evaluate('''async ({kind,armor,weapon})=>{const {spritesReady,spriteSheet}=await import('/mmo/sprites.js');const {bareAppearance,defaultAppearance}=await import('/mmo/appearance.js');await spritesReady;const a=bareAppearance();if(armor!=='none')a.armor={base:armor,rarity:'comum'};if(weapon!=='none')a.weapon=weapon==='class'?defaultAppearance(kind).weapon:{base:'espada',rarity:'comum'};return spriteSheet(kind,false,{state:'walk',appearance:a}).toDataURL();}''',{'kind':kind,'armor':armor,'weapon':weapon})
    name=f'{kind}-{armor}-{weapon}.png';(out/name).write_bytes(base64.b64decode(png.split(',')[1]));manifest[f'{kind}-{armor}-{weapon}']=name
 for kind in ['cacador','vampiro','lobisomem']:
  png=page.evaluate('''async kind=>{const {spritesReady,spriteSheet}=await import('/mmo/sprites.js');const {bareAppearance}=await import('/mmo/appearance.js');await spritesReady;return spriteSheet(kind,false,{state:'idle',appearance:bareAppearance()}).toDataURL();}''',kind)
  name=f'{kind}-none-none-idle.png';(out/name).write_bytes(base64.b64decode(png.split(',')[1]));manifest[f'{kind}-none-none-idle']=name
 (out/'manifest.json').write_text(json.dumps(manifest));browser.close()
print('Exportadas 36 combinações humanas e 3 bases em postura de descanso com células 160x160 e pivô (80,128).')
