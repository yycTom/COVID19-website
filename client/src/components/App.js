import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Login from "./Login"
import Home from "./Home";
import COVID19_world_map from "./COVID19_world_map"
import Compare from "./Compare"
import Explore from "./Explore"
import First_case_death from "./First_case_death"
export default class App extends React.Component {
  render() {
    return (
      <div className="App">
        <Router>
          <Switch>
            <Route exact path="/" render={() => <Home />} />
            <Route exact path="/home" render={() => <Home />} />
            <Route path="/covid19_world_map" render={() => <COVID19_world_map />} />
            <Route path="/compare" render={() => <Compare />} />
            <Route path="/explore" render={() => <Explore />} />
            <Route path="/first_case_death" render={() => <First_case_death />} />
          </Switch>
        </Router>
      </div>
    );
  }
}
