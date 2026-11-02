import {test} from 'node:test';
import assert from 'node:assert/strict';
import {clamp,direction,levelCost,waveAt} from '../src/rules.js';
test('movimento diagonal mantém velocidade constante',()=>{const d=direction(1,1);assert.ok(Math.abs(Math.hypot(d.x,d.y)-1)<1e-10);assert.deepEqual(direction(0,0),{x:0,y:0});});
test('ondas avançam a cada 24 segundos e param na quinta',()=>{assert.equal(waveAt(0),1);assert.equal(waveAt(23.9),1);assert.equal(waveAt(24),2);assert.equal(waveAt(120),5);});
test('arena limita movimento e progressão exige mais almas',()=>{assert.equal(clamp(-4,16,500),16);assert.equal(clamp(600,16,500),500);assert.equal(levelCost(1),10);assert.ok(levelCost(2)>levelCost(1));});
