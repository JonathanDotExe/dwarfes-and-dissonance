
export class AudioLoop {

    constructor(buffer, preBars) {
        this._buffer = buffer;
        this._preBars = preBars;
    }

    get buffer() {
        return this._buffer;
    }

    get preBars() {
        return this._preBars;
    }
}


export class AudioChannel {

    constructor() {
        this._pan = new PannerNode();
        this._gain = new GainNode();

        this._pan.connect(this._gain);
    }

    play(loop, player) {
        const source = new AudioBufferSourceNode();
        source.buffer = loop.buffer;
        source.connect(this._pan);
        source.play(player.nextLoopTime - player.barDuration * loop.preBars);
    }

    connect(dst) {
        this._gain.connect(dst);
    }

}

export class MusicPlayer {

    constructor(bpm, bars) { //BPM 108, bars 8
        this._bpm = bpm;
        this._bars = bars;
        this._channels = {};
        this._audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        this._audioCtx.sampleRate = 48000;
        this.onLoopStart = (player) => {};
        this._nextLoopTime = 0;
    }

    addChannel(key) {
        if (key in this._channels) {
            throw "Channel with key " + key + " already created.";
        }
        const ch = new AudioChannel();
        ch.connect(this._audioCtx);
        this._channels[key] = ch;
    }

    start() {
        this._nextLoopTime = this._audioCtx.currentTime;
        const t = this;
        const func = () => {  //Loop every half bar and check if it's time to generate the next audio
            if (this._nextLoopTime - t._audioCtx.currentTime <= t.barDuration) {
                t.onLoopStart(t);
                t._nextLoopTime += this.loopDuration;
            }
            setTimeout(func, this.barDuration/2);
        };
        func();
    }

    get bpm() {
        return this._bpm;
    }

    get bars() {
        return this._bars;
    }

    get barDuration() {
        return 60.0/(this.bpm) * 4;
    }

    get loopDuration() {
        return this.barDuration * this.bars;
    }

    get nextLoopTime() {
        return this._nextLoopTime;
    }

}