export const WIDTH = 800;
export const HEIGHT = 600;

export class Canvas {
  constructor(canvasId) {
    this.width = WIDTH;
    this.height = HEIGHT;
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas.getContext('2d');
  }
}
