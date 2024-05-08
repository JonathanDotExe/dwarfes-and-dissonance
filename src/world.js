import {GRASS_TILE, SAND_TILE, STONE_TILE, TILE_SIZE, WATER_TILE} from "./object/tile.js";
import {Goblin} from "./object/enemies/goblin.js";
import {Player} from "./object/player.js";
import {Tree} from "./object/static/tree.js";
import {Chest} from "./object/static/chest.js";
import {Piranha} from "./object/enemies/piranha.js";
import { createAmbientMusicGenerator } from "./music/music.js";
import { WorldGenerator } from "./worldgenerator.js";
export const WORLD_SIZE = 256;


export class GameWorld {

    constructor() {
        const w = WATER_TILE;
        const g = GRASS_TILE;
        const s = SAND_TILE;
        const r = STONE_TILE;
        /*this._tiles = [
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
            [g, g, g, g, g, g, r, g, g, g, g, g, g, g, g, g, w, w, w, w],
            [g, g, g, g, r, r, r, r, r, g, g, g, g, g, g, w, w, w, w, g],
            [g, g, g, r, r, r, r, r, g, g, g, g, g, g, w, w, w, w, g, g],
            [g, g, r, r, r, r, r, g, g, g, g, g, g, g, w, w, w, g, g, g],
            [g, g, r, r, r, r, r, g, g, g, g, g, g, g, w, w, w, g, g, g],
        ];*/
        this._tiles = [];
        //Create array
        for (let i = 0; i < 512; i++) {
            const arr = [];
            for (let j = 0; j < 512; j++) {
                arr.push(null);
            }
            this._tiles.push(arr);
        }
        this._objects = [];
        this._player = new Player(100, 100);
        //Generate world
        const gen = new WorldGenerator();
        gen.generate(this, 0, 0, 512, 512);

        //Add objects
        this.addObject(new Goblin(10, 7));
        this.addObject(new Tree(10,12));
        this.addObject(new Chest(15,8));
        this.addObject(new Piranha(1,1));
        this.addObject(this._player);

        //Add player
        createAmbientMusicGenerator(this).then(m => {
            m.init();
        })
    }

    update(deltaTime, env) {
        //Update objects
        for (let obj of this._objects) {
            obj.update(deltaTime, env);
        }
    }

    draw(ctx, camWidth, camHeight) {
        //Draw tiles
        const width = this.worldWidth;
        const height = this.worldHeight;
        const camX = Math.max(0, Math.min(width - camWidth, this._player.x - camWidth/2));
        const camY = Math.max(0, Math.min(height - camHeight, this._player.y - camHeight/2));
        for (let x = Math.floor(camX); x < Math.ceil(camX + camWidth); x++) {
            for (let y = Math.floor(camY); y < Math.ceil(camY + camHeight); y++) {
                const tile = this.getTile(x, y);
                if (!!tile) {
                    tile.draw(ctx, x - camX, y - camY);
                    //Draw borders
                    const top = this.getTile(x, y - 1);
                    const bottom = this.getTile(x, y + 1);
                    const left = this.getTile(x - 1, y);
                    const right = this.getTile(x + 1, y);
                    
                    let line = tile.getSeparationStyle(top);
                    if (line) {
                        ctx.fillStyle = line;
                        ctx.fillRect(x * TILE_SIZE - camX * TILE_SIZE, y * TILE_SIZE - camY * TILE_SIZE, TILE_SIZE, 1);
                    }
                    line = tile.getSeparationStyle(bottom);
                    if (line) {
                        ctx.fillStyle = line;
                        ctx.fillRect(x * TILE_SIZE - camX * TILE_SIZE, (y + 1) * TILE_SIZE - 1 - camY * TILE_SIZE, TILE_SIZE, 1);
                    }
                    line = tile.getSeparationStyle(left);
                    if (line) {
                        ctx.fillStyle = line;
                        ctx.fillRect(x * TILE_SIZE - camX * TILE_SIZE, y * TILE_SIZE - camY * TILE_SIZE, 1, TILE_SIZE);
                    }
                    line = tile.getSeparationStyle(right);
                    if (line) {
                        ctx.fillStyle = line;
                        ctx.fillRect((x + 1) * TILE_SIZE - 1 - camX * TILE_SIZE, y * TILE_SIZE - camY * TILE_SIZE, 1, TILE_SIZE);
                    }
                }
            }
        }
        //Draw objects
        //TODO only draw whats in cam
        for (let obj of this._objects) {
            obj.draw(camX, camY, ctx);
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

    doCollisionDetection(x, y, width, height, movementX, movementY, collide) {
        const goalX = x + movementX;
        const goalY = y + movementY;
        
        //X axis
        if (movementX > 0) {
            loop:
            for (let i = Math.floor(x + width); i <= Math.ceil(goalX + width); i++) {
                x = i - width;
                for (let j = Math.floor(y); j < y + height; j++) {
                    const t = this.getTile(i, j);
                    if (t == null || collide(t)) {
                        break loop;
                    }
                }
            }
            x = Math.min(x, goalX);
        }
        else if (movementX < 0) {
            loop:
            for (let i = Math.floor(x); i >= Math.floor(goalX); i--) {
                for (let j = Math.floor(y); j < y + height; j++) {
                    const t = this.getTile(i, j);
                    if (t == null || collide(t)) {
                        break loop;
                    }
                }
                x = i;
            }
            x = Math.max(x, goalX);
        }
        //Y axis
        if (movementY > 0) {
            loop:
            for (let i = Math.floor(y + height); i <= Math.ceil(goalY + height); i++) {
                y = i - height;
                for (let j = Math.floor(x); j < x + width; j++) {
                    const t = this.getTile(j, i);
                    if (t == null || collide(t)) {
                        break loop;
                    }
                }
            }
            y = Math.min(y, goalY);
        }
        else if (movementY < 0) {
            loop:
            for (let i = Math.floor(y); i >= Math.floor(goalY); i--) {
                for (let j = Math.floor(x); j < x + width; j++) {
                    const t = this.getTile(j, i);
                    if (t == null || collide(t)) {
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