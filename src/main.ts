import { Application } from 'pixi.js';
import { Plane } from "./Plane.ts";

class Main {
  app: Application;
  planes: Plane[] = [];

  constructor() {
    this.app = new Application()
  }

  async run() {
    // Preload assets
    await Plane.preload();

    // Initialize the application.
    await this.app.init({ background: '#1099bb', resizeTo: window });

    // Then adding the application's canvas to the DOM body.
    document.body.appendChild(this.app.canvas);

    this.addPlane()

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
