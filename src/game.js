import { GameWorld } from "./world.js";

export class Game {

    constructor(canvas) {
        this._canvas = canvas;
        this._world = new GameWorld();
    }

    start() {
        let lastTime = 0;
        const world = this._world;
        const ctx = this._canvas.getContext('2d');
        function loop(time) {
            //Calc delta
            const delta = (time - lastTime)/1000.0;
            console.log(delta);
            lastTime = time;
            //Update/draw
            world.update(delta);
            world.draw(ctx);

            window.requestAnimationFrame(loop);
        }
        window.requestAnimationFrame(loop);
    }
    
    //Source: https://www.sitepoint.com/quick-tip-game-loop-in-javascript/

}

window.addEventListener('load', () => {
    const canvas = document.querySelector('#game')
    const game = new Game(canvas);
    game.start();
});