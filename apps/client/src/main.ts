import {io} from 'socket.io-client';
import type {PlayerState,CharacterSummary} from '../../../packages/shared/src/types.ts';
import '../../../mmo/client.js';
export type {PlayerState,CharacterSummary};

(window as Window & {eclipseIo?:typeof io}).eclipseIo=io;
