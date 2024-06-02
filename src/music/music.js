import { Chest } from "../object/static/chest.js";
import { Tree } from "../object/static/tree.js";
import { SAND_TILE } from "../object/tile.js";
import { AmbientEnergySupplier, FightEnergySupplier, MusicGenerator, MusicGeneratorSection, RandomMusicGeneratorTrack, SequenceMusicGeneratorTrack, SyncMusicGeneratorTrack } from "./generator.js";
import { AudioLoop, createGainChannel } from "./player.js";


async function loadAudio(url, ctx) {
    const response = await fetch(url);
    const arr = await response.arrayBuffer();
    const data = await ctx.decodeAudioData(arr);
    return data;
}

const AUDIO_FILES = {
    ambient: {},
    fight: {}
};

const AUDIO_PROMISE = new Promise(async (resolve, reject) => {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)({sampleRate: 48000});
    AUDIO_FILES.ambient.pianoCalm1 = await loadAudio("/res/loops/ambient/piano_calm1.flac", audioCtx);
    AUDIO_FILES.ambient.pianoCalm2 = await loadAudio("/res/loops/ambient/piano_calm2.flac", audioCtx);
    AUDIO_FILES.ambient.pianoCalm3 = await loadAudio("/res/loops/ambient/piano_calm3.flac", audioCtx);
    AUDIO_FILES.ambient.pianoEpic1 = await loadAudio("/res/loops/ambient/piano_epic1.flac", audioCtx);
    AUDIO_FILES.ambient.pianoEpic2 = await loadAudio("/res/loops/ambient/piano_epic2.flac", audioCtx);
    AUDIO_FILES.ambient.epianoCalm1 = await loadAudio("/res/loops/ambient/epiano_calm1.flac", audioCtx);
    AUDIO_FILES.ambient.epianoCalm2 = await loadAudio("/res/loops/ambient/epiano_calm2.flac", audioCtx);
    AUDIO_FILES.ambient.padCalm1 = await loadAudio("/res/loops/ambient/pad_calm1.flac", audioCtx);
    AUDIO_FILES.ambient.padCalm2 = await loadAudio("/res/loops/ambient/pad_calm2.flac", audioCtx);
    AUDIO_FILES.ambient.drumsCalm1 = await loadAudio("/res/loops/ambient/drums_calm1.flac", audioCtx);
    AUDIO_FILES.ambient.drumsCalm2 = await loadAudio("/res/loops/ambient/drums_calm2.flac", audioCtx);
    AUDIO_FILES.ambient.drumsCalm3 = await loadAudio("/res/loops/ambient/drums_calm3.flac", audioCtx);
    AUDIO_FILES.ambient.eguitarCalm1 = await loadAudio("/res/loops/ambient/eguitar_calm1.flac", audioCtx);
    AUDIO_FILES.ambient.doublebass1 = await loadAudio("/res/loops/ambient/doublebass1.flac", audioCtx);
    AUDIO_FILES.ambient.brassEpic1 = await loadAudio("/res/loops/ambient/brass_epic1.flac", audioCtx);
    AUDIO_FILES.ambient.chello1 = await loadAudio("/res/loops/ambient/chello1.flac", audioCtx);
    AUDIO_FILES.ambient.drumsEpic1 = await loadAudio("/res/loops/ambient/drums_epic1.flac", audioCtx);
    AUDIO_FILES.ambient.drumsEpic2 = await loadAudio("/res/loops/ambient/drums_epic2.flac", audioCtx);
    AUDIO_FILES.ambient.drumsEpic3 = await loadAudio("/res/loops/ambient/drums_epic3.flac", audioCtx);
    AUDIO_FILES.ambient.drumsPizz1 = await loadAudio("/res/loops/ambient/drums_pizz1.flac", audioCtx);
    AUDIO_FILES.ambient.glockenspielEpic1 = await loadAudio("/res/loops/ambient/glockenspiel_epic1.flac", audioCtx);
    AUDIO_FILES.ambient.glockenspielEpic2 = await loadAudio("/res/loops/ambient/glockenspiel_epic2.flac", audioCtx);
    AUDIO_FILES.ambient.pianoOctave1 = await loadAudio("/res/loops/ambient/piano_octave1.flac", audioCtx);
    AUDIO_FILES.ambient.pianoOctave2 = await loadAudio("/res/loops/ambient/piano_octave2.flac", audioCtx);
    AUDIO_FILES.ambient.pizzStrings1 = await loadAudio("/res/loops/ambient/pizz_strings1.flac", audioCtx);
    AUDIO_FILES.ambient.violinEpic1 = await loadAudio("/res/loops/ambient/violins_epic1.flac", audioCtx);
    AUDIO_FILES.ambient.violin2Epic1 = await loadAudio("/res/loops/ambient/violin2_epic1.flac", audioCtx);

    AUDIO_FILES.fight.brass1 = await loadAudio("/res/loops/fight/brass1.flac", audioCtx);
    AUDIO_FILES.fight.brass2 = await loadAudio("/res/loops/fight/brass2.flac", audioCtx);
    AUDIO_FILES.fight.brass3 = await loadAudio("/res/loops/fight/brass3.flac", audioCtx);
    AUDIO_FILES.fight.strings1 = await loadAudio("/res/loops/fight/strings1.flac", audioCtx);
    AUDIO_FILES.fight.strings2 = await loadAudio("/res/loops/fight/strings2.flac", audioCtx);
    AUDIO_FILES.fight.strings3 = await loadAudio("/res/loops/fight/strings3.flac", audioCtx);
    AUDIO_FILES.fight.strings4 = await loadAudio("/res/loops/fight/strings4.flac", audioCtx);
    AUDIO_FILES.fight.strings5 = await loadAudio("/res/loops/fight/strings5.flac", audioCtx);
    AUDIO_FILES.fight.chello1 = await loadAudio("/res/loops/fight/chello1.flac", audioCtx);
    AUDIO_FILES.fight.chello2 = await loadAudio("/res/loops/fight/chello2.flac", audioCtx);
    AUDIO_FILES.fight.chello3 = await loadAudio("/res/loops/fight/chello3.flac", audioCtx);
    AUDIO_FILES.fight.chelloSpic1 = await loadAudio("/res/loops/fight/chello_spic1.flac", audioCtx);
    AUDIO_FILES.fight.chelloSpic2 = await loadAudio("/res/loops/fight/chello_spic2.flac", audioCtx);
    AUDIO_FILES.fight.chelloSpic3 = await loadAudio("/res/loops/fight/chello_spic3.flac", audioCtx);
    AUDIO_FILES.fight.doublebass1 = await loadAudio("/res/loops/fight/doublebass1.flac", audioCtx);
    AUDIO_FILES.fight.doublebass2 = await loadAudio("/res/loops/fight/doublebass2.flac", audioCtx);
    AUDIO_FILES.fight.glideSynth1 = await loadAudio("/res/loops/fight/glide_synth1.flac", audioCtx);
    AUDIO_FILES.fight.guiro1 = await loadAudio("/res/loops/fight/guiro1.flac", audioCtx);
    AUDIO_FILES.fight.ride1 = await loadAudio("/res/loops/fight/ride1.flac", audioCtx);
    AUDIO_FILES.fight.snare1 = await loadAudio("/res/loops/fight/snare1.flac", audioCtx);
    AUDIO_FILES.fight.timpani1 = await loadAudio("/res/loops/fight/timpani1.flac", audioCtx);
    AUDIO_FILES.fight.violinSpic1 = await loadAudio("/res/loops/fight/violin_spic1.flac", audioCtx);

    resolve(AUDIO_FILES);
});

