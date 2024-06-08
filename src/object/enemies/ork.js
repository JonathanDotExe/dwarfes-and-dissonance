import { TILE_SIZE } from "../tile.js";
import {Enemy} from "./enemy.js";

const orkImage = new Image();
orkImage.src = "/res/objects/ork.png";

export class Ork extends Enemy {


    constructor(x, y) {
        super(x, y, 50, 1.5);
        this.count = 0;
        this.dir = 0;
        this.lastTime = 0;
    }

    get energyScore() {
        return 2;
    }

    get killScore() {
        return 80;
    }

    get cooldown() {
        return 700;
    }

    get damage() {
        return 20;
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

    get width() {
        return 2;
    }

    enemyAttack(attackX, attackY, rangeX, rangeY, damage) {
        // Attack player if on Enemy
        // Range of enemy is his postion plus half his hitbox in each direction, aka. half the player
        let creatures = this.world.getObjectsInArea(attackX, attackY, rangeX, rangeY);

        creatures.forEach((obj) => {
            if(this.isTarget(obj)) {
                obj.takeDamage(damage);
                obj.overwriteForce(this._direction.x * 12, this._direction.y * 12);
            }
        })
    }
}