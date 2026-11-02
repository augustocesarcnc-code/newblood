import {distance} from './world.js';
import {partyFor} from './parties.js';
import {clanFor} from './clans.js';
export function createChatMessage(data,p,input,online,now){let text=String(input.text||'').trim(),channel=input.channel||'GLOBAL',recipient=input.recipient;
 const whisper=text.match(/^\/w\s+(?:"([^"]+)"|(\S+))\s+(.+)$/i);if(whisper){channel='PRIVATE';recipient=whisper[1]||whisper[2];text=whisper[3];}else if(/^\/party\s+/i.test(text)){channel='PARTY';text=text.replace(/^\/party\s+/i,'');}else if(/^\/clan\s+/i.test(text)){channel='CLAN';text=text.replace(/^\/clan\s+/i,'');}
 if(!['LOCAL','GLOBAL','PARTY','CLAN','PRIVATE'].includes(channel)||!text||text.length>140)throw Error('Canal ou mensagem inválida.');if(now-(p.lastChat||0)<1500)throw Error('Aguarde antes de enviar outra mensagem.');
 const message={id:crypto.randomUUID(),name:p.name,sender:p.id,text,channel,at:now,map:p.map,x:p.x,y:p.y};
 if(channel==='PARTY'){const party=partyFor(data,p);if(!party)throw Error('Entre em um grupo.');message.recipients=[...party.members];}
 if(channel==='CLAN'){const clan=clanFor(data,p);if(!clan)throw Error('Entre em um clã.');message.recipients=[...clan.members];}
 if(channel==='PRIVATE'){const q=online.find(q=>q.name.toLocaleLowerCase()===String(recipient||'').toLocaleLowerCase());if(!q)throw Error('Jogador não está online.');message.recipients=[p.id,q.id];message.recipientName=q.name;}
 p.lastChat=now;return message;
}
export function visibleMessages(messages,p){return messages.filter(m=>!m.channel||m.channel==='GLOBAL'||m.recipients?.includes(p.id)||m.channel==='LOCAL'&&m.map===p.map&&distance(p,m)<=12);}
