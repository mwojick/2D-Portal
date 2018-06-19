import { WIDTH, HEIGHT } from '../canvas';

export const BLOCK_H = 64;
export const BLOCK_W = 64;

export const MAP_H = HEIGHT/BLOCK_H;
export const MAP_W = WIDTH/BLOCK_W;

export class Map {
  constructor(map) {
    this.map = map;
    this.boxesP = [];
    this.boxesNP = [];
    this.exit = [];
  }

  getMap() {
    let mapIndex = 0;

    for (let y = 0; y < MAP_H; y++) {
      for (let x = 0; x < MAP_W; x++, mapIndex++) {
        let tileX = x * BLOCK_W;
        let tileY = y * BLOCK_H;
        let tileType = this.map[mapIndex];

        let box = {
          x: tileX,
          y: tileY,
          width: BLOCK_W,
          height: BLOCK_H
        };

        if (tileType === 1) {
          this.boxesP.push(box);
        } else if (tileType === 2) {
          this.boxesNP.push(box);
        } else if (tileType === 3) {
          this.exit.push(box);
        }
      }
    }
  }

}
