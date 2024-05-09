import { MusicGenerator, RandomMusicGeneratorTrack } from "./generator.js";
import { AudioLoop } from "./player.js";


async function loadAudio(url, ctx) {
    const response = await fetch(url);
    const arr = await response.arrayBuffer();
    const data = await ctx.decodeAudioData(arr);
    return data;
}

const AUDIO_FILES = {

};

const AUDIO_PROMISE = new Promise(async (resolve, reject) => {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)({sampleRate: 48000});
    AUDIO_FILES.pianoCalm1 = await loadAudio("/res/loops/ambient/piano_calm1.flac", audioCtx);
    AUDIO_FILES.pianoCalm2 = await loadAudio("/res/loops/ambient/piano_calm2.flac", audioCtx);
    AUDIO_FILES.pianoCalm3 = await loadAudio("/res/loops/ambient/piano_calm3.flac", audioCtx);
    AUDIO_FILES.pianoEpic1 = await loadAudio("/res/loops/ambient/piano_epic1.flac", audioCtx);
    AUDIO_FILES.pianoEpic2 = await loadAudio("/res/loops/ambient/piano_epic2.flac", audioCtx);
    AUDIO_FILES.epianoCalm1 = await loadAudio("/res/loops/ambient/epiano_calm1.flac", audioCtx);
    AUDIO_FILES.epianoCalm2 = await loadAudio("/res/loops/ambient/epiano_calm2.flac", audioCtx);
    AUDIO_FILES.padCalm1 = await loadAudio("/res/loops/ambient/pad_calm1.flac", audioCtx);
    AUDIO_FILES.padCalm2 = await loadAudio("/res/loops/ambient/pad_calm2.flac", audioCtx);
    AUDIO_FILES.drumsCalm1 = await loadAudio("/res/loops/ambient/drums_calm1.flac", audioCtx);
    AUDIO_FILES.drumsCalm2 = await loadAudio("/res/loops/ambient/drums_calm2.flac", audioCtx);
    AUDIO_FILES.drumsCalm3 = await loadAudio("/res/loops/ambient/drums_calm3.flac", audioCtx);
    AUDIO_FILES.eguitarCalm1 = await loadAudio("/res/loops/ambient/eguitar_calm1.flac", audioCtx);
    AUDIO_FILES.doublebass1 = await loadAudio("/res/loops/ambient/doublebass1.flac", audioCtx);

    resolve(AUDIO_FILES);
});


export async function createAmbientMusicGenerator(world) {
    await AUDIO_PROMISE;
    return new MusicGenerator(world, 108, 8, [
        new RandomMusicGeneratorTrack(
            'piano',
            [new AudioLoop(AUDIO_FILES.pianoCalm1, 1), new AudioLoop(AUDIO_FILES.pianoCalm2, 1), new AudioLoop(AUDIO_FILES.pianoCalm3, 1), new AudioLoop(AUDIO_FILES.pianoEpic1, 1), new AudioLoop(AUDIO_FILES.pianoEpic2, 1)],
            1,
            1
        ),
        new RandomMusicGeneratorTrack(
            'drums',
            [new AudioLoop(AUDIO_FILES.drumsCalm1, 1), new AudioLoop(AUDIO_FILES.drumsCalm2, 0), new AudioLoop(AUDIO_FILES.drumsCalm3, 0)],
            0.7,
            1
        ),
        new RandomMusicGeneratorTrack(
            'epiano',
            [new AudioLoop(AUDIO_FILES.epianoCalm1, 0), new AudioLoop(AUDIO_FILES.epianoCalm2, 0)],
            0.3,
            0.5
        ),
        new RandomMusicGeneratorTrack(
            'pad',
            [new AudioLoop(AUDIO_FILES.padCalm1, 0), new AudioLoop(AUDIO_FILES.padCalm2, 0)],
            0.5,
            0.2
        ),
        new RandomMusicGeneratorTrack(
            'guitar',
            [new AudioLoop(AUDIO_FILES.eguitarCalm1, 1)],
            0.5,
            0.6
        ),
        new RandomMusicGeneratorTrack(
            'doublebass',
            [new AudioLoop(AUDIO_FILES.doublebass1, 0)],
            0.5,
            0.3
        )
    ]);
}