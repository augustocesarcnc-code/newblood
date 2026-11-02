import {PrismaClient} from '@prisma/client';
import {PrismaBetterSQLite3} from '@prisma/adapter-better-sqlite3';
import {readFile,copyFile,mkdir,chmod} from 'node:fs/promises';
import {constants} from 'node:fs';
import {join,resolve} from 'node:path';
import {createHash,randomUUID} from 'node:crypto';
type WorldData={players:Record<string,any>;accounts?:Record<string,any>;clans?:Record<string,any>;listings:any[];[key:string]:any};
const clean=(value:any)=>JSON.parse(JSON.stringify(value));
export async function openWorldDatabase(directory:string){
 await mkdir(directory,{recursive:true});const filename=join(resolve(directory),'eclipse.sqlite');
 const client=new PrismaClient({adapter:new PrismaBetterSQLite3({url:'file:'+filename})});
 await client.$queryRawUnsafe('PRAGMA journal_mode=WAL');await client.$queryRawUnsafe('PRAGMA busy_timeout=5000');
 await client.$executeRawUnsafe('CREATE TABLE IF NOT EXISTS "_prisma_migrations" ("id" TEXT PRIMARY KEY NOT NULL,"checksum" TEXT NOT NULL,"finished_at" DATETIME,"migration_name" TEXT NOT NULL,"logs" TEXT,"rolled_back_at" DATETIME,"started_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,"applied_steps_count" INTEGER NOT NULL DEFAULT 0)');
 const migrationName='202611020001_initial',sql=await readFile(new URL('../../../prisma/migrations/'+migrationName+'/migration.sql',import.meta.url),'utf8'),checksum=createHash('sha256').update(sql).digest('hex');
 const records=await client.$queryRawUnsafe<any[]>('SELECT checksum FROM "_prisma_migrations" WHERE migration_name=? AND rolled_back_at IS NULL',migrationName);
 if(records.length&&records[0].checksum!==checksum)throw Error('A migration aplicada foi alterada. Crie uma nova migration para evoluir o banco.');
 if(!records.length)await client.$transaction(async tx=>{for(const statement of sql.split(';').map(s=>s.trim()).filter(Boolean))await tx.$executeRawUnsafe(statement);await tx.$executeRawUnsafe('INSERT INTO "_prisma_migrations" (id,checksum,finished_at,migration_name,applied_steps_count) VALUES (?,?,?,?,1)',randomUUID(),checksum,new Date().toISOString(),migrationName);},{timeout:15000});
 await chmod(filename,0o600);
 async function load():Promise<WorldData>{
  const record=await client.worldRecord.findUnique({where:{key:'world'}});
  if(!record){try{const legacy=join(directory,'world.json'),data=JSON.parse(await readFile(legacy,'utf8'));try{await copyFile(legacy,join(directory,'world.pre-eclipse.json'),constants.COPYFILE_EXCL);}catch(e:any){if(e.code!=='EEXIST')throw e;}return data;}catch(e:any){if(e.code!=='ENOENT')throw e;return {players:{},listings:[]};}}
  const [accounts,characters,items,clans,listings]=await Promise.all([client.account.findMany(),client.character.findMany(),client.inventoryItem.findMany({orderBy:{slot:'asc'}}),client.clan.findMany(),client.marketListing.findMany()]);
  return {...record.payload as object,accounts:Object.fromEntries(accounts.map(a=>[a.id,{id:a.id,email:a.email,password:a.password,characterKeys:a.characterKeys,playerKey:a.selectedKey,role:a.role,createdAt:Number(a.createdAt)}])),players:Object.fromEntries(characters.map(p=>[p.key,{...p.state as object,id:p.id,name:p.name,kind:p.kind,level:p.level,xp:p.xp,gold:p.gold,map:p.map,x:p.x,y:p.y,inventory:items.filter(i=>i.characterId===p.id).map(i=>i.state)}])),clans:Object.fromEntries(clans.map(c=>[c.id,c.state])),listings:listings.map(l=>l.state)} as WorldData;
 }
 async function save(source:WorldData){
  const data=clean(source),{players,accounts={},clans={},listings=[],...meta}=data;
  const owner=new Map<string,string>();for(const a of Object.values(accounts) as any[])for(const key of a.characterKeys||[a.playerKey])if(key)owner.set(key,a.id);
  await client.$transaction(async tx=>{
   await tx.inventoryItem.deleteMany();await tx.character.deleteMany();await tx.account.deleteMany();await tx.clan.deleteMany();await tx.marketListing.deleteMany();
   const accountRows=(Object.values(accounts) as any[]).map(a=>({id:a.id,email:a.email,password:a.password,characterKeys:a.characterKeys||[a.playerKey].filter(Boolean),selectedKey:a.playerKey||null,role:a.role||'player',createdAt:BigInt(a.createdAt||Date.now())}));if(accountRows.length)await tx.account.createMany({data:accountRows});
   const characters=Object.entries(players).map(([key,p]:[string,any])=>{const {inventory,...state}=p;return {id:p.id,key,accountId:owner.get(key)||null,name:p.name,kind:p.kind,level:p.level,xp:p.xp||0,gold:p.gold||0,map:p.map||'cinzaveu',x:p.x,y:p.y,state};});if(characters.length)await tx.character.createMany({data:characters});
   const inventory=Object.values(players).flatMap((p:any)=>(p.inventory||[]).map((i:any,index:number)=>({id:i.id,characterId:p.id,slot:i.slot??index,base:i.base,rarity:i.rarity,quantity:i.quantity||1,upgrade:i.upgrade||0,state:i})));if(inventory.length)await tx.inventoryItem.createMany({data:inventory});
   const clanRows=(Object.values(clans) as any[]).map(c=>({id:c.id,name:c.name,tag:c.tag,leaderId:c.leader,members:c.members,state:c}));if(clanRows.length)await tx.clan.createMany({data:clanRows});
   const listingRows=listings.map((l:any)=>({id:l.id,sellerId:l.seller,price:l.price,item:l.item,state:l}));if(listingRows.length)await tx.marketListing.createMany({data:listingRows});
   await tx.worldRecord.upsert({where:{key:'world'},create:{key:'world',payload:meta},update:{payload:meta}});
  },{timeout:15000});
 }
 return {load,save,close:()=>client.$disconnect(),filename,client};
}
