import village from '../assets/maps/cinzaveu.json' with {type:'json'};
import forest from '../assets/maps/floresta.json' with {type:'json'};
import cemetery from '../assets/maps/cripta.json' with {type:'json'};
import cave from '../assets/maps/caverna.json' with {type:'json'};
import ruins from '../assets/maps/ruinas.json' with {type:'json'};
import castle from '../assets/maps/castelo.json' with {type:'json'};
import {parseTiledMap} from '../packages/shared/src/tiled.js';
export const tiledMaps=Object.fromEntries(Object.entries({cinzaveu:village,floresta:forest,cripta:cemetery,caverna:cave,ruinas:ruins,castelo:castle}).map(([id,map])=>[id,parseTiledMap(map)]));
export const mapObjects=(id,layer)=>tiledMaps[id]?.objects(layer)||[];
