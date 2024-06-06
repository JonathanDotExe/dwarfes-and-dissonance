import { Enemy } from "../enemies/enemy.js";
import {LivingObject} from "../livingobject.js";
import {TILE_SIZE} from "../tile.js";

const bearImage = new Image();
bearImage.src = "/res/objects/bear.png";

export class Bear extends LivingObject{

    constructor(x,y) {
        super(x,y, 30);
    }

    update(deltaTime, env) {
        super.update(deltaTime, env);
        //Kill all
        if (this.xMotion != 0 || this.yMotion != 0) {
            for (let obj of this.world.getObjectsInArea(this.x, this.y, this.width, this.height)) {
                if (obj instanceof Enemy) {
                    obj.takeDamage(obj.health);
                }
            }
        }
    }

    draw(camX, camY, ctx) {
        ctx.drawImage(bearImage, (this.x - camX) * TILE_SIZE, (this.y - camY) * TILE_SIZE);
        super.draw(camX, camY, ctx);
    }

    get solid() {
        return true;
    }

    takeDamage(damage) {
        return false;
    }

    applyForce(forceX, forceY) {
        super.applyForce(forceX * 2, forceY * 2)
    }

    overwriteForce(forceX, forceY) {
        super.overwriteForce(forceX * 2, forceY * 2)
    }

}