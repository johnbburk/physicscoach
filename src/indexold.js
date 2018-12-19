import React from 'react';
import ReactDOM from 'react-dom';
import './styles/index.css';
import App from './components/App';
import * as serviceWorker from './serviceWorker';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import firebase from 'firebase';
import {Route, Link, BrowserRouter as Router} from "react-router-dom"
const keys = require("./config/keys");


const routing = (
  <Router>
    <div>
      <Route path="/" component ={SignInScreen} />
      <Route path="/timer" component={App}/>
      <Route path="/signin" component={SignInScreen}/>
    </div>
  </Router>
)

// Configure Firebase.
const config = {
    apiKey: keys.firebaseClientID,
    authDomain: 'physics-coach.firebaseapp.com',
    // ...
  };
  firebase.initializeApp(config);
  
  // Configure FirebaseUI.
  const uiConfig = {
    // Popup signin flow rather than redirect flow.
    signInFlow: 'popup',
    // Redirect to /signedIn after sign in is successful. Alternatively you can provide a callbacks.signInSuccess function.
    signInSuccessUrl: '/#signedIn',
    // We will display Google and Facebook as auth providers.
    signInOptions: [
      firebase.auth.GoogleAuthProvider.PROVIDER_ID,
    ]
  };

  class SignInScreen extends React.Component {
    render() {
      return (
        <div>
          <h1>My App</h1>
          <p>Please sign-in:</p>
          <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={firebase.auth()}/>
        </div>
      );
    }
}





// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();

ReactDOM.render(routing, document.getElementById("root"))