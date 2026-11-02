import {spawn} from 'node:child_process';
import net from 'node:net';
import {fileURLToPath} from 'node:url';
import {join} from 'node:path';
import {existsSync} from 'node:fs';
import {createDemoWorld,demoPassword,demoAccounts} from './mmo/demo-world.js';
const [major,minor]=process.versions.node.split('.').map(Number);
if(major!==24||minor<19){console.error('Use Node.js 24.19 ou mais recente dentro da linha 24 LTS: https://nodejs.org/');process.exit(1);}
const directory=fileURLToPath(new URL('./',import.meta.url));
if(!existsSync(join(directory,'node_modules/.prisma/client/index.js'))){console.log('Instalando dependências do ECLIPSE. Aguarde…');const code=await new Promise((resolve,reject)=>{const installer=spawn(process.platform==='win32'?'npm.cmd':'npm',['install'],{cwd:directory,stdio:'inherit',shell:process.platform==='win32'});installer.on('error',reject);installer.on('exit',resolve);});if(code!==0)throw Error('A instalação falhou. Consulte o README e execute npm install.');}
const flag=process.argv.indexOf('--port');const preferred=flag>=0?Number(process.argv[flag+1]):3000;
if(!Number.isInteger(preferred)||preferred<1||preferred>65535)throw Error('Porta inválida.');
async function portAvailable(port){return await new Promise((resolve,reject)=>{const server=net.createServer();server.once('error',reject);server.listen(port,'0.0.0.0',()=>{const chosen=server.address().port;server.close(()=>resolve(chosen));});});}
let port;try{port=await portAvailable(preferred);}catch{port=await portAvailable(0);}
const url='http://localhost:'+port;
const demo=process.argv.includes('--demo');let demoDirectory;
if(demo){demoDirectory=join(directory,'.data-demo');await createDemoWorld(demoDirectory);console.log('\nDEMONSTRAÇÃO LOCAL · contas e progresso separados.\n'+demoAccounts.map(a=>a.email).join('\n')+'\nSenha de demonstração: '+demoPassword+'\nVIP, equipamentos e recursos de demonstração; sem cobrança.\n');}
// Local play mode. HTTPS-only checkout and email recovery remain unavailable here.
const child=spawn(process.execPath,['server.js'],{cwd:directory,env:{...process.env,PORT:String(port),PUBLIC_BASE_URL:url,MP_MODE:'test',MP_VIP_PRICE_CENTS:'1500',...(demo?{BLOODMOON_DATA_DIR:demoDirectory,BLOODMOON_DEMO:'1',MP_ACCESS_TOKEN:'',MP_WEBHOOK_SECRET:'',RESEND_API_KEY:'',AUTH_EMAIL_FROM:''}:{})},stdio:['inherit','pipe','inherit']});
let opened=false;
child.stdout.on('data',chunk=>{process.stdout.write(chunk);if(!opened&&String(chunk).includes('Bloodmoon MMO na porta')){opened=true;console.log('\nJOGUE EM: '+url+'\nCrie sua conta na tela do jogo. Mantenha esta janela aberta.\n');if(!process.argv.includes('--no-open')){let command,args;if(process.platform==='win32'){command='cmd';args=['/c','start','',url];}else if(process.platform==='darwin'){command='open';args=[url];}else{command='xdg-open';args=[url];}const browser=spawn(command,args,{stdio:'ignore'});browser.on('error',()=>console.log('Abra manualmente '+url+' no navegador.'));}}});
child.on('error',()=>{console.error('Não foi possível iniciar o servidor.');process.exitCode=1;});child.on('exit',code=>{process.exitCode=code||0;});
for(const signal of ['SIGINT','SIGTERM'])process.on(signal,()=>{child.kill(signal);});
