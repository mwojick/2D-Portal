import { WIDTH, HEIGHT } from './canvas';
import { BLOCK_H, BLOCK_W } from './maps/map';

let pDim = 24;

export const player = {
  x : BLOCK_W,
  y : 5*BLOCK_H,
  width : pDim,
  height : pDim,
  speed: 5,
  jumpMult: 2,
  velX: 0,
  velY: 0,
  velOffset: 3,
  grounded: false
};
