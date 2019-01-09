//todo
//there is a problem with the handlechange fuction. Should change this to update the state when the enter key is pressed


import React, { Component } from "react";
import "./../styles/index.css";
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid'; 
import firebase from "../config/constants.js";
import moment from "moment";
import Modal from "./Modal";


var database = firebase.database();




const styles = theme => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing.unit * 2,
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
});

class Countdown extends Component{
  constructor(props){
    super(props);
    this.state = {
      sessionTimeEntry: 25, //in min
      breakTimeEntry: 5, //in min
      sessionRemainingSeconds: 1500, //in seconds
      breakRemainingSeconds: 300, //in seconds
      running: false,
      timerLabel: "Session",
      goal: "",
      show: true
    }
  
  this.addSession = this.addSession.bind(this);
  this.subSession = this.subSession.bind(this);
  this.addBreak = this.addBreak.bind(this);
  this.subBreak = this.subBreak.bind(this);
  this.startStop = this.startStop.bind(this);
  this.resetTimer = this.resetTimer.bind(this);
  this.formatMinutes = this.formatMinutes.bind(this);
  this.onKeyPress = this.onKeyPress.bind(this);
  this.handleChange = this.handleChange.bind(this);
  }

  addSession() { //adding and subtracting methods need to also chage the session remaining in seconds to mirrow the entry time if ever changed
    if (this.state.sessionTimeEntry < 60 && this.state.running === false) {
      this.setState({
        sessionTimeEntry: this.state.sessionTimeEntry + 1,
        sessionRemainingSeconds: (this.state.sessionTimeEntry + 1) * 60
      })
    }
  }

  subSession() {
    if (this.state.sessionTimeEntry > 1 && this.state.running === false) {
      this.setState({
        sessionTimeEntry: this.state.sessionTimeEntry - 1,
        sessionRemainingSeconds: (this.state.sessionTimeEntry - 1) * 60
  
      })
    }
  }


  addBreak() {
    if (this.state.breakTimeEntry < 60 && this.state.running === false) {
      this.setState({
        breakTimeEntry: this.state.breakTimeEntry + 1,
        breakRemainingSeconds: (this.state.breakTimeEntry + 1) * 60
      })
    }
  }

  subBreak() {
    if (this.state.breakTimeEntry > 1 && this.state.running === false) {
      this.setState({
        breakTimeEntry: this.state.breakTimeEntry - 1,
        breakRemainingSeconds: (this.state.breakTimeEntry - 1) * 60
      })
    }
  }

  startStop() {
    const db = firebase.firestore();
    const status = this.state.running;
    const user = firebase.auth().currentUser
    const ev = new Date();
    const sessionRef = db.collection("sessions").add({
      start_time: ev.toJSON(),
      user: user.uid,
      
    })
    // const chime1 = new Audio("https://res.cloudinary.com/dwut3uz4n/video/upload/v1532362194/352659__foolboymedia__alert-chime-1.mp3") // changed to use <audio> to pass FCC tests
    switch (status) {
      case false:
        console.log("Begin Timer")
        this.setState({ running: true })

        this.timer = setInterval(() => {
          if (this.state.running) {

            if ( (this.state.sessionRemainingSeconds === 0 && this.state.breakRemainingSeconds === 1) || (this.state.sessionRemainingSeconds === 1 && this.state.breakRemainingSeconds === this.state.breakTimeEntry*60) ) {
              // chime1.play(); // changed to use <audio> to pass FCC tests
              document.getElementById("notification").play();
            }


            if (this.state.sessionRemainingSeconds > 0) {
              this.setState({
                sessionRemainingSeconds: this.state.sessionRemainingSeconds - 1,
                timerLabel: 'Session'
              });
            } else if (this.state.breakRemainingSeconds > 0 && this.state.timerLabel === "Session") { //wont continue
              this.setState({
                timerLabel: 'Break'
              });
            } else if (this.state.breakRemainingSeconds > 0) {
              this.setState({
                breakRemainingSeconds: this.state.breakRemainingSeconds - 1,
                timerLabel: 'Break'
              });
            } else {
              this.setState({
                sessionRemainingSeconds: this.state.sessionTimeEntry * 60,
                breakRemainingSeconds: this.state.breakTimeEntry * 60,
                timerLabel: 'Session'
              });
            }
          }
        }, 1000)
        break;
      case true:
        console.log("Stop Timer")
        this.setState({ running: false })
        clearInterval(this.timer)
        break;
      default:
        break; 
    }

  }
  resetTimer() {
    this.setState({
      sessionTimeEntry: 25,
      breakTimeEntry: 5,
      sessionRemainingSeconds: 1500,
      breakRemainingSeconds: 300,
      running: false,
      timerLabel: "Session"
    })
  }