export async function createFightMusicGenerator(world, ctx) {
    await AUDIO_PROMISE;
    const brass = new SequenceMusicGeneratorTrack(
        'brass',
        [new AudioLoop(AUDIO_FILES.fight.brass1, 0), null, new AudioLoop(AUDIO_FILES.fight.brass2, 0), null, new AudioLoop(AUDIO_FILES.fight.brass3, 0), null, new AudioLoop(AUDIO_FILES.fight.brass1, 0), null],
        { minEnergy: 0.6 }
    );
    return new MusicGenerator(world, 145, 4, 3, {
        'chello_spic': (ctx) => createGainChannel(ctx, 1),
        'chello': (ctx) => createGainChannel(ctx, 1),
        'strings': (ctx) => createGainChannel(ctx, 1),
        'doublebass': (ctx) => createGainChannel(ctx, 1),
        'snare': (ctx) => createGainChannel(ctx, 1),
        'timpani': (ctx) => createGainChannel(ctx, 1),
        'ride': (ctx) => createGainChannel(ctx, 1),
        'violin_spic': (ctx) => createGainChannel(ctx, 1),
        'brass': (ctx) => createGainChannel(ctx, 1),
        'glide_synth': (ctx) => createGainChannel(ctx, 1),
        'guiro': (ctx) => createGainChannel(ctx, 1),
    },
    [
        new MusicGeneratorSection([
            new RandomMusicGeneratorTrack(
                'chello_spic',
                [new AudioLoop(AUDIO_FILES.fight.chelloSpic1, 0)],
                { maxEnergy: 0.2 }
            ),
            new RandomMusicGeneratorTrack(
                'chello_spic',
                [new AudioLoop(AUDIO_FILES.fight.chelloSpic2, 0)],
                { minEnergy: 0.2, maxEnergy: 0.4 }
            ),
            new RandomMusicGeneratorTrack(
                'chello_spic',
                [new AudioLoop(AUDIO_FILES.fight.chelloSpic3, 0)],
                { minEnergy: 0.4 }
            ),
            new RandomMusicGeneratorTrack(
                'doublebass',
                [new AudioLoop(AUDIO_FILES.fight.doublebass1, 0)],
                { minEnergy: 0.2, maxEnergy: 0.4 }
            ),
            new RandomMusicGeneratorTrack(
                'doublebass',
                [new AudioLoop(AUDIO_FILES.fight.doublebass2, 0)],
                { minEnergy: 0.2 }
            ),
            new RandomMusicGeneratorTrack(
                'snare',
                [new AudioLoop(AUDIO_FILES.fight.snare1, 0)],
                { minEnergy: 0.35 }
            ),
            new RandomMusicGeneratorTrack(
                'timpani',
                [new AudioLoop(AUDIO_FILES.fight.timpani1, 0)],
                { minEnergy: 0.55 }
            ),
            brass,
            new RandomMusicGeneratorTrack(
                'violin_spic',
                [new AudioLoop(AUDIO_FILES.fight.violinSpic1, 0)],
                { minEnergy: 0.75 }
            ),
            new RandomMusicGeneratorTrack(
                'ride',
                [new AudioLoop(AUDIO_FILES.fight.ride, 0)],
                { minEnergy: 0.75 }
            ),
            new SyncMusicGeneratorTrack(
                'strings',
                [new AudioLoop(AUDIO_FILES.fight.strings1, 0), new AudioLoop(AUDIO_FILES.fight.strings2, 0), new AudioLoop(AUDIO_FILES.fight.strings1, 0), new AudioLoop(AUDIO_FILES.fight.strings3, 0), new AudioLoop(AUDIO_FILES.fight.strings1, 0), new AudioLoop(AUDIO_FILES.fight.strings4, 0), new AudioLoop(AUDIO_FILES.fight.strings1, 0), new AudioLoop(AUDIO_FILES.fight.strings5, 0)],
                brass,
                { minEnergy: 0.8 }
            ),
            new SyncMusicGeneratorTrack(
                'chello',
                [new AudioLoop(AUDIO_FILES.fight.chello1, 0), new AudioLoop(AUDIO_FILES.fight.chello2, 0), new AudioLoop(AUDIO_FILES.fight.chello1, 0), new AudioLoop(AUDIO_FILES.fight.chello2, 0), new AudioLoop(AUDIO_FILES.fight.chello1, 0), new AudioLoop(AUDIO_FILES.fight.chello2, 0), new AudioLoop(AUDIO_FILES.fight.chello1, 0), new AudioLoop(AUDIO_FILES.fight.chello3, 0)],
                brass,
                { minEnergy: 0.8 }
            ),
        ], 0, 2)
    ], new FightEnergySupplier(), ctx);
}

export async function createAmbientMusicGenerator(world, ctx) {
    await AUDIO_PROMISE;
    return new MusicGenerator(world, 108, 8, 4,
        {
            'piano': (ctx) => createGainChannel(ctx, 0.7),
            'drums': (ctx) => createGainChannel(ctx, 0.7),
            'epiano': (ctx) => createGainChannel(ctx, 0.5),
            'pad': (ctx) => createGainChannel(ctx, 0.2),
            'guitar': (ctx) => createGainChannel(ctx, 0.6),
            'doublebass': (ctx) => createGainChannel(ctx, 0.4),
            'chello': (ctx) => createGainChannel(ctx, 0.5),
            'violin1': (ctx) => createGainChannel(ctx, 1),
            'violin2': (ctx) => createGainChannel(ctx, 1),
            'glockenspiel1': (ctx) => createGainChannel(ctx, 0.3),
            'octave_piano1': (ctx) => createGainChannel(ctx, 0.3),
            'glockenspiel2': (ctx) => createGainChannel(ctx, 0.2),
            'octave_piano2': (ctx) => createGainChannel(ctx, 0.3),
            'brass': (ctx) => createGainChannel(ctx, 1),
            'pizz_strings': (ctx) => createGainChannel(ctx, 1),
            'pizz_drums': (ctx) => createGainChannel(ctx, 1),
        },
        [
            new MusicGeneratorSection(
                [
                    new RandomMusicGeneratorTrack(
                        'piano',
                        [new AudioLoop(AUDIO_FILES.ambient.pianoCalm1, 1), new AudioLoop(AUDIO_FILES.ambient.pianoCalm1, 1), new AudioLoop(AUDIO_FILES.ambient.pianoCalm2, 1), new AudioLoop(AUDIO_FILES.ambient.pianoCalm2, 1), new AudioLoop(AUDIO_FILES.ambient.pianoCalm3, 1)]
                    ),
                    new RandomMusicGeneratorTrack(
                        'drums',
                        [new AudioLoop(AUDIO_FILES.ambient.drumsCalm1, 1), new AudioLoop(AUDIO_FILES.ambient.drumsCalm2, 0), new AudioLoop(AUDIO_FILES.ambient.drumsCalm3, 0)],
                        { chance: 0.7, excludesAll: ['pizz_drums'] }
                    ),
                    new RandomMusicGeneratorTrack(
                        'epiano',
                        [new AudioLoop(AUDIO_FILES.ambient.epianoCalm1, 0), new AudioLoop(AUDIO_FILES.ambient.epianoCalm2, 0)],
                        { canPlay: (world) => world.getObjectsInArea(world.player.x - 10, world.player.y - 10, 20, 20).filter(o => o instanceof Tree).length >= 10, excludesAll: ['pizz_strings'] }
                    ),
                    new RandomMusicGeneratorTrack(
                        'pad',
                        [new AudioLoop(AUDIO_FILES.ambient.padCalm1, 0), new AudioLoop(AUDIO_FILES.ambient.padCalm2, 0)],
                        { canPlay: (world) => world.getObjectsInArea(world.player.x - 10, world.player.y - 10, 20, 20).filter(o => o instanceof Tree).length >= 10 }
                    ),
                    new RandomMusicGeneratorTrack(
                        'pad',
                        [new AudioLoop(AUDIO_FILES.ambient.padCalm1, 0), new AudioLoop(AUDIO_FILES.ambient.padCalm2, 0)],
                        { minEnergy: 0.3 }
                    ),
                    new RandomMusicGeneratorTrack(
                        'guitar',
                        [new AudioLoop(AUDIO_FILES.ambient.eguitarCalm1, 1)],
                        { canPlay: (world) => {
                            let sandCount = 0;
                            const startX = Math.floor(world.player.x) - 3;
                            const startY = Math.floor(world.player.y) - 3;
                            for (let i = startX; i < startX + 7; i++) {
                                for (let j = startY; j < startY + 7; j++) {
                                    if (world.getTile(i, j) == SAND_TILE) {
                                        sandCount++;
                                    }
                                }
                            }
                            return sandCount >= 20;
                        }, excludesAll: ['epiano'] }
                    ),
                    new RandomMusicGeneratorTrack(
                        'chello',
                        [new AudioLoop(AUDIO_FILES.ambient.chello1, 0)],
                        { minEnergy: 0.2 }
                    ),
                    new RandomMusicGeneratorTrack(
                        'doublebass',
                        [new AudioLoop(AUDIO_FILES.ambient.doublebass1, 0)],
                        { minEnergy: 0.35 }
                    ),
                    new RandomMusicGeneratorTrack(
                        'glockenspiel2',
                        [new AudioLoop(AUDIO_FILES.ambient.glockenspielEpic2, 0)],
                        { canPlay: (world) => world.getObjectsInArea(world.player.x - 6, world.player.y - 6, 12, 12).filter(o => o instanceof Chest).length > 0 }
                    ),
                    new RandomMusicGeneratorTrack(
                        'octave_piano2',
                        [new AudioLoop(AUDIO_FILES.ambient.pianoOctave2, 0)],
                        { canPlay: (world) => world.getObjectsInArea(world.player.x - 6, world.player.y - 6, 12, 12).filter(o => o instanceof Chest).length > 0 }
                    ),
                    new RandomMusicGeneratorTrack(
                        'pizz_strings',
                        [new AudioLoop(AUDIO_FILES.ambient.pizzStrings1, 0)],
                        { chance: 0.3, minEnergy: 0.4, excludesAll: ['epiano'] }
                    ),
                    new RandomMusicGeneratorTrack(
                        'pizz_drums',
                        [new AudioLoop(AUDIO_FILES.ambient.drumsPizz1, 0)],
                        { dependsOnAll: ['pizz_strings'] }
                    ),
                ], 0, 0.5),
            new MusicGeneratorSection(
                [
                    new RandomMusicGeneratorTrack(
                        'piano',
                        [new AudioLoop(AUDIO_FILES.ambient.pianoEpic1, 1), new AudioLoop(AUDIO_FILES.ambient.pianoEpic2, 1)]
                    ),
                    new RandomMusicGeneratorTrack(
                        'drums',
                        [new AudioLoop(AUDIO_FILES.ambient.drumsEpic1, 0), new AudioLoop(AUDIO_FILES.ambient.drumsEpic2, 0), new AudioLoop(AUDIO_FILES.ambient.drumsEpic3, 0)],
                        { minEnergy: 0.6 }
                    ),
                    new RandomMusicGeneratorTrack(
                        'pad',
                        [new AudioLoop(AUDIO_FILES.ambient.padCalm1, 0), new AudioLoop(AUDIO_FILES.ambient.padCalm2, 0)],
                        { chance: 0.5, minEnergy: 0.8 }
                    ),
                    new RandomMusicGeneratorTrack(
                        'guitar',
                        [new AudioLoop(AUDIO_FILES.ambient.eguitarCalm1, 1)],
                        { canPlay: (world) => {
                            let sandCount = 0;
                            const startX = Math.floor(world.player.x) - 3;
                            const startY = Math.floor(world.player.y) - 3;
                            for (let i = startX; i < startX + 7; i++) {
                                for (let j = startY; j < startY + 7; j++) {
                                    if (world.getTile(i, j) == SAND_TILE) {
                                        sandCount++;
                                    }
                                }
                            }
                            return sandCount >= 20;
                         } }
                    ),
                    new RandomMusicGeneratorTrack(
                        'chello',
                        [new AudioLoop(AUDIO_FILES.ambient.chello1, 0)],
                        { minEnergy: 0.65 }
                    ),
                    new RandomMusicGeneratorTrack(
                        'doublebass',
                        [new AudioLoop(AUDIO_FILES.ambient.doublebass1, 0)],
                        { minEnergy: 0.5 }
                    ),
                    //Melody 1
                    new RandomMusicGeneratorTrack(
                        'violin1',
                        [new AudioLoop(AUDIO_FILES.ambient.violinEpic1, 1)],
                        { minEnergy: 0.7, chance: 0.8, excludesAll: ['pizz_strings'] }
                    ),
                    new RandomMusicGeneratorTrack(
                        'violin2',
                        [new AudioLoop(AUDIO_FILES.ambient.violin2Epic1, 0)],
                        { minEnergy: 0.85, dependsOnAll: ['violin1'] }
                    ),
                    new RandomMusicGeneratorTrack(
                        'octave_piano1',
                        [new AudioLoop(AUDIO_FILES.ambient.pianoOctave1, 1)],
                        { minEnergy: 0.75, dependsOnAll: ['violin1'] }
                    ),
                    new RandomMusicGeneratorTrack(
                        'brass',
                        [new AudioLoop(AUDIO_FILES.ambient.brassEpic1, 1)],
                        { minEnergy: 0.85, chance: 0.5, dependsOnAll: ['violin1'] }
                    ),
                    new RandomMusicGeneratorTrack(
                        'glockenspiel1',
                        [new AudioLoop(AUDIO_FILES.ambient.glockenspiel1, 1)],
                        { minEnergy: 0.85, chance: 0.5, dependsOnAll: ['violin1'] }
                    ),
                    //Melody 2
                    new RandomMusicGeneratorTrack(
                        'glockenspiel2',
                        [new AudioLoop(AUDIO_FILES.ambient.glockenspielEpic2, 0)],
                        { minEnergy: 0.6, chance: 0.5, dependsOnAll: ['octave_piano2'] }
                    ),
                    new RandomMusicGeneratorTrack(
                        'octave_piano2',
                        [new AudioLoop(AUDIO_FILES.ambient.pianoOctave2, 0)],
                        { minEnergy: 0.6, chance: 0.5 , excludesAll: ['violin1']}
                    ),
                    //Pizz
                    //TODO only trigger for dwarfes
                    new RandomMusicGeneratorTrack(
                        'pizz_strings',
                        [new AudioLoop(AUDIO_FILES.ambient.pizzStrings1, 0)],
                        { chance: 0.2, minEnergy: 0.6 }
                    ),

                ], 0.5, 2)
        ], new AmbientEnergySupplier(), ctx);
}