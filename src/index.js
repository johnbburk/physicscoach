// Import FirebaseAuth and firebase.
import React from 'react';
import ReactDOM from "react-dom";
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import firebase from 'firebase';
import App from "./components/App";
import { BrowserRouter as Router, Route, Redirect, Link, Switch } from "react-router-dom";
import { logout } from './helpers/auth'
import UserTest from "./components/UserTest"
import Main from "./components/Main"

const keys = require("./config/keys");


const Public = () => <h3>Public</h3>
const Protected = () =><h3>Protected</h3>
const UT = () => <div><UserTest /></div>

class SignInScreen extends React.Component {
  constructor(props){
    super(props);
  
  // The component's Local state.
  this.state = {
    isSignedIn: false, // Local signed-in state.
    loading: true,
    authUser: null

  };
  }
  // Configure FirebaseUI.
  uiConfig = {
    // Popup signin flow rather than redirect flow.
    signInFlow: 'popup',
    // We will display Google as auth providers.
    signInOptions: [
      firebase.auth.GoogleAuthProvider.PROVIDER_ID,
    ],
    callbacks: {
      // Avoid redirects after sign-in.
      signInSuccessWithAuthResult: () => false
    }
  };

  // Listen to the Firebase Auth state and set the local state.
  componentDidMount() {
    firebase.auth().onAuthStateChanged(authUser => {
      authUser ? this.setState({authUser: authUser, isSignedIn: true, loading: false})
      : this.setState({authUser: null, isSignedIn: false, loading: false})
    });


    // this.unregisterAuthObserver = firebase.auth().onAuthStateChanged(
    //     (user) => this.setState({isSignedIn: !!user, loading: false, authUser: user})
    // );
    
  }
  
  // Make sure we un-register Firebase observers when the component unmounts.
  componentWillUnmount() {
    this.unregisterAuthObserver();
  }

  render() {
    if (this.state.loading){
      return (<h1>Loading</h1>)
    }
      if(!this.state.isSignedIn) {
          return (
            <div>
              <h1>My App</h1>
              <p>Please sign-in:</p>
              <StyledFirebaseAuth uiConfig={this.uiConfig} firebaseAuth={firebase.auth()}/>
          
              const user = firebase.auth().currentUser;


}
            </div>
          ) 
        }
    return(
      <Router>
        <div>
          <ul>
            <li><Link to ="/public">Public Page</Link></li>
            <li><Link to ="/protected">Protected</Link></li>
            <li><Link to ="/user">User</Link></li>
            <li><Link to ="/newSession">New Session</Link></li>
            
        </ul>
        <Switch>
          <Route  path="/public" component = {Public}/>
          <PrivateRoute authed={this.state.isSignedIn} path="/protected" component = {Main}/>
          <PrivateRoute authed={this.state.isSignedIn} path="/newSession" component = {App}/>
          <Route  path="/user" component = {UserTest}/>
        </Switch>          
          <button
                        style={{border: 'none', background: 'transparent'}}
                        onClick={() => {
                          logout();
                        }}
                      >Logout</button>

      
        </div>
        
      </Router>
    )
    
}
}

const PrivateRoute = ({ component: Component, authed, ...rest }) => (
  <Route {...rest} 
  render={(props) => (
    authed === true
      ? <Component {...props} />
      : <Redirect to={{
          pathname: '/login',
          state: { from: props.location }
        }} />
  )} />
)

const PublicRoute = ({ component: Component, authed, ...rest }) => (
  <Route {...rest} 
  render={(props) => (
    authed === false
      ? <Component {...props} />
      : <Redirect to= "/"/>
  )} />
)


ReactDOM.render(<SignInScreen/>, document.getElementById("root"))