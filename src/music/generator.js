import { Enemy } from "../object/enemies/enemy.js";
import { STONE_FLOOR_TILE } from "../object/tile.js";
import { AudioChannel, MusicPlayer } from "./player.js";

/**
 * Represents a track for a music piece containing the loops for the corresponding channel
 */
export class MusicGeneratorTrack {

    constructor(identifier, loops, options = {}) {
        this._identifier = identifier;
        this._loops = loops;
        this._options = {chance: 1, minEnergy: 0, maxEnergy: 2, dependsOnAll: [], excludesAll: [], canPlay: (world) => true};
        Object.assign(this._options, options);
        console.log(this._options)
    }

    get identifier() {
        return this._identifier;
    }

    /**
     * Selects a loop from the list of possible loops
     */
    selectLoop(world, energyLevel) {
        return null
    }

    /**
     * Returns the loop that should be played on the channel next iteration or none if the conditions are not met
     */
    nextLoop(world, energyLevel) {
        if (this._options.canPlay(world) && energyLevel >= this._options.minEnergy && energyLevel < this._options.maxEnergy && Math.random() <= this._options.chance) { //Conditions
            const loop = this.selectLoop(world, energyLevel);
            if (!loop) {
                return null;
            }
            return { 
                loop: loop,
                dependsOnAll: this._options.dependsOnAll,
                excludesAll: this._options.excludesAll,
            }
        }
        return null;
    }

    selectionFinished() { //Always called when the selection of the next loop is finished for all generators

    }

}

/**
 * A track that randomly selects a loop from the list of possible loops
 */
export class RandomMusicGeneratorTrack extends MusicGeneratorTrack {

    constructor(identifier, loops, options = {}) {
        super(identifier, loops, options);
    }

    selectLoop(world, energyLevel) {
        return this._loops[Math.floor(Math.random() * this._loops.length)];
    }

}

/**
 * A track that always plays the loops sequentially after each other
 */
export class SequenceMusicGeneratorTrack extends MusicGeneratorTrack {

    constructor(identifier, loops, options = {}) {
        super(identifier, loops, options);
        this._index = 0;
        this._selected = false;
    }

    get index() {
        return this._index;
    }

    selectLoop(world, energyLevel) {
        this._selected = true;
        return this._loops[this.index];
    }

    selectionFinished() {
        if (this._selected) {
            this._index = (this._index + 1) % this._loops.length;
        }
        else {
            this._index = 0;
        }
        this._selected = false;
    }

}


/**
 * A track that always plays the loops at the position another track is playing (to synchronize them)
 */
export class SyncMusicGeneratorTrack extends MusicGeneratorTrack {

    constructor(identifier, loops, track, options = {}) {
        super(identifier, loops, options);
        this._track = track;
    }

    selectLoop(world, energyLevel) {
        return this._loops[this._track.index];
    }

}

/**
 * A section of a music piece with a collection of tracks that plays in a specific energy range
 */
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

/**
 * An abstract class that supplies the music generator with an energy level used for loop selection
 */
export class EnergySupplier {

    getEnergyLevel(world) {
        return 0;
    }

    update(delta) {

    }

}

/**
 * The energy supplier for the ambient. The energy slowly rises and randomly dips sometimes.
 */
export class AmbientEnergySupplier extends EnergySupplier {

    constructor() {
        super();
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

/**
 * Supplies the energy for a fight. Energy is based on the amount and type of enemys around as well as the players health.
 */
export class FightEnergySupplier extends EnergySupplier {

    getEnergyLevel(world) {
        const enemies = world.getObjectsInArea(world.player.x - 12, world.player.y - 12, 24 + world.player.width, 24 + world.player.height).filter(e => e instanceof Enemy);
        return Math.min(enemies.reduce((sum, e) => sum + e.energyScore, 0.0)/10.0 + (1 - world.player.healthPercent) * 0.3, 1);
    }

}

/**
 * A dynamic generator of game music. Has a collection of sections with tracks with multiply possible loops. All loops have the same bar length and tempo.
 * The music generator internally creates a music player and supplies it with the loops to play.
 */
export class MusicGenerator {

    constructor(world, bpm, bars, beatsPerBar, channels, sections, energySupplier, ctx) {
        this._player = new MusicPlayer(bpm, bars, beatsPerBar, ctx);
        this._channels = channels;
        this._sections = sections;
        this._world = world;
        this._energySupplier = energySupplier;
    }
    
    /**
     * Starts the music
     */
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
                const loop = track.nextLoop(this._world, energyLevel);
                if (!!loop) {
                    loops[track.identifier] = loop;
                }
            }
            for (let track of section.tracks) {
                track.selectionFinished();
            }
            //Filter loops
            let size;
            do { //Filter till there are no changes
                size = Object.keys(loops).length
                for (let key in loops) {
                    if (loops[key].excludesAll.some(e => e in loops) || loops[key].dependsOnAll.some(e => !(e in loops))) {
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

    /**
     * Called every game update
     * Used to activate special effects when the player enters water or caves
     */
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

    //Forward to player
    fadeIn(time) {
        this._player.fadeIn(time);
    }

    fadeOut(time) {
        this._player.fadeOut(time);
    }

    stop(time) {
        this._player.stop(time);
    }

}