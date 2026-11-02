import {spawn} from 'node:child_process';
const children=[];let stopping=false;
function stop(code=0){if(stopping)return;stopping=true;for(const child of children)child.kill();process.exitCode=code;}
for(const [entry,args]of [['server',['apps/server/src/main.ts']],['client',['node_modules/vite/bin/vite.js','--config','apps/client/vite.config.ts']]]){const child=spawn(process.execPath,args,{env:{...process.env,BLOODMOON_DATA_DIR:process.env.BLOODMOON_DATA_DIR||'.data-dev',PORT:'3000',PUBLIC_BASE_URL:'http://localhost:5173',ECLIPSE_DEV:'1'},stdio:'inherit'});children.push(child);child.on('error',()=>stop(1));child.on('exit',code=>{if(!stopping){console.error(entry+' finalizou.');stop(code||0);}});}
console.log('ECLIPSE — Blood & Moon\nCliente: http://localhost:5173\nServidor: http://localhost:3000');
for(const signal of ['SIGINT','SIGTERM'])process.on(signal,()=>stop());
