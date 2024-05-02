import { LivingObject } from "./livingobject.js";
import { TILE_SIZE } from "./tile.js";

const goblinImage = new Image();
goblinImage.src = "/res/objects/goblin.png";

export class Goblin extends LivingObject {

    constructor(x, y) {
        super(x, y, 25);
        this.count = 0;
        this.dir = 0;
    }

    update(deltaTime, env) {
        super.update(deltaTime, env);
        let xMotion = 0;
        let yMotion = 0;

        while (this.count >= 1) {
            this.count -= 1;
            this.dir = Math.floor(Math.random() * 4);
        }
        switch(this.dir) {
            case 0:
                xMotion = 4;
                break;
            case 1:
                yMotion = 4;
                break;
            case 2:
                xMotion = -4;
                break;
            case 3:
                yMotion = -4;
                break;
        }
        this.count += deltaTime
        this.move(xMotion, yMotion, deltaTime);
    }

    draw(camX, camY, ctx) {
        ctx.drawImage(goblinImage, (this.x - camX) * TILE_SIZE, (this.y - camY) * TILE_SIZE);
        super.draw(camX, camY, ctx);
    }

}