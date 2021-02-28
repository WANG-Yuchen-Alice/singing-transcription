// import "babel-polyfill";
import React from "react";
import { render } from "react-dom";
import axios from "axios";
import soundfontPlayer from "soundfont-player";

import { getInstrumentName } from "./get-instrument-name";
import {
  getInstrument,
  loadInstruments
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
      console.log('heyyo');
      if (channel in instruments) {
          console.log(`${channel} in!!!`);
      } else {
          console.log(`${channel} not in!!!`);
      }
      if (!channel in instruments) {
        console.error(`${instrumentName} not loaded`);
        console.log(`${channel} not in`);
        return;
      }
      switch (type) {
        case "NOTE_ON": {
          console.log(instruments[channel]);
          console.log(channel);
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
            Loaded
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

class TinyReactMidiPlayer extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        areInstrumentsLoaded: true,
        possibleChannels: []
      };

      this.addChannel = this.addChannel.bind(this)

      
      this.midiPlayer = new MidiPlayer.Player(function(event) {
        const {
            channel
        } = event;

        this.addChannel(channel);
        
        console.log(event);
      });
      
    }

    addChannel ({ channel })  {
        console.log(`add channel`);
    };
    
    async componentDidMount() {
      const { url } = this.props;
      const midi = await loadMidi(url);
      console.log(midi);
      this.midiPlayer.loadArrayBuffer(midi);
      
      this.midiPlayer.on("midiEvent", midiEvent => {
        
        console.log('heyyo');
        console.log('hell github');
        
      });
    }

    render() {
      return (
        <div>
          {this.state.areInstrumentsLoaded === true ? (
            <div>
              Loaded
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
                  console.log(this.state.possibleChannels);
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
class ReactMidiPlayerDemo extends React.Component {
  render() {
    const { url } = this.props;
    return (
      <div>
        ReactMidiPlayerDemo Playing url : {url}
        <ReactMidiPlayer url={url} />
      </div>
    );
  }
}

export default ReactMidiPlayerDemo;
