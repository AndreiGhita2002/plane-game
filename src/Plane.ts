import {Assets, Sprite, Texture, Ticker} from 'pixi.js';
import {getRandomInt} from "./util/random.ts";
import {Main} from "./main.ts";
import {sound} from "@pixi/sound";

const PLANE_MIN_SPAWN_SPEED = 0.7;
const PLANE_MAX_SPAWN_SPEED = 1.8;
const SPAWN_DISTANCE = 10; // how far from world border should planes spawn
const SIN_INCREMENT = 0.05;
const SIN_WAVELENGTH = 0.3;
const GOAL_SPEEDUP = 2.5;
const PLANE_SPAWN_SIZE = 0.1;
const LANDING_SCALE_DOWN = 0.02; // how much to decrease scale by each frame
const LANDING_FADE_OUT = 0.01;
const AIRPORT_RANGE = 90;
const AUTOLAND_RANGE = 50;


export function dot_product(v1: [number, number], v2: [number, number]): number {
  return v1[0] * v2[0] + v2[1] * v2[1];
}

export function vector_angle(v: [number, number]): number {
  return Math.atan2(v[1], v[0]);
}

export function vector_magnitude(v: [number, number]): number {
  return Math.sqrt(v[0] * v[0] + v[1] * v[1]);
}

export function get_unit_vector(v: [number, number]): [number, number] {
  let mag = vector_magnitude(v);
  return [v[0] / mag, v[1] / mag];
}

export function direction_closeness(v1: [number, number], v2: [number, number]): number {
  let dot = dot_product(v1, v2);
  let closeness = dot / (vector_magnitude(v1) * vector_magnitude(v2));
  return Math.min(Math.max(closeness, -1), 1);
}

export function vector_dist(v1: [number, number], v2: [number, number]): number {
  let dx = v1[0] - v2[0];
  let dy = v1[1] - v2[1];
  return Math.sqrt(dx * dx + dy * dy);
}


export class Plane extends Sprite {
  static plane_textures: Texture[];
  colour: number;
  to_delete: boolean = false;

  max_x: number;
  max_y: number;

  speed: number;
  velocity: [number, number];

  // Pathfinding information
  pathfind_mode: number; // 0 - initial, 1 - player set
  // for pathfind_mode==1:
  goal: [number, number];
  goal_direction: [number, number];
  sin_i: number = 0;

  // set this to true when you want a plane to land
  landing: boolean = false;

  static async preload() {
    Plane.plane_textures = new Array<Texture>(7);
    // load assets
    for (let i = 0; i < 7; i++) {
      Plane.plane_textures[i] = await Assets.load(`/sprite/planes/${i}.svg`);
    }
    sound.add('chime0', '/sounds/chime.mp3');
    sound.add('chime1', '/sounds/chime1.mp3');
    sound.add('chime2', '/sounds/chime2.mp3');
    sound.add('miss', '/sounds/miss.mp3');
  }

