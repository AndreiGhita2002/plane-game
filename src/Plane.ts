import {Assets, Sprite, Texture, Ticker} from 'pixi.js';
import {getRandomInt} from "./util/random.ts";

const PLANE_URL = 'https://pixijs.com/assets/bunny.png';
const PLANE_MIN_SPAWN_SPEED = 1;
const PLANE_MAX_SPAWN_SPEED = 5;

export class Plane extends Sprite {
  static plane_texture: Texture;

  to_delete: boolean = false;

  max_x: number;
  max_y: number;

  velocity: [number, number];

  static async preload() {
    // load asset
    Plane.plane_texture = await Assets.load(PLANE_URL);
  }

  update(time: Ticker) {
    // if it is time to pathfind:
    // this.pathfind()

    this.x += this.velocity[0] * time.deltaTime;
    this.y += this.velocity[1] * time.deltaTime;

    if (this.x < 0) this.to_delete = true;
    if (this.y < 0) this.to_delete = true;
    if (this.x > this.max_x) this.to_delete = true;
    if (this.y > this.max_x) this.to_delete = true;
  }

  resize(new_width: number, new_height: number) {
    this.max_x = new_width;
    this.max_y = new_height;
  }

  constructor(max_x: number, max_y: number) {
    super(Plane.plane_texture);

    this.max_x = max_x;
    this.max_y = max_y;

    this.velocity = [0, 0];

    let vel = getRandomInt(PLANE_MIN_SPAWN_SPEED, PLANE_MAX_SPAWN_SPEED);
    let angle = Math.random() * Math.PI;

    // clamp angle
    const angle_limit = 1.22173; // 70 degrees in radians
    if (angle < angle_limit) {angle = angle_limit;}
    if (angle > Math.PI - angle_limit) {angle = Math.PI - angle_limit;}

    let edge: number = getRandomInt(0, 4);
    if (edge == 0) {
      // north
      let base = max_y / Math.tan(angle_limit)
      this.x = getRandomInt(base, max_x - base);
      this.y = 0;

      this.velocity = [Math.cos(angle) * vel, Math.sin(angle) * vel];

    }
    if (edge == 1) {
      // east
      let base = max_x / Math.tan(angle_limit)
      this.x = max_x
      this.y = getRandomInt(base, max_y - base);

      this.velocity = [-Math.sin(angle) * vel, Math.cos(angle) * vel];
    }
    if (edge == 2) {
      // south
      let base = max_y / Math.tan(angle_limit)
      this.x = getRandomInt(base, max_x - base);
      this.y = max_y;

      this.velocity = [Math.cos(angle) * vel, -Math.sin(angle) * vel];
    }
    if (edge == 3) {
      // west
      let base = max_x / Math.tan(angle_limit)
      this.x = 0;
      this.y = getRandomInt(base, max_y - base);

      this.velocity = [Math.sin(angle) * vel, Math.cos(angle) * vel];
    }
  }

  // Pathfinding information
  // pathfind_mode: number; // 0 - initial, 1 - player set
  // overall_direction: [number, number]
  // goal: [number, number]
  //
  // pathfind() {
  //   if (this.pathfind_mode == 0) {
  //     // initial edge-to-edge travel
  //   } else {
  //     // player set travel
  //   }
  // }
}