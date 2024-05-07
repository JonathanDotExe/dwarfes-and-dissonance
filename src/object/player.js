import { LivingObject } from "./livingobject.js";
import { TILE_SIZE } from "./tile.js";
import {Goblin} from "./enemy";

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
        if(motion.x !== 0 || motion.y !== 0) {
            this.direction = motion;
        }
        const speed = this.isInFluid() ? 1 : 4;

        this.move(motion.x * speed , motion.y * speed, deltaTime, true);
    }

    draw(camX, camY, ctx) {
        ctx.drawImage(playerImage, (this.x - camX) * TILE_SIZE, (this.y - camY) * TILE_SIZE);
        super.draw(camX, camY, ctx);
    }

    attack() {
        //check if there is an enemy in the tile in front of player (current direction)
        // For now only 1 weapon -> 1 Tile range
        // Can be updated and stats gotten from a possible future weapon or inventory class (same for dmg)
        //const motion = env.input.movementAxis;
        if(this.direction === undefined) {
            return;
        }
        const attackPosX = this.x + this.direction.x;
        const attackPosY = this.y + this.direction.y;

        // Check if enemy is in that tile
        let existingObjects = this.allObjects;
        for(let obj of existingObjects) {
            if(obj instanceof Goblin && (obj.x === attackPosX && obj.y === attackPosY)) {
                obj.takeDamage(10);
            }
        }
    }
}