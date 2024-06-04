import { TILE_SIZE } from "../tile.js";
import {Enemy} from "./enemy.js";

const flyingeyeImage = new Image();
flyingeyeImage.src = "/res/objects/flying_eye.png";

export class Flyingeye extends Enemy {

    rangeX = 2;
    rangeY = 2;
    damage = 30;
    cooldown = 1000;

    constructor(x, y) {
        super(x, y, 100, 2);
        this.count = 0;
        this.dir = 0;
        this.lastTime = 0;
    }

    draw(camX, camY, ctx) {
        ctx.drawImage(flyingeyeImage, (this.x - camX) * TILE_SIZE, (this.y - camY) * TILE_SIZE);
        super.draw(camX, camY, ctx);
    }

    update(deltaTime, env) {
        super.update(deltaTime, env);
    }

    get height(){
        return 3;
    }

    get width(){
        return 3;
    }
}