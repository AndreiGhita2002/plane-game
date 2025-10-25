import {Texture, Assets, Sprite } from "pixi.js"

export class Map extends Sprite{
    static mapTexture: Texture;

    static async preload(){
        //@ts-ignore
        Map.mapTexture = await Assets.load("sprite/Map.svg", {resolution: 4});
    }

    constructor(x : number, y : number, width: number, height: number){
        super(Map.mapTexture);
        this.position.set(x, y);
        this.scale.set(1);
        this.width = width;
        this.height = height;
    }
}