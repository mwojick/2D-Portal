
let pDim = 15,
    width = 800,
    height = 600;

export const player = {
  x : width/2,
  y : height - 2* pDim,
  width : pDim,
  height : pDim,
  speed: 5,
  jumpMult: 2.5,
  velX: 0,
  velY: 0,
  velOffset: 3,
  grounded: false
};
