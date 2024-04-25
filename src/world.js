export const WORLD_SIZE = 256;


export class GameWorld {

    constructor() {
        this._tiles = [];//TODO initialize tile array
        this._objects = [];

    }

    update(deltaTime) {

    }

    draw(ctx) {

    }

    addObject(obj) {
        //TODO exception handling
        _obj.init(this);
        this._objects.addObject(obj);
    }

    setTile(x, y, tile) {
        this._tiles[y][x] = tile;
    }

    getTile(x, y) {
        return this._tiles[y][x];
    }

}