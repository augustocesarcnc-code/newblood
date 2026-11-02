import {resolve} from 'node:path';
import {openWorldDatabase} from '../apps/server/src/database.ts';
import {seedDevelopment,seedCatalog} from '../apps/server/src/seed.ts';
import {migrate} from '../mmo/world.js';
import {normalizeInventory} from '../mmo/inventory.js';
const db=await openWorldDatabase(resolve(process.env.BLOODMOON_DATA_DIR||(process.env.ECLIPSE_DEV==='1'?'.data-dev':'.data')));
try{
 const data=await db.load();for(const p of Object.values(data.players)){migrate(p);normalizeInventory(p);}await db.save(data);
 if(process.argv[2]==='seed'){
  await db.client.worldRecord.upsert({where:{key:'catalog'},create:{key:'catalog',payload:seedCatalog()},update:{payload:seedCatalog()}});
  await seedDevelopment(data,()=>db.save(data));
  console.log('Catálogo persistido.'+(process.env.ECLIPSE_DEV==='1'?' Seed DEV habilitado: admin / admin123 (uso local).':' Conta admin não criada; exige ECLIPSE_DEV=1.'));
 }else console.log('Migrations SQLite aplicadas.');
}finally{await db.close();}
