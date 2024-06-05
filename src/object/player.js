import { LivingObject } from "./livingobject.js";
import { TILE_SIZE } from "./tile.js";

const playerFront = new Image();
playerFront.src = "/res/objects/player_front_knife.png";

const playerBack = new Image();
playerBack.src = "/res/objects/player_back_knife.png";

const playerLeft = new Image();
playerLeft.src = "/res/objects/player_left_knife.png";

const playerRight = new Image();
playerRight.src = "/res/objects/player_right_knife.png";

export class Player extends LivingObject {

    constructor(x, y) {
        super(x, y, 100);
        this.sightRange = 6;
        this.lastTime = 0;
        this.direction = {x: 0, y: 1};
        this.score = 0;
    }

    init(world) {
        super.init(world);
        this.respawn();
    }

    update(deltaTime, env) {
        super.update(deltaTime, env);
        const motion = env.input.movementAxis;

        // save direction for attacking
        if(motion.x !== 0 || motion.y !== 0) {
            this.direction = motion;
        }

        // attacking
        if(env.input.currentlyAttacking) {
            let curTime = new Date().getTime();
            if((curTime - this.lastTime > 500) || this.lastTime === undefined) {
                this.attack();
                this.lastTime = curTime;
            }
        }

        const speed = this.isInFluid() ? 2 : 4;

        this.move(motion.x * speed , motion.y * speed, deltaTime);
    }

    kill() {
        this.respawn();
    }

    respawn() {
        this._health = this._maxHealth;
        do {
            this.x = Math.floor(Math.random() * this.world.worldWidth)
            this.y = Math.floor(Math.random() * this.world.worldHeight)
        } while(this._world.getTile(this.x, this.y)?.solid);
    }

    draw(camX, camY, ctx) {
        const x = this.direction.x;
        const y = this.direction.y;

        if(x < 0) {
            ctx.drawImage(playerLeft, (this.x - camX) * TILE_SIZE, (this.y - camY) * TILE_SIZE);
            super.draw(camX, camY, ctx);
            return;
        }
        if(x > 0) {
            ctx.drawImage(playerRight, (this.x - camX) * TILE_SIZE, (this.y - camY) * TILE_SIZE);
            super.draw(camX, camY, ctx);
            return;
        }
        if(y < 0) {
            ctx.drawImage(playerBack, (this.x - camX) * TILE_SIZE, (this.y - camY) * TILE_SIZE);
            super.draw(camX, camY, ctx);
            return;
        }
        if(y > 0) {
            ctx.drawImage(playerFront, (this.x - camX) * TILE_SIZE, (this.y - camY) * TILE_SIZE);
            super.draw(camX, camY, ctx);
        }
    }


    doesCollide(tile) {
        return  tile == null || tile.solid
    }
  
    attack() {
        //check if there is an enemy in the tile in front of player (current direction)
        // For now only 1 weapon -> 1 Tile range
        // Can be updated and stats gotten from a possible future weapon or inventory class (same for dmg)
        //const motion = env.input.movementAxis;

        const attackPosX = this.x + this.width/2 + (this.direction.x) - 0.5;
        const attackPosY = this.y + this.height/2 + (this.direction.y) - 0.5;
        let creatures = this.world.getObjectsInArea(attackPosX, attackPosY, 1, 1);

        creatures.forEach((obj) => {
            if(obj instanceof LivingObject && obj !== this) {
                if (obj.takeDamage(10)) {
                    this.score += obj.killScore;
                }
                obj.overwriteForce(this.direction.x * 6, this.direction.y * 6);
            }
        })
    }

}