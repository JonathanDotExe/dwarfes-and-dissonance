export class Input {

    constructor() {
        this._left = false;
        this._right = false;
        this._up = false;
        this._down = false;

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
                this._righr = true;
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
                this._righr = false;
            }
        });
    }

    get movementAxis() {
        const x = this._right - this._left;
        const y = this._down - this._up;

        const length = Math.sqrt(x * x + y * y);
        return {x : x/length, y: y/length};
    }

}