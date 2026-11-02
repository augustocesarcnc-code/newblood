// Explicit equipment fixture: real new characters now start in simple clothing.
import {create,migrate} from '../mmo/world.js';
import {item} from '../mmo/items.js';
export function geared(name='Teste',kind='vampiro'){const p=migrate(create(name,kind));p.inventory=[item({vampiro:'cetro',lobisomem:'garra',cacador:'besta'}[kind]),item('manto'),item('amuleto','incomum')];p.equipment={weapon:p.inventory[0].id,armor:p.inventory[1].id,charm:null};return p;}
