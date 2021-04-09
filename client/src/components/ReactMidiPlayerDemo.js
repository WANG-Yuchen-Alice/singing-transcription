// import "babel-polyfill";
import React from "react";
import { render } from "react-dom";
import axios from "axios";
import soundfontPlayer from "soundfont-player";

import { getInstrumentName } from "./get-instrument-name";
import {
    getInstrument,
    loadInstruments,
    loadCheckedInstruments
} from "./load-instrument";

import MidiPlayer from "midi-player-js";

const loadMidi = async url => {
    const { data } = await axios.get(url, {
        responseType: "arraybuffer"
    });
    return data;
};

const getNoteKey = ({ noteName, track, channel }) => {
    return `${noteName}_${track}_${channel}`;
};

const smooshObjs = (obj1, obj2) => {
    return Object.assign({}, obj1, obj2);
};

const midiEventsToNoteActions = midiEvent => {
    const this_midi_event = midiEvent;
    const {
        channel,
        noteName,
        track,
        name: midiEventType
    } = this_midi_event;
    console.log(channel);
    //console.log(track);
    //console.log(value);
    const noteKey = getNoteKey({ noteName, track, channel });

    const instrumentName = getInstrumentName(channel);
    //const instrumentName = getInstrumentName(value);
    if (midiEventType === "Note on") {
        return {
            type: "NOTE_ON",
            payload: {
                key: noteKey,
                instrumentName,
                channel,
                noteName
            }
        };
    } else if (midiEventType === "Note off") {
        return {
            type: "NOTE_OFF",
            payload: {
                key: noteKey,
                instrumentName,
                channel,
                noteName
            }
        };
    } else {
        return null;
    }
};

const possibleMidiPlayerStates = {
    paused: "paused",
    playing: "playing",
    stopped: "stopped"
};

const possibleLoadingStates = {
    loading: "loading",
    loaded: "loaded",
    errored: "errored"
};

let playingNotes = {};

const playNote = ({ instrument, noteName, noteKey }) => {
    if (!(noteKey in playingNotes)) {
        playingNotes[noteKey] = [];
    }
    playingNotes[noteKey].push(instrument.play(noteName));
};

class ReactMidiPlayer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            areInstrumentsLoaded: false
        };
        this.midiPlayer = new MidiPlayer.Player();
    }
    async componentDidMount() {
        const { url } = this.props;
        const midi = await loadMidi(url);
        console.log(midi);
        this.midiPlayer.loadArrayBuffer(midi);
        const instruments = await loadInstruments(
            this.midiPlayer
        );
        //console.log(instruments);
        this.setState({
            areInstrumentsLoaded: true,
            playableInstruments: instruments
        });
        this.midiPlayer.on("midiEvent", midiEvent => {
            const action = midiEventsToNoteActions(midiEvent);
            if (action === null) return;
            const { payload, type } = action;
            const {
                instrumentName,
                noteName,
                key,
                channel
            } = payload;

            switch (type) {
                case "NOTE_ON": {
                    if (channel in instruments) {
                        playNote({
                            instrument: instruments[channel],
                            noteName,
                            noteKey: key
                        });

                    } else {
                        console.log(`NOTE ON ${channel} not in`);
                    }

                }
                case "NOTE_OFF": {
                    console.log("Left as an exercise to the reader");
                }
                default: {
                    return;
                }
            }
        });
    }

    render() {
        return (
            <div>
                {this.state.areInstrumentsLoaded === true ? (
                    <div>
                        <button
                            onClick={() => {
                                this.midiPlayer.play();
                            }}
                        >
                            Play
            </button>
                        <button
                            onClick={() => {
                                this.midiPlayer.pause();
                            }}
                        >
                            Pause
            </button>
                        <button
                            onClick={() => {
                                this.midiPlayer.stop();
                            }}
                        >
                            Stop
            </button>
                    </div>
                ) : (
                        "Loading Instruments"
                    )}
            </div>
        );
    }
}
ReactMidiPlayer.defaultProps = {
    midiPlayer: null,
    midiPlayerState: ""
};

class TinyReactMidiLoader extends React.Component {
    constructor(props) {
        super(props);
        this.configurePlayer = this.configurePlayer.bind(this);
        this.state = {
            areInstrumentsLoaded: true,
            possibleChannels: [],
            state_instruments: null
        };

        this.midiPlayer = new MidiPlayer.Player();
        this.midiPlayer_player = new MidiPlayer.Player();

    }

    async componentDidMount() {
        const { url } = this.props;
        const midi = await loadMidi(url);
        //console.log(midi);
        this.midiPlayer.loadArrayBuffer(midi);
        this.midiPlayer_player.loadArrayBuffer(midi);

        this.midiPlayer.on("midiEvent", midiEvent => {
            const this_midi_event = midiEvent;
            const {
                channel,
                noteName,
                track,
                name: midiEventType
            } = this_midi_event;

            if (channel in this.state.possibleChannels) {
                console.log(`${channel} in possiblechannels`);
            } else {
                if (typeof channel !== 'undefined') {
                    this.setState((oldState, props) => {
                        var updated_channel_array = oldState.possibleChannels;
                        var updated_channel_set = new Set(updated_channel_array);
                        if (typeof channel !== 'undefined') {
                            // the variable is defined
                            updated_channel_set.add(channel);
                            updated_channel_array = Array.from(updated_channel_set);
                            console.log(updated_channel_array);
                            return {
                                areInstrumentsLoaded: true,
                                possibleChannels: updated_channel_array
                            }
                        }
                        return oldState;
                    });
                }
            }
        });

    }

    configurePlayer(instruments_player) {
        this.midiPlayer_player.on("midiEvent", midiEvent => {
            const action = midiEventsToNoteActions(midiEvent);
            if (action === null) return;
            const { payload, type } = action;
            const {
                instrumentName,
                noteName,
                key,
                channel
            } = payload;

            switch (type) {
                case "NOTE_ON": {
                    if (channel in instruments_player) {
                        playNote({
                            instrument: instruments_player[channel],
                            noteName,
                            noteKey: key
                        });

                    } else {
                        console.log(`NOTE ON ${channel} not in`);
                    }

                }
                case "NOTE_OFF": {
                    console.log("Left as an exercise to the reader");
                }
                default: {
                    return;
                }
            }
        });
    }

    async componentDidUpdate(prevProps, prevState) {
        if (this.state.possibleChannels.length !== prevState.possibleChannels.length) {
            console.log("------");
            console.log(this.state.possibleChannels);
            const instruments_player = await loadCheckedInstruments(this.state.possibleChannels);
            this.setState((oldState, props) => {
                return {
                    areInstrumentsLoaded: true,
                    state_instruments: instruments_player
                }
            });
            // this.midiPlayer_player.on("midiEvent", midiEvent => {
            //     const action = midiEventsToNoteActions(midiEvent);
            //     if (action === null) return;
            //     const { payload, type } = action;
            //     const {
            //         instrumentName,
            //         noteName,
            //         key,
            //         channel
            //     } = payload;

            //     switch (type) {
            //         case "NOTE_ON": {
            //             if (channel in instruments_player) {
            //                 playNote({
            //                     instrument: instruments_player[channel],
            //                     noteName,
            //                     noteKey: key
            //                 });

            //             } else {
            //                 console.log(`NOTE ON ${channel} not in`);
            //             }

            //         }
            //         case "NOTE_OFF": {
            //             console.log("Left as an exercise to the reader");
            //         }
            //         default: {
            //             return;
            //         }
            //     }
            // });
        }
    }

    render() {
        return (
            <div>
                {this.state.areInstrumentsLoaded === true ? (
                    <div>
                        <div>
                        <button className='btn btn-light'
                            onClick={() => {
                                this.midiPlayer.play();
                            }}
                        >
                            Load </button>
                        <button className='btn btn-light ml-2'
                            onClick={() => {
                                this.midiPlayer.stop();
                                console.log(this.state.possibleChannels);
                                console.log(this.state.state_instruments);
                                this.configurePlayer(this.state.state_instruments);
                            }}
                        >
                            Ready </button>
                        
                        <button className='btn btn-light ml-2'
                            onClick={() => {
                                this.midiPlayer_player.play();
                            }}
                        >
                            Play
              </button>
                        <button className='btn btn-light ml-2'
                            onClick={() => {
                                this.midiPlayer_player.pause();
                            }}
                        >
                            Pause
              </button>
                        <button className='btn btn-light ml-2'
                            onClick={() => {
                                this.midiPlayer_player.stop();
                            }}
                        >
                            Stop
              </button>
                    </div>
                    </div>
                ) : (
                        "Loading Instruments"
                    )}
            </div>
        );
    }
}

class ReactMidiPlayerDemo extends React.Component {
    render() {
        const { url } = this.props;
        return (
            <div>
                <TinyReactMidiLoader url={url} />
            </div>
        );
    }
}

export default ReactMidiPlayerDemo;