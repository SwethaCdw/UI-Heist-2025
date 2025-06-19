import React from 'react';
import './OldNintendo.css';
import useClickSound from './useClickSound';


function OldNintendo({ onStart }) {
      const playClick = useClickSound();

//   return (
//     <div className="old-nintendo">
//     <div className="gif-container">
//         <img src="/press-start.gif" alt="Console Animation" />
//       </div>

//     <div className="retro-console">
//       <div className="controls-panel">
//         <h3 className="title">GAME CONTROLS</h3>
//         <div className="dpad-box">
//           <div className="dpad">
//             <div className="arrow up">↑</div>
//             <div className="arrow left">←</div>
//             <div className="arrow center"></div>
//             <div className="arrow right">→</div>
//             <div className="arrow down">↓</div>
//           </div>
//         </div>
//         <div className="volume-section">
//           <div className="volume-label">Volume Control</div>
//           <div className="volume-buttons">
//             <button>🔉</button>
//             <button>🔈</button>
//             <button>🔊</button>
//           </div>
//           <div className="volume-bars">
//             {[...Array(12)].map((_, i) => (
//               <div
//                 key={i}
//                 className={`bar ${i < 5 ? 'active' : ''}`}
//               ></div>
//             ))}
//           </div>
//         </div>
//         <div className="status">
//           <span>Status:</span>
//           <span className="connected">[ Connected ]</span>
//         </div>
//       </div>

//       <div className="screen-panel">
//         <div className="screen-area"></div>
//         <div className="buttons-row">
//           <button className="start" onClick={onStart}>START</button>
//           <button className="power">POWER</button>
//           <button className="stop">STOP</button>
//         </div>
//       </div>
//     </div>
//     </div>
//   );
return (
    <div className="container">
        <div className="gif-container">
         <img src="/press-start.gif" alt="Console Animation" />
       </div>
      <div className="console">
        {/* Left Control Panel */}
        <div className="left-panel">
          <h2 className="title">GAME CONTROLS</h2>
            <div className='container-old'>
          {/* D-Pad */}
          <div className="dpad">
            <button className="arrow-old up">↑</button>
            <div className="horizontal-arrows">
              <button className="arrow-old left">←</button>
              <div className="center" />
              <button className="arrow-old right">→</button>
            </div>
            <button className="arrow-old down">↓</button>
          </div>

          {/* Volume Control */}
          <div className="volume-control">
            <p className="volume-label-old">Volume Control</p>
            <div className="volume-buttons">
              <button>◄</button>
              <button>🔇</button>
              <button>►</button>
            </div>
            <div className="volume-bars">
              {[...Array(12)].map((_, i) => (
                <div key={i} className={`bar ${i < 8 ? "active" : ""}`}></div>
              ))}
            </div>
          </div>
          </div>

          <div className="status">
            Status: <span className="connected">Connected</span>
          </div>
        </div>

        {/* Right Screen + Buttons Panel */}
        <div className="right-panel">
          <div className="screen-old-wrapper">
            <div className="screen-old"></div>
            <div className="button-row">
              <button className="start" onClick={() => {playClick(); onStart();}}>START</button>
              <button className="power">POWER</button>
              <button className="stop">STOP</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OldNintendo;
