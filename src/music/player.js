import { SimpleReverb } from "../lib/reverb.js";

/**
 * A playable audio loop with the binary media data and the amount of bars of silence before the loop starts
 */
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


/**
 * Represents an audio channel of one instrument with a processing chain
 * Start is the first noide of the chain where the audio is sent into and end is the output that is sent to the master effects.
 */
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

export function createGainChannel(ctx, g) {
    let gain = ctx.createGain();
    gain.gain.setValueAtTime(g, 0);
    return new AudioChannel(gain, gain);
}

export class MusicPlayer {

    constructor(bpm, bars, beatsPerBar, ctx) {
        this._bpm = bpm;
        this._bars = bars;
        this._beatsPerBar = beatsPerBar;
        this._channels = {};
        this._audioCtx =  ctx;
        this.onLoopStart = (player) => {};
        this._nextLoopTime = 0;
        this._preDecisionBars = 2;
        //Gain
        this._masterGain = this._audioCtx.createGain();
        this._masterGain.connect(this._audioCtx.destination);
        //Filter
        this._filter = this._audioCtx.createBiquadFilter();
        this._filter.frequency.setValueAtTime(700, this._audioCtx.currentTime);
        this._filter.Q.setValueAtTime(1, this._audioCtx.currentTime);
        this.deactivateWaterFilter();
        this._filter.connect(this._masterGain);
        //Reverb
        this._reverb = new SimpleReverb(this._audioCtx, {
            seconds: 5,
            decay: 5
        });
        this._reverb.connect(this._masterGain);
        //Mix
        this._wetGain = this._audioCtx.createGain();
        this._filter.connect(this._wetGain);
        this._wetGain.connect(this._reverb.input);
        this.deactivateCaveReverb();
        this._running = true;
        this._masterGain.gain.value = 1;

        /**
         * Processing chain
         * 
         * channels -> filter ------------------> master -> out
         *               |                          ^
         *               |->  wetGain -> reverb ----|
         * 
         */
    }

    /**
     * Create a channel for a track with the given key
     */
    addChannel(key, ch) {
        if (key in this._channels) {
            throw "Channel with key " + key + " already created.";
        }
        ch.connect(this._filter);
        this._channels[key] = ch;
        return key;
    }

    /**
     * Plays the given loop in the given channel in time with the next loop iteration
     */
    play(key, loop) {
        this._channels[key].play(loop, this);
    }

    start() {
        this._nextLoopTime = this._audioCtx.currentTime + this.barDuration * 2; //Start in two bars
        const t = this;
        const func = () => {  //Loop every half bar and check if it's time to generate the next audio
            if (this._running) {
                if (t._nextLoopTime - t._audioCtx.currentTime <= t._preDecisionBars * t.barDuration) {
                    t.onLoopStart(t);
                    t._nextLoopTime += t.loopDuration;
                }
                setTimeout(func, t.barDuration/2);
            }
        };
        func();
    }

    activateWaterFilter() {
        this._filter.type ='lowpass';
    }

    deactivateWaterFilter() {
        this._filter.type = 'peaking';
    }

    activateCaveReverb() {
        this._wetGain.gain.value = 1.5;
    }

    deactivateCaveReverb() {
        this._wetGain.gain.value = 0;
    }


    fadeIn(time) {
        this._masterGain.gain.exponentialRampToValueAtTime(1, this._audioCtx.currentTime + time);
    }

    fadeOut(time) {
        this._masterGain.gain.exponentialRampToValueAtTime(Number.EPSILON, this._audioCtx.currentTime + time);
    }

    stop(time) {
        this._running = false;
        this.fadeOut(time);
    }

    get bpm() {
        return this._bpm;
    }

    get bars() {
        return this._bars;
    }

    get beatsPerBar() {
        return this._beatsPerBar;
    }

    get barDuration() {
        return 60.0/(this.bpm) * this.beatsPerBar;
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