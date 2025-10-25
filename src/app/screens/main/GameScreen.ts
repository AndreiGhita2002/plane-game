import { Plane } from "./Plane.ts";
import { Container } from "pixi.js";

export class GameScreen extends Container {
  planes: Array<Plane>;

  constructor() {
    super();

    this.planes = new Array<Plane>();

    this.planes.push(new Plane());
  }
}
