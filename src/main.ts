import {Application, Ticker, RenderLayer} from 'pixi.js';
import { Plane } from "./Plane.ts";
import {Airport} from "./Airport.ts";
import {airportLocations} from "./Airport-locations.ts";

// every how many frame(-ish) to spawn a new plane in
const NEW_PLANE_FREQUENCY = 100;
// max planes?
const MAX_NUMBER_OF_PLAINS = 10;

let foregroundLayer = new RenderLayer();

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

    const height = window.innerHeight - 160;
    // Initialize the application.
    await this.app.init({ background: '#1099bb', resizeTo: window });

    // Then adding the application's canvas to the DOM body.
    document.body.appendChild(this.app.canvas);
    this.app.stage.addChild(foregroundLayer);

    this.addPlane(foregroundLayer, 1);
    this.addAirport(foregroundLayer, 0);

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
        this.addPlane(foregroundLayer, 1)
      }
    }

    // Plane update and deletions
    this.planes.forEach((plane) => plane.update(time))
    this.planes = this.planes.filter((p) => !p.to_delete);
  }

  addPlane(layer : RenderLayer, zindex: number) {
    // push to plane array
    let plane = new Plane(this.app.screen.width, this.app.screen.height)
    this.planes.push(plane);
    // add to stage.
    layer.addChildAt(plane,zindex);
  }
  addAirport(layer: RenderLayer, zindex: number){
    airportLocations(screen.width,screen.height).forEach((coord ) =>{
      let airport = new Airport(coord[0],coord[1], 0.5);
      this.airports.push(airport)
      layer.addChildAt(airport, zindex);
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
  await main.run();
})();
