export const TILE_SIZE = 32;

export class Tile {
    constructor(image, solid, fluid) {
        this._image = image;
        this._solid = solid;
        this._fluid = fluid;
    }

    draw(ctx, x, y) {
        ctx.drawImage(this.image, x * TILE_SIZE, y * TILE_SIZE);
    }

    get image() {
        return this._image;
    }

    get solid() {
        return this._solid;
    }

    get fluid() {
        return this._fluid;
    }

    getDisplayTile(x, y, world) { //A tile that should be displayed instead of this one
        return this;
    }

    getSeparationStyle(other) {
        if (other == null || other == this) { //Equals
            return null;
        }
        if (other.solid != this.solid || other.fluid != this.fluid) { //Vastly different materials
            return (this.solid || this.fluid) ? "rgba(0,0,0,1)" : "rgba(0,0,0,0.75)";
        }
        //Similar materials
        return "rgb(0,0,0,0.2)";
    }
}

export class CaveTile extends Tile {
    
    constructor(image, solid, fluid, display) {
        super(image, solid, fluid);
        this._display = display;
    }

    getDisplayTile(x, y, world) { //A tile that should be displayed instead of this one when the player is not near
        if (Math.pow(x + 0.5 - world.player.x + world.player.width/2, 2) + Math.pow(y + 0.5 - world.player.y + world.player.height/2, 2) < world.player.sightRange * world.player.sightRange) {
            return this;
        }
        return this._display;
    }

}

function loadTileImage(name) {
    let image = new Image();
    image.src = "res/tiles/" + name + ".png"
    return image;
}

/**
 * Tile constants
 */
export const GRASS_TILE = new Tile(loadTileImage("grass"), false, false);
export const SAND_TILE = new Tile(loadTileImage("sand"), false, false);
export const WATER_TILE = new Tile(loadTileImage("water"), false, true);
export const STONE_TILE = new Tile(loadTileImage("stone"), true, false);
export const STONE_FLOOR_TILE = new CaveTile(loadTileImage("stone_floor"), false, false, STONE_TILE);