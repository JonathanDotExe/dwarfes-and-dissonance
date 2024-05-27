import {Enemy} from "./enemy.js";
import {TILE_SIZE} from "../tile.js";

const piranhaImage = new Image();
piranhaImage.src = "./res/objects/piranha.png";


export class Piranha extends Enemy{

    constructor(x, y) {
        super(x, y, 9, 1);
    }

    draw(camX, camY, ctx) {
        ctx.drawImage(piranhaImage, (this.x - camX) * TILE_SIZE, (this.y - camY) * TILE_SIZE);
        super.draw(camX, camY, ctx);
    }

    doesCollide(tile) {
        return  tile == null || !tile.fluid;
    }

    update(deltaTime, env) {
        super.update(deltaTime, env);
    }
}