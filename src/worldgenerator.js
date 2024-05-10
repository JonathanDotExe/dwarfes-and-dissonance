import { ValueNoise } from '../node_modules/value-noise-js/dist/value-noise.mjs'
import { Goblin } from './object/enemies/goblin.js';
import { Piranha } from './object/enemies/piranha.js';
import { Tree } from './object/static/tree.js';
import { GRASS_TILE, SAND_TILE, STONE_TILE, WATER_TILE } from './object/tile.js';

const TREE_CHUNK_SIZE = 16;

function placeInChunks(x, y, width, height, chunkSize, place, amount, rng) {
    for (let i = 0; i < width; i += chunkSize) {
        for (let j = 0; j < height; j +=chunkSize) {
            const num = Math.floor(rng() * (amount + 1));
            for (let k = 0; k < num; k++) {
                const placeX = i + Math.floor(rng() * chunkSize);
                const placeY = j + Math.floor(rng() * chunkSize);
                place(placeX, placeY);
            }
        }
    }
}

export class WorldGenerator {

    constructor(seed) {
        this._noise = new ValueNoise(seed);
        this._noise2 = new ValueNoise(seed + 69);
        this._noise3 = new ValueNoise(seed + 42);
        this._seed = seed;
        this.scale = 0.05;
        this.scale2 = 0.0125;
        this.scale3 = 0.2;
    }

    generate(world, x, y, width, height) {
        const rng = new Math.seedrandom(this._seed + x * 31 + y * 73);
        //Generate basic terrain
        for (let i = 0; i < width; i++) {
            for (let j = 0; j < height; j++) {
                let val = this._noise.evalXY((x + i) * this.scale, (x + j) * this.scale) * 0.55 + this._noise2.evalXY((x + i) * this.scale2, (x + j) * this.scale2) * 0.4 + this._noise3.evalXY((x + i) * this.scale3, (x + j) * this.scale3) * 0.05;
                //Interpolate water on the sides to create island
                var mul = 1;
                if (i/width < 0.1) {
                    mul = i/width * 10;
                }
                else if (i/width > 0.9) {
                    mul =  (1 - i/width) * 10;
                }
                if (j/height < 0.1) {
                    mul = Math.min(j/height * 10, mul);
                }
                else if (j/height > 0.9) {
                    mul =  Math.min((1 - j/height) * 10, mul);
                }
                val *= mul;
                let tile = STONE_TILE;
                if (val < 0.25) {
                    tile = WATER_TILE;
                }
                else if(val < 0.3) {
                    tile = SAND_TILE;
                }
                else if(val < 0.6) {
                    tile = GRASS_TILE;
                }
                world.setTile(x + i, y + j, tile);
            }
        }
        //Decoration per chunks
        //Trees
        placeInChunks(x, y, width, height, 16, (treeX, treeY) => {
            if (world.getTile(treeX, treeY) == GRASS_TILE) {
                world.addObject(new Tree(treeX, treeY));
            }
        }, 10, rng);
        //Forests
        placeInChunks(x, y, width, height, 64, (x, y) => {
            //Place 20 trees
            for (let i = 0; i < 20; i++) {
                const treeX = x + Math.floor(rng() * 16);
                const treeY = y + Math.floor(rng() * 16);
                if (world.getTile(treeX, treeY) == GRASS_TILE) {
                    world.addObject(new Tree(treeX, treeY));
                }
            }
        }, 2, rng);
        //Goblins
        placeInChunks(x, y, width, height, 64, (x, y) => {
            for (let i = 0; i < 3; i++) {
                const goblinX = x + Math.floor(rng() * 4);
                const goblinY = y + Math.floor(rng() * 4);
                const goblin = new Goblin(goblinX, goblinY);
                if (!goblin.doesCollide(world.getTile(goblinX, goblinY))) {
                    world.addObject(goblin);
                }
            }
        }, 2, rng);
        //Piranhias
        placeInChunks(x, y, width, height, 64, (x, y) => {
            for (let i = 0; i < 1; i++) {
                const piranhaX = x + Math.floor(rng() * 4);
                const piranhaY = y + Math.floor(rng() * 4);
                const piranha = new Piranha(piranhaX, piranhaY);
                if (!piranha.doesCollide(world.getTile(piranhaX, piranhaY))) {
                    world.addObject(piranha);
                }
            }
        }, 2, rng);
    }

}