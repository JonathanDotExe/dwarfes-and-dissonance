
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
        this._xMotion = 0;
        this._yMotion = 0;
    }

    get friction() {
        return 8;
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

    update(deltaTime, env) {
        //Movement
        this.move(this.xMotion, this.yMotion, deltaTime);
        //Friction
        this.xMotion -= Math.sign(this.xMotion) * Math.min(this.friction * deltaTime, Math.abs(this.xMotion));
        this.yMotion -= Math.sign(this.yMotion) * Math.min(this.friction * deltaTime, Math.abs(this.yMotion));
    }

    draw(camX, camY, ctx) {

    }

    move(xMotion, yMotion, deltaTime) {
        const movement = this.world.doCollisionDetection(this.x, this.y, this.width, this.height, xMotion * deltaTime, yMotion * deltaTime, t => this.doesCollide(t));
        this.x = movement.x;
        this.y = movement.y;
    }

    onRemove() {
        this._state = GameObjectState.Removed;
    }

    doesCollide(tile) {
        return tile == null || tile.solid || tile.fluid;
    }

    isInFluid() {
        const tile = this._world.getTile(Math.floor(this.x + this.width/2), Math.floor(this.y + this.height/2));
        return !!tile && tile.fluid;
    }

    applyForce(forceX, forceY) {
        this.xMotion += forceX;
        this.yMotion += forceY;
    }

    overwriteForce(forceX, forceY) {
        if (Math.sign(this.xMotion) == Math.sign(forceX)) {
            this.xMotion = Math.sign(this.xMotion) * Math.max(this.xMotion);
        }
        else {
            this.xMotion += forceX;
        }
        if (Math.sign(this.yMotion) == Math.sign(forceY)) {
            this.yMotion = Math.sign(this.yMotion) * Math.max(this.yMotion);
        }
        else {
            this.yMotion += forceY;
        }
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

    get xMotion() {
        return this._xMotion;
    }

    get yMotion() {
        return this._yMotion;
    }

    set xMotion(val) {
        this._xMotion = val;
    }

    set yMotion(val) {
        this._yMotion = val;
    }

    get world() {
        return this._world;
    }

    get solid() {
        return false;
    }

    get inMotion() {
        return this.xMotion != 0 || this.yMotion != 0;
    }

}