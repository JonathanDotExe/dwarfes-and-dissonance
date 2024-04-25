export const WORLD_SIZE = 256;


export class GameWorld {

    constructor() {
        this._tiles = [];//TODO initialize tile array
        this._objects = [];

    }

    update(deltaTime) {
        //Update objects
        for (let obj of this._objects) {
            obj.update(deltaTime);
        }
    }

    draw(ctx) {
        //Draw tiles
        
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
        this._objects.addObject(obj);
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

    get worldWidth() {
        return this._tiles[0].length; //FIXME only works if all lines are the same length
    }

    get worldHeight() {
        return this._tiles.length;
    }

}