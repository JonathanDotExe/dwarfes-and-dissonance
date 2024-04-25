
export const GameObjectState = {
    New: 0,
    Alive: 1,
    Removed: 2
}

/**
 * Coordinates are in TILE_SIZE units
 */
export class GameObject {

    constructor() {
        this._x = 0;
        this._y = 0;
        this._world = null;
        this._state = GameObjectState.New;
    }

    /**
     * Initialized the game object for the given world
     * Should only be called once
     * 
     * World may not be changed afterwards
     * @param {*} world 
     */
    init(world) {
        if (!world) {
            throw "World can't be null";
        }
        else if (this._world || this._state != GameObjectState.New) {
            throw "Object already initialized";
        }
        this._world = world;
        this._state = GameObjectState.Alive;
    }

    update(deltaTime) {

    }

    draw(camX, camY, ctx) {

    }

    move(world, xMotion, yMotion, deltaTime) {
        //TODO collision detection
        this.x += xMotion * deltaTime;
        this.y += yMotion * deltaTime;
    }

    onRemove() {
        this._state = GameObjectState.Removed;
    }

    get width() {
        return 1;
    }

    get height() {
        return 1;
    }

    get x() {
        return this._x;
    }

    get y() {
        return this._y;
    }

    set x(val) {
        this._x = val;
    }

    set y(val) {
        this._y = val;
    }

}