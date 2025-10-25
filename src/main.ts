import { Application } from 'pixi.js';
import { Plane } from "./Plane.ts";
import {Airport} from "./Airport.ts";

class Main {
  app: Application;
  planes: Plane[] = [];
  airports: Airport[] =[];

  constructor() {
    this.app = new Application()
  }

  async run() {
    // Preload assets
    await Plane.preload();
    await Airport.preload();

    // Initialize the application.
    await this.app.init({ background: '#1099bb', resizeTo: window });

    // Then adding the application's canvas to the DOM body.
    document.body.appendChild(this.app.canvas);

    this.addPlane()
    //this.addAirport()

    // Add an animation loop callback to the application's ticker.
    this.app.ticker.add((time) => {
      this.planes.forEach((p) => p.update(time));
    });
  }

  addPlane() {
    // push to plane array
    let plane = new Plane(this.app.screen.width, this.app.screen.height)
    this.planes.push(plane);
    // add to stage.
    this.app.stage.addChild(plane);
  }
  addAirport(){
    const screen_bounds_max : number[] = [this.app.screen.width, this.app.screen.height];
    const screen_bounds_min : number[] = [0,0]
    const getRandom = (min : number, max : number):number =>{
      return Math.random() * (max-min) + min;
    }

    const location : number[] = [getRandom(screen_bounds_min[0], screen_bounds_max[0]), getRandom(screen_bounds_min[1], screen_bounds_max[1])];
    let airport = new Airport(location[0],location[1]);
    this.airports.push(airport)
    this.app.stage.addChild(airport);
  }
  // todo call this from somewhere
  resize(new_width: number, new_height: number) {
    this.planes.forEach((p) => p.resize(new_width, new_height));
  }
}

// Asynchronous IIFE
(async () => {
  // Create a PixiJS application.
  let main = new Main();
  main.run();
})();
