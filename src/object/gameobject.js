import { TILE_SIZE } from "./tile";

export class GameObject {

    constructor() {
        this.x = 0;
        this.y = 0;
        this.world = null;
    }

    /**
     * Initialized the game object for the given world
     * Should only be called once
     * 
     * World may not be changed afterwards
     * @param {*} world 
     */
    init(world) {
        this.world = world;
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

    width() {
        return 1;
    }

    height() {
        return 1;
    }

}