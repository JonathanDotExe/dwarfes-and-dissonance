import {GameObject} from "../gameobject.js";
import {TILE_SIZE} from "../tile.js";


const chestImage = new Image();
chestImage.src = "/res/objects/chest.png";

const chestOpened = new Image();
chestOpened.src = "/res/objects/chestopen.png";

export class Chest extends GameObject{
    constructor(x,y){
        super(x,y);
        this.interacted = false;
        this.solid = true;
    }

    draw(camX, camY, ctx) {
        if(this.interacted){
            ctx.drawImage(chestOpened, (this.x - camX) * TILE_SIZE, (this.y - camY) * TILE_SIZE);
        } else{
            ctx.drawImage(chestImage, (this.x - camX) * TILE_SIZE, (this.y - camY) * TILE_SIZE);
        }
        super.draw(camX, camY, ctx);
    }
}