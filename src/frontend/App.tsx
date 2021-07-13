import React from 'react';
import './App.css';
import GlobeView from './globe/GlobeView';

type Props = {}

const App: React.FC<Props> = () => {
  return (
    <div className="App">
      <GlobeView></GlobeView>
    </div>
  )
}

export default App;
