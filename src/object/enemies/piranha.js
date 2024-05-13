import {Enemy} from "./enemy.js";
import {TILE_SIZE} from "../tile.js";

const piranhaImage = new Image();
piranhaImage.src = "./res/objects/piranha.png";


export class Piranha extends Enemy{

    constructor(x, y) {
        super(x, y, 9, 1, 1);
        this.count = 0;
        this.dir = 0;
        this.lastTime = 0;
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
        if(this.attackNow === undefined) {
            return;
        }
        if(this.attackNow) {
            let curTime = new Date().getTime();
            if((curTime - this.lastTime > 250) || this.lastTime === undefined) {
                this.setNotAttack();
                this.attack(this.player);
                this.lastTime = curTime;
            }
        }
    }

    attack(player) {
        player.takeDamage(5);
    }
}