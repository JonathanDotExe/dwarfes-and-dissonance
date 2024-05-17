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
            'chello': (ctx) => createGainChannel(ctx, 0.3),
            'violin1': (ctx) => createGainChannel(ctx, 1),
            'violin2': (ctx) => createGainChannel(ctx, 1),
            'glockenspiel1': (ctx) => createGainChannel(ctx, 0.6),
            'octave_piano1': (ctx) => createGainChannel(ctx, 0.5),
            'glockenspiel2': (ctx) => createGainChannel(ctx, 0.6),
            'octave_piano2': (ctx) => createGainChannel(ctx, 0.5),
            'brass': (ctx) => createGainChannel(ctx, 1),
            'pizz_strings': (ctx) => createGainChannel(ctx, 1),
            'pizz_drums': (ctx) => createGainChannel(ctx, 1),
        },
        [
            new MusicGeneratorSection(
                [
                    new RandomMusicGeneratorTrack(
                        'piano',
                        [new AudioLoop(AUDIO_FILES.pianoCalm1, 1), new AudioLoop(AUDIO_FILES.pianoCalm2, 1), new AudioLoop(AUDIO_FILES.pianoCalm3, 1)]
                    ),
                    new RandomMusicGeneratorTrack(
                        'drums',
                        [new AudioLoop(AUDIO_FILES.drumsCalm1, 1), new AudioLoop(AUDIO_FILES.drumsCalm2, 0), new AudioLoop(AUDIO_FILES.drumsCalm3, 0)],
                        { chance: 0.7, excludesAll: ['pizz_drums'] }
                    ),
                    new RandomMusicGeneratorTrack(
                        'epiano',
                        [new AudioLoop(AUDIO_FILES.epianoCalm1, 0), new AudioLoop(AUDIO_FILES.epianoCalm2, 0)],
                        { chance: 0.6, minEnergy: 0.3, dependsOnAll: ['pad'], excludesAll: ['pizz_strings'] }
                    ),
                    new RandomMusicGeneratorTrack(
                        'pad',
                        [new AudioLoop(AUDIO_FILES.padCalm1, 0), new AudioLoop(AUDIO_FILES.padCalm2, 0)],
                        { minEnergy: 0.3 }
                    ),
                    new RandomMusicGeneratorTrack(
                        'guitar',
                        [new AudioLoop(AUDIO_FILES.eguitarCalm1, 1)],
                        { chance: 0.4, minEnergy: 0.1, excludesAll: ['epiano'] }
                    ),
                    new RandomMusicGeneratorTrack(
                        'chello',
                        [new AudioLoop(AUDIO_FILES.chello1, 0)],
                        { minEnergy: 0.35 }
                    ),
                    new RandomMusicGeneratorTrack(
                        'doublebass',
                        [new AudioLoop(AUDIO_FILES.doublebass1, 0)],
                        { minEnergy: 0.2 }
                    ),
                    new RandomMusicGeneratorTrack(
                        'glockenspiel2',
                        [new AudioLoop(AUDIO_FILES.glockenspiel2, 0)],
                        { chance: 0.3, minEnergy: 0.3, excludesAll: ['epiano'] }
                    ),
                    new RandomMusicGeneratorTrack(
                        'pizz_strings',
                        [new AudioLoop(AUDIO_FILES.pizzStrings1, 0)],
                        { chance: 0.3, minEnergy: 0.4, excludesAll: ['epiano'] }
                    ),
                    new RandomMusicGeneratorTrack(
                        'pizz_drums',
                        [new AudioLoop(AUDIO_FILES.drumsPizz1, 0)],
                        { dependsOnAll: ['pizz_strings'] }
                    ),
                ], 0, 0.5),
            new MusicGeneratorSection(
                [
                    new RandomMusicGeneratorTrack(
                        'piano',
                        [new AudioLoop(AUDIO_FILES.pianoEpic1, 1), new AudioLoop(AUDIO_FILES.pianoEpic2, 1)]
                    ),
                    new RandomMusicGeneratorTrack(
                        'drums',
                        [new AudioLoop(AUDIO_FILES.drumsEpic1, 0), new AudioLoop(AUDIO_FILES.drumsEpic2, 0), new AudioLoop(AUDIO_FILES.drumsEpic3, 0)],
                        { minEnergy: 0.6 }
                    ),
                    new RandomMusicGeneratorTrack(
                        'pad',
                        [new AudioLoop(AUDIO_FILES.padCalm1, 0), new AudioLoop(AUDIO_FILES.padCalm2, 0)],
                        { chance: 0.5, minEnergy: 0.8 }
                    ),
                    new RandomMusicGeneratorTrack(
                        'guitar',
                        [new AudioLoop(AUDIO_FILES.eguitarCalm1, 1)],
                        { chance: 0.3, minEnergy: 0.7 }
                    ),
                    new RandomMusicGeneratorTrack(
                        'chello',
                        [new AudioLoop(AUDIO_FILES.chello1, 0)],
                        { minEnergy: 0.65 }
                    ),
                    new RandomMusicGeneratorTrack(
                        'doublebass',
                        [new AudioLoop(AUDIO_FILES.doublebass1, 0)],
                        { minEnergy: 0.5 }
                    ),
                    //Melody 1
                    new RandomMusicGeneratorTrack(
                        'violin1',
                        [new AudioLoop(AUDIO_FILES.violinEpic1, 1)],
                        { minEnergy: 0.7, chance: 0.8, excludesAll: ['pizz_strings'] }
                    ),
                    new RandomMusicGeneratorTrack(
                        'violin2',
                        [new AudioLoop(AUDIO_FILES.violin2Epic1, 0)],
                        { minEnergy: 0.85, dependsOnAll: ['violin1'] }
                    ),
                    new RandomMusicGeneratorTrack(
                        'octave_piano1',
                        [new AudioLoop(AUDIO_FILES.pianoOctave1, 1)],
                        { minEnergy: 0.75, dependsOnAll: ['violin1'] }
                    ),
                    new RandomMusicGeneratorTrack(
                        'brass',
                        [new AudioLoop(AUDIO_FILES.brassEpic1, 1)],
                        { minEnergy: 0.85, chance: 0.5, dependsOnAll: ['violin1'] }
                    ),
                    new RandomMusicGeneratorTrack(
                        'glockenspiel1',
                        [new AudioLoop(AUDIO_FILES.glockenspiel2, 1)],
                        { minEnergy: 0.85, chance: 0.5, dependsOnAll: ['violin1'] }
                    ),
                    //Melody 2
                    new RandomMusicGeneratorTrack(
                        'glockenspiel2',
                        [new AudioLoop(AUDIO_FILES.glockenspielEpic2, 0)],
                        { minEnergy: 0.6, chance: 0.5, dependsOnAll: ['octave_piano2'] }
                    ),
                    new RandomMusicGeneratorTrack(
                        'octave_piano2',
                        [new AudioLoop(AUDIO_FILES.pianoOctave2, 0)],
                        { minEnergy: 0.6, chance: 0.5 , excludesAll: ['violin1']}
                    ),
                    //Pizz
                    //TODO only trigger for dwarfes
                    new RandomMusicGeneratorTrack(
                        'pizz_strings',
                        [new AudioLoop(AUDIO_FILES.pizzStrings1, 0)],
                        { chance: 0.2, minEnergy: 0.6 }
                    ),

                ], 0.5, 1)
        ]);
}