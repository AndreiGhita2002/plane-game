import {Application, Ticker} from 'pixi.js';
import { Plane } from "./Plane.ts";
import {Airport} from "./Airport.ts";
import {Map} from "./Map.ts";
import {airportLocations} from "./Airport-locations.ts";

// every how many frame(-ish) to spawn a new plane in
const NEW_PLANE_FREQUENCY = 100;
// max planes?
const MAX_NUMBER_OF_PLANES = 10;

class Main {
  app: Application;
  planes: Plane[] = [];
  airports: Airport[] =[];
  map : Map; // shows error cause not initialised. Don't care :)
  new_plane_cum = 0;

  constructor() {
    this.app = new Application()
  }

  async run() {
    // Preload assets
    await Plane.preload();
    await Airport.preload();
    await Map.preload();

    const width = window.innerWidth;
    const height = window.innerHeight * 0.9;
    const container = document.getElementById("pixi-container");
    // Initialize the application.
    if(container){
      await this.app.init({ background: 'transparent',width , height, resizeTo: container});
    }

    // Then adding the application's canvas to the DOM body.
    document.body.appendChild(this.app.canvas);
    this.addPlane()
    this.addAirport()
    this.addMap()

    // Add an animation loop callback to the application's ticker.
    this.app.ticker.add(t => this.mainLoop(t));

    // Move elements to accommodate for resize
    window.addEventListener("resize", () => {this.resize(window.innerWidth, (window.innerHeight * 0.9))});
  }

  mainLoop(time: Ticker) {
    // New planes
    this.new_plane_cum += time.deltaTime;
    if (this.new_plane_cum > NEW_PLANE_FREQUENCY) {
      // reset new plane cum
      this.new_plane_cum = 0;
      // only spawn the new plane if max number has not been reached
      if (this.planes.length < MAX_NUMBER_OF_PLANES) {
        this.addPlane();
      }
    }

    // Plane update and deletions
    this.planes.forEach((plane) => plane.update(time))
    this.planes = this.planes.filter((p) => !p.to_delete);
  }

  addPlane() {
    // push to plane array
    let plane = new Plane(this.app.screen.width, this.app.screen.height)
    this.planes.push(plane);
    // add to stage.
    this.app.stage.addChild(plane);
  }

  addAirport(){
    airportLocations(this.app.screen.width,this.app.screen.height).forEach((coord ) =>{
      let airport = new Airport(coord[0],coord[1], 0.5);
      this.airports.push(airport)
      this.app.stage.addChild(airport);
    })
  }

  addMap(){
    let map = new Map(0,0,this.app.screen.width,this.app.screen.height);
    this.map = map;
    this.app.stage.addChildAt(map,0);
  }

  // todo call this from somewhere
  resize(new_width: number, new_height: number) {
    //this.planes.forEach((p) => p.resize(new_width, new_height));
    const coords = airportLocations(new_width,new_height);
    this.airports.forEach((value, index) => value.position.set(coords[index][0], coords[index][1]));
  }
}

// Asynchronous IIFE
(async () => {
  // Create a PixiJS application.
  let main = new Main();
  await main.run();
})();
