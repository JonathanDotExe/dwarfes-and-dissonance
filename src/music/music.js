import { MusicGenerator, MusicGeneratorSection, RandomMusicGeneratorTrack } from "./generator.js";
import { AudioLoop, createGainChannel } from "./player.js";


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
    AUDIO_FILES.brassEpic1 = await loadAudio("/res/loops/ambient/brass_epic1.flac", audioCtx);
    AUDIO_FILES.chello1 = await loadAudio("/res/loops/ambient/chello1.flac", audioCtx);
    AUDIO_FILES.drumsEpic1 = await loadAudio("/res/loops/ambient/drums_epic1.flac", audioCtx);
    AUDIO_FILES.drumsEpic2 = await loadAudio("/res/loops/ambient/drums_epic2.flac", audioCtx);
    AUDIO_FILES.drumsEpic3 = await loadAudio("/res/loops/ambient/drums_epic3.flac", audioCtx);
    AUDIO_FILES.drumsPizz1 = await loadAudio("/res/loops/ambient/drums_pizz1.flac", audioCtx);
    AUDIO_FILES.glockenspielEpic1 = await loadAudio("/res/loops/ambient/glockenspiel_epic1.flac", audioCtx);
    AUDIO_FILES.glockenspielEpic2 = await loadAudio("/res/loops/ambient/glockenspiel_epic2.flac", audioCtx);
    AUDIO_FILES.pianoOctave1 = await loadAudio("/res/loops/ambient/piano_octave1.flac", audioCtx);
    AUDIO_FILES.pianoOctave2 = await loadAudio("/res/loops/ambient/piano_octave2.flac", audioCtx);
    AUDIO_FILES.pizzStrings1 = await loadAudio("/res/loops/ambient/pizz_strings1.flac", audioCtx);
    AUDIO_FILES.violinEpic1 = await loadAudio("/res/loops/ambient/violins_epic1.flac", audioCtx);
    AUDIO_FILES.violin2Epic1 = await loadAudio("/res/loops/ambient/violin2_epic1.flac", audioCtx);

    resolve(AUDIO_FILES);
});


export async function createAmbientMusicGenerator(world) {
    await AUDIO_PROMISE;
    return new MusicGenerator(world, 108, 8,
        {
            'piano': (ctx) => createGainChannel(ctx, 1),
            'drums': (ctx) => createGainChannel(ctx, 1),
            'epiano': (ctx) => createGainChannel(ctx, 0.5),
            'pad': (ctx) => createGainChannel(ctx, 0.2),
            'guitar': (ctx) => createGainChannel(ctx, 0.6),
            'doublebass': (ctx) => createGainChannel(ctx, 0.3),
        },
        [
            new MusicGeneratorSection(
                [
                    new RandomMusicGeneratorTrack(
                        'piano',
                        [new AudioLoop(AUDIO_FILES.pianoCalm1, 1), new AudioLoop(AUDIO_FILES.pianoCalm2, 1), new AudioLoop(AUDIO_FILES.pianoCalm3, 1)],
                        1
                    ),
                    new RandomMusicGeneratorTrack(
                        'drums',
                        [new AudioLoop(AUDIO_FILES.drumsCalm1, 1), new AudioLoop(AUDIO_FILES.drumsCalm2, 0), new AudioLoop(AUDIO_FILES.drumsCalm3, 0)],
                        0.7
                    ),
                    new RandomMusicGeneratorTrack(
                        'epiano',
                        [new AudioLoop(AUDIO_FILES.epianoCalm1, 0), new AudioLoop(AUDIO_FILES.epianoCalm2, 0)],
                        0.3
                    ),
                    new RandomMusicGeneratorTrack(
                        'pad',
                        [new AudioLoop(AUDIO_FILES.padCalm1, 0), new AudioLoop(AUDIO_FILES.padCalm2, 0)],
                        0.5
                    ),
                    new RandomMusicGeneratorTrack(
                        'guitar',
                        [new AudioLoop(AUDIO_FILES.eguitarCalm1, 1)],
                        0.5
                    ),
                    new RandomMusicGeneratorTrack(
                        'doublebass',
                        [new AudioLoop(AUDIO_FILES.doublebass1, 0)],
                        0.5
                    )
                ]),
            new MusicGeneratorSection(
                [
                    new RandomMusicGeneratorTrack(
                        'piano',
                        [new AudioLoop(AUDIO_FILES.pianoEpic1, 1), new AudioLoop(AUDIO_FILES.pianoEpic2, 1)],
                        1
                    ),
                    new RandomMusicGeneratorTrack(
                        'drums',
                        [new AudioLoop(AUDIO_FILES.drumsEpic1, 0), new AudioLoop(AUDIO_FILES.drumsEpic2, 0), new AudioLoop(AUDIO_FILES.drumsEpic3, 0)],
                        1
                    ),
                    new RandomMusicGeneratorTrack(
                        'pad',
                        [new AudioLoop(AUDIO_FILES.padCalm1, 0), new AudioLoop(AUDIO_FILES.padCalm2, 0)],
                        0.5
                    ),
                    new RandomMusicGeneratorTrack(
                        'guitar',
                        [new AudioLoop(AUDIO_FILES.eguitarCalm1, 1)],
                        0.5
                    )
                ]
            )
        ]);
}