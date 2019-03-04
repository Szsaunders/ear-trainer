import React from "react";
import Tone from "tone";
import { Piano,  MidiNumbers } from "react-piano";

const firstNote = MidiNumbers.fromNote("c3");
const lastNote = MidiNumbers.fromNote("c5");


var synth = new Tone.Synth({
	"oscillator" : {
		"type" : "triangle",
		"modulationFrequency" : 0.5
	},
	"envelope" : {
		"attack" : 0.02,
		"decay" : .6,
		"sustain" : .3,
		"release" : .6,
	}
}).toMaster();


const Keyboard = props => (
  <div className="container" style={{ width: "100%", height: "auto", margin: 0, padding: "0" }}>
    <Piano
      noteRange={{ first: firstNote, last: lastNote }}
      activeNotes={
        props.isPlaying ? props.currentSong[props.activeNotesIndex] : null
      }
      playNote={midiNumber => {
        var x = Tone.Frequency(midiNumber, "midi").toNote();
        synth.triggerAttackRelease(x, "16n");
        // Play a given note - e notes below
      }}
      onPlayNoteInput={midiNumber => {
        props.scorekeeper(midiNumber);
      }}
      stopNote={midiNumber => {
      }}
      width={props.width}
    />
  </div>
);

export default Keyboard;