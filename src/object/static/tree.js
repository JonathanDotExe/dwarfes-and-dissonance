import {LivingObject} from "../livingobject.js";
import {TILE_SIZE} from "../tile.js";

const treeImage = new Image();
treeImage.src = "/res/objects/Tree.png";

export class Tree extends LivingObject{

    constructor(x,y) {
        super(x,y, 30);
    }

    draw(camX, camY, ctx) {
        ctx.drawImage(treeImage, (this.x - camX) * TILE_SIZE, (this.y - camY) * TILE_SIZE);
        super.draw(camX, camY, ctx);
    }

    get solid() {
        return true;
    }
}