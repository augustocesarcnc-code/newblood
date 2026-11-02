export type CharacterClass='cacador'|'vampiro'|'lobisomem';
export type Rarity='comum'|'incomum'|'raro'|'epico'|'lendario'|'mitico';
export type EquipmentSlot='head'|'chest'|'legs'|'boots'|'gloves'|'weapon'|'offhand'|'charm'|'ring'|'belt';
export interface Position {x:number;y:number;map:string;}
export interface ItemDefinition {name:string;description:string;type:'equipment'|'consumable'|'material';slot?:EquipmentSlot;kind?:CharacterClass;requiredLevel:number;icon:string;value:number;stackable:boolean;maxStack:number;attack?:number;armor?:number;strength?:number;dexterity?:number;intelligence?:number;vitality?:number;}
export interface InventoryItem {id:string;base:string;rarity:Rarity;quantity?:number;slot?:number;upgrade?:number;}
export interface CharacterSummary {id:string;name:string;kind:CharacterClass;level:number;map:string;}
export interface PlayerState extends Position {id:string;name:string;kind:CharacterClass;hp:number;level:number;facing:[number,number];transformed:boolean;}
export interface MonsterState extends Position {id:string;species:string;name:string;hp:number;maxHP:number;state:'IDLE'|'PATROL'|'CHASE'|'ATTACK'|'RETURN'|'DEAD';boss?:boolean;elite?:boolean;facing:[number,number];}
export interface SkillDefinition {id:string;name:string;cost:number;cooldown:number;level:number;range?:number;type:string;requiresTransform?:boolean;weapons?:string[];}
export interface ActionResult {ok?:boolean;error?:string;self?:PlayerState;status?:number;}
export interface NetworkEvents {'session:join':(data:Record<string,never>,reply:(result:ActionResult)=>void)=>void;'player:action':(data:{type:string;[key:string]:unknown},reply:(result:ActionResult)=>void)=>void;'world:state':(state:{now:number;self:PlayerState;players:PlayerState[];monsters:MonsterState[]})=>void;'world:ping':(reply:(serverNow:number)=>void)=>void;}
