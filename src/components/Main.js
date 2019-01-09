import React from "react"
import ReactDOM from "react-dom"
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid'; 
import firebase from "../config/constants.js";

class Main extends React.Component{

    constructor(props){
        super(props)
    

    this.newSession = this.newSession.bind(this);
    }
    newSession(){
        const url = "/newSession";
        window.location.assign(url)
    }

    render(){
        return(
            <div>
                <Button variant = "contained" color = "primary" onClick={this.newSession} id='newSession'>New Session </Button>
            </div>
        )
    }
}

export default Main;

