import React, { useState } from 'react';
import OldNintendo from './OldNintendo';
import NewNintendo from './NewNintendo';
import './SpiralTransition.css';

function App() {
  const [gameStarted, setGameStarted] = useState(false);

  return (
    <>
      {gameStarted ? (
        <div className="spiral-enter">
          <NewNintendo />
        </div>
      ) : (
        <OldNintendo
          onStart={() => setTimeout(() => setGameStarted(true), 1000)}
        />
      )}
    </>
  );
}

export default App;
