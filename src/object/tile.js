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

function loadTileImage(name) {
    let image = new Image();
    image.src = "res/tiles/" + name + ".png"
    return image;
}

export const GRASS_TILE = new Tile(loadTileImage("grass"), false, false);
export const SAND_TILE = new Tile(loadTileImage("sand"), false, false);
export const WATER_TILE = new Tile(loadTileImage("water"), false, true);
export const STONE_TILE = new Tile(loadTileImage("stone"), true, false);
export const STONE_FLOOR_TILE = new Tile(loadTileImage("stone_floor"), false, false);