import { LivingObject } from "./livingobject.js";
import { TILE_SIZE } from "./tile.js";
import {Enemy} from "./enemies/enemy.js";

const playerImage = new Image();
playerImage.src = "/res/objects/dwarf_blue.png";

export class Player extends LivingObject {

    direction;
    constructor(x, y) {
        super(x, y, 100);
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
            let lastTime;
            if((curTime - lastTime > 500) || lastTime === undefined) {
                this.attack();
                env.input.doneAttacking();
                lastTime = curTime;
            }
        }

        const speed = this.isInFluid() ? 1 : 4;

        this.move(motion.x * speed , motion.y * speed, deltaTime);
    }

    draw(camX, camY, ctx) {
        ctx.drawImage(playerImage, (this.x - camX) * TILE_SIZE, (this.y - camY) * TILE_SIZE);
        super.draw(camX, camY, ctx);
    }


    doesCollide(tile) {
        return  tile == null || tile.solid
    }
  
   attack() {
        //check if there is an enemy in the tile in front of player (current direction)
        // For now only 1 weapon -> 1 Tile range
        // Can be updated and stats gotten from a possible future weapon or inventory class (same for dmg)
        //const motion = env.input.movementAxis;
        if(this.direction === undefined) {
            return;
        }
        //const attackPosX = this.x + this.direction.x;
        //const attackPosY = this.y + this.direction.y - TILE_SIZE/2;
        //let creatures = this.world.getObjectsInArea(attackPosX, attackPosY, 1, 1);
       let creatures = this.world.getObjectsInArea(this.x + this.direction.x, this.y + this.direction.y, this.direction.x, this.direction.y);
        creatures.forEach((obj) => {
            if(obj instanceof Enemy) {
                obj.takeDamage(10);
            }
        })
    }
}