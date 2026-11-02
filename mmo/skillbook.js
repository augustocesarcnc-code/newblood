const ability=(id,name,type,effect,level,cost,cooldown,power,extra={})=>({id,name,type,effect,level,cost,cooldown,power,...extra});
export const skills={
 cacador:[
  ability('silver-shot','Disparo de prata','strike','bolt',1,18,4500,1.9,{range:5,weapons:['besta','arco']}),
  ability('first-aid','Primeiros socorros','healguard','heal',3,30,12000,45,{duration:15000}),
  ability('crossbow-volley','Rajada da sentinela','strike','volley',6,24,6500,2.3,{range:6,weapons:['besta','arco']}),
  ability('silver-rain','Chuva de prata','area','rain',10,32,11000,1.5,{range:5,radius:2,weapons:['besta','arco']}),
  ability('hunter-oath','Postura do predador','fury','rune',15,25,22000,.2,{duration:10000}),
  ability('restoration','Elixir do guardião','heal','cross',20,35,18000,110),
  ability('sacred-ward','Guarda de aço','guard','shield',30,32,26000,.35,{duration:20000}),
  ability('consecration','Corte circular','area','slash',45,42,18000,2.1,{range:1,radius:1,weapons:['espada']}),
  ability('judgement','Golpe executor','strike','slash',60,45,22000,3.3,{range:1,weapons:['espada']}),
  ability('silver-requiem','Salva perfurante','area','rain',80,55,40000,3.1,{range:6,radius:2,weapons:['besta','arco']})
 ],
 vampiro:[
  ability('blood-pact','Pacto de sangue','drain','drain',1,20,5000,1.9,{range:3,heal:18}),
  ability('red-mist','Névoa rubra','healguard','mist',3,30,12000,45,{duration:15000}),
  ability('night-spear','Lança noturna','strike','lance',6,24,6500,2.2,{range:6}),
  ability('bat-swarm','Enxame de morcegos','area','bats',10,32,11000,1.5,{range:5,radius:2}),
  ability('ancient-thirst','Sede ancestral','fury','rune',15,25,22000,.2,{duration:10000}),
  ability('transfusion','Transfusão vital','heal','heart',20,35,18000,110),
  ability('grave-veil','Véu tumular','guard','shield',30,32,26000,.35,{duration:20000}),
  ability('blood-rosary','Rosário carmesim','area','orbs',45,42,18000,2.1,{range:5,radius:2}),
  ability('abyss-kiss','Beijo do abismo','drain','fangs',60,45,22000,2.8,{range:4,heal:45}),
  ability('scarlet-eclipse','Eclipse escarlate','area','eclipse',80,55,40000,3.1,{range:6,radius:3})
 ],
 lobisomem:[
  ability('rend','Dilacerar','strike','claws',1,18,4500,1.9,{range:1}),
  ability('ancestral-howl','Uivo ancestral','healguard','howl',3,30,12000,45,{duration:15000}),
  ability('cutting-roar','Rugido cortante','strike','wave',6,24,6500,2.4,{range:3}),
  ability('whirlwind','Turbilhão de garras','area','whirl',10,32,11000,1.7,{range:2,radius:1}),
  ability('moon-rage','Fúria da lua','fury','rune',15,25,22000,.2,{duration:10000}),
  ability('wild-recovery','Regeneração selvagem','heal','leaves',20,35,18000,120),
  ability('iron-hide','Pele de ferro','guard','shield',30,32,26000,.35,{duration:20000}),
  ability('pack-wrath','Ira da alcateia','area','wolves',45,42,18000,2.2,{range:3,radius:2}),
  ability('predator-bite','Mordida do predador','drain','fangs',60,45,22000,2.8,{range:1,heal:45}),
  ability('fullmoon-ruin','Ruína da lua cheia','area','moonburst',80,55,40000,3.3,{range:3,radius:2})
 ]
};
for(const kind of ['vampiro','lobisomem'])for(const index of [3,7,8,9])skills[kind][index].requiresTransform=true;
export const lunarDamagePercent={cacador:[0,8,15,6,0,6,15,8],vampiro:[20,12,6,3,0,3,6,12],lobisomem:[0,4,8,15,25,15,8,4]};
export const classPalette={cacador:['#ead6a2','#92c4cd'],vampiro:['#ec466d','#a175d6'],lobisomem:['#a7cee9','#e5b87d']};
export function skillDescription(s){const effect={strike:`${Math.round(s.power*100)}% de dano`,area:`${Math.round(s.power*100)}% de dano · área de ${s.radius} casas`,drain:`${Math.round(s.power*100)}% de dano · até ${s.heal} de cura ao drenar`,heal:`Recupera até ${s.power} de vida`,healguard:`Recupera até ${s.power} de vida · defesa +20% (mín. 3) por 15s`,fury:`+${Math.round(s.power*100)}% de dano por ${s.duration/1000}s`,guard:`+${Math.round(s.power*100)}% de defesa (mín. 3) por ${s.duration/1000}s`}[s.type];return `${effect}${s.requiresTransform?' · Exige transformação':''}${s.weapons?' · Exige '+s.weapons.map(w=>w==='besta'?'besta':w==='arco'?'arco':'espada').join('/') :''}${s.range?' · alcance '+s.range:''} · ${s.cost} energia · ${s.cooldown/1000}s de recarga`;}

export function skillWeaponReady(p,skill){return !skill.weapons||skill.weapons.includes(p.inventory?.find(i=>i.id===p.equipment?.weapon)?.base);}
