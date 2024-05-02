
export const GameObjectState = {
    New: 0,
    Alive: 1,
    Removed: 2
}

/**
 * Coordinates are in TILE_SIZE units
 */
export class GameObject {

    constructor(x, y) {
        this._x = x;
        this._y = y;
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

    move(xMotion, yMotion, deltaTime) {
        const movement = this.world.doCollisionDetection(this.x, this.y, this.width, this.height, xMotion * deltaTime, yMotion * deltaTime);
        this.x = movement.x;
        this.y = movement.y;
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

    get world() {
        return this._world;
    }

}