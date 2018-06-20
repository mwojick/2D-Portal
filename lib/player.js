import { WIDTH, HEIGHT } from './canvas';
import { BLOCK_H, BLOCK_W } from './maps/map';

let pDim = 42;

export const player = {
  x: BLOCK_W,
  y: 5*BLOCK_H,
  width: pDim,
  height: pDim,
  speed: 7,
  jumpMult: 2,
  velX: 0,
  velY: 0,
  velOffset: 4,
  grounded: false,
  levelCount: 2
};

// Starting player positions for each level
export const playerPos = [
  { x: BLOCK_W, y: 5*BLOCK_H },
  { x: BLOCK_W, y: 7*BLOCK_H },
  { x: BLOCK_W, y: 5*BLOCK_H },
  { x: BLOCK_W, y: 5*BLOCK_H },
  { x: BLOCK_W, y: 5*BLOCK_H },

  { x: BLOCK_W, y: 5*BLOCK_H },
  { x: BLOCK_W, y: 5*BLOCK_H },
  { x: BLOCK_W, y: 5*BLOCK_H },
  { x: BLOCK_W, y: 5*BLOCK_H },
  { x: BLOCK_W, y: 5*BLOCK_H }
];
