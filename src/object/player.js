import { LivingObject } from "./livingobject.js";
import { TILE_SIZE } from "./tile.js";

const playerImage = new Image();
playerImage.src = "/res/objects/dwarf_blue.png";

export class Player extends LivingObject {

    direction;
    constructor(x, y) {
        super(x, y, 100);
        this.sightRange = 6;
        this.lastTime = 0;
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
        const attackPosX = this.x + this.width/2 + (this.direction.x) - 0.5;
        const attackPosY = this.y + this.height/2 + (this.direction.y) - 0.5;
        let creatures = this.world.getObjectsInArea(attackPosX, attackPosY, 1, 1);

        creatures.forEach((obj) => {
            if(obj instanceof LivingObject && obj !== this) {
                obj.takeDamage(10);
            }
        })
    }
}