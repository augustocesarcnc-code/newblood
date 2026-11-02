import {readdir} from 'node:fs/promises';
import {spawnSync} from 'node:child_process';
async function collect(directory){const entries=await readdir(directory,{withFileTypes:true});const results=await Promise.all(entries.map(entry=>entry.isDirectory()?collect(directory+'/'+entry.name):/\.(js|mjs)$/.test(entry.name)?[directory+'/'+entry.name]:[]));return results.flat();}
const files=['server.js','jogar.mjs',...await collect('mmo'),...await collect('scripts'),...await collect('packages')];
for(const file of files){const result=spawnSync(process.execPath,['--check',file],{stdio:'inherit'});if(result.status!==0)process.exit(result.status||1);}
const typecheck=spawnSync(process.execPath,['node_modules/typescript/bin/tsc','--noEmit'],{stdio:'inherit'});if(typecheck.status!==0)process.exit(typecheck.status||1);
console.log('Sintaxe e TypeScript verificados: '+files.length+' módulos JavaScript e entradas TypeScript.');
