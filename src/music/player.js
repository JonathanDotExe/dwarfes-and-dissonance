
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

    constructor(start, end) {
        this._start = start;
        this._end = end;
    }

    play(loop, player) {
        const source = player.audioContext.createBufferSource();
        source.buffer = loop.buffer;
        source.connect(this._start);
        const time = player.nextLoopTime - player.barDuration * loop.preBars
        if (time >= player.audioContext.currentTime) {
            source.start(time);
        }
    }

    connect(dst) {
        this._end.connect(dst);
    }

}

export class MusicPlayer {

    constructor(bpm, bars) { //BPM 108, bars 8
        this._bpm = bpm;
        this._bars = bars;
        this._channels = {};
        this._audioCtx = new (window.AudioContext || window.webkitAudioContext)({sampleRate: 48000});
        //this._audioCtx.sampleRate = 48000;
        this.onLoopStart = (player) => {};
        this._nextLoopTime = 0;
    }

    addChannel(key, ch) {
        if (key in this._channels) {
            throw "Channel with key " + key + " already created.";
        }
        ch.connect(this._audioCtx.destination);
        this._channels[key] = ch;
        return key;
    }

    play(key, loop) {
        this._channels[key].play(loop, this);
    }

    start() {
        this._nextLoopTime = this._audioCtx.currentTime + this.barDuration * 2; //Start in two bars
        const t = this;
        const func = () => {  //Loop every half bar and check if it's time to generate the next audio
            if (this._nextLoopTime - t._audioCtx.currentTime <= t.loopDuration) {
                t.onLoopStart(t);
                t._nextLoopTime += t.loopDuration;
            }
            setTimeout(func, t.barDuration/2);
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

    get audioContext() {
        return this._audioCtx;
    }

}