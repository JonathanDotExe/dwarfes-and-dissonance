import { ValueNoise } from '../node_modules/value-noise-js/dist/value-noise.mjs'
import { distanceSquaredToLineSegment, distanceToLineSegment } from './lib/distance.js';
import { Goblin } from './object/enemies/goblin.js';
import { Piranha } from './object/enemies/piranha.js';
import { Chest } from './object/static/chest.js';
import { Tree } from './object/static/tree.js';
import { GRASS_TILE, SAND_TILE, STONE_FLOOR_TILE, STONE_TILE, WATER_TILE } from './object/tile.js';

const CAVE_CONNECTION_RANGE = 64;
const CAVE_CONNECTION_COUNT = 4;
const MAX_CAVE_WIDTH = 6;
const CAVE_THRESHOLD = 0.5;

function placeInChunks(x, y, width, height, chunkSize, place, amount, rng, minAmount=0) {
    for (let i = 0; i < width; i += chunkSize) {
        for (let j = 0; j < height; j +=chunkSize) {
            const num = Math.floor(rng() * (amount - minAmount + 1) + minAmount);
            for (let k = 0; k < num; k++) {
                const placeX = x + i + Math.floor(rng() * chunkSize);
                const placeY = y + j + Math.floor(rng() * chunkSize);
                place(placeX, placeY);
            }
        }
    }
}

class CaveNode {

    constructor(x, y, weight) {
        this.x = x;
        this.y = y;
        this.weight = weight;
    }

}

export class WorldGenerator {

    constructor(seed) {
        this._noise = new ValueNoise(seed);
        this._noise2 = new ValueNoise(seed + 69);
        this._noise3 = new ValueNoise(seed + 42);
        this._caveNoise = new ValueNoise(seed + 420);
        this._seed = seed;
        this.scale = 0.05;
        this.scale2 = 0.0125;
        this.scale3 = 0.2;
        this.caveScale = 0.05;
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
                else if(val < 0.55) {
                    tile = GRASS_TILE;
                }
                world.setTile(x + i, y + j, tile);
            }
        }
        //Caves
        const caveNodes = [];
        placeInChunks(0, 0, width, height, 32, (x, y) => {
            caveNodes.push(new CaveNode(x, y, rng()))
        }, 2, rng, 2);
        //Connect nodes
        const edges = new Set();
        for (let i = 0; i < caveNodes.length; i++) {
            const node = caveNodes[i];
            //Find neighbors
            const neighborIndices = [];
            for (let j = 0; j < caveNodes.length; j++) {
                const n = caveNodes[j];
                if (Math.pow(n.x - node.x, 2) + Math.pow(n.y - node.y, 2) < Math.pow(CAVE_CONNECTION_RANGE, 2)) {
                    neighborIndices.push(j);
                }
            }
            //Pick neighbors
            const connections = 1 + Math.floor(CAVE_CONNECTION_COUNT * rng());
            for (let j = 0; j < connections && neighborIndices.length > 0; j++) {
                const index = Math.floor(rng() * neighborIndices.length);
                const edge = new Set([i, neighborIndices[index]]);
                if (edge.size == 2) {
                    edges.add(edge);
                }
                neighborIndices.splice(index, 1); //Remove options
            }
        }
        //Generate cave map
        const caveMap = [];
        for (let i = 0; i < width; i++) {
            const arr = [];
            for (let j = 0; j < height; j++) {
                arr.push(0.8 + 0.2 * this._caveNoise.evalXY((x + i) * this.caveScale, (x + j) * this.caveScale));
            }
            caveMap.push(arr);
        }
        //Apply graph
        for (let edge of edges) {
            const e = Array.from(edge);
            const start = caveNodes[e[0]];
            const end = caveNodes[e[1]];

            const startX = Math.floor(Math.min(start.x, end.x) - MAX_CAVE_WIDTH);
            const startY = Math.floor(Math.min(start.y, end.y) - MAX_CAVE_WIDTH);
            const endX = Math.ceil(Math.max(start.x, end.x) + MAX_CAVE_WIDTH);
            const endY = Math.ceil(Math.max(start.y, end.y) + MAX_CAVE_WIDTH);

            //Interpolate factors
            for (let i = startX; i <= endX; i++) {
                for (let j = startY; j <= endY; j++) {
                    const dst = distanceToLineSegment(start.x, start.y, end.x, end.y, i + 0.5, j + 0.5);
                    const dstStart = Math.sqrt(Math.pow(startX - i, 2) + Math.pow(startY - j, 2));
                    const dstEnd = Math.sqrt(Math.pow(endX - i, 2) + Math.pow(endY - j, 2));
                    const totalDst = (dstStart + dstEnd);
                    const weight = totalDst == 0 ? 1 : (start.weight * dstStart + end.weight * dstEnd)/totalDst;
                    let factor = Math.min(dst/MAX_CAVE_WIDTH, 1) * 0.5 + 0.5;
                    factor += (1 - factor) * (1 - weight) * 0.5;
                    if (i in caveMap && j in caveMap[i]) {
                        caveMap[i][j] *= factor;
                    }
                }
            }
        }
        //Apply map
        for (let i = 0; i < caveMap.length; i++) {
            for (let j = 0; j <= caveMap[i].length; j++) {
                if (world.getTile(i, j) == STONE_TILE && caveMap[i][j] < CAVE_THRESHOLD) {
                    world.setTile(i, j, STONE_FLOOR_TILE);
                }
            }
        }

        //Decoration per chunks
        //Trees
        placeInChunks(x, y, width, height, 16, (treeX, treeY) => {
            if (world.getTile(treeX, treeY) == GRASS_TILE) {
                world.addObject(new Tree(treeX, treeY));
            }
        }, 6, rng);
        //Forests
        placeInChunks(x, y, width, height, 64, (x, y) => {
            //Place 20 trees
            for (let i = 0; i < 20; i++) {
                const treeX = x + Math.floor(rng() * 10);
                const treeY = y + Math.floor(rng() * 10);
                if (world.getTile(treeX, treeY) == GRASS_TILE) {
                    world.addObject(new Tree(treeX, treeY));
                }
            }
        }, 8, rng);
        //Chests
        placeInChunks(x, y, width, height, 32, (x, y) => {
            if (world.getTile(x, y) == STONE_FLOOR_TILE) {
                world.addObject(new Chest(x, y));
            }
        }, 4, rng);
        placeInChunks(x, y, width, height, 32, (x, y) => {
            if (world.getTile(x, y) != null && !world.getTile(x, y).solid && !world.getTile(x, y).fluid) {
                world.addObject(new Chest(x, y));
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
            const piranhaX = x + Math.floor(rng() * 4);
            const piranhaY = y + Math.floor(rng() * 4);
            const piranha = new Piranha(piranhaX, piranhaY);
            if (!piranha.doesCollide(world.getTile(piranhaX, piranhaY))) {
                world.addObject(piranha);
            }
        }, 2, rng);
    }

}