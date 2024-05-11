import { TILE_SIZE } from "../tile.js";
import {Enemy} from "./enemy.js";

const goblinImage = new Image();
goblinImage.src = "/res/objects/goblin.png";

export class Goblin extends Enemy {

    constructor(x, y) {
        super(x, y, 25, 2, 2);
        this.count = 0;
        this.dir = 0;
    }

    draw(camX, camY, ctx) {
        ctx.drawImage(goblinImage, (this.x - camX) * TILE_SIZE, (this.y - camY) * TILE_SIZE);
        super.draw(camX, camY, ctx);
    }

}