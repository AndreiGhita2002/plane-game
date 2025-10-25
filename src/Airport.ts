import {Assets, Sprite, Texture} from 'pixi.js';

export class Airport extends Sprite{

    static airport_texture : Texture;
    static async preload(){
        Airport.airport_texture= await Assets.load({src : "sprite/airport.svg"});
    }
    constructor(x: number, y: number, scale:number){
       super(Airport.airport_texture);
       this.scale.set(scale)
       this.position.set(x,y)
    }

}
