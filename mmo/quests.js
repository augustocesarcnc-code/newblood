import {maxHP} from './world.js';
import {gainXP} from './progression.js';
import {item} from './items.js';
import {addItem} from './inventory.js';
export const questDefinitions={
 bloodforest:{id:'bloodforest',name:'O Sangue na Floresta',type:'kill',target:'any',required:10,npc:'master',description:'Derrote dez criaturas e retorne ao Mestre de Classe.',xp:150,gold:100,reward:'amuleto'},
 fragments:{id:'fragments',name:'Ecos da Lua',type:'collect',target:'fragmento',required:5,npc:'alchemist',description:'Reúna cinco fragmentos lunares no inventário.',xp:100,gold:50,reward:'mana'},
 delivery:{id:'delivery',name:'Suprimentos do Alquimista',type:'deliver',target:'fragmento',required:3,npc:'alchemist',description:'Entregue três fragmentos ao alquimista.',xp:120,gold:70,reward:'pocao'},
 firstforge:{id:'firstforge',name:'O Fogo e o Ferro',type:'talk',target:'forge',required:1,npc:'master',description:'Converse com Dorian na forja e retorne ao mestre.',xp:50,gold:25,reward:'racao'}
};
export function questView(p){return Object.values(questDefinitions).map(q=>({...q,...p.quests?.[q.id],progress:['collect','deliver'].includes(q.type)?Math.min(q.required,p.inventory.filter(i=>i.base===q.target).reduce((n,i)=>n+(i.quantity||1),0)):p.quests?.[q.id]?.progress||0,status:p.quests?.[q.id]?.status||'available'}));}
export function acceptQuest(p,id){const q=questDefinitions[id];if(!q)throw Error('Missão desconhecida.');p.quests??={};if(p.quests[id])throw Error('Missão já iniciada ou concluída.');p.quests[id]={status:'active',progress:0};}
export function questEvent(p,type,target){for(const q of Object.values(questDefinitions)){const state=p.quests?.[q.id];if(state?.status==='active'&&q.type===type&&(q.target==='any'||q.target===target))state.progress=Math.min(q.required,(state.progress||0)+1);}}
export function claimQuest(p,id){const q=questView(p).find(q=>q.id===id);if(!q||q.status!=='active'||q.progress<q.required)throw Error('Objetivo da missão ainda não concluído.');const draft={...p,inventory:p.inventory.map(i=>({...i}))};if(q.type==='deliver'){let count=q.required;for(const i of draft.inventory.filter(i=>i.base===q.target)){const n=Math.min(count,i.quantity||1);i.quantity-=n;count-=n;}draft.inventory=draft.inventory.filter(i=>i.quantity>0);}
 addItem(draft,item(q.reward));p.inventory=draft.inventory;p.gold+=q.gold;gainXP(p,q.xp,maxHP);p.quests[id].status='claimed';return q;
}
