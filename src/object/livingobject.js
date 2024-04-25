import { GameObject } from "./gameobject.js";
import { TILE_SIZE, Tile } from "./tile.js";

export class LivingObject extends GameObject {

    constructor(x, y, maxHealth) {
        super(x, y);
        this._maxHealth = maxHealth;
        this._health = health;
    }

    takeDamage(damage) {
        if (damage < 0) {
            throw "Damage must not be below zero";
        }
        this._health -= damage;
        if (this._health <= 0) {
            this.kill();
        }
    }

    kill() {
        this.world.removeObject(this);
    }

    draw(camX, camY, ctx) {
        super(camX, camY, ctx);
        //Draw health bar
        const x = TILE_SIZE * this.x - camX;
        const y = TILE_SIZE * this.y - camY - 10;

        ctx.fillStyle = 'red#7d0000';
        ctx.fillRect(x, y, this.width, 5);
        ctx.fillStyle = 'red';
        ctx.fillRect(x, y, this.width * this.healthPercent, 5);
    }

    get health() {
        return this.health;
    }

    get maxHealth() {
        return this.maxHealth;
    }

    get healthPercent() {
        return this.health/this.maxHealth;
    }

}