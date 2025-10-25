import {Application, Ticker} from 'pixi.js';
import { Plane } from "./Plane.ts";
import {Airport} from "./Airport.ts";
import {Map} from "./Map.ts";
import {airportLocations} from "./Airport-locations.ts";
import { sound } from '@pixi/sound';

// every how many frame(-ish) to spawn a new plane in
const NEW_PLANE_FREQUENCY = 100;
// max planes?
const MAX_NUMBER_OF_PLANES = 10;

export class Main {
  app: Application;
  planes: Plane[] = [];
  airports: Airport[] =[];
  // @ts-ignore
  map : Map; // shows error cause not initialised. Don't care :)
  new_plane_cum = 0;
  current_plane = 0;

  static selected_plane: Plane | null = null;

  constructor() {
    this.app = new Application()
  }

  async run() {
    // Preload assets
    await Plane.preload();
    await Airport.preload();
    await Map.preload();

    sound.add('background', '/sounds/background.mp3');
    waitAndPlay(7);

    const width = window.innerWidth;
    const height = window.innerHeight - 220;
    const container = document.getElementById("pixi-container");
    // Initialize the application.
    if(container){
      await this.app.init({ backgroundAlpha: 0.1, background: 'transparent',  width , height, resizeTo: container});
    }

    // Then adding the application's canvas to the DOM body.
    document.body.appendChild(this.app.canvas);
    this.addPlane()
    this.addAirport()
    this.addMap()

    // Add an animation loop callback to the application's ticker.
    this.app.ticker.add(t => this.mainLoop(t));

    // Move elements to accommodate for resize NOOOO
    // window.addEventListener("resize", () => {this.resize(window.innerWidth, (window.innerHeight * 0.9))});
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

  // todo LINK PLANES AND AIRPORTS

  addPlane() {

    // push to plane array
    let plane = new Plane(this.app.screen.width, this.app.screen.height, this.current_plane)
    this.planes.push(plane);
    // add to stage.
    this.app.stage.addChild(plane);
    if (this.current_plane == 7) {this.current_plane = 0}
    else {this.current_plane += 1;}
  }

  addAirport(){
    airportLocations(this.app.screen.width,this.app.screen.height).forEach((coord ) =>{
      let airport = new Airport(coord[0],coord[1], 0.1, Math.floor(Math.random() * 7));
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

function sleep(seconds: number) {
  return new Promise(resolve => setTimeout(resolve, seconds * 1000));
}

async function waitAndPlay(timeToWait: number) {
  await sleep(timeToWait);
  sound.play("background")
}

// Asynchronous IIFE
(async () => {
  // Create a PixiJS application.
  let main = new Main();
  await main.run();
})();
