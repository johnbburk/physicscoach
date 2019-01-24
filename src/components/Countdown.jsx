//TODO: style the app with material.ui, also replace add function with doc
//need to update the style
//need to refactor so that state is in the app. 
//idea: create state for local start, and measure splits off of that, then record them in array on FS



import React, { Component } from "react";
import "./../styles/index.css";
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid'; 
import firebase, { ref } from "../config/constants.js";
import moment from "moment";
import Modal from "./Modal";
import StarRatings from 'react-star-ratings'

const db = firebase.firestore();
const settings = {/* your settings... */ timestampsInSnapshots: true};
db.settings(settings);
const sessionsRef = db.collection("sessions")
const user = firebase.auth().currentUser;



class Countdown extends Component{
  constructor(props){
    super(props);
    this.state = {
      sessionTimeEntry: 1, //in min
      sessionRemainingSeconds: 60, //in seconds
      running: false,
      timerLabel: "Session",
      goal: "",
      showStart: true,
      showClose: false,
      sessionRef: null,
      rating: 0,
      goal_comment: "",
      question_cmmment: "",
      learn_comment: ""

    }
  
  this.addSession = this.addSession.bind(this);
  this.subSession = this.subSession.bind(this);
  this.startStop = this.startStop.bind(this);
  this.resetTimer = this.resetTimer.bind(this);
  this.formatMinutes = this.formatMinutes.bind(this);
  this.handleChange = this.handleChange.bind(this);
  this.changeRating = this.changeRating.bind(this);
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
 

  startStop() {
    const status = this.state.running;
    
    if(!this.state.sessionRef) //first time starting timer, record new database entry
    {
      console.log("writing session to cloudstore")
      const user = firebase.auth().currentUser;

  const sessionRef = sessionsRef.add({
        start_time: firebase.firestore.FieldValue.serverTimestamp(),
        user: user.uid,
        goal: this.state.goal,
        splits: [] 
      }).then( ref =>{
      console.log("Write successful with ID: ", ref.id);
      this.setState({sessionRef: ref.id});
      return ref.id;
      }
      );
    }

    //TODO: deal with splits. For now, I'm not recording them in the databse (21/1/19)
    /* else //need log split in firebase
    {
      const sessionRef = this.state.sessionRef
      console.log("sessionRef is: ",sessionRef)
      const action = (this.state.running ? "stop":"start");
      const data = {timestamp: firebase.firestore.FieldValue.serverTimestamp(), action: action}
      console.log ("data is ",data)
       const splitRef = sessionsRef.doc(sessionRef).update(
        {"splits" : firebase.firestore.FieldValue.arrayUnion(
          data)}
      ).then(ref=>{
        console.log("Split write successful with ID ", ref.id);
        return ref.id
      }) 
    } */

    // const chime1 = new Audio("https://res.cloudinary.com/dwut3uz4n/video/upload/v1532362194/352659__foolboymedia__alert-chime-1.mp3") // changed to use <audio> to pass FCC tests
    switch (status) {
      case false:
        console.log("Begin Timer")
        this.setState({ running: true })

        this.timer = setInterval(() => {
          if (this.state.running) {

            if  (this.state.sessionRemainingSeconds === 0 ) { 
              // chime1.play(); // changed to use <audio> to pass FCC tests
              const sessionRef = this.state.sessionRef
              console.log(sessionRef)
              sessionsRef.doc(sessionRef).update({
                stop_time: firebase.firestore.FieldValue.serverTimestamp()
              })
              document.getElementById("notification").play();
              this.setState({ running: false, showClose: true })


            }


            if (this.state.sessionRemainingSeconds > 0) {
              this.setState({
                sessionRemainingSeconds: this.state.sessionRemainingSeconds - 1,
                timerLabel: 'Session'
              });
            }
            else {
              this.setState({
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
      sessionRemainingSeconds: 1500,
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


  handleChange(event){
    this.setState({goal: event.target.goal})
    }

  goSession = () => {
     this.setState({ showStart: false });
     //start timer
     this.startStop();
  };

  onChange = (event) =>{
    this.setState({[event.target.name]: event.target.value});
  };

  changeRating = (event)=>{
    this.setState({rating: event.target.value});
  };
  

  render() {
    return (
      <div id="clock" >
      <Grid container spacing = {24}>
      <Grid item xs={12}>
        <h1>Pomodoro Clock</h1>
        <h2>{this.state.goal}</h2>
        <Modal show = {this.state.showStart} handleClose = {this.goSession} buttonText = "Go!">
        <form>
          What is your goal for this session? <input type = "text" name = "goal" onChange={this.onChange}/>
        </form>
        <div className="flexContainer">
          <div id='timerContainer'  className="flexContainer">
            <h3 id="session-
            label" className="timerContainerLabels">Session Time</h3>
            <h3 id="session-length"  className="timerContainerLabels">{this.state.sessionTimeEntry}</h3>
            <button onClick={this.subSession} id="session-decrement" className="timerContainerButtons">-</button>
            <button onClick={this.addSession} id="session-increment" className="timerContainerButtons">+</button>
          </div>
        </div>
        </Modal>
        </Grid>
       
        <div id="mainTimer">
          <h1>{this.formatMinutes(this.state.sessionRemainingSeconds)}</h1>
          <h2>{this.state.timerLabel}</h2>
         
          <div id="timerControls" className="flexContainer">
              <Button variant ="contained" color = "primary" onClick={this.startStop} id="start-stop">Start/Stop</Button>
              <Button variant = "contained" color = "secondary" onClick={this.resetTimer} id="reset">Reset</Button>
          </div>
        </div>
        </Grid>

      <Modal show = {this.state.showClose}>
      This is the closing screen.
      <form>
          Your Goal: {this.state.goal}
          Comment on your goal: <input type = "text" name = "goal_comment" onChange={this.onChange}/>
          Qaulity of practice: <StarRatings rating={this.state.rating} starRatedColor = "red" numberOfStars = {5} name = 'rating' changeRating ={this.changeRating}/>
          What did you learn: <input type = "text" name = "learn_comment" onChange={this.onChange}/>
          1 Question you still have: <input type = "text" name = "question_cmmment" onChange={this.onChange}/>
        </form>


      </Modal>

        <audio id="notification" src="https://res.cloudinary.com/dwut3uz4n/video/upload/v1532362194/352659__foolboymedia__alert-chime-1.mp3" preload="auto"></audio> 
      </div>
    )
  }


}



export default Countdown;



