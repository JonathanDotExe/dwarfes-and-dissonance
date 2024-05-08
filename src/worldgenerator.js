import { ValueNoise } from '../node_modules/value-noise-js/dist/value-noise.mjs'
import { GRASS_TILE, SAND_TILE, STONE_TILE, WATER_TILE } from './object/tile.js';


export class WorldGenerator {

    constructor(seed) {
        this._noise = new ValueNoise(seed);
        this.scale = 0.05;
    }

    generate(world, x, y, width, height) {
        //Generate basic terrain
        for (let i = 0; i < width; i++) {
            for (let j = 0; j < height; j++) {
                const val = this._noise.evalXY((x + i) * this.scale, (x + j) * this.scale);
                let tile = STONE_TILE;
                if (val < 0.3) {
                    tile = WATER_TILE;
                }
                else if(val < 0.35) {
                    tile = SAND_TILE;
                }
                else if(val < 0.7) {
                    tile = GRASS_TILE;
                }
                world.setTile(x + i, y + j, tile);
            }
        }


    }

}