"""Package renderer exports and an offline inspection page; no image edits."""
from pathlib import Path
import base64,json,html,re,zipfile
root=Path(__file__).resolve().parents[1];kit=root/'dist/animation-kit'
exports=json.loads((kit/'exports.json').read_text());images={key:'data:image/png;base64,'+base64.b64encode((kit/name).read_bytes()).decode() for key,name in exports.items()}
appearance=(root/'mmo/appearance.js').read_text().replace('export ','')
lab=(root/'mmo/sprite-lab.js').read_text();lab='\n'.join(line for line in lab.splitlines() if not line.startswith('import '))
helpers='''
const directions=[[0,1],[-1,1],[-1,0],[-1,-1],[0,-1],[1,-1],[1,0],[1,1]];
const images={};
const spritesReady=Promise.all(Object.entries(EMBEDDED).map(([key,src])=>new Promise((resolve,reject)=>{const image=new Image();image.onload=()=>{images[key]=image;resolve();};image.onerror=reject;image.src=src;})));
function imageKey(kind,form,options={}){if(form)return kind+'-'+(options.state==='run'?'run':'walk');const a=options.appearance||defaultAppearance(kind),mask=(a.armor?1:0)|(a.weapon?2:0)|(a.charm?4:0);return kind+'-'+mask;}
function drawSprite(c,kind,x,y,facing=[0,1],moving=0,scale=1,form=false,options={}){const image=images[imageKey(kind,form,options)];if(!image)return;const d=Math.max(0,directions.findIndex(v=>v[0]===facing[0]&&v[1]===facing[1])),frame=(options.frameIndex||0)%8,s=scale/1.2;c.imageSmoothingEnabled=true;const cw=image.naturalWidth/8,ch=image.naturalHeight/8;c.drawImage(image,frame*cw,d*ch,cw,ch,x-cw/2*s,y+10-(cw===160?ch-32:ch-16)*s,cw*s,ch*s);}
function spriteSheet(kind,form=false,options={}){const canvas=document.createElement('canvas');const image=images[imageKey(kind,form,options)];canvas.width=image.naturalWidth;canvas.height=image.naturalHeight;canvas.getContext('2d').drawImage(image,0,0);return canvas;}
'''
page=(root/'sprites.html').read_text().replace('<link rel="stylesheet" href="/mmo/style.css">','<style>'+(root/'mmo/style.css').read_text()+'</style>').replace('<option value="idle">Parado</option>','').replace('href="/"','href="#top"').replace('VOLTAR AO JOGO ↗','ESTÚDIO OFFLINE').replace('Carregando as pranchas…','Carregando as pranchas locais…')
page=re.sub(r'<select id="armorStyle">.*?</select>','<select id="armorStyle"><option value="manto">Manto da classe</option></select>',page);page=re.sub(r'<select id="weaponStyle">.*?</select>','<select id="weaponStyle"><option value="class">Arma de classe</option></select>',page)
page=page.replace('href="/assets/flare/ATTRIBUTION.md" target="_blank" rel="noopener"','href="#credits"')
credits='<details id="credits" style="max-width:1100px;margin:30px auto;padding:25px"><summary>Créditos e licenças da arte</summary>'
for title,name in [('Atribuição Flare','ATTRIBUTION.md'),('Créditos originais','CREDITS.txt'),('CC BY-SA 3.0','LICENSE.txt')]:credits+='<h3>'+title+'</h3><pre style="white-space:pre-wrap;font-size:11px">'+html.escape((root/'assets/flare'/name).read_text())+'</pre>'
credits+='</details>'
script='const EMBEDDED='+json.dumps(images,separators=(',',':'))+';\n'+appearance+'\n'+helpers+'\n'+lab
page=page.replace('<script type="module" src="/mmo/sprite-lab.js"></script>',credits+'<script>'+script+'</script>')
file=root/'dist/Bloodmoon-Estudio-Animacao.html';file.write_text(page)
readme='''BLOODMOON — KIT DE ANIMAÇÃO\n\nAbra Bloodmoon-Estudio-Animacao.html no navegador. Não requer servidor ou Internet.\n\nFormas: 8 direções x 8 quadros, caminhada e corrida separadas para vampiro e lobisomem (256 quadros).\nHumanos: Sentinela (caçador), Adepto (vampiro), Errante (lobisomem). Derivam de um rig Flare comum com perfis corporais e cabeças diferentes. Armas, armaduras e amuleto compartilham o encaixe do corpo.\nCada PNG normalizado tem 768x1024 pixels: 8 colunas de quadros de 96x128 e 8 linhas na ordem S, SW, W, NW, N, NE, E, SE. Pivô dos pés: x=48, y=112 em cada célula.\n\nHumanos-camadas-0 são as três bases sem equipamento. Máscara de camadas: +1 armadura, +2 arma, +4 amuleto. O conjunto contém as 8 combinações para cada base. A caminhada/corrida humana usa o mesmo ciclo Flare com cadência distinta; as transformações possuem pranchas próprias para cada movimento. As animações geradas são assets alpha e podem precisar de ajustes artísticos de continuidade.\n\nArte humana e composições: Flare, CC BY-SA 3.0. Preserve a atribuição e a licença nas adaptações. Créditos completos estão no HTML e na pasta LICENSES. As transformações foram geradas para Bloodmoon, não são arte Flare.\n'''
(kit/'LEIA-ME.txt').write_text(readme);licenses=kit/'LICENSES';licenses.mkdir(exist_ok=True)
for name in ['ATTRIBUTION.md','CREDITS.txt','LICENSE.txt']:(licenses/('Flare-'+name)).write_bytes((root/'assets/flare'/name).read_bytes())
zip_path=root/'dist/Bloodmoon-Kit-Animacao.zip'
with zipfile.ZipFile(zip_path,'w',zipfile.ZIP_DEFLATED) as z:
 z.write(file,file.name)
 for f in kit.rglob('*'):
  if f.is_file():z.write(f,str(f.relative_to(kit)))
print('Offline HTML:',round(file.stat().st_size/1048576,2),'MiB; ZIP:',round(zip_path.stat().st_size/1048576,2),'MiB')
