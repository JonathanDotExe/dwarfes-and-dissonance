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

    constructor(identifier, loops, chance) {
        super(identifier);
        this._loops = loops;
        this._chance = chance;
    }

    selectLoop(world) {
        if (Math.random() <= this._chance) {
            return this._loops[Math.floor(Math.random() * this._loops.length)]
        }
        return super.selectLoop(world);
    }

}

export class MusicGeneratorSection {

    constructor(tracks) {
        this._tracks = tracks;
    }

    get tracks() {
        return this._tracks;
    }

}

export class MusicGenerator {

    constructor(world, bpm, bars, channels, sections) {
        this._player = new MusicPlayer(bpm, bars);
        this._channels = channels;
        this._sections = sections;
        this._world = world;
        this._currentSection = 0;
    }
    
    init() {
        //Create tracks
        for (let key in this._channels) {
            const ch = this._channels[key](this._player.audioContext);
            this._player.addChannel(key, ch);
        }
        //Start
        this._player.onLoopStart = (player) => {
            const section = this._sections[this._currentSection];
            for (let track of section.tracks) {
                const loop = track.selectLoop(this.world);
                if (!!loop) {
                    player.play(track.identifier, loop);
                }
            }
        };
        this._player.start();
    }


}