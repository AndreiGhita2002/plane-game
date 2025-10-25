import { Sprite, Texture } from "pixi.js";
import { Vector2 } from "@esotericsoftware/spine-pixi-v8";

export class Plane extends Sprite {
  // public position: Vector2;
  public velocity: Vector2;

  constructor() {
    const tex = "logo.svg";
    super({ texture: Texture.from(tex), anchor: 0.5, scale: 0.25 });
    this.position = new Vector2(0, 0);
    this.velocity = new Vector2(0, 0);
  }
}
