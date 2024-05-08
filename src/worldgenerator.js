import { ValueNoise } from '../node_modules/value-noise-js/dist/value-noise.mjs'
import { Tree } from './object/static/tree.js';
import { GRASS_TILE, SAND_TILE, STONE_TILE, WATER_TILE } from './object/tile.js';

const TREE_CHUNK_SIZE = 16;

export class WorldGenerator {

    constructor(seed) {
        this._noise = new ValueNoise(seed);
        this._seed = seed;
        this.scale = 0.05;
    }

    generate(world, x, y, width, height) {
        const rng = new Math.seedrandom(this._seed + x * 31 + y * 73);
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
        //Trees
        //Single trees
        for (let i = 0; i < width; i += TREE_CHUNK_SIZE) {
            for (let j = 0; j < height; j +=TREE_CHUNK_SIZE) {
                const numTrees = Math.floor(rng() * 10);
                for (let k = 0; k < numTrees; k++) {
                    const treeX = x + i + Math.floor(rng() * TREE_CHUNK_SIZE);
                    const treeY = y + j + Math.floor(rng() * TREE_CHUNK_SIZE);

                    //Only place trees on grass
                    if (world.getTile(treeX, treeY) == GRASS_TILE) {
                        world.addObject(new Tree(treeX, treeY));
                    }
                }
            }
        }

    }

}