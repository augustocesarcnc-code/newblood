const options=[
 ['autoPotion','Autopoção','Usa suas poções abaixo do limite de vida, respeitando a recarga.'],
 ['autoTarget','Autoalvo','Seleciona uma criatura próxima e alcançável.'],
 ['autoAttack','Autoataque','Ataca o alvo dentro do alcance da arma.'],
 ['autoSkills','Habilidades automáticas','Usa habilidades ofensivas desbloqueadas, respeitando alvo, mana e recarga.'],
 ['autoBuff','Buff automático','Renova defesa e fúria desbloqueadas, respeitando mana e recargas.'],
 ['autoHunt','Caça automática','Caminha até os monstros dentro do raio escolhido.'],
 ['autoLure','Lure automático','Durante a caça, traz grupos próximos ao ponto onde você iniciou.'],
 ['huntPvp','Caça PvP','Persegue jogadores com PvP ativo. Você também precisa ativar seu PvP.']
];
export function renderBotPanel(body,p,{el,button,action,openVip,refresh}){
 const hero=el('div',undefined,'bot-hero');hero.append(el('small','AUTOMAÇÃO VIP · PACTO CARMESIM'),el('h3','Seu companheiro de caça.'),el('p','Escolha as rotinas, vá até uma área de caça e inicie. A posição inicial define o centro da área.'));
 const status=el('p',p.bot?.status||'Automação pausada.','bot-status');status.id='botStatus';status.setAttribute('role','status');body.append(hero,status);
 if(!p.vip)body.append(el('p','Ative um Pacto VIP para usar a automação.'),button('VER PACTO VIP',openVip));
 const form=el('form',undefined,'bot-form'),fields=el('fieldset'),inputs={};fields.disabled=!p.vip;
 const grid=el('div',undefined,'bot-options');
 for(const [key,title,description]of options){const label=el('label',undefined,'bot-option'),input=el('input');input.type='checkbox';input.name=key;input.checked=p.bot?.[key]??['autoPotion','autoTarget','autoAttack','autoSkills'].includes(key);const copy=el('span');copy.append(el('b',title),el('small',description));label.append(input,copy);grid.append(label);inputs[key]=input;}
 fields.append(grid);const numbers=el('div',undefined,'bot-limits');
 for(const [key,title,min,max,value]of [['potionAt','Usar poção com vida até (%)',10,90,50],['radius','Raio de caça (casas)',3,12,8]]){const label=el('label',title),input=el('input');input.type='number';input.name=key;input.min=min;input.max=max;input.required=true;input.value=p.bot?.[key]??value;label.append(input);numbers.append(label);inputs[key]=input;}
 fields.append(numbers);form.append(fields);const controls=el('div',undefined,'bot-controls'),start=el('button',p.bot?.enabled?'APLICAR E REINICIAR ÁREA':'INICIAR AUTOMAÇÃO','primary');start.type='submit';start.disabled=!p.vip;const stop=button('PARAR AUTOMAÇÃO',async()=>{if(await action({type:'bot-stop'}))refresh();});stop.type='button';controls.append(start,stop);form.append(controls);
 form.onsubmit=async e=>{e.preventDefault();const settings={enabled:true};for(const [key,input]of Object.entries(inputs))settings[key]=input.type==='checkbox'?input.checked:Number(input.value);start.disabled=true;try{if(await action({type:'bot-config',settings}))refresh();}finally{start.disabled=!p.vip;}};
 body.append(form,el('p','Funciona enquanto sua conexão com o mundo estiver ativa. Morre, troca de mapa, sai da conta ou perde o VIP: a automação para. Movimento manual pausa as rotinas. Não atravessa portais nem sai da área de caça.','bot-note'),el('p','PvP exige consentimento dos dois jogadores e respeita zonas seguras. Lure precisa de caça automática e de um grupo próximo; não cria monstros.','bot-note'));
}
