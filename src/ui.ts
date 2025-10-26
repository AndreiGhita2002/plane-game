import {Container, TextStyle, HTMLText} from "pixi.js";
import {Main} from "./main.ts";

const textStyle = new TextStyle({ // TODO Make scoreboard style pretty
  fontFamily: 'Helvetica',
  fontSize: '36px',
  fill: '#ffffff',
  stroke: {
    color: `#000000`,
    width: 4,
  },
  dropShadow: {
    color: '#000000',
    blur: 5,
    distance: 3,
    angle: 2 * Math.PI / 3,
    alpha: 0.5,
  },
});

export class ScoreBoard extends Container {
  last_score: number;
  last_lives: number;
  text: HTMLText;

  update() {
    // only update the text if required
    if (this.last_score != Main.score || this.last_lives != Main.lives) {
      // update values
      this.last_score = Main.score;
      this.last_lives = Main.lives;
      // Line showing how many lives are left
      let live_str = "...";
      if (Main.lives > 0) {
        live_str = "✈ ".repeat(Main.lives);
      }
      // Redraw text
      this.text.text = `Score: ${Main.score}<br><span> ${live_str} </span>`;
    }
  }

  constructor() {
    super();
    this.x = 10; //Top left
    this.y = 10;

    this.last_score = 10; // set to a crazy value so it updates right away
    this.last_lives = 10;
    this.text = new HTMLText({
      text: "...",
      style: textStyle,
    });
    this.addChild(this.text);
  }
}