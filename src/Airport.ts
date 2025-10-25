import {Assets, Sprite, Texture} from 'pixi.js';
import {Main} from "./main.ts";

export class Airport extends Sprite {
    static airport_textures : Texture[];

    colour: number;

    static async preload() {
      // @ts-ignore
      Airport.airport_textures = new Array<Texture>(7);
        // load assets
        for (let i = 0; i < 7; i++) {
            Airport.airport_textures[i] = await Assets.load(`/sprite/airports/${i}.svg`);
        }
    }
    constructor(x: number, y: number, scale:number, color: number){
       super(Airport.airport_textures[color]);
       this.colour = color;
       this.scale.set(scale);
       this.position.set(x,y);
       this.anchor.set(0.5);

      // Adding listeners
      this.eventMode = "dynamic";
      this.cursor = "pointer";

      this.onpointerup = (_event) => {
        if (Main.selected_plane && !Main.selected_plane.destroyed) {
          if (this.colour != Main.selected_plane.colour) {
            // Not a match!
            Main.selected_plane = null;
            return;
          }

          Main.selected_plane.change_path(this.x, this.y);
          Main.selected_plane = null;
        } else {
          console.log(" released on airport without plane!")
        }
      };
    }

}
