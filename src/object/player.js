import { LivingObject } from "./livingobject.js";
import { TILE_SIZE } from "./tile.js";

const playerImage = new Image();
playerImage.src = "/res/objects/dwarf_blue.png";

export class Player extends LivingObject {

    constructor(x, y) {
        super(x, y, 100);
    }

    update(deltaTime, env) {
        super.update(deltaTime, env);
        const motion = env.input.movementAxis;

        this.move(motion.x * 4 , motion.y * 4, deltaTime);
    }

    draw(camX, camY, ctx) {
        ctx.drawImage(playerImage, (this.x - camX) * TILE_SIZE, (this.y - camY) * TILE_SIZE);
        super.draw(camX, camY, ctx);
    }

}