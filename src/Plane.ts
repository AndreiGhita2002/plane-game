import {Assets, Sprite, Texture} from 'pixi.js';

export class Plane extends Sprite {
  static plane_texture: Texture;

  x_velocity: number;
  y_velocity: number;

  static async preload() {
    // load asset
    Plane.plane_texture = await Assets.load('https://pixijs.com/assets/bunny.png');
  }

  constructor(x: number, y: number) {
    super(Plane.plane_texture);

    this.position.set(x, y);

    this.x_velocity = 0;
    this.y_velocity = 0;
  }
}