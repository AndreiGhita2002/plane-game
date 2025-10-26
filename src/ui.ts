import {Container, TextStyle, HTMLText, Graphics} from "pixi.js";
import {FancyButton} from '@pixi/ui';
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

const defaultGraphics = new Graphics()
  .rect(0, 0, 200, 100)
  .fill('red');


const button = new FancyButton({
  defaultView: defaultGraphics,
  text: "Click to retry"
})

export class ScoreBoard extends Container {
  last_score: number;
  last_lives: number;
  text: HTMLText;
  first_time:boolean = true;
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
    if (Main.lives == 0 && this.first_time==true) {
      // todo add restart button

      this.addChild(button)
      // button.visible = true;
      console.log("HERE")
      button.onPress.connect(() => {
        Main.reset();
        this.removeChild(button)
        this.first_time = true;
      });
      // button.visible = false;
      // this.removeChild(button)
      this.first_time = false;
    }
  }

  constructor() {
    super();

    this.text = new HTMLText({
      text: "...",
      style: textStyle,
    });

    this.text.x = 10; //Top left
    this.text.y = 10;
    button.x = 600; //todo hardcode for presentation screen
    button.y = 200;

    this.last_score = 10; // set to a crazy value so it updates right away
    this.last_lives = 10;

    this.addChild(this.text);
    // button.visible = false;

  }
}