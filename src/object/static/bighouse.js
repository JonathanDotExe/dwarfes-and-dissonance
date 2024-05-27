import {TILE_SIZE} from "../tile.js";
import {GameObject} from "../gameobject.js";

const bigHouse = new Image();
bigHouse.src = "/res/objects/house_big.png";

export class Bighouse extends GameObject {

    constructor(x, y) {
        super(x, y);
    }

    draw(camX, camY, ctx) {
        ctx.drawImage(bigHouse, (this.x - camX) * TILE_SIZE, (this.y - camY) * TILE_SIZE);
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