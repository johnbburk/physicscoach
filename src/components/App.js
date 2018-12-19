import React, { Component } from 'react';
import '../styles/App.css';
import Countdown from "./Countdown";
import timer from 'react-timer-hoc';


const Timer1 = timer(1000)(Countdown);

class App extends Component {
  render() {
    return (
      <div className="container">
   <Timer1 />
      </div>
    );
  }
}
export default App;
