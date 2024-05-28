import {LivingObject} from "../livingobject.js";
import {Player} from "../player.js";

export class Enemy extends LivingObject {

    constructor(x, y, maxHealth, speed) {
        super(x, y);
        this._maxHealth = maxHealth;
        this._health = maxHealth;
        this._speed = speed;
        this._target = null;
        this._direction = {x: 0, y: 1}
        this.count = 0;
        this.dir = 0;
        this.lastTime = 0;
    }

    get range(){
        return this._range;
    }

    get speed(){
        return this._speed;
    }

    get targetRange() {
        return 20;
    }

    get cooldown() {
        return 500;
    }

    get damage() {
        return 10;
    }

    get rangeX() {
        return 1;
    }

    get rangeY() {
        return 1;
    }

    // AttackPosX and Y need to be written as getter
    // otherwise they don't get updated with the update() method.
    get attackPosX() {
        return (this.x - this.width/4);
    }
    get attackPosY() {
        return (this.y - this.width/4);
    }

    update(deltaTime, env) {
        super.update(deltaTime, env);
        //Random count
        while (this.count >= 1) {
            this.count -= 1;
            this.dir = Math.floor(Math.random() * 8);
        }
        this.count += deltaTime
        //Find target
        let creatures = this.world.getObjectsInArea(this.x - (this.targetRange/2), this.y - (this.targetRange/2), this.targetRange, this.targetRange);
        if (!(this._target in creatures)) { //Reset target
            this._target = null;
        }
        creatures.forEach((obj) => {
            if(this.isTarget(obj)) {
                this._target = obj;
            }
        })
        //Move
        const motion = this.getMovement();
        this.move(motion.x * this.speed, motion.y * this.speed, deltaTime);
        if (motion.x != 0 || motion.y != 0) {
            this._direction = motion;
        }
        //Attack
        let curTime = new Date().getTime();
        if((curTime - this.lastTime > this.cooldown) || this.lastTime === undefined) {
            this.enemyAttack(this.attackPosX, this.attackPosY, this.rangeX, this.rangeY, this.damage);
            this.lastTime = curTime;
        }
    }

    getMovement() {
        if (this._target != null) {
            return this.moveAttack(this._target);
        }
        return this.moveRand();
    }

    moveRand(){
        let xMotion = 0;
        let yMotion = 0;

        switch(this.dir) {
            case 0: // up
                yMotion = -1;
                break;
            case 1: // right
                xMotion = 1;
                break;
            case 2: // down
                yMotion = 1;
                break;
            case 3: // left
                xMotion = -1;
                break;
            case 4: // up right
                xMotion = 1/Math.sqrt(2);
                yMotion = -1/Math.sqrt(2);
                break;
            case 5: // down right
                xMotion = 1/Math.sqrt(2);
                yMotion = 1/Math.sqrt(2);
                break;
            case 6: // down left
                xMotion = -1/Math.sqrt(2);
                yMotion = 1/Math.sqrt(2);
                break;
            case 7: // up left
                xMotion = -1/Math.sqrt(2);
                yMotion = -1/Math.sqrt(2);
                break;

        }
        return { x: xMotion, y: yMotion};
    }

    moveAttack(target) {
        let dir;
        let diagonal = 1/Math.sqrt(2);

        const graceArea = 2;

        const playerX = target.x;
        const playerY = target.y;

        const playerXLeft = playerX - graceArea;
        const playerXRight = playerX + graceArea;
        const playerYUp = playerY - graceArea;
        const playerYDown = playerY + graceArea;

        // Inside X Grace Area
        if(this.x >= playerXLeft && this.x <= playerXRight) {
            // Inside Y Grace Area
            if(this.y >= playerYUp && this.y <= playerYDown) {
                // Check shortest direction
                dir = this.shortestDiag(diagonal, playerX, playerY);
            } else {
                // Outside of Y Grace Area
                // Move up or down
                if(this.y > playerY) {
                    // Enemy under player
                    dir = {x: 0, y: -1};
                } else {
                    // Enemy over player
                    dir = {x: 0, y: 1};
                }
            }
        } else {
            // Outside of X Grace Area
            // Inside Y Grace Area
            if(this.y >= playerYUp && this.y <= playerYDown) {
                // Move left or right
                if(this.x > playerX) {
                    // Enemy right from player
                    dir = {x: -1, y: 0};
                } else {
                    // Enemy left from player
                    dir = {x: 1, y: 0};
                }
            } else {
                // Outside of all grace Areas
                dir = this.shortestDiag(diagonal, playerX, playerY);
            }
        }

        return dir;
    }

    shortestDiag(diagonal, playerX, playerY) {
        let dir;
        if(this.x > playerX && this.y > playerY) {
            // Enemy right down from player
            dir = {x: -diagonal, y: -diagonal}
        } else if (this.x > playerX && this.y < playerY) {
            // Enemy right up from player
            dir = {x: -diagonal, y: diagonal}
        } else if (this.x < playerX && this.y < playerY) {
            // Enemy left up from player
            dir = {x: diagonal, y: diagonal}
        } else {
            // Enemy left down from player
            dir = {x: diagonal, y: -diagonal}
        }
        return dir;
    }
    
    isTarget(obj) {
        return obj instanceof Player;
    }

    enemyAttack(attackX, attackY, rangeX, rangeY, damage) {
        // Attack player if on Enemy
        // Range of enemy is his postion plus half his hitbox in each direction, aka. half the player
        let creatures = this.world.getObjectsInArea(attackX, attackY, rangeX, rangeY);

        creatures.forEach((obj) => {
            if(this.isTarget(obj)) {
                obj.takeDamage(damage);
                obj.applyForce(this._direction.x * 8, this._direction.y * 8);
            }
        })
    }
}