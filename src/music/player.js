
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

    play(loop, ) {
        const source = new AudioBufferSourceNode();
        source.buffer = loop.buffer;
        source.connect(this._pan);
        //TODO play in time
        source.play();
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
        this._startTime = 0;
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
        this._startTime = this._audioCtx.currentTime;
        //TODO trigger initial loop start
    }

    get bpm() {
        return this._bpm;
    }

    get 

}