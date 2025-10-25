import {Assets, Sprite, Texture} from 'pixi.js';

export class Airport extends Sprite{

    static airport_texture : Texture;
    static async preload(){
        Airport.airport_texture = await Assets.load("~/sprite/airport.svg");
    }
    constructor(x: number, y: number){
       super(Airport.airport_texture);
       this.position.set(x,y)

    }

}
