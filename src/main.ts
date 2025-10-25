import {Application, Ticker} from 'pixi.js';
import { Plane } from "./Plane.ts";
import {Airport} from "./Airport.ts";
import {airportLocations} from "./Airport-locations.ts";

// every how many frame(-ish) to spawn a new plane in
const NEW_PLANE_FREQUENCY = 100;
// max planes?
const MAX_NUMBER_OF_PLAINS = 10;

class Main {
  app: Application;
  planes: Plane[] = [];
  airports: Airport[] =[];

  new_plane_cum = 0;

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
    this.addAirport()

    // Add an animation loop callback to the application's ticker.
    this.app.ticker.add(t => this.mainLoop(t));
  }

  mainLoop(time: Ticker) {
    // New planes
    this.new_plane_cum += time.deltaTime;
    if (this.new_plane_cum > NEW_PLANE_FREQUENCY) {
      // reset new plane cum
      this.new_plane_cum = 0;
      // only spawn the new plane if max number has not been reached
      if (this.planes.length < MAX_NUMBER_OF_PLAINS) {
        this.addPlane()
      }
    }

    // Plane update
    this.planes.forEach((p) => p.update(time));
  }

  addPlane() {
    // push to plane array
    let plane = new Plane(this.app.screen.width, this.app.screen.height)
    this.planes.push(plane);
    // add to stage.
    this.app.stage.addChild(plane);
  }
  addAirport(){
    airportLocations(screen.width,screen.height).forEach((coord ) =>{
      let airport = new Airport(coord[0],coord[1], 0.5);
      this.airports.push(airport)
      this.app.stage.addChild(airport);
    })
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
