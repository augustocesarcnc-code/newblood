from pathlib import Path
from playwright.sync_api import sync_playwright
import base64,json
root=Path(__file__).resolve().parents[1];out=root/'assets/eclipse';manifest={}
with sync_playwright() as p:
 b=p.chromium.launch(executable_path='/usr/bin/chromium',args=['--no-sandbox','--enable-unsafe-swiftshader']);page=b.new_page();page.goto('http://localhost:5173/tools/art/props-studio.html');page.wait_for_function('!!window.eclipseProps')
 for name in page.evaluate('window.eclipseProps.names'):
  result=page.evaluate('name=>window.eclipseProps.render(name)',name);filename='prop-'+name+'.png';(out/filename).write_bytes(base64.b64decode(result.pop('url').split(',')[1]));manifest[name]={**result,'image':filename}
 b.close()
(out/'props.json').write_text(json.dumps(manifest));print('Original scenery props:',len(manifest))
