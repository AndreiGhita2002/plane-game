import {Application, Ticker} from 'pixi.js';
import { Plane } from "./Plane.ts";
import {Airport} from "./Airport.ts";
import {Map} from "./Map.ts";
import {airportLocations} from "./Airport-locations.ts";
import { sound } from '@pixi/sound';
import {ScoreBoard} from "./ui.ts";

// every how many frame(-ish) to spawn a new plane in
const NEW_PLANE_FREQUENCY = 100;
// max planes?
const MAX_NUMBER_OF_PLANES = 7;

export class Main {
  app: Application;
  static planes: Plane[] = [];
  static airports: Airport[] = [];
  // @ts-ignore
  map : Map; // shows error cause not initialised. Don't care :)
  new_plane_cum = 0;
  current_plane = 0;
  scoreBoard: ScoreBoard = new ScoreBoard();
  static score: number = 0;
  static lives: number = 3;

  static selected_plane: Plane | null = null;

  constructor() {
    this.app = new Application()
  }

  async run() {
    // Preload assets
    await Plane.preload();
    await Airport.preload();
    await Map.preload();

    sound.add('firstflight', '/sounds/first_plane.mp3');
    sound.add('takeoff', '/sounds/takeoff.mp3');
    sound.add('background', '/sounds/background.mp3');
    waitAndPlay(7);
    sound.play('firstflight');
    sound.play('takeoff', {volume: 0.3});

    const width = window.innerWidth;
    const height = window.innerHeight - 200;
    const container = document.getElementById("pixi-container");
    // Initialize the application.
    if(container){
      await this.app.init({ backgroundAlpha: 0.1, background: 'transparent',  width , height, resizeTo: container});
    }

    // Then adding the application's canvas to the DOM body.
    document.body.appendChild(this.app.canvas);
    this.addMap()
    this.addAirports()
    this.addPlane()
    this.app.stage.addChild(this.scoreBoard);

    this.app.stage.sortableChildren = true;

    // Add an animation loop callback to the application's ticker.
    this.app.ticker.add(t => this.mainLoop(t));

    // Move elements to accommodate for resize NOOOO
    // window.addEventListener("resize", () => {this.resize(window.innerWidth, (window.innerHeight * 0.9))});
  }

  mainLoop(time: Ticker) {
    if (Main.lives > 0) { //Game plays
      // New planes
      this.new_plane_cum += time.deltaTime;
      if (this.new_plane_cum > NEW_PLANE_FREQUENCY) {
        // reset new plane cum
        this.new_plane_cum = 0;
        // only spawn the new plane if max number has not been reached
        if (Main.planes.length < MAX_NUMBER_OF_PLANES - 1) {
          this.addPlane();
        }
      }

      // Plane update and deletions
      Main.planes.forEach((plane) => plane.update(time))
      Main.planes = Main.planes.filter((p) => !p.to_delete);

      // UI updates
      this.scoreBoard.update();
    } else { // You lose
      // // todo add ui and wait
      // console.log("You lose");
      // // Main.lives = 3;
      // // Main.score = 0;
    }
  }

  // todo LINK PLANES AND AIRPORTS

  addPlane() {
    // push to plane array
    let plane = new Plane(this.app.screen.width + 40, this.app.screen.height + 40, this.current_plane)
    Main.planes.push(plane);
    // add to stage.
    this.app.stage.addChild(plane);
    if (this.current_plane == 6) {this.current_plane = 0} // holy hard-coding
    else {this.current_plane += 1;}
  }

  addAirports(){
    let current_airport: number = 0;
    airportLocations(this.app.screen.width,this.app.screen.height).forEach((coord ) => {
      let airport = new Airport(coord[0],coord[1], 0.1, current_airport);
      Main.airports.push(airport)
      this.app.stage.addChild(airport);
      current_airport += 1;
    })
  }

  addMap(){
    this.map = new Map(0,0,this.app.screen.width,this.app.screen.height);
    this.app.stage.addChildAt(this.map, 0);
  }

  static reset(){
    this.lives = 3;
    this.score = 0;
    this.planes.forEach((p) => p.destroy())
    this.planes = [];
    // todo clear all current planes
  }

  // todo call this from somewhere
  resize(new_width: number, new_height: number) {
    //this.planes.forEach((p) => p.resize(new_width, new_height));
    const coords = airportLocations(new_width,new_height);
    Main.airports.forEach((value, index) => value.position.set(coords[index][0], coords[index][1]));
  }
}

function sleep(seconds: number) {
  return new Promise(resolve => setTimeout(resolve, seconds * 1000));
}

async function waitAndPlay(timeToWait: number) {
  await sleep(timeToWait);
  sound.play("background", {loop: true});
}

// Asynchronous IIFE
(async () => {
  // Create a PixiJS application.
  let main = new Main();
  await main.run();
})();
