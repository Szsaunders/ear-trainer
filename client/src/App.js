import React, { Component } from "react";
import Header from "./components/Header";
import Keyboard from "./components/Keyboard";
import BackgroundImage from "./components/BackgroundImage";
// import PlayBox from "./components/PlayBox";
import { Container, Row, Col } from "./components/Grid";
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import { Redirect } from 'react-router-dom'
import axios from 'axios'

import Tone from "tone";

import "react-piano/dist/styles.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

class App extends Component {
  constructor() {
    super();
    this.scoreFunction = this.scoreFunction.bind(this);
    this.updateDimensions = this.updateDimensions.bind(this);
    this.timerFunction = this.timerFunction.bind(this);
    this.startTimer = this.startTimer.bind(this);
    this.toggle = this.toggle.bind(this);
    this.selectFunction = this.selectFunction.bind(this);
    this.highScoreFunction = this.highScoreFunction.bind(this);
    this.modeHandler = this.modeHandler.bind(this);
    this.playbackIntervalFn = null;
  }
  state = {
    username: null,
    winstate: "",
    score: 0,
    timer: 0,
    n: 0,
    dropdownOpen: false,
    countdown: 90,
    currentSong: [],
    currentSongHolder: [],
    currentInput: [],
    currentMode: "",
    activeNotesIndex: -1,
    isPlaying: false,
    winSize: window.innerWidth
  };

  //Component mount/unmount functions

  componentDidMount = () => {
    console.log(this.state.width);
    window.addEventListener("resize", this.updateDimensions);
  };

  componentWillUnmount() {
    window.removeEventListener("resize", this.updateDimensions);
  }

  //Handles responsive piano

  updateDimensions() {
    this.setState({
      winSize: window.innerWidth
    });
  }

  //Handles keyboard playback

  componentDidUpdate(prevProps, prevState) {
    if (prevState.isPlaying !== this.state.isPlaying) {
    console.log(this.state.currentSongHolder)
      if (this.state.isPlaying) {
        console.log(this.state.currentSong, this.state.currentSong.length)
        this.playbackIntervalFn = setInterval(() => {
          if (this.state.n < this.state.currentSong.length * 2) {
            if (this.state.n % 2 === 1) {
          this.setState({
            activeNotesIndex: (this.state.activeNotesIndex + 1),
            currentSongHolder: this.state.currentSong,
            n: this.state.n + 1
          });
          console.log("tick", this.state.currentSong[this.state.activeNotesIndex- 1])
        }
        else {
          this.setState({
            // activeNotesIndex: (this.state.activeNotesIndex + 1),
            n: this.state.n + 1,
            currentSongHolder: []
          });
          console.log("tick", this.state.currentSong[this.state.activeNotesIndex- 1])
        }
        }
        else {
          clearInterval(this.playbackIntervalFn);
          this.setState({
            isPlaying: false,
          });
          this.setState({
            activeNotesIndex: -1,
            n: 0,
            currentSongHolder: []
          });
        }
        
        }, 250);
     } 
    }
  }

  

  //Handles timer

  startTimer() {
    clearInterval(this.timer);
    this.setState({
      countdown: 90
    });
    this.timer = setInterval(this.timerFunction, 1000);
  }

  timerFunction = () => {
    let countdownTimer = this.state.countdown - 1;
    this.setState({
      countdown: countdownTimer
    });
    if (this.state.countdown === 0) {
      clearInterval(this.timer);
      this.highScoreFunction();
      this.setState({
        countdown: 90,
        currentSong: []
      });
    }
  };

  //Handles dropdown
  toggle() {
    this.setState(prevState => ({
      dropdownOpen: !prevState.dropdownOpen
    }));
  }

  selectFunction = event => {
    this.setState({ score: 0 });
    // console.log(event.target.value);
    this.setState({
      currentMode: event.target.value
    });
    this.modeHandler(event.target.value);
    if (event.target.value !== "Freeplay") {
      this.startTimer();
    } else {
      clearInterval(this.timer);
      this.setState({
        currentMode: "",
        countdown: 90
      });
    }
  };

  modeHandler(mode) {
    console.log(this.state.username)
    this.setState({score: 0})
    this.setState({ activeNotesIndex: -1 });
    this.setState({ isPlaying: false });
    this.setState({ currentSong: [],
     currentSongHolder: []});
    switch(mode) {
      case "Intervals":
        this.songGeneratorEasy();
        break;
      case "ArpeggiosMajor":
        this.songGeneratorArpeggio();
        break;
      case "Tonerows":
        this.songGeneratorHard();
        break;
      default:
      this.setState({score: 0})
        break;
    }
  }

  modeHandler2(mode) {
    console.log("modehandler2")
    this.setState({ activeNotesIndex: -1 });
    switch(mode) {
      case "Intervals":
        this.songGeneratorEasy();
        break;
      case "ArpeggiosMajor":
        this.songGeneratorArpeggio();
        break;
      case "Tonerows":
        this.songGeneratorHard();
        break;
      default:
        break;
    }
  }
  // Song generator functions

  shuffle(a) {
    var j, x, i;
    for (i = a.length - 1; i > 0; i--) {
      j = Math.floor(Math.random() * (i + 1));
      x = a[i];
      a[i] = a[j];
      a[j] = x;
    }
    return a;
  }

  midiArrayGenerator(size, startAt) {
    if (!startAt) {
      var startAt = 48
    }
  return [...Array(size).keys()].map(i => [i + startAt])
  }

  songGeneratorEasy = () => {
    const toneArray = this.midiArrayGenerator(12, 49)
    let tempArray = this.shuffle(toneArray);
    let tempArray2 = [[48], tempArray[1]];
    console.log(tempArray2);
    this.setState({ currentSong: tempArray2,
     });
    this.setState({ isPlaying: true });
  };

  songGeneratorArpeggio = () => {
    let baseNote = Math.floor(Math.random() * 11) + 48;
    let toneArray = [
      [baseNote],
      [baseNote + 4],
      [baseNote + 7]
    ];
    console.log(toneArray);
    this.setState({ currentSong: toneArray });
    this.setState({ isPlaying: true });
  };

  songGeneratorHard = () => {
    const toneArray = this.midiArrayGenerator(13)
    let tempArray = this.shuffle(toneArray);
    console.log(tempArray);
    this.setState({ currentSong: tempArray });
    this.setState({ isPlaying: true });
  };


  //Score function. Self explanatory
  scoreFunction = (x) => {
    if (this.state.currentMode === "") {

      this.setState({
      currentInput: [],
      winstate: ""
    })
  }
    else {
    console.log(x)
    this.setState(prevState => ({
      currentInput: [...prevState.currentInput, [x]],
      winstate: ""
    }), () => {
        var y = this.state.currentInput.length - 1;
        console.log(this.state.currentInput[y], this.state.currentSong[y]);
        if (this.state.currentInput[y][0] === this.state.currentSong[y][0]) {
          if (
            this.state.currentInput.length === this.state.currentSong.length
          ) {
            this.setState(prevState => ({
              score: this.state.score + 1,
              currentInput: [],
              winstate: "Success!"
            }));

            setTimeout(() => this.modeHandler2(this.state.currentMode), 1000);
          } 
        } else {
          this.setState(prevState => ({
            currentInput: [],
            winstate: "Wrong Note!"
          }));
        }
    })
  }
}


  usernameRetriever = (username) => {
    var user = username
    console.log(user)
    this.setState({username: user})  
  }

  highScoreFunction() {
    var score = this.state.score;
    var username = this.state.username;
    axios.post("/user/scores" + this.state.currentMode, {
      username: username,
      score: score}).then(function (response) {  
        console.log(this.state.currentMode)
        switch(this.state.currentMode) {
          case "Intervals":
            var scoreArr = response.data.scoreArrIntervals
            console.log(scoreArr)
            break;
          case "ArpeggiosMajor":
            var scoreArr = response.data.scoreArrArpeggiosMajor
            console.log(scoreArr)
            break;
          case "Tonerows":
            var scoreArr = response.data.scoreArrTonerows
            console.log(scoreArr)
            break;
          default:
            var scoreArr = []
            console.log(scoreArr)
            break;
        }
        console.log(scoreArr)
        var hiscore = Math.max.apply(null, scoreArr)
        console.log(hiscore)
        this.setState({ winstate: "Best Score: " + hiscore, currentMode: "", });}.bind(this)
    ).catch(error => {
      console.log(error.response)
  })
    this.setState({ score: 0 });
  }

  render() {
    return (
      <div>
        <Header
          branding="Music To My Ears"
          winstate={this.state.winstate}
          score={this.state.score}
          timer={this.state.countdown}
          callbackFromParent={this.usernameRetriever}
        >
          <Dropdown isOpen={this.state.dropdownOpen} toggle={this.toggle}>
            <DropdownToggle caret>Mode</DropdownToggle>
            <DropdownMenu>
              <DropdownItem value={"Freeplay"} onClick={this.selectFunction}>
                Free Play
              </DropdownItem>
              <DropdownItem divider />
              <DropdownItem value={"Intervals"} onClick={this.selectFunction}>
                Intervals
              </DropdownItem>
              <DropdownItem divider />
              <DropdownItem
                value={"ArpeggiosMajor"}
                onClick={this.selectFunction}
              >
                Major Arpeggio
              </DropdownItem>
              <DropdownItem divider />
              <DropdownItem value={"Tonerows"} onClick={this.selectFunction}>
                Tone Rows
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </Header>
        <BackgroundImage />
        <Keyboard width={this.state.winSize} scorekeeper={this.scoreFunction} 
        isPlaying={this.state.isPlaying} currentSong={this.state.currentSongHolder} activeNotesIndex = {this.state.activeNotesIndex}
        />
        <Container>
          <Row>
            <Col size="lg-4">
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

export default App;
