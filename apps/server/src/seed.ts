import {randomUUID,randomBytes} from 'node:crypto';
import {hashPassword} from '../../../mmo/auth.js';
import {create,migrate,maxHP} from '../../../mmo/world.js';
import {normalizeInventory} from '../../../mmo/inventory.js';
import {item,definitions} from '../../../mmo/items.js';
import {skills} from '../../../mmo/skillbook.js';
import {monsterTypes} from '../../../mmo/bestiary.js';
import {questDefinitions} from '../../../mmo/quests.js';
import {npcs} from '../../../mmo/village.js';
export const seedCatalog=()=>({items:definitions,skills,monsters:monsterTypes,npcs,quests:questDefinitions});
export async function seedDevelopment(data:any,persist:()=>Promise<unknown>){
 if(process.env.ECLIPSE_DEV!=='1')return false;
 data.accounts??={};if(Object.values(data.accounts).some((a:any)=>a.email==='admin@eclipse.local'))return false;
 const p=migrate(create('Augusto','cacador'));p.level=10;p.hp=maxHP(p);p.gold=1000;p.potions=30;p.vipUntil=Date.now()+30*86400000;p.inventory=[item('arco'),item('espada'),item('couro')];p.equipment.weapon=p.inventory[0].id;normalizeInventory(p);
 const key=randomBytes(32).toString('hex'),id=randomUUID();data.players[key]=p;data.accounts[id]={id,email:'admin@eclipse.local',password:await hashPassword('admin123'),playerKey:key,characterKeys:[key],role:'admin',createdAt:Date.now()};await persist();return true;
}
