import express from 'express';
import http from 'node:http';
import {readFile,access} from 'node:fs/promises';
import {attachRealtime} from './apps/server/src/network.ts';
import {api,shutdownWorld} from './mmo/backend.js';

const root=new URL('./',import.meta.url),production=process.env.NODE_ENV==='production';
if(production)await access(new URL('dist/web/index.html',root)).catch(()=>{throw Error('Execute npm run build antes de iniciar em produção.');});
const publicModules=new Set([
 'client','world','items','sprites','progression','village','auth-ui','appearance',
 'sprite-lab','directions','bestiary','monster-sprites','terrain','scenery','bot-ui',
 'skillbook','skills-ui','skill-effects','map-renderer','game-ui','clan-ui','inventory',
 'inventory-ui','bank-ui','loot-ui','attributes','social-ui','map-data','environment-ui','audio','window-ui','eclipse-sprites','art-review','picking'
]);
const mime={svg:'image/svg+xml',png:'image/png',jpg:'image/jpeg',json:'application/json',
 txt:'text/plain; charset=utf-8',md:'text/plain; charset=utf-8',js:'text/javascript',
 css:'text/css',html:'text/html; charset=utf-8',wav:'audio/wav',ogg:'audio/ogg',mp3:'audio/mpeg'};
const app=express();app.disable('x-powered-by');
app.use(async(req,res)=>{
 try{
  res.setHeader('Referrer-Policy','no-referrer');res.setHeader('X-Content-Type-Options','nosniff');
  const path=new URL(req.url,'http://localhost').pathname;
  if(path.startsWith('/api/'))return await api(req,res,path);
  let file;
  if(production&&(path==='/'||/^\/assets\/[a-zA-Z0-9_-]+-[\w-]+\.(js|css|svg|png|jpg|woff2)$/.test(path)))file='dist/web/'+(path==='/'?'index.html':path.slice(1));
  else if(['/packages/shared/src/events.js','/packages/shared/src/tiled.js'].includes(path))file=path.slice(1);
  else if(/^\/assets\/(?:flare|original|animations|bases|audio|maps|monsters|terrain|concepts|skills|ui|eclipse)\/(?:[a-zA-Z0-9_-]+\/)?[a-zA-Z0-9_.-]+\.(png|jpg|svg|json|txt|md|ogg|wav|mp3)$/.test(path))file=path.slice(1);
  else if(path==='/')file='index.html';
  else if(path==='/sprites')file='sprites.html';
  else if(path==='/art'||path==='/art.html')file='art.html';
  else if(['/mmo/style.css','/mmo/immersive.css'].includes(path))file=path.slice(1);
  else if(/^\/mmo\/[a-z-]+\.js$/.test(path)&&publicModules.has(path.slice(5,-3)))file=path.slice(1);
  if(!file){res.writeHead(404);return res.end('Não encontrado');}
  let body=await readFile(new URL(file,root));
  if(file==='index.html')body=Buffer.from(body.toString().replace('/apps/client/src/main.ts','/mmo/client.js'));
  res.writeHead(200,{'Content-Type':mime[file.split('.').at(-1)]||'application/octet-stream','Cache-Control':'no-cache'});res.end(body);
 }catch(error){const status=error.code==='ENOENT'?404:400;res.writeHead(status,{'Content-Type':'application/json'});res.end(JSON.stringify({error:status===404?'Arquivo não encontrado.':'Não foi possível processar o pedido.'}));}
});
export const server=http.createServer(app);const realtime=attachRealtime(server);
let closing=false;
for(const signal of ['SIGINT','SIGTERM'])process.once(signal,async()=>{
 if(closing)return;closing=true;realtime.close();server.close();
 try{await shutdownWorld();process.exit(0);}catch(e){console.error('Falha no salvamento final:',e.message);process.exit(1);}
});
server.listen(Number(process.env.PORT||3000),(process.env.BLOODMOON_DEMO==='1'||process.env.ECLIPSE_DEV==='1')?'127.0.0.1':'0.0.0.0',()=>console.log('Bloodmoon MMO na porta '+(process.env.PORT||3000)));
