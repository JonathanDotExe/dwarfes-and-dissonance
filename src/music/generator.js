import { Enemy } from "../object/enemies/enemy.js";
import { STONE_FLOOR_TILE } from "../object/tile.js";
import { AudioChannel, MusicPlayer } from "./player.js";

export class MusicGeneratorTrack {

    constructor(identifier) {
        this._identifier = identifier;
    }

    get identifier() {
        return this._identifier;
    }

    selectLoop(world) {
        return null;
    }

}

export class RandomMusicGeneratorTrack extends MusicGeneratorTrack {

    constructor(identifier, loops, options = {}) {
        super(identifier);
        this._loops = loops;
        this._options = {chance: 1, minEnergy: 0, maxEnergy: 2, dependsOnAll: [], excludesAll: [], canPlay: (world) => true};
        Object.assign(this._options, options);
        console.log(this._options)
    }

    selectLoop(world, energyLevel) {
        if (this._options.canPlay(world) && energyLevel >= this._options.minEnergy && energyLevel < this._options.maxEnergy && Math.random() <= this._options.chance) {
            return { 
                loop: this._loops[Math.floor(Math.random() * this._loops.length)],
                dependsOnAll: this._options.dependsOnAll,
                excludesAll: this._options.excludesAll,
            }
        }
        return super.selectLoop(world);
    }

}

export class MusicGeneratorSection {

    constructor(tracks, minEnergy = 0, maxEnergy = 1) {
        this._tracks = tracks;
        this._minEnergy = minEnergy;
        this._maxEnergy = maxEnergy;
    }

    get tracks() {
        return this._tracks;
    }

    get minEnergy() {
        return this._minEnergy;
    }

    get maxEnergy() {
        return this._maxEnergy;
    }

}

export class EnergySupplier {

    getEnergyLevel(world) {
        return 0;
    }

    update(delta) {

    }

}

export class AmbientEnergySupplier extends EnergySupplier {

    constructor() {
        this._energyLevel = 0;
        this._time = 1;
        this._energyChange = 0;
    }

    getEnergyLevel(world) {
        const energyLevel = world.getTile(Math.floor(world.player.x + world.player.width/2), Math.floor(world.player.y + world.player.height/2)) == STONE_FLOOR_TILE ? Math.min(this._energyLevel + 0.3, 1) : this._energyLevel;
        return energyLevel;
    }

    update(delta) {
        this._time += delta;
        if (this._time >= 1) {
            this._time = 0;
            this._energyChange = (Math.random() - 0.3) * 0.025;
        }
        //Energy level ramp
        this._energyLevel += this._energyChange * delta;
        if (this._energyLevel < 0) {
            this._energyLevel = 0;
        }
        if (this._energyLevel > 1) {
            this._energyLevel = Math.random() * 0.6;
        }
    }

}

export class FightEnergySupplier extends EnergySupplier {

    getEnergyLevel(world) {
        const enemies = world.getObjectsInArea(world.player.x - 12, world.player.y - 12, 24 + world.player.width, 24 + world.player.height).filter(e => e instanceof Enemy);
        return Math.min(enemies.length/8.0 + (1 - world.player.healthPercent) * 0.4, 1);
    }

}

export class MusicGenerator {

    constructor(world, bpm, bars, beatsPerBar, channels, sections, energySupplier) {
        this._player = new MusicPlayer(bpm, bars, beatsPerBar);
        this._channels = channels;
        this._sections = sections;
        this._world = world;
        this._energySupplier = energySupplier;
    }
    
    init() {
        //Create tracks
        for (let key in this._channels) {
            const ch = this._channels[key](this._player.audioContext);
            this._player.addChannel(key, ch);
        }
        //Start
        this._player.onLoopStart = (player) => {
            //Find section
            const energyLevel = this._energySupplier.getEnergyLevel(this._world);
            const sections = this._sections.filter(s => s.minEnergy <= energyLevel && s.maxEnergy > energyLevel);
            const section = sections[Math.floor(Math.random() * sections.length)];
            const loops = {};
            console.log(energyLevel + "/" + this._energyLevel);
            //Select loops
            for (let track of section.tracks) {
                const loop = track.selectLoop(this._world, energyLevel);
                if (loop) {
                    loops[track.identifier] = loop;
                }
            }
            //Filter loops
            let size;
            do { //Filter till there are no changes
                size = Object.keys(loops).length
                for (let key in loops) {
                    if (loops[key].excludesAll.some(e => e in loops) || loops[key].dependsOnAll.some(e => !(e in loops))) {
                        console.log('Delete ' + key)
                        delete loops[key];
                    }
                }
            } while (size != Object.keys(loops).length);
            //Play loops
            for (let key in loops) {
                player.play(key, loops[key].loop);
            }
        };
        this._player.start();
    }

    update(delta) {
        this._energySupplier.update(delta);
        //Water
        if (this._world._player.isInFluid()) {
            this._player.activateWaterFilter();
        }
        else {
            this._player.deactivateWaterFilter();
        }
        //Cave
        if (this._world.getTile(Math.floor(this._world.player.x + this._world.player.width/2), Math.floor(this._world.player.y + this._world.player.height/2)) == STONE_FLOOR_TILE) {
            this._player.activateCaveReverb();
        }
        else {
            this._player.deactivateCaveReverb();
        }
    }

}