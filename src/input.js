export class Input {

    constructor() {
        this._left = false;
        this._right = false;
        this._up = false;
        this._down = false;
        this._attack = false;
        this._interact = false;

        window.addEventListener("keydown", e => {
            const key = e.key.toLowerCase();
            if (key == 'w') {
                this._up = true;
            }
            else if (key == 'a') {
                this._left = true;
            }
            else if (key == 's') {
                this._down = true;
            }
            else if (key == 'd') {
                this._right = true;
            }
            else if (key == 'e') {
                this._interact = true;
            }
        });
        window.addEventListener("keyup", e => {
            const key = e.key.toLowerCase();
            if (key == 'w') {
                this._up = false;
            }
            else if (key == 'a') {
                this._left = false;
            }
            else if (key == 's') {
                this._down = false;
            }
            else if (key == 'd') {
                this._right = false;
            }
            else if (key == 'e') {
                this._interact = false;
            }
        });
        window.addEventListener("mousedown",e => {
            this._attack = true;
        });
        window.addEventListener("mouseup",e => {
            this._attack = false;
        });
    }

    get movementAxis() {
        const x = this._right - this._left;
        const y = this._down - this._up;

        let length = Math.sqrt(x * x + y * y);
        if (length == 0) {
            length = 1;
        }
        return {x : x/length, y: y/length};
    }

    get currentlyAttacking() {
        return this._attack;
    }

    get currentlyInteracting() {
        return this._interact;
    }
}