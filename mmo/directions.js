// Canonical world convention: +X east, +Y south. Assets are mapped in one place.
export const directions=[[0,1],[-1,1],[-1,0],[-1,-1],[0,-1],[1,-1],[1,0],[1,1]];
export const directionNames=['S','SW','W','NW','N','NE','E','SE'];
// Flare source convention is W, NW, N, NE, E, SE, S, SW.
export const flareDirections=[6,7,0,1,2,3,4,5];
export function directionIndex(facing){const [x,y]=facing||[0,1],index=directions.findIndex(v=>v[0]===Math.sign(x)&&v[1]===Math.sign(y));return index<0?0:index;}
export const flareDirection=facing=>flareDirections[directionIndex(facing)];