  update(time: Ticker) {
    if (this.pathfind_mode == 0) {
      // plane is on its initial path; player has not touched it yet

      // delete the plane if out of bounds
      if (this.x < 0) this.to_delete = true;
      if (this.y < 0) this.to_delete = true;
      if (this.x > this.max_x) this.to_delete = true;
      if (this.y > this.max_y) this.to_delete = true;
      if (this.to_delete) {
        this.destroy();
        Main.lives -= 1;

        sound.play('miss');
        return;
      }

      // calculate next position on the sine wave
      this.sin_i += SIN_INCREMENT;
      let angle = vector_angle(this.velocity)
      let displacement: [number, number] = [
        this.speed,
        Math.sin(this.sin_i) * this.speed * SIN_WAVELENGTH
      ]
      displacement = [
       displacement[0] * Math.cos(angle) + displacement[1] * -Math.sin(angle),
       displacement[0] * Math.sin(angle) + displacement[1] * Math.cos(angle)
      ]
      this.x += displacement[0]
      this.y += displacement[1]
    }
    else {
      // TODO make fancy turning

      // const TURNING_SPEED = 0.01;
      // const CLOSE_ENOUGH_DOT = 0.01; // out of 1
      // player has chosen a destination
      // if (this.turning) {
      //
      //   let new_rot = this.rotation + TURNING_SPEED * time.deltaTime;
      //   // let new_vel: [number, number] = [Math.cos(new_rot), -Math.sin(new_rot)];
      //   // check if turn has been enough
      //   // let closeness = direction_closeness(new_vel, this.goal_direction);
      //
      //   let closeness = this.goal_rot - this.rotation;
      //
      //   if (closeness > 2.0 * Math.PI - CLOSE_ENOUGH_DOT) {
      //     console.log("close enough!")
      //     // just set new_vel to direction
      //     // this.velocity = [
      //     //   this.goal_direction[0] * this.speed,
      //     //   this.goal_direction[1] * this.speed,
      //     // ];
      //     this.rotation = this.goal_rot;
      //     this.turning = false;
      //   } else {
      //     // console.log(closeness);
      //     this.rotation = new_rot;
      //   }
      // }
      // else: no course correction needs to be done

      // update position
      this.x += this.velocity[0] * time.deltaTime;
      this.y += this.velocity[1] * time.deltaTime;
    }

    // if Plane is over Airport; start landing
    let d = vector_dist([this.x, this.y], this.goal);
    if ((d < AIRPORT_RANGE && this.pathfind_mode == 1) || (d < AUTOLAND_RANGE && this.pathfind_mode == 0)) {
      this.landing = true;

      if (this.pathfind_mode == 0) {
        this.change_path(this.goal[0], this.goal[1]);
      }
    }

    // set rotation
    this.rotation = vector_angle(this.velocity) + Math.PI / 2.0;

    // z index
    this.zIndex = 10 + this.colour;

    // adjust scale and alpha if landing
    if (this.landing) {
      let s = [
        this.scale.x - PLANE_SPAWN_SIZE * LANDING_SCALE_DOWN * time.deltaTime * this.speed,
        this.scale.y - PLANE_SPAWN_SIZE * LANDING_SCALE_DOWN * time.deltaTime * this.speed,
      ];
      this.scale.set(s[0], s[1]);
      this.alpha -= LANDING_FADE_OUT * time.deltaTime * this.speed;

      if (this.scale.x < 0.0 || this.scale.x < 0.0) {
        this.to_delete = true;
        Main.score += 1;

        sound.play(`chime${Math.floor(Math.random() * 2)}`);
      }
    }
  }

  //TODO call this when used has made a move
  change_path(goal_x: number, goal_y: number) {
    this.goal = [goal_x, goal_y];
    this.pathfind_mode = 1;
    this.goal_direction = get_unit_vector([goal_x - this.x, goal_y - this.y]);
    this.velocity = [
      this.goal_direction[0] * this.speed * GOAL_SPEEDUP,
      this.goal_direction[1] * this.speed * GOAL_SPEEDUP,
    ];

    // this.turning = true;
    // this.goal_rot = vector_angle(this.goal_direction);
    // if (this.goal_rot < this.rotation) this.goal_rot += 2.0 * Math.PI;

    // calculate turning dir
    // let dot = this.goal[0] * (-this.velocity[1]) + this.goal[1] * this.velocity[0];
    // this.turning_dir = dot > 0 ? 1 : -1;
    // this.turning_dir = 1;
  }

  resize(new_width: number, new_height: number) {
    this.max_x = new_width;
    this.max_y = new_height;
  }

  constructor(max_x: number, max_y: number, color: number) {
    super(Plane.plane_textures[color]);

    this.colour = color;

    this.anchor.set(0.5);
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
      this.y = SPAWN_DISTANCE;

      this.velocity = [Math.cos(angle) * this.speed, Math.sin(angle) * this.speed];
    }
    if (edge == 1) {
      // east
      let base = max_x / Math.tan(angle_limit)
      this.x = max_x - SPAWN_DISTANCE;
      this.y = getRandomInt(base, max_y - base);

      this.velocity = [-Math.sin(angle) * this.speed, Math.cos(angle) * this.speed];
    }
    if (edge == 2) {
      // south
      let base = max_y / Math.tan(angle_limit)
      this.x = getRandomInt(base, max_x - base);
      this.y = max_y - SPAWN_DISTANCE;

      this.velocity = [Math.cos(angle) * this.speed, -Math.sin(angle) * this.speed];
    }
    if (edge == 3) {
      // west
      let base = max_x / Math.tan(angle_limit)
      this.x = SPAWN_DISTANCE;
      this.y = getRandomInt(base, max_y - base);

      this.velocity = [Math.sin(angle) * this.speed, Math.cos(angle) * this.speed];
    }
    this.pathfind_mode = 0;

    this.goal_direction = get_unit_vector(this.velocity);

    // Find goal airport
    let goal_airport = Main.airports.find((airport) => airport.colour == this.colour);
    if (goal_airport != undefined) {
      this.goal = [goal_airport.x, goal_airport.y];
    } else {
      this.goal = [0, 0];
    }

    this.scale.set(PLANE_SPAWN_SIZE);

    // Adding listeners
    this.eventMode = "dynamic";
    this.cursor = "pointer";

    this.onpointerdown = (_event) => {
      Main.selected_plane = this;
      console.log("Plane has been selected!");
    };
  }
}