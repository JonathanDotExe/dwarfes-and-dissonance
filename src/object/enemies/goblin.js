import { TILE_SIZE } from "../tile.js";
import {Enemy} from "./enemy.js";
import {Player} from "../player.js";

const goblinImage = new Image();
goblinImage.src = "/res/objects/goblin.png";

export class Goblin extends Enemy {

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
    damage = 10;
    cooldown = 500;
    targetRange = 10;

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

        let attackFlag = false;
        let playerX ;
        let playerY ;

        let creatures = this.world.getObjectsInArea(this.x - (this.targetRange/2), this.y - (this.targetRange/2), this.targetRange, this.targetRange);
        creatures.forEach((obj) => {
            if(obj instanceof Player) {
                playerX = obj.x;
                playerY = obj.y;
                attackFlag = true;
            }
        })

        if(attackFlag) {
            // chase Player
            // Move towards the closest of 8 directions to player
            let xMove = 0;
            let yMove = 0;

            let diffMoveX = 0;
            let diffX = this.x - playerX;
            if(diffX < 0) {
                diffX = diffX * (-1);
            }
            // Set player one width to the left
            // Make value positive
            // If Different smaller than difference without moving -> enemy is to the left
            // If Different bigger than difference without moving -> enemy is to the right
            diffMoveX = (this.x - 1) - playerX;
            if(diffMoveX < 0) {
                diffMoveX = diffMoveX * (-1);
            }
            if(diffMoveX < diffX) {
                xMove = -(this.speed);
            } else if(diffMoveX > diffX) {
                xMove = this.speed;
            }

            let diffMoveY = 0;
            let diffY = this.y - playerY;
            if(diffY < 0) {
                diffY = diffY * (-1);
            }
            // Same for height Differenz
            // If Different smaller than difference without moving -> enemy is higher
            // If Different bigger than difference without moving -> enemy is lower
            diffMoveY = (this.y - 1) - playerY;
            if(diffMoveY < 0) {
                diffMoveY = diffMoveY * (-1);
            }
            if(diffMoveY < diffY) {
                yMove = -(this.speed);
            } else if(diffMoveY > diffY) {
                yMove = this.speed;
            }

            // if both are set, movement is gonna be diaganolly so next to recalculated
            if(xMove !== 0 && yMove !== 0) {
                let diagonal = Math.sqrt(2 * this.speed * this.speed) / 2;
                if (xMove > 0) {
                    xMove = diagonal;
                } else {
                    xMove = -(diagonal);
                }

                if (yMove > 0) {
                    yMove = diagonal;
                } else {
                    yMove = -(diagonal);
                }
            }
            this.move(xMove, yMove, deltaTime);

        } else {
            // Random Movement
            this.moveRand(deltaTime);
        }
        attackFlag = false;

        // Attack
        let curTime = new Date().getTime();
        if((curTime - this.lastTime > this.cooldown) || this.lastTime === undefined) {
            this.enemyAttack(this.attackPosX, this.attackPosY, this.rangeX, this.rangeY, this.damage);
            this.lastTime = curTime;
        }
    }
}