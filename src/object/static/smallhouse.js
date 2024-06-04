import {STONE_FLOOR_TILE, TILE_SIZE} from "../tile.js";
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

    doesCollide(tile, world){
        let bool = false;
        for (let x = 0; x < this.width; x++) {//checking if colliding for every tile under the house
            for (let y = 0; y < this.height; y++) {
                const tile = world.getTile(this.x + x, this.y + y);
                if (tile == null || tile.solid || tile.fluid || tile === STONE_FLOOR_TILE ) {
                    bool = true;
                }
            }
        }
        return bool;
    }

    get height(){
        return 3;
    }

    get width(){
       return 4;
    }
}