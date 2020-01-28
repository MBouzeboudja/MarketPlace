import React from "react";
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import BIFormProperty from './components/bi-form-property';
import BIHomePage from './components/bi-home-page';
import 'bootstrap/dist/css/bootstrap.min.css';


import "./App.css";

export default function App() {
    return(
        <Router>
          <div>
            <Switch>     
              <Route path='/Property/new'>
                 <BIFormProperty/> 
              </Route>
              <Route path='/'> 
                <BIHomePage/> 
              </Route>  
            </Switch>
          </div>
        </Router>
    );

}
