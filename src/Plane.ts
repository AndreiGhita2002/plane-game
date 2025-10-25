import {Assets, Sprite, Texture, Ticker} from 'pixi.js';
import {getRandomInt} from "./util/random.ts";

const PLANE_URL = 'https://pixijs.com/assets/bunny.png';
const PLANE_MIN_SPAWN_SPEED = 1;
const PLANE_MAX_SPAWN_SPEED = 5;
const TURNING_SPEED = 2; // in radians for some reason
const CLOSE_ENOUGH_DOT = 0.1;


function dot_product(v1: [number, number], v2: [number, number]): number {
  return v1[0] * v2[0] + v2[1] * v2[1];
}

function vector_magnitude(v: [number, number]): number {
  return Math.sqrt(Math.pow(v[0], 2) + Math.pow(v[1], 2));
}

function get_unit_vector(v: [number, number]): [number, number] {
  let mag = vector_magnitude(v);
  return [v[0] / mag, v[1] / mag];
}


export class Plane extends Sprite {
  static plane_texture: Texture;

  to_delete: boolean = false;

  max_x: number;
  max_y: number;

  speed: number;
  velocity: [number, number];

  // Pathfinding information
  pathfind_mode: number; // 0 - initial, 1 - player set
  // for pathfind_mode==1:
  goal: [number, number];
  turning: boolean = false;
  turning_dir: number = 0; // either -1 or +1
  goal_direction: [number, number];

  static async preload() {
    // load asset
    Plane.plane_texture = await Assets.load(PLANE_URL);
  }

  update(time: Ticker) {
    if (this.pathfind_mode == 0) {
      // plane is on its initial path; player has not touched it yet

      // delete the plane if out of bounds
      if (this.x < 0) this.to_delete = true;
      if (this.y < 0) this.to_delete = true;
      if (this.x > this.max_x) this.to_delete = true;
      if (this.y > this.max_x) this.to_delete = true;
      if (this.to_delete) {
        this.destroy();
        return;
      }

      // calculate next position on the sine wave
      // todo sin wave motion of planes
      // let v = [
      //   Math.cos()
      // ]
      // this.sin_i += SIN_INCREMENT;
    } else {
      // player has chosen a destination
      if (this.turning) { //TODO test this
        // this.angle = Math.acos(this.velocity[0]);
        this.angle += TURNING_SPEED * this.turning_dir;
        let new_vel: [number, number] = [Math.cos(this.angle), Math.sin(this.angle)];
        // check if turn has been enough
        if (dot_product(new_vel, this.goal_direction) < CLOSE_ENOUGH_DOT) {
          // just set new_vel to direction
          this.velocity = this.goal_direction;
        } else {
          this.velocity = new_vel;
        }
      }
      // else: no course correction needs to be done

      //todo if Plane is over Airport code here
    }

    // update position
    this.x += this.velocity[0] * time.deltaTime;
    this.y += this.velocity[1] * time.deltaTime;
  }

  //TODO call this when used has made a move
  change_path(goal_x: number, goal_y: number) {
    this.goal = [goal_x, goal_y];
    this.pathfind_mode = 1;
    this.turning = true;

    // calculate turning dir
    let dot = this.goal[0] * (-this.velocity[1]) + this.goal[1] * this.velocity[0];
    this.turning_dir = dot > 0 ? 1 : -1;
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

    this.speed = getRandomInt(PLANE_MIN_SPAWN_SPEED, PLANE_MAX_SPAWN_SPEED);
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

      this.velocity = [Math.cos(angle) * this.speed, Math.sin(angle) * this.speed];
    }
    if (edge == 1) {
      // east
      let base = max_x / Math.tan(angle_limit)
      this.x = max_x
      this.y = getRandomInt(base, max_y - base);

      this.velocity = [-Math.sin(angle) * this.speed, Math.cos(angle) * this.speed];
    }
    if (edge == 2) {
      // south
      let base = max_y / Math.tan(angle_limit)
      this.x = getRandomInt(base, max_x - base);
      this.y = max_y;

      this.velocity = [Math.cos(angle) * this.speed, -Math.sin(angle) * this.speed];
    }
    if (edge == 3) {
      // west
      let base = max_x / Math.tan(angle_limit)
      this.x = 0;
      this.y = getRandomInt(base, max_y - base);

      this.velocity = [Math.sin(angle) * this.speed, Math.cos(angle) * this.speed];
    }
    this.pathfind_mode = 0;
    this.goal = [0, 0];
    this.goal_direction = get_unit_vector(this.velocity);
  }
}