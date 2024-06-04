import { TILE_SIZE } from "../tile.js";
import {Enemy} from "./enemy.js";

const orkImage = new Image();
orkImage.src = "/res/objects/ork.png";

export class Ork extends Enemy {

    rangeX = 1;
    rangeY = 1;
    damage = 20;
    cooldown = 700;

    constructor(x, y) {
        super(x, y, 50, 1);
        this.count = 0;
        this.dir = 0;
        this.lastTime = 0;
    }

    draw(camX, camY, ctx) {
        ctx.drawImage(orkImage, (this.x - camX) * TILE_SIZE, (this.y - camY) * TILE_SIZE);
        super.draw(camX, camY, ctx);
    }

    update(deltaTime, env) {
        super.update(deltaTime, env);
    }

    get height(){
        return 2;
    }
}