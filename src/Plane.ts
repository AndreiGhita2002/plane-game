import {Assets, Sprite, Texture, Ticker} from 'pixi.js';
import {getRandomInt} from "./util/random.ts";

const PLANE_URL = 'https://pixijs.com/assets/bunny.png';
const PLANE_MIN_SPAWN_SPEED = 1;
const PLANE_MAX_SPAWN_SPEED = 5;

export class Plane extends Sprite {
  static plane_texture: Texture;

  max_x: number; //TODO on resize edit these of every plane
  max_y: number;

  x_velocity: number;
  y_velocity: number;

  static async preload() {
    // load asset
    Plane.plane_texture = await Assets.load(PLANE_URL);
  }

  update(time: Ticker) {
    this.x += this.x_velocity * time.deltaTime;
    this.y += this.y_velocity * time.deltaTime;

    if (this.x < 0) this.x += this.max_x;
    if (this.y < 0) this.y += this.max_y;
    if (this.x > this.max_x) this.x -= this.max_x;
    if (this.y > this.max_x) this.y -= this.max_y;
  }

  constructor(max_x: number, max_y: number) {
    super(Plane.plane_texture);

    this.max_x = max_x;
    this.max_y = max_y;

    this.x_velocity = 0;
    this.y_velocity = 0;

    let vel = PLANE_MIN_SPAWN_SPEED + getRandomInt(PLANE_MAX_SPAWN_SPEED - PLANE_MIN_SPAWN_SPEED);
    let angle = Math.random() * Math.PI;

    // clamp angle
    const angle_limit = 0.523599; // 30 degrees in radians
    if (angle < angle_limit) {angle = angle_limit;}
    if (angle > Math.PI - angle_limit) {angle = Math.PI - angle_limit;}

    let edge: number = getRandomInt(4);
    if (edge == 0) {
      // north
      this.x = getRandomInt(max_x);
      this.y = 0;

      // this.y_velocity = vel;
      this.x_velocity = Math.cos(angle) * vel;
      this.y_velocity = Math.sin(angle) * vel;
    }
    if (edge == 1) {
      // east
      this.x = max_x
      this.y = getRandomInt(max_y);

      this.x_velocity = -Math.sin(angle) * vel;
      this.y_velocity = Math.cos(angle) * vel;
    }
    if (edge == 2) {
      // south
      this.x = getRandomInt(max_x);
      this.y = max_y;

      this.x_velocity = Math.cos(angle) * vel;
      this.y_velocity = -Math.sin(angle) * vel;
    }
    if (edge == 3) {
      // west
      this.x = 0;
      this.y = getRandomInt(max_y);

      this.x_velocity = Math.sin(angle) * vel;
      this.y_velocity = Math.cos(angle) * vel;
    }
  }
}