import soundFontPlayer from "soundfont-player";
import { getInstrumentName } from "./get-instrument-name";

let audioContext /*: null | {}*/ = null;

export const isAudioContextSupported = () => {
  return (
    "AudioContext" in window ||
    "webkitAudioContext" in window
  );
};

export const getAudioContext = () => /*: AudioContext*/ {
  const isSupported = isAudioContextSupported();
  if (!isSupported) {
    console.error(
      "AudioContext not supported in your environment"
    );
    throw new Error(
      "AudioContext not supported in your environment"
    );
  }
  if (audioContext !== null) return audioContext;
  audioContext = new AudioContext();
  return audioContext;
};

/* 
export type InstrumentsMap = {
  [instrumentName in InstrumentName]?: Promise<Instrument>
};
*/

export const instrumentsMap /*: InstrumentsMap */ = {};

export const isInstrumentLoaded = (
  instrumentName /*: InstrumentName */
) => {
  return instrumentName in instrumentsMap;
};

export const getInstrument = (
  instrumentName /*: InstrumentName*/
) => {
  if (!isInstrumentLoaded(instrumentName)) {
    instrumentsMap[
      instrumentName
    ] = soundFontPlayer.instrument(
      getAudioContext(),
      instrumentName
    );
  }
  return instrumentsMap[
    instrumentName
  ] /* as Promise<Instrument>*/;
};

export const loadInstruments = midiPlayer => {
  //const instruments = midiPlayer.instruments;
  const instruments = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];
  console.log(instruments);
  console.log(typeof(instruments));
  const instrumentNames = instruments.map(instr =>
    getInstrumentName(instr)
  );
  console.log(instrumentNames);
  const loadInstruments = instrumentNames.map(
    instrumentName => getInstrument(instrumentName)
  );

  return new Promise((resolve, reject) => {
    const loadAllInstruments = Promise.all(loadInstruments);
    loadAllInstruments
      .then(playableInstrumentsArray => {
        const indexedInstruments = playableInstrumentsArray.reduce(
          (accumulator, currentInstrument, i) => {
            const currentInstrumentChannel = instruments[i];
            return Object.assign({}, accumulator, {
              [currentInstrumentChannel]: currentInstrument
            });
          },
          {}
        );
        resolve(indexedInstruments);
      })
      .catch(reject);
  });
};