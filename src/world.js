import {GRASS_TILE, SAND_TILE, WATER_TILE} from "./object/tile.js";
import {Goblin} from "./object/enemy.js";
import {Player} from "./object/player.js";
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
            [g, g, g, g, g, g, g, g, g, g, g, g, g, g, g, g, g, g, w, w],
            [g, g, g, g, g, g, g, g, g, g, g, g, g, g, g, g, w, w, w, w],
            [g, g, g, g, g, g, g, g, g, g, g, g, g, g, g, w, w, w, w, g],
            [g, g, g, g, g, g, g, g, g, g, g, g, g, g, w, w, w, w, g, g],
            [g, g, g, g, g, g, g, g, g, g, g, g, g, g, w, w, w, g, g, g],
            [g, g, g, g, g, g, g, g, g, g, g, g, g, g, w, w, w, g, g, g],
        ];
        this._objects = [];

        this.addObject(new Goblin(10, 7));
        this.addObject(new Player(10, 7));
    }

    update(deltaTime, env) {
        //Update objects
        for (let obj of this._objects) {
            obj.update(deltaTime, env);
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
        if (y < 0 || y >= this._tiles.length || x < 0 || x >= this._tiles[y].length) {
            return null;
        }
        
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
                for (let j = Math.floor(y); j <= Math.floor(y + height); j++) {
                    const t = this.getTile(i, j);
                    if (t == null || t.solid || t.fluid) {
                        break loop;
                    }
                }
            }
            x = Math.min(x, goalX);
        }
        else {
            loop:
            for (let i = Math.floor(x); i >= Math.floor(goalX); i--) {
                for (let j = Math.floor(y); j <= Math.floor(y + height); j++) {
                    const t = this.getTile(i, j);
                    if (t == null || t.solid || t.fluid) {
                        break loop;
                    }
                }
                x = i;
            }
            x = Math.max(x, goalX);
        }
        //Y axis
        if (movementY >= 0) {
            loop:
            for (let i = Math.floor(y + height); i <= Math.ceil(goalY + height); i++) {
                y = i - height;
                for (let j = Math.floor(x); j <= Math.floor(x + width); j++) {
                    const t = this.getTile(j, i);
                    if (t == null || t.solid || t.fluid) {
                        break loop;
                    }
                }
            }
            y = Math.min(y, goalY);
        }
        else {
            loop:
            for (let i = Math.floor(y); i >= Math.floor(goalY); i--) {
                for (let j = Math.floor(x); j <= Math.floor(x + width); j++) {
                    const t = this.getTile(j, i);
                    if (t == null || t.solid || t.fluid) {
                        break loop;
                    }
                }
                y = i;
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