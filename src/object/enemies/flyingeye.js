import {CaveTile, STONE_FLOOR_TILE, TILE_SIZE} from "../tile.js";
import {Enemy} from "./enemy.js";
import {LivingObject} from "../livingobject.js";
import {Tree} from "../static/tree.js";

const flyingeyeImage = new Image();
flyingeyeImage.src = "/res/objects/flying_eye.png";

export class Flyingeye extends Enemy {

    constructor(x, y) {
        super(x, y, 100, 2);
        this.count = 0;
        this.dir = 0;
        this.lastTime = 0;
    }

    get energyScore() {
        return 3;
    }

    get killScore() {
        return 100;
    }

    get cooldown() {
        return 1000;
    }

    get damage() {
        return 30;
    }

    get rangeX() {
        return 1;
    }

    get rangeY() {
        return 1;
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

    doesCollide(tile) {
        return tile == null || tile.solid || tile === STONE_FLOOR_TILE;
    }

    doesCollideObject(obj) {
        if(obj instanceof Tree){
            return !obj.solid;
        }
        return false;
    }

}