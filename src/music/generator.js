import { AudioChannel, MusicPlayer } from "./player.js";

export class MusicGeneratorTrack {

    constructor(identifier) {
        this._identifier = identifier;
        this._gain = 1;
        this._pan = 0;
    }

    get identifier() {
        return this._identifier;
    }

    selectLoop(world) {
        return null;
    }

    createChannel() {
        pan = new PannerNode();
        pan.pan.setValueAtTime(this._pan, 0);
        gain = new GainNode();
        gain.gain.setValueAtTime(this._gain, 0);

        pan.connect(gain);
        return new AudioChannel(pan, gain);
    }

}

export class RandomMusicGeneratorTrack {

    constructor(identifier, loops, chance) {
        super(identifier);
        this._loops = loops;
        this._chance = chance;
    }

    selectLoop(world) {
        if (Math.random() <= this._chance) {
            return this._loops[Math.floor(Math.random() * this._loops(chance))]
        }
        return super.selectTrack(world);
    }

}

export class MusicGenerator {

    constructor(world, bpm, bars, tracks) {
        this._player = new MusicPlayer(bpm, bars);
        this._tracks = tracks;
        this._world = world;
    }
    
    init() {
        //Create tracks
        for (let track of this._tracks) {
            const ch = track.createChannel();
            this._player.addChannel(track.identifier, ch);
        }
        //Start
        this._player.onLoopStart = (player) => {
            for (let track of this._tracks) {
                const loop = selectLoop(track);
                if (!!loop) {
                    player.play(track.identifier, loop);
                }
            }
        };
        this._player.start();
    }


}