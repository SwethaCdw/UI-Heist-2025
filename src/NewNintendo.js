import React, { useState, useEffect } from 'react';
import './NewNintendo.css';
import SuperMario from './SuperMario';
import useClickSound from './useClickSound';
function NewNintendo() {
  const playClick = useClickSound();
  const [powerOn, setPowerOn] = useState(true);
  const [videoEnded, setVideoEnded] = useState(false);
  const [showImage, setShowImage] = useState(false);
  const [showBlack, setShowBlack] = useState(false);
  const [showMario, setShowMario] = useState(false);
  const [showMenuBar, setShowMenuBar] = useState(false);
  const [showHandbook, setShowHandbook] = useState(false);

  const [marioDirection, setMarioDirection] = useState({
    direction: '',
    time: Date.now(),
  });

  const [volume, setVolume] = React.useState(0.5);

  const increaseVolume = () => {
    setVolume(prev => Math.min(1, parseFloat((prev + 0.1).toFixed(2))));
  };

  const decreaseVolume = () => {
    setVolume(prev => Math.max(0, parseFloat((prev - 0.1).toFixed(2))));
  };

  function handlePowerOn() {
    console.log('Power button clicked', powerOn);
    if (!powerOn) {
      setPowerOn(true);
    } else {
      setShowMenuBar(true);
    }
  }

  // Step 2: When video ends, show image for 2 seconds
  useEffect(() => {
    if (videoEnded) {
      setShowImage(true);

      const imageTimer = setTimeout(() => {
        setShowImage(false);
        setShowBlack(true);

        // After black screen, show Mario
        const marioTimer = setTimeout(() => {
          setShowMario(true);
        }, 2000); // black screen duration

        return () => clearTimeout(marioTimer);
      }, 3000); // image duration

      return () => clearTimeout(imageTimer);
    }
  }, [videoEnded]);

  return (
    <>
      <img
        src="/assets/settings.png"
        className="handbook-icon"
        onClick={() => setShowHandbook(true)}
        alt="handbook"
      ></img>
      <div className="switch">
        {showHandbook && (
          <div
            className="handbook-modal-backdrop"
            onClick={() => setShowHandbook(false)}
          >
            <div className="handbook-modal" onClick={e => e.stopPropagation()}>
              <h2>
                Game Controls<p>( Use Keyboard Keys ) </p>
              </h2>

              <ul className="controls-list">
                <li>
                  <img
                    className="power-btn-img"
                    style={{ margin: '0 10px', width: '30px', height: '30px' }}
                    src="/assets/power-button.svg"
                    alt="power-button"
                  />{' '}
                  — Turn Console On/Off
                </li>
                <li>
                  <b className="h-dpad-btn">◀</b> — Move Mario Left
                </li>
                <li>
                  <b className="h-dpad-btn">▶</b> — Move Mario Right
                </li>
                <li>
                  <b className="h-dpad-btn">▲</b> — Jump
                </li>
                <li>
                  {' '}
                  <div
                    style={{
                      marginLeft: '20px',
                      marginTop: '10px',
                      marginRight: '20px',
                    }}
                    className="plus"
                  ></div>
                  — Increase Volume
                </li>
                <li>
                  <div
                    style={{ boxShadow: 'none', margin: '5px 10px 0 10px' }}
                    className="minus"
                  ></div>{' '}
                  — Decrease Volume
                </li>
              </ul>
              <button
                className="modal-close-btn"
                onClick={() => setShowHandbook(false)}
              >
                ✖ Close
              </button>
            </div>
          </div>
        )}

        <div className="joycon left">
          <div
            className="minus"
            onClick={() => {
              playClick();
              decreaseVolume();
            }}
          >
            −
          </div>
          <div className="stick"></div>
          <div className="dpad-buttons">
            <div
              className="dpad-btn up"
              onClick={() =>
                setMarioDirection({ direction: 'up', time: Date.now() })
              }
            >
              ▲
            </div>
            <div className="dpad-btn down">▼</div>
            <div
              className="dpad-btn left"
              onClick={() =>
                setMarioDirection({ direction: 'left', time: Date.now() })
              }
            >
              ◀
            </div>
            <div
              className="dpad-btn right"
              onClick={() =>
                setMarioDirection({ direction: 'right', time: Date.now() })
              }
            >
              ▶
            </div>
          </div>

          <div className="square-button"></div>
        </div>
        <div className="screen-wrapper">
          <div className="screen">
            <div
              className={`power-status-indicator ${powerOn ? 'on' : 'off'}`}
            />

            <div
              className="power-button"
              onClick={() => {
                playClick();
                handlePowerOn();
              }}
            >
              <img
                className="power-btn-img"
                src="/assets/power-button.svg"
                alt="power-button"
              ></img>
            </div>
            <div className="bezel">
              {showMenuBar && (
                <div className="menu-bar">
                  <div className="menu-item">Sleep Mode</div>
                  <div className="menu-item">Restart</div>
                  <div
                    className="menu-item turn-off"
                    onClick={() => {
                      setShowMenuBar(false);
                      setPowerOn(false);
                    }}
                  >
                    Turn Off
                  </div>
                </div>
              )}

              {!powerOn && !showMenuBar && (
                <>
                  <div className="reflection-glass"></div>
                  <div className="reflection-streak"></div>
                </>
              )}

              {powerOn && !videoEnded && (
                <video
                  className="screen-video"
                  src="/hello-all.mp4"
                  autoPlay
                  onEnded={() => setVideoEnded(true)}
                />
              )}

              {powerOn && showImage && (
                <img
                  className="screen-image"
                  src="/nintendo-loading.jpg"
                  alt="Final screen"
                />
              )}

              {powerOn && showBlack && !showMario && (
                <div className="black-screen" />
              )}

              {powerOn && showMario && (
                <SuperMario
                  volume={volume}
                  directionFromJoycon={marioDirection}
                />
              )}
            </div>
          </div>
        </div>
        <div className="joycon right">
          <div
            className="plus"
            onClick={() => {
              playClick();
              increaseVolume();
            }}
          ></div>
          <div className="abxy-buttons">
            <div className="btn x">X</div>
            <div className="btn y">Y</div>
            <div className="btn b">B</div>
            <div className="btn a">A</div>
          </div>
          <div className="stick"></div>
          <div className="square-button"></div>
        </div>
      </div>
    </>
  );
}

export default NewNintendo;
