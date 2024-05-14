import {Enemy} from "./enemy.js";
import {TILE_SIZE} from "../tile.js";

const piranhaImage = new Image();
piranhaImage.src = "./res/objects/piranha.png";


export class Piranha extends Enemy{

    // AttackPosX and Y need to be written as getter
    // otherwise they don't get updated with the update() method.
    get attackPosX() {
        return (this.x - this.width/4);
    }
    get attackPosY() {
        return (this.y - this.width/4);
    }
    rangeX = 1;
    rangeY = 1;
    damage = 5;
    cooldown = 250;

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

        // Attack
        let curTime = new Date().getTime();
        if((curTime - this.lastTime > this.cooldown) || this.lastTime === undefined) {
            this.enemyAttack(this.attackPosX, this.attackPosY, this.rangeX, this.rangeY, this.damage);
            this.lastTime = curTime;
        }
    }
}