  formatMinutes(time) {
    let seconds = time;
    const minutes = (seconds % 60 === 0 ) ? ((seconds/60) < 10 ? "0" + seconds/60 : seconds/60): (Math.floor(seconds/60) < 10 ? "0" + Math.floor(seconds/60) : Math.floor(seconds/60));
    seconds = (seconds % 60 === 0 ) ? "00" : ((seconds % 60 < 10) ? "0"+ (seconds % 60) : seconds % 60)
    console.log(minutes + ":" + seconds);
    return minutes + ":" + seconds;
  }

  onKeyPress(event){
    if(event.key == "Enter"){
    event.preventDefault();
    this.setState({goal: event.target.goal})
    console.log("Goal changed!")
    }
  }

  handleChange(event){
    this.setState({goal: event.target.goal})
    }

  goSession = () => {
     this.setState({ show: false });
     //start timer
     this.startStop();
     //insert text in html for goal
     //save data to firebase
  };
  

  render() {
    return (
      <div id="clock" >
      <Grid container spacing = {24}>
      <Grid item xs={12}>
        <h1>Pomodoro Clock</h1>
        <Modal show = {this.state.show} handleClose = {this.goSession} buttonText = "Go!">
        <form>
          What is your goal for this session? <input type = "text" name = "goal" value = {this.state.goal} onChange={this.handleChange} onKeyPress={this.onKeyPress}/>
        </form>
        <div className="flexContainer">
          <div id='timerContainer'  className="flexContainer">
            <h3 id="session-
            label" className="timerContainerLabels">Session Time</h3>
            <h3 id="session-length"  className="timerContainerLabels">{this.state.sessionTimeEntry}</h3>
            <button onClick={this.subSession} id="session-decrement" className="timerContainerButtons">-</button>
            <button onClick={this.addSession} id="session-increment" className="timerContainerButtons">+</button>
          </div>
          <div id='timerContainer'  className="flexContainer">
            <h3 id="break-label"  className="timerContainerLabels">Break Time</h3>
            <h3 id="break-length"  className="timerContainerLabels">{this.state.breakTimeEntry}</h3>
            <button onClick={this.subBreak} id="break-decrement" className="timerContainerButtons">-</button>
            <button onClick={this.addBreak} id="break-increment" className="timerContainerButtons">+</button>
            <audio id="notification" src="https://res.cloudinary.com/dwut3uz4n/video/upload/v1532362194/352659__foolboymedia__alert-chime-1.mp3" preload="auto"></audio> 
          </div>
        </div>
        </Modal>
        </Grid>
       
        <div id="mainTimer">
          <h1>{(this.state.timerLabel==="Break") ?  this.formatMinutes(this.state.breakRemainingSeconds) : this.formatMinutes(this.state.sessionRemainingSeconds)}</h1>
          <h2>{this.state.timerLabel}</h2>
          <div id="timerControls" className="flexContainer">
              <Button variant ="contained" color = "primary" onClick={this.startStop} id="start-stop">Start/Stop</Button>
              <Button variant = "contained" color = "secondary" onClick={this.resetTimer} id="reset">Reset</Button>
          </div>
        </div>
        
        </Grid>
      </div>
    )
  }


}



export default Countdown;



