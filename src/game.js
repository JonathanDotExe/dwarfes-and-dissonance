import { GameWorld } from "./world.js";
import { Input } from "./input.js";
import { TILE_SIZE } from "./object/tile.js";
import { createAmbientMusicGenerator, createFightMusicGenerator } from "./music/music.js";
import { Enemy } from "./object/enemies/enemy.js";

export class Game {

    constructor(canvas) {
        this._canvas = canvas;
        this._input = new Input();
        this._world = new GameWorld();
        
    }

    async start() {
        //Music
        this._music = await createAmbientMusicGenerator(this._world);
        this._fightMusic = null;
        this._music.init();
        let lastTime = 0;
        const world = this._world;
        const ctx = this._canvas.getContext('2d');
        const env =  {input: this._input};
        const canvas = this._canvas;
        const t = this
        async function loop(time) {
            //Calc delta
            const delta = (time - lastTime)/1000.0;
            lastTime = time;
            //Update/draw
            world.update(delta, env);
            t._music.update(delta);
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            world.draw(ctx, canvas.width/TILE_SIZE, canvas.height/TILE_SIZE);
            //Music
            //FIXME
            const enemies = world.getObjectsInArea(world.player.x - 12, world.player.y - 12, 24 + world.player.width, 24 + world.player.height).filter(e => e instanceof Enemy);
            if (t._fightMusic && world.getObjectsInArea(world.player.x - 15, world.player.y - 15, 30 + world.player.width, 30 + world.player.height).filter(e => e instanceof Enemy).length <= 0) {
                //End fight
                t._fightMusic.stop();
                t._fightMusic = null;
                t._music.fadeIn();
            }
            else if (!t._fightMusic && world.getObjectsInArea(world.player.x - 8, world.player.y - 8, 16 + world.player.width, 16 + world.player.height).filter(e => e instanceof Enemy).length > 0) {
                //Start fight
                t._music.fadeOut();
                t._fightMusic = await createFightMusicGenerator(world);
                t._fightMusic.init();
            }

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