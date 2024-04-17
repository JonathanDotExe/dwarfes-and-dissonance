export const TILE_SIZE = 32;

export class Tile {
    constructor(image, solid, fluid) {
        this.image = image;
        this.solid = solid;
        this.fluid = fluid;
    }

    draw(ctx, x, y) {
        ctx.drawImage(this.image, x * TILE_SIZE, y * TILE_SIZE);
    }
}

//TODO tile constants