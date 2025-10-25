import {Assets, Sprite, Texture} from 'pixi.js';

class Airport extends Sprite{

    static airportTexture : Texture;

    constructor(){
       super(Airport.airportTexture);
    }

}