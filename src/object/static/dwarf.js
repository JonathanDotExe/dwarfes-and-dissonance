import {GameObject} from "../gameobject.js";
import {TILE_SIZE} from "../tile.js";



const dwarfYellow = new Image();
dwarfYellow.src = "/res/objects/dwarf_yellow.png";

const dwarfGreen = new Image();
dwarfGreen.src = "/res/objects/dwarf_green.png";

const dwarfBlue = new Image();
dwarfBlue.src = "/res/objects/dwarf_blue.png";

export class Dwarf extends GameObject{
    constructor(x,y){
        super(x,y,5);
        this.random = Math.random();
        this.healamount = 50;
        this.interacted = false;
    }

    draw(camX, camY, ctx) {
        if(this.random < 0.33){
            ctx.drawImage(dwarfYellow, (this.x - camX) * TILE_SIZE, (this.y - camY) * TILE_SIZE);
        } else if(this.random < 0.66){
            ctx.drawImage(dwarfGreen, (this.x - camX) * TILE_SIZE, (this.y - camY) * TILE_SIZE);
        } else{
            ctx.drawImage(dwarfBlue, (this.x - camX) * TILE_SIZE, (this.y - camY) * TILE_SIZE);
        }
        super.draw(camX, camY, ctx);
    }

    get solid() {
        return true;
    }

    healPlayer(player){
        if(!this.interacted)
        player.heal(this.healamount);
        this.interacted = true;
    }




}