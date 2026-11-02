// Generate the official Prisma client through its generator protocol. Schema
// parsing uses the package's WASM implementation; runtime uses the JS adapter.
// This path needs no Rust schema/query-engine download and keeps checks intact.
import {readFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import {spawn} from 'node:child_process';
import {createRequire} from 'node:module';
import internals from '@prisma/internals';
const {getDMMF,getConfig}=internals;
const require=createRequire(import.meta.url),schemaPath=resolve('prisma/schema.prisma'),datamodel=await readFile(schemaPath,'utf8');
const config=await getConfig({datamodel,ignoreEnvVarErrors:true}),dmmf=await getDMMF({datamodel});
const generator={...config.generators[0],output:{fromEnvVar:null,value:resolve('node_modules/.prisma/client')},isCustomOutput:false,sourceFilePath:schemaPath};
const version=require('@prisma/engines-version').enginesVersion;
const options={generator,otherGenerators:[],schemaPath,version,datamodel,dmmf,datasources:config.datasources,binaryPaths:{},postinstall:false,noEngine:false,envPaths:{rootEnvPath:null}};
await new Promise((resolve,reject)=>{const child=spawn(process.execPath,[require.resolve('@prisma/client/generator-build')],{stdio:['pipe','ignore','pipe']});let pending='';const timer=setTimeout(()=>{child.kill();reject(Error('Tempo limite na geração Prisma.'));},60000);child.stderr.on('data',chunk=>{pending+=chunk;let index;while((index=pending.indexOf('\n'))>=0){const line=pending.slice(0,index);pending=pending.slice(index+1);try{const result=JSON.parse(line);if(result.id===1){clearTimeout(timer);child.stdin.end();child.kill();if(result.error)reject(Error(result.error.message));else resolve();}}catch{if(line.trim())console.error(line);}}});child.on('error',reject);child.stdin.on('error',reject);child.on('exit',code=>{if(code&&code!==0){clearTimeout(timer);reject(Error('Gerador Prisma encerrou sem concluir.'));}});child.stdin.write(JSON.stringify({jsonrpc:'2.0',method:'generate',id:1,params:options})+'\n');});
console.log('Cliente Prisma gerado em modo JavaScript/WASM.');
