import {Texture, Assets, Sprite } from "pixi.js"

export class Map extends Sprite{
    static mapTexture: Texture;

    static async preload(){
        Map.mapTexture = await Assets.load("/sprite/Map.svg")
    }

    constructor(x : number, y : number, width: number, height: number){
        super(Map.mapTexture);
        this.position.set(x, y);
        this.width = width;
        this.height = height;
        this.zIndex = 0;
    }
}