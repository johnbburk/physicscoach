import React from "react";
import ReactDOM from "react-dom";
import "./styles/index.css";
import App from "./components/App";
import * as serviceWorker from "./serviceWorker";
import StyledFirebaseAuth from "react-firebaseui/StyledFirebaseAuth";
import firebase from "firebase";
import {Redirect, Route, Switch, Link, BrowserRouter as Router } from "react-router-dom";


// Configure Firebase.
const config = {
  apiKey: "AIzaSyDzH89FQylXhJUEthvCy6FMh1iR94pHB8k",
  authDomain: "physics-coach.firebaseapp.com"
  // ...
};

export const firebaseApp = firebase.initializeApp(config);

export const auth = firebaseApp.auth(); //the firebase auth namespace
export const storageKey = "KEY_FOR_LOCAL_STORAGE";
export const isAuthenticated = () => {
  return !!auth.currentUser || !!localStorage.getItem(storageKey);
};

class Top extends React.Component {
  state = {
    uid: null
  };
  componentDidMount() {
    auth.onAuthStateChanged(user => {
      if (user) {
        window.localStorage.setItem(storageKey, user.uid);
        this.setState({ uid: user.uid });
      } else {
        window.localStorage.removeItem(storageKey);
        this.setState({ uid: null });
      }
    });
  }

  render() {
    return (
      <Router>
        <div>
            <Switch>
        <Route exactly path="/" component={"Welcome"} />
        <Route exactly path="/login" component={Login} />
        <MatchWhenAuthorized path="/protected" component={<App/>} />
        </Switch>
        </div>
      </Router>
    );
  }
}

const MatchWhenAuthorized = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={renderProps =>
      isAuthenticated() ? (
        <Component {...renderProps} />
      ) : (
        <Redirect
          to={{ pathname: "/login", state: { from: renderProps.location } }}
        />
      )
    }
  />
);

const uiConfig = {
    // Popup signin flow rather than redirect flow.
    signInFlow: 'popup',
    // Redirect to /signedIn after sign in is successful. Alternatively you can provide a callbacks.signInSuccess function.
    signInSuccessUrl: '/#signedIn',
    // We will display Google and Facebook as auth providers.
    signInOptions: [
      firebase.auth.GoogleAuthProvider.PROVIDER_ID,

    ],
    callbacks: {
          // Avoid redirects after sign-in.
      signInSuccessWithAuthResult: () => false
    }
  };

class Login extends React.Component {
    state = {
        isSignedIn: false,
    }
    componentDidMount() {
        this.unregisterAuthObserver = firebase.auth().onAuthStateChanged(
            (user) => this.setState({isSignedIn: !!user})
        );
      }
      // Make sure we un-register Firebase observers when the component unmounts.
  componentWillUnmount() {
    this.unregisterAuthObserver();
  }
      
    render() {
        if (!this.state.isSignedIn) {
            return (
              <div>
                <h1>My App</h1>
                <p>Please sign-in:</p>
                <StyledFirebaseAuth uiConfig={this.uiConfig} firebaseAuth={firebase.auth()}/>
              </div>
            );
          }
          return (
            <div>
              <h1>My App</h1>
              <p>Welcome {firebase.auth().currentUser.displayName}! You are now signed-in!</p>
              <a onClick={() => firebase.auth().signOut()}>Sign-out</a>
            </div>
          );
        }
      
      

}

ReactDOM.render(<Top />, document.getElementById("root"));
