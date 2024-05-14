import { GameWorld } from "./world.js";
import { Input } from "./input.js";
import { TILE_SIZE } from "./object/tile.js";
import { createAmbientMusicGenerator } from "./music/music.js";

export class Game {

    constructor(canvas) {
        this._canvas = canvas;
        this._input = new Input();
        this._world = new GameWorld();
    }

    async start() {
        //Music
        const music = await createAmbientMusicGenerator(this._world);
        music.init();
        let lastTime = 0;
        const world = this._world;
        const ctx = this._canvas.getContext('2d');
        const env =  {input: this._input};
        const canvas = this._canvas;
        function loop(time) {
            //Calc delta
            const delta = (time - lastTime)/1000.0;
            lastTime = time;
            //Update/draw
            world.update(delta, env);
            music.update(delta);
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            world.draw(ctx, canvas.width/TILE_SIZE, canvas.height/TILE_SIZE);

            window.requestAnimationFrame(loop);
        }
        window.requestAnimationFrame(loop);
    }
    
    //Source: https://www.sitepoint.com/quick-tip-game-loop-in-javascript/

}

window.addEventListener('load', () => {
    const canvas = document.querySelector('#game')
    const start = document.querySelector('#start');
    canvas.addEventListener('click', () => {
        canvas.requestFullscreen();
    });
    let started = false;
    start.addEventListener('click', () => {
        if (!started) {
            const game = new Game(canvas);
            started = true;
            game.start();
        }
    });
});