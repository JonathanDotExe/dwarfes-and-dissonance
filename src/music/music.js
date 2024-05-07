import { MusicGenerator, RandomMusicGeneratorTrack } from "./generator.js";
import { AudioLoop } from "./player.js";


const AUDIO_FILES = {

};

const AUDIO_PROMISE = new Promise(async (resolve, reject) => {
    AUDIO_FILES.pianoCalm1 = await load("/res/loops/ambient/piano_calm1.flac");
    AUDIO_FILES.pianoCalm2 = await load("/res/loops/ambient/piano_calm2.flac");
    AUDIO_FILES.pianoCalm3 = await load("/res/loops/ambient/piano_calm3.flac");
    AUDIO_FILES.epianoCalm1 = await load("/res/loops/ambient/epiano_calm1.flac");
    AUDIO_FILES.epianoCalm2 = await load("/res/loops/ambient/epiano_calm2.flac");
    AUDIO_FILES.padCalm1 = await load("/res/loops/ambient/pad_calm1.flac");
    AUDIO_FILES.padCalm2 = await load("/res/loops/ambient/pad_calm2.flac");

    resolve(AUDIO_FILES);
});


export async function createAmbientMusicGenerator(world) {
    await AUDIO_PROMISE;
    return new MusicGenerator(world, 108, 8, [
        new RandomMusicGeneratorTrack(
            'piano',
            [new AudioLoop(AUDIO_FILES.pianoCalm1, 1), new AudioLoop(AUDIO_FILES.pianoCalm2, 1), new AudioLoop(AUDIO_FILES.pianoCalm3, 1)]
        ),
        new RandomMusicGeneratorTrack(
            'epiano',
            [new AudioLoop(AUDIO_FILES.epianoCalm1, 0), new AudioLoop(AUDIO_FILES.epianoCalm2, 0)]
        ),
        new RandomMusicGeneratorTrack(
            'pad',
            [new AudioLoop(AUDIO_FILES.padCalm1, 0), new AudioLoop(AUDIO_FILES.padCalm2, 0)]
        )
    ]);
}