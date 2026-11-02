import {mkdir,readFile,writeFile,rename} from 'node:fs/promises';
import {join} from 'node:path';
import {createAuth} from './auth.js';
import {create,migrate} from './world.js';
import {item} from './items.js';
export const demoPassword='Bloodmoon-demo-123';
export const demoAccounts=['cacador','vampiro','lobisomem'].map(kind=>({kind,email:kind+'@demo.local'}));
// Explicit local demo only. No server route can grant this entitlement.
export async function createDemoWorld(directory){
 await mkdir(directory,{recursive:true});const filename=join(directory,'world.json');
 try{await readFile(filename);return {created:false,accounts:demoAccounts};}catch(e){if(e.code!=='ENOENT')throw e;}
 const data={players:{},listings:[]};
 const persist=async()=>{await writeFile(join(directory,'world.tmp'),JSON.stringify(data),{mode:0o600});await rename(join(directory,'world.tmp'),filename);};
 const auth=createAuth({data,persist,makePlayer:(name,kind)=>{
  const p=migrate(create(name,kind));p.level=15;p.hp=300;p.gold=1500;p.shards=40;p.potions=60;p.vipUntil=Date.now()+30*86400000;
  p.inventory=[item({cacador:'besta',vampiro:'cetro',lobisomem:'garra'}[kind],'raro'),item('couro'),item('espada')];p.equipment.weapon=p.inventory[0].id;p.equipment.armor=p.inventory[1].id;return p;
 }});
 for(const account of demoAccounts)await auth.register({...account,name:'Demo '+account.kind,password:demoPassword},'local-demo');
 // Registration sessions are unnecessary: the user signs in through the game.
 data.authSessions={};await persist();return {created:true,accounts:demoAccounts};
}
