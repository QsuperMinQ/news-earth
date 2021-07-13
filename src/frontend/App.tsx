import React from 'react';
import './App.css';
import GlobeView from './globe/GlobeView';
import MapView from './map/MapView';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";
import GlobeGLView from './globegl/GlobeGLView';

type Props = {}

const App: React.FC<Props> = () => {
  return (
    <div className="App">
      <Router>
        <Switch>
          <Route path="/globe">
            <GlobeView />
          </Route>
          <Route path="/map">
            <MapView />
          </Route>
          <Route path="/globegl">
            <GlobeGLView />
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
