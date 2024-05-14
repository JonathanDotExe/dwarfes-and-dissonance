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

    constructor(identifier, loops, options = {chance: 1, minEnergy: 0, maxEnergy: 1}) {
        super(identifier);
        this._loops = loops;
        this._options = {chance: 1, minEnergy: 0, maxEnergy: 1};
        Object.assign(this._options, options);
        console.log(this._options)
    }

    selectLoop(world, energyLevel) {
        if (energyLevel >= this._options.minEnergy && energyLevel < this._options.maxEnergy && Math.random() <= this._options.chance) {
            return this._loops[Math.floor(Math.random() * this._loops.length)]
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

export class MusicGenerator {

    constructor(world, bpm, bars, channels, sections) {
        this._player = new MusicPlayer(bpm, bars);
        this._channels = channels;
        this._sections = sections;
        this._world = world;
        this._energyLevel = 0;
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
            const sections = this._sections.filter(s => s.minEnergy <= this._energyLevel && s.maxEnergy > this._energyLevel);
            const section = sections[Math.floor(Math.random() * sections.length)];
            for (let track of section.tracks) {
                const loop = track.selectLoop(this.world, this._energyLevel);
                if (!!loop) {
                    player.play(track.identifier, loop);
                }
            }
        };
        this._player.start();
    }

    update(delta) {
        //Energy level ramp
        this._energyLevel += (Math.random() - 0.3)/20 * delta;
        if (this._energyLevel < 0) {
            this._energyLevel = 0;
        }
        if (this._energyLevel >= 1) {
            this._energyLevel = Math.random() * 0.5;
        }

        console.log(this._energyLevel);
    }


}