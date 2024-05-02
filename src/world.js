import {GRASS_TILE, SAND_TILE, WATER_TILE} from "./object/tile.js";
import {Goblin} from "./object/enemy.js";
export const WORLD_SIZE = 256;


export class GameWorld {

    constructor() {
        const w = WATER_TILE;
        const g = GRASS_TILE;
        const s = SAND_TILE
        this._tiles = [
            [w, w, w, w, w, w, w, s, s, s, g, g, g, g, g, g, g, g, g, g],
            [w, w, w, w, w, w, s, s, s, g, g, g, g, g, g, g, g, g, g, g],
            [w, w, w, w, s, s, s, g, g, g, g, g, g, g, g, g, g, g, g, g],
            [w, w, s, s, s, g, g, g, g, g, g, g, g, g, g, g, g, g, g, g],
            [s, s, s, s, g, g, g, g, g, g, g, g, g, g, g, g, g, g, g, g],
            [s, s, g, g, g, g, g, g, g, g, g, g, g, g, g, g, g, g, g, g],
            [g, g, g, g, g, g, g, g, g, g, g, g, g, g, g, g, g, g, g, g],
            [g, g, g, g, g, g, g, g, g, g, g, g, g, g, g, g, g, g, g, g],
            [g, g, g, g, g, g, g, g, g, g, g, g, g, g, g, g, g, g, g, g],
            [g, g, g, g, g, g, g, g, g, g, g, g, g, g, g, g, g, g, g, g],
            [g, g, g, g, g, g, g, g, g, g, g, g, g, g, g, g, g, g, g, g],
            [g, g, g, g, g, g, g, g, g, g, g, g, g, g, g, g, g, g, g, g],
            [g, g, g, g, g, g, g, g, g, g, g, g, g, g, g, g, g, g, g, g],
            [g, g, g, g, g, g, g, g, g, g, g, g, g, g, g, g, g, g, g, g],
            [g, g, g, g, g, g, g, g, g, g, g, g, g, g, g, g, g, g, g, g],
        ];
        this._objects = [];

        this.addObject(new Goblin(10, 7))
    }

    update(deltaTime) {
        //Update objects
        for (let obj of this._objects) {
            obj.update(deltaTime);
        }
    }

    draw(ctx) {
        //Draw tiles
        const width = this.worldWidth;
        const height = this.worldHeight;
        const camX = 0;
        const camY = 0;
        //TODO only draw whats in cam
        for (let x = 0; x < width; x++) {
            for (let y = 0; y < height; y++) {
                this.getTile(x, y).draw(ctx, x, y);
            }
        }
        //Draw objects
        for (let obj of this._objects) {
            obj.draw(0, 0, ctx); //TODO cam position
        }
    }

    addObject(obj) {
        if (this._objects.includes(obj)) {
            throw "Object already in world!";
        }
        obj.init(this);
        this._objects.push(obj);
    }

    removeObject(obj) {
        const i = this._objects.indexOf(obj);
        if (i >= 0) {
            obj.onRemove();
            this._objects.splice(i, 1);
        }
    }

    setTile(x, y, tile) {
        this._tiles[y][x] = tile;
    }

    getTile(x, y) {
        return this._tiles[y][x];
    }

    doCollisionDetection(x, y, width, height, movementX, movementY) {
        const goalX = x + movementX;
        const goalY = y + movementY;
        
        //X axis
        if (movementX >= 0) {
            loop:
            for (let i = Math.floor(x + width); i <= Math.ceil(goalX + width); i++) {
                x = i - width;
                for (let j = Math.floor(y); j <= Math.ceil(y + height); j++) {
                    if (this.getTile(i, j).solid || this.getTile(i, j).fluid) {
                        break loop;
                    }
                }
            }
            x = Math.min(x, goalX);
        }
        else {
            loop:
            for (let i = Math.ceil(x); i >= Math.floor(goalX); i--) {
                x = i;
                for (let j = Math.floor(y); j <= Math.ceil(y + height); j++) {
                    if (this.getTile(i, j).solid || this.getTile(i, j).fluid) {
                        break loop;
                    }
                }
            }
            x = Math.max(x, goalX);
        }
        //Y axis
        if (movementY >= 0) {
            loop:
            for (let i = Math.floor(y + height); i <= Math.ceil(goalY + height); i++) {
                y = i - height;
                for (let j = Math.floor(x); j < Math.ceil(x + width); j++) {
                    if (this.getTile(j, i).solid || this.getTile(j, i).fluid) {
                        break loop;
                    }
                }
            }
            y = Math.min(y, goalY);
        }
        else {
            loop:
            for (let i = Math.ceil(y); i <= Math.floor(goalY); i++) {
                y = i;
                for (let j = Math.floor(x); j < Math.ceil(x + width); j++) {
                    if (this.getTile(j, i).solid || this.getTile(j, i).fluid) {
                        break loop;
                    }
                }
            }
            y = Math.max(y, goalY);
        }

        return {x: x, y: y};
    }

    get worldWidth() {
        return this._tiles[0].length; //FIXME only works if all lines are the same length
    }

    get worldHeight() {
        return this._tiles.length;
    }

}