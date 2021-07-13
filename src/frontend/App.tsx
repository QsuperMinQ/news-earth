import React from 'react';
import './App.css';
import GlobeView from './globe/GlobeView';
import MapView from './map/MapView';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";

type Props = {}

const App: React.FC<Props> = () => {
  return (
    <div className="App">
      <Router>
        <Switch>
          <Route path="/globe">
            <GlobeView />
          </Route>
          <Route path="/mapView">
            <MapView />
          </Route>
          <Route path="/">
            <GlobeView />
          </Route>
        </Switch>
      </Router>
    </div>
  )
}

export default App;
