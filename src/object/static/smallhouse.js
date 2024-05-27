import {TILE_SIZE} from "../tile.js";
import {GameObject} from "../gameobject.js";


const smallHouse = new Image();
smallHouse.src = "/res/objects/house_small.png";

export class Smallhouse extends GameObject{
    constructor(x,y){
        super(x, y);
        this.random = Math.random();
    }

    draw(camX, camY, ctx) {
        ctx.drawImage(smallHouse, (this.x - camX) * TILE_SIZE, (this.y - camY) * TILE_SIZE);
        super.draw(camX, camY, ctx);
    }

    get solid() {
        return true;
    }

    get height(){
        return 3;
    }

    get width(){
       return 4;
    }
}