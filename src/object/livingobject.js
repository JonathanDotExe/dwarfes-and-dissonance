import { GameObject } from "./gameobject.js";
import { TILE_SIZE, Tile } from "./tile.js";

export class LivingObject extends GameObject {

    constructor(x, y, maxHealth) {
        super(x, y);
        this._maxHealth = maxHealth;
        this._health = maxHealth;
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
        super.draw(camX, camY, ctx);
        //Draw health bar
        if(this.health < this.maxHealth) {
            const x = TILE_SIZE * (this.x - camX);
            const y = TILE_SIZE * (this.y - camY) - 10;

            ctx.fillStyle = 'red#7d0000';
            ctx.fillRect(x, y, this.width * TILE_SIZE, 5);
            ctx.fillStyle = 'red';
            ctx.fillRect(x, y, this.width * this.healthPercent * TILE_SIZE, 5);
        }
    }

    get health() {
        return this._health;
    }

    get maxHealth() {
        return this._maxHealth;
    }

    get healthPercent() {
        return this.health/this.maxHealth;
    }

}