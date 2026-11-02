const type=(name,hp,damage,xp,gold,moveMs,extra={})=>({name,hp,damage,xp,gold,moveMs,armor:0,aggro:7,leash:12,respawnMs:12000,...extra});
export const monsterTypes={
 rat:type('Rato Sombrio',35,5,8,4,650),bat:type('Morcego Sangrento',40,6,10,5,450),
 wolf:type('Lobo Sombrio',70,9,14,9,650),skeleton:type('Esqueleto',95,10,20,12,650,{armor:2}),
 bandit:type('Bandido',110,12,23,18,650,{armor:3}),ghoul:type('Ghoul',130,12,26,16,850,{armor:2}),
 cultist:type('Cultista',105,14,28,20,700,{attackRange:3}),spider:type('Aranha de Cripta',120,13,30,18,600),
 vampire:type('Vampiro Selvagem',220,18,55,35,600,{armor:5}),werewolf:type('Lobisomem Selvagem',300,22,70,45,550,{armor:6}),
 'corrupted-wolf':type('Lobo Corrompido',180,17,40,25,550,{armor:4}),
 goblin:type('Goblin saqueador',60,7,14,9,600),antlion:type('Formiga-leão',45,6,10,6,550),zombie:type('Zumbi profanado',130,12,26,16,850),
 elite:type('Esqueleto de Elite',420,25,100,65,600,{armor:10,elite:true,art:'elite'}),
 necromancer:type('Necromante',1500,30,300,120,700,{armor:12,boss:true,miniBoss:true,respawnMs:60000,art:'necromancer'}),
 executioner:type('O Carrasco da Lua',6000,45,1000,250,650,{armor:20,boss:true,respawnMs:180000,art:'executioner',leash:10})
};
export const mapPopulation={cinzaveu:['bat','wolf'],floresta:['wolf','bat','skeleton'],cripta:['skeleton','ghoul','cultist','elite','necromancer'],caverna:['spider','antlion','ghoul','elite'],ruinas:['bandit','cultist','vampire','elite'],castelo:['werewolf','vampire','elite','executioner']};
export function monsterFor(map,index){const list=mapPopulation[map];if(!list)throw Error('Mapa de monstros desconhecido.');const species=list[index%list.length];return {species,...monsterTypes[species]};}
