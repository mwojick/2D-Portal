export const WIDTH = 1024;
export const HEIGHT = 800;

export class Canvas {
  constructor(canvasId) {
    this.width = WIDTH;
    this.height = HEIGHT;
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas.getContext('2d');
  }
}
