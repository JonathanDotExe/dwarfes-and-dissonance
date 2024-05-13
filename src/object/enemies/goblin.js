import { TILE_SIZE } from "../tile.js";
import {Enemy} from "./enemy.js";

const goblinImage = new Image();
goblinImage.src = "/res/objects/goblin.png";

export class Goblin extends Enemy {

    constructor(x, y) {
        super(x, y, 25, 2, 2);
        this.count = 0;
        this.dir = 0;
        this.lastTime = 0;
    }

    draw(camX, camY, ctx) {
        ctx.drawImage(goblinImage, (this.x - camX) * TILE_SIZE, (this.y - camY) * TILE_SIZE);
        super.draw(camX, camY, ctx);
    }

    update(deltaTime, env) {
        super.update(deltaTime, env);
        if(this.attackNow === undefined) {
            return;
        }
        if(this.attackNow) {
            let curTime = new Date().getTime();
            if((curTime - this.lastTime > 500) || this.lastTime === undefined) {
                this.setNotAttack();
                this.attack(this.player);
                this.lastTime = curTime;
            }
        }
    }

    attack(player) {
        player.takeDamage(10);
    }
}