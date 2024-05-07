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