import {Assets, Sprite, Texture} from 'pixi.js';
import {Main} from "./main.ts";

export class Airport extends Sprite {

    static airport_texture : Texture;
    static async preload(){
      // @ts-ignore
      Airport.airport_texture = await Assets.load("sprite/airport.svg", {resolution: 4});
    }
    constructor(x: number, y: number, scale:number){
       super(Airport.airport_texture);
       this.scale.set(scale)
       this.position.set(x,y)

      // Adding listeners
      this.eventMode = "dynamic";
      this.cursor = "pointer";

      this.onpointerup = (_event) => {
        if (Main.selected_plane && !Main.selected_plane.destroyed) {
          // todo if plane and airport match
          console.log("Plane is released!")

          Main.selected_plane.change_path(this.x, this.y);
          Main.selected_plane = null;
        } else {
          console.log(" released on airport without plane!")
        }
      };
    }

}
