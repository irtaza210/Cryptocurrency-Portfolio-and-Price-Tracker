import React, { useState, useEffect, useRef } from "react";
import {BrowserRouter as Router, Route, Switch, Link} from "react-router-dom";
import Chart from "./chart";
import App from "./App";
import Button from '@material-ui/core/Button';
function App2() {
    return(
    <div>
         <Router>
        <Switch>
            <Link to="/charts"><Button style={{margin: "10px", background: "white"}}>View Charts</Button></Link>
        </Switch>
        <Switch>
            <Link to="/"><Button style={{margin: "10px", background: "white"}}>Homepage</Button></Link>
        </Switch>
        <Route path="/charts">
            <br></br>
            <Chart></Chart>
        </Route>
        <Route path="/" exact>
            <App></App>
         </Route>
    </Router>
    </div>
    );
}
export default App2;