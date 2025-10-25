import { Application } from 'pixi.js';
import {Plane} from "./Plane.ts";

// Asynchronous IIFE
(async () => {
  // Create a PixiJS application.
  const app = new Application();

  // Preload assets
  await Plane.preload();

  // Initialize the application.
  await app.init({ background: '#1099bb', resizeTo: window });

  // Then adding the application's canvas to the DOM body.
  document.body.appendChild(app.canvas);

  // Create a new Sprite from an image path.
  const plane = new Plane(app.screen.width / 2, app.screen.height / 2);

  // Add to stage.
  app.stage.addChild(plane);

  // Add an animation loop callback to the application's ticker.
  app.ticker.add((time) => {
    /**
     * Just for fun, let's rotate mr rabbit a little.
     * Time is a Ticker object which holds time related data.
     * Here we use deltaTime, which is the time elapsed between the frame callbacks
     * to create frame-independent transformation. Keeping the speed consistent.
     */
    plane.rotation += 0.1 * time.deltaTime;
  });
})();
