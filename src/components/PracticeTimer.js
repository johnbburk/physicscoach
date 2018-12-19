import React, { Component } from 'react';
import '../styles/App.css';
import Countdown from "./Countdown";
import timer from 'react-timer-hoc';

const Timer1 = timer(1000)(Countdown);


updateInput = e => {
    this.setState({[e.target.name]:e.target.value});
}

createPractice = e =>{
    e.preventDefault();
    const db = firebase.firestore();
    db.settings({
        timestampsInSnapshots: true
    });
    const userRef = db.collection("practice_sessions").add({
      //todo need to modify this to record the username, goals and start time. 
      
        fullname: this.state.fullname,
        email: this.state.email
    })
    this.setState({
        fullname: "",
        email: ""
    });
};



class PracticeTimer extends Component {
    render() {
      return (
        <div className="container">
        <form onSubmit={this.createPractice}>
            <input type = "text" name="goal" placeholder="What is your goal for this session?" onChange={this.updateInput} value ={this.state.goal}/>
            <button type="submit">Submit</button>
        </form>
     <Timer1 />
        </div>
      );
    }
  }
  export default PracticeTimer;
  