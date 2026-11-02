"""Build the public Eclipse source distribution; exclude all private runtime data."""
from pathlib import Path
import json,zipfile,hashlib
root=Path(__file__).resolve().parents[1]
out=root/'dist/Eclipse-Blood-Moon.zip'
out.parent.mkdir(exist_ok=True)
root_files=['server.js','package.json','package-lock.json','tsconfig.json','index.html','sprites.html','art.html','README.md','AGENTS.md','.gitignore','.env.example','jogar.mjs','JOGAR-WINDOWS.bat','jogar.sh','JOGAR-DEMO-WINDOWS.bat','jogar-demo.sh','LEIA-ME-PRIMEIRO.txt']
paths=[root/name for name in root_files]
for folder in ['apps','packages','prisma','mmo','assets','docs','scripts','tests','tools','src']:
 paths+=sorted(p for p in (root/folder).rglob('*') if p.is_file() and not (folder=='assets' and p.suffix in ['.png','.jpg'] and p.relative_to(root).parts[1] in ['flare','original','animations','bases','monsters','terrain','concepts','sprites']) and not any(part.startswith('.') or part in ['node_modules','__pycache__'] for part in p.relative_to(root).parts) and p.suffix not in ['.pyc','.sqlite','.db','.log'] and not (folder=='docs' and p.relative_to(root).parts[1:2]==('previews',) and len(p.relative_to(root).parts)==3))
manifest={}
with zipfile.ZipFile(out,'w',zipfile.ZIP_DEFLATED) as archive:
 for path in paths:
  relative=path.relative_to(root).as_posix()
  assert not any(part in ['.data','.data-demo','.data-dev','.git','node_modules'] for part in path.relative_to(root).parts)
  assert relative!='.env' and (not relative.startswith('.env.') or relative=='.env.example')
  blob=path.read_bytes();archive.write(path,'Eclipse/'+relative);manifest[relative]=hashlib.sha256(blob).hexdigest()
 archive.writestr('Eclipse/ARQUIVOS-SHA256.json',json.dumps(manifest,indent=2))
(root/'ARQUIVOS-SHA256.json').write_text(json.dumps(manifest,indent=2))
with zipfile.ZipFile(out) as archive:
 assert archive.testzip() is None
 assert not any('/.data/' in name or '/.git/' in name or name.endswith('/.env') for name in archive.namelist())
assert out.stat().st_size<100*1024*1024,'Arquivo excede limite de GitHub.'
print(f'Pacote Eclipse: {out.name}; {out.stat().st_size/1048576:.1f} MiB; {len(paths)} arquivos públicos; SHA256 {hashlib.sha256(out.read_bytes()).hexdigest()}')
