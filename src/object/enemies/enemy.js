import {LivingObject} from "../livingobject.js";

export class Enemy extends LivingObject {

    constructor(x, y, maxHealth, range, speed) {
        super(x, y);
        this._maxHealth = maxHealth;
        this._health = maxHealth;
        this._range = range;
        this._speed = speed;
    }

    get range(){
        return this._range;
    }

    get speed(){
        return this._speed;
    }

    update(deltaTime, env) {
        super.update(deltaTime, env);
        //TODO implement inRange method

        // if(inRange(objectPosition))
        this.moveRand(deltaTime)
    }

    moveRand(deltaTime){
        let xMotion = 0;
        let yMotion = 0;
        const speed = this.speed;
        const diagonal = Math.sqrt(2 * speed * speed)/2;

        while (this.count >= 1) {
            this.count -= 1;
            this.dir = Math.floor(Math.random() * 8);

        }
        switch(this.dir) {
            case 0: // up
                yMotion = -speed;
                break;
            case 1: // right
                xMotion = speed;
                break;
            case 2: // down
                yMotion = speed;
                break;
            case 3: // left
                xMotion = -speed;
                break;
            case 4: // up right
                xMotion = diagonal;
                yMotion = -diagonal;
                break;
            case 5: // down right
                xMotion = diagonal;
                yMotion = diagonal;
                break;
            case 6: // down left
                xMotion = -diagonal;
                yMotion = diagonal;
                break;
            case 7: // up left
                xMotion = -diagonal;
                yMotion = -diagonal;
                break;

        }
        this.count += deltaTime
        this.move(xMotion, yMotion, deltaTime, false);
    }
}