
export const GameObjectState = {
    New: 0,
    Alive: 1,
    Removed: 2
}

/**
 * Represents a movable object in the game whose position is not bound to tiles.
 * Coordinates are in TILE_SIZE units
 * Motions are all given in Tile/s
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

    /**
     * How much motion the object looses per/s
     */
    get friction() {
        return 8;
    }

    /**
     * Determines if the object bounces of walls when colliding with motion
     */
    get bounce() {
        return false;
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

    /**
     * 
     * Called every game frame
     * 
     * @param {*} deltaTime the time since the last update in seconds
     * @param {*} env a structure with game environment objects like the Input
     */
    update(deltaTime, env) {
        //Movement
        const diff = this.move(this.xMotion, this.yMotion, deltaTime);
        if (this.bounce && diff.x != 0) {
            this.xMotion = -this.xMotion;
        }
        if (this.bounce && diff.y != 0) {
            this.yMotion = -this.yMotion;
        }
        //Friction
        this.xMotion -= Math.sign(this.xMotion) * Math.min(this.friction * deltaTime, Math.abs(this.xMotion));
        this.yMotion -= Math.sign(this.yMotion) * Math.min(this.friction * deltaTime, Math.abs(this.yMotion));
    }

    /**
     * Called when the game is drawn.
     * Should draw itself on the canvas.
     */
    draw(camX, camY, ctx) {

    }

    /**
     * Moves the object by the given motion considering delta time with collision detection.
     * 
     * @returns a vector containing the amount of tiles that the object couldn't move doe to collision detection
     */
    move(xMotion, yMotion, deltaTime) {
        const xM = xMotion * deltaTime;
        const yM = yMotion * deltaTime;
        const movement = this.world.doCollisionDetection(this.x, this.y, this.width, this.height, xM, yM, t => this.doesCollide(t), o => this.doesCollideObject(o));
        const diff = {
            x: this.x + xM - movement.x,
            y: this.y + yM - movement.y,
        }
        this.x = movement.x;
        this.y = movement.y;
        return diff;
    }

    onRemove() {
        this._state = GameObjectState.Removed;
    }

    /**
     * @returns whether the object should collide with the given tile
     */
    doesCollide(tile) {
        return tile == null || tile.solid || tile.fluid;
    }

    /**
     * @returns whether the object should collide with the given object
     */
    doesCollideObject(object) {
        return object != null && object.solid;
    }

    isInFluid() {
        const tile = this._world.getTile(Math.floor(this.x + this.width/2), Math.floor(this.y + this.height/2));
        return !!tile && tile.fluid;
    }

    /**
     * Adds force to the object
     */
    applyForce(forceX, forceY) {
        this.xMotion += forceX;
        this.yMotion += forceY;
    }

    /**
     * Overwrites the objects force to prevent knockback from stacking
     */
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