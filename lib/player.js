import { WIDTH } from './canvas';
import { HEIGHT } from './canvas';

let pDim = 26;

export const player = {
  x : WIDTH/2,
  y : HEIGHT - 5* pDim,
  width : pDim,
  height : pDim,
  speed: 5,
  jumpMult: 2.5,
  velX: 0,
  velY: 0,
  velOffset: 3,
  grounded: false
};
