import { GameObject } from "./gameobject.js";
import { TILE_SIZE, Tile } from "./tile.js";

/**
 * A game object with health
 */
export class LivingObject extends GameObject {

    constructor(x, y, maxHealth) {
        super(x, y);
        this._maxHealth = maxHealth;
        this._health = maxHealth;
    }

    /**
     * the score the player gains when he kills this object
     */
    get killScore() {
        return 0;
    }

    setHealth(health){
        return this._health = health;
    }

    /**
     * Object takes damage and performs kill logic if health <= 0
     */
    takeDamage(damage) {
        if (damage < 0) {
            throw "Damage must not be below zero";
        }
        const oldHealth = this.health;
        this._health -= damage;
        if (this._health <= 0 && oldHealth > 0) {
            this.kill();
            return true;
        }
        return false;
    }

    /**
     * Heals the object by the given amount
     */
    heal(amount) {
        if (amount < 0) {
            throw "Amount must not be below zero";
        }
        if(this._health + amount > this._maxHealth){
            this._health = this._maxHealth;
        } else{
            this._health += amount;
        }
    }

    /**
     * Internal method, called by takeDamage when damage reaches 0
     */
    kill() {
        this.world.removeObject(this);
    }

    draw(camX, camY, ctx) {
        super.draw(camX, camY, ctx);
        //Draw health bar
        if(this.health < this.maxHealth) {
            const x = TILE_SIZE * (this.x - camX);
            const y = TILE_SIZE * (this.y - camY) - 10;

            ctx.fillStyle = '#7d0000';
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