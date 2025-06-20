import React, { useEffect, useState, useRef } from 'react';
import './SuperMario2.css';
import SuperMario from './SuperMario';

function SuperMario2({ volume, directionFromJoycon }) {
  const [isLoading, setIsLoading] = useState(true);
  const audioRef = useRef(null);
  const jumpAudioRef = useRef(null);
  const coinAudioRef = useRef(null);
  const gameOverAudioRef = useRef(null);
  const victoryAudioRef = useRef(null);
  const [character, setCharacter] = useState('mario');
  const [showVolumeUI, setShowVolumeUI] = useState(false);
  const volumeTimeoutRef = useRef(null);
  const [showGif, setShowGif] = useState(false);
  const marioRef = useRef(null);
const [isMuted, setIsMuted] = useState(false);

  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isJumping, setIsJumping] = useState(false);
  const [currentLevel, setCurrentLevel] = useState(2);
  const [isMoving, setIsMoving] = useState(false);
  const [facingDirection, setFacingDirection] = useState('right');
  const [brickBlocks, setBrickBlocks] = useState([{ id: 1, x: 400, y: 170 }]);
  const [coins, setCoins] = useState([
    { id: 1, x: 300, y: 100 },
    { id: 2, x: 500, y: 100 },
    { id: 3, x: 640, y: 100 },
    // { id: 4, x: 405, y: 220 }, // on top of brick 1
    // { id: 5, x: 655, y: 220 }  // on top of brick 2
  ]);

  const [score, setScore] = useState(0);

  const obstacle = { x: 700, width: 60 };
  const [isGameOver, setIsGameOver] = useState(false);

  const handleRestart = () => {
    setPosition({ x: 0, y: 0 });
    setCoins([
      { id: 1, x: 300, y: 100 },
      { id: 2, x: 500, y: 100 },
      { id: 3, x: 860, y: 100 },
      // { id: 4, x: 405, y: 220 }, // on top of brick 1
      // { id: 5, x: 655, y: 220 }
    ]);
    setScore(0);
    setIsGameOver(false);
    setShowGif(false);

    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play();
      if (victoryAudioRef.current) {
        victoryAudioRef.current.pause();
      }
      if (gameOverAudioRef.current) {
        gameOverAudioRef.current.pause();
      }
    }
  };

    const toggleMute = () => {
  const muteState = !isMuted;
  setIsMuted(muteState);

  const volumeValue = muteState ? 0 : volume;

  if (audioRef.current) audioRef.current.volume = volumeValue;
  if (jumpAudioRef.current) jumpAudioRef.current.volume = volumeValue;
  if (coinAudioRef.current) coinAudioRef.current.volume = volumeValue;
  if (gameOverAudioRef.current) gameOverAudioRef.current.volume = volumeValue;
  if (victoryAudioRef.current) victoryAudioRef.current.volume = volumeValue;
};


  const move = dir => {
    if (isGameOver) return;
    setFacingDirection(dir); // save direction

    if (dir === 'left' || dir === 'right') {
      setIsMoving(true);
    }

    if (dir === 'up') {
      setIsJumping(true);
      setIsMoving(false); // Not running while jumping
    }
    const delta = dir === 'left' ? -50 : dir === 'right' ? 80 : 0;
    const newX = Math.min(850, Math.max(0, position.x + delta));
    const marioLeft = newX;
    const marioRight = newX + 80;
    const obstacleLeft = obstacle.x + 30;
    const obstacleRight = obstacle.x + obstacle.width;

    const isHittingObstacleHorizontally =
      marioRight > obstacleLeft && marioLeft < obstacleRight;
    const isOnGround = position.y === 0;

    if (isHittingObstacleHorizontally && isOnGround) {
      setIsGameOver(true);
      if (gameOverAudioRef.current) {
        gameOverAudioRef.current.currentTime = 0;
        gameOverAudioRef.current.play();
        audioRef.current.pause();
      }
      return;
    }

    // Update Mario's X position
    setPosition(prev => ({ ...prev, x: newX }));

    // Show victory
    if (newX === 850 && position.x !== 850) {
      setShowGif(true);
    }

    // Handle Jump
    if (dir === 'up' && !isJumping) {
      setIsJumping(true);
      setPosition(prev => ({ ...prev, y: -150 }));

      setTimeout(() => {
        const landedOnBrick = brickBlocks.find(brick => {
          const brickLeft = brick.x - 10;
          const brickRight = brick.x + 40;

          const isHorizontallyAligned =
            marioRight > brickLeft && marioLeft < brickRight;
          return isHorizontallyAligned;
        });

        if (landedOnBrick) {
          // Stay on brick
          setPosition(prev => ({ ...prev, y: -150 }));
        } else {
          // Fall to ground
          setPosition(prev => ({ ...prev, y: 0 }));
        }

        setIsJumping(false);
      }, 500);
    } else {
      // 👇 Check if Mario is walking off the brick
      const stillOnBrick = brickBlocks.some(brick => {
        const brickLeft = brick.x;
        const brickRight = brick.x + 50;

        const isHorizontallyAligned =
          marioRight > brickLeft && marioLeft < brickRight;
        const isVerticallyOnBrick = position.y === brick.y + 50;

        return isHorizontallyAligned && isVerticallyOnBrick;
      });

      if (!stillOnBrick && position.y !== 0 && !isJumping) {
        // Fall to ground if no longer on brick
        setPosition(prev => ({ ...prev, y: 0 }));
      }
    }
  };

  useEffect(() => {
    const marioLeft = position.x;
    const marioRight = position.x + 80;
    const marioBottom = position.y + 70;

    setCoins(prevCoins => {
      return prevCoins.filter(coin => {
        const coinLeft = coin.x;
        const coinRight = coin.x + 40;

        const isHorizontallyTouching =
          marioRight > coinLeft && marioLeft < coinRight;
        const isVerticallyTouching = Math.abs(marioBottom - coin.y) < 40;

        const isColliding = isHorizontallyTouching && isVerticallyTouching;

        if (isColliding) {
          setScore(prev => prev + 10);
          if (coinAudioRef.current) {
            coinAudioRef.current.currentTime = 0;
            coinAudioRef.current.play();
          }
        }

        return !isColliding;
      });
    });
  }, [position]);

  const handlePrevLevel = () => {
    setCurrentLevel(1);
  };

  // Keyboard controls
 useEffect(() => {
     const handleKeyDown = e => {
       if (e.key === 'ArrowLeft') move('left');
       if (e.key === 'ArrowRight') move('right');
       if (e.key === 'ArrowUp') move('up');
     };
 
     const handleKeyUp = e => {
     if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
       setIsMoving(false);
     }
     };
 
     window.addEventListener('keydown', handleKeyDown);
     window.addEventListener('keyup', handleKeyUp);
 
     return () => {
         window.removeEventListener('keyup', handleKeyUp);
         window.removeEventListener('keydown', handleKeyDown)
       };
   }, [position, isJumping, isGameOver]);

  // Joycon input
  useEffect(() => {
    move(directionFromJoycon.direction);
  }, [directionFromJoycon]);

  // Volume update
 useEffect(() => {
    const volumeValue = isMuted ? 0 : volume;
    if (audioRef.current) audioRef.current.volume = volumeValue;
  if (jumpAudioRef.current) jumpAudioRef.current.volume = volumeValue;
  if (coinAudioRef.current) coinAudioRef.current.volume = volumeValue;
  if (gameOverAudioRef.current) gameOverAudioRef.current.volume = volumeValue;
  if (victoryAudioRef.current) victoryAudioRef.current.volume = volumeValue;

    setShowVolumeUI(true);
    clearTimeout(volumeTimeoutRef.current);
    volumeTimeoutRef.current = setTimeout(() => setShowVolumeUI(false), 1500);
  }, [volume, isMuted]);

  // Loader timeout
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3500);
    return () => clearTimeout(timer);
  }, []);

  // Background music
  useEffect(() => {
    if (!isLoading && audioRef.current && !isGameOver) {
      audioRef.current.play();
    }
  }, [isLoading, isGameOver]);

  // Jump audio
  useEffect(() => {
    if (isJumping && jumpAudioRef.current) {
      jumpAudioRef.current.play();
    }
  }, [isJumping]);

  useEffect(() => {
    if (!isGameOver && victoryAudioRef.current && showGif) {
      victoryAudioRef.current.play();
      audioRef.current.pause();
    }
  }, [isGameOver, showGif]);

  if (currentLevel === 1) {
    return (
      <SuperMario volume={volume} directionFromJoycon={directionFromJoycon} />
    );
  }
  return (
    <div className="super-mario-screen2">
      <audio ref={jumpAudioRef} src="/assets/mario_jump.mp3" />
      <audio
        ref={coinAudioRef}
        src="/assets/mario_coin_sound.mp3"
        preload="auto"
      />
      <audio
        ref={gameOverAudioRef}
        src="/assets/mario-game-over.mp3"
        preload="auto"
      />
      <audio ref={audioRef} src="/assets/level2-music.mp3" loop />
      <audio
        ref={victoryAudioRef}
        src="/assets/mario-wins.mp3"
        preload="auto"
      />
      {isLoading ? (
        <div className="loading-container2">
          <img src="/mario.png" alt="Mario" className="character-img" />
          <img src="/marioLogo.png" alt="Super Mario Logo" className="logo" />
          <img src="/loadingGif.gif" alt="Loading..." className="loading-gif" />
        </div>
      ) : (
        <div className="main-game-assets2">
          <h1 className="super-heading2">LEVEL 2</h1>
          <div className="score-box">Score: {score}</div>
           <div className="mute-button" onClick={toggleMute}>
          <img
            src={isMuted ? '/assets/mute.webp' : '/assets/volume.webp'}
            alt="Mute Toggle"
            className={isMuted ? "mute-icon" : "volume-icon"}
          />
          </div>
          <div
            className="character-switch"
            onClick={() => {
              setCharacter(prev => (prev === 'mario' ? 'peach' : 'mario'));
            }}
          >
            <img
              src={`/assets/${character === 'mario' ? 'peach-icon.png' : 'mario-icon.png'}`}
              alt="Switch Icon"
              className="switch-icon"
            />
          </div>

          {isGameOver && (
            <>
              <div className="game-over-text">
                <div>GAME OVER</div>
                <div className="final-score">Your Score: {score}</div>
              </div>
              <img
                src="/assets/restart.png"
                alt="Restart"
                className="restart-icon"
                onClick={handleRestart}
              />
              <img
                src={`${character === 'mario' ? '/assets/mario-death.png' : '/assets/princess.png'}`}
                alt="Game Over"
                className={`game-over-gif2 ${isGameOver ? 'mario-death-animation' : ''} `}
                style={{
                  backgroundSize: 'cover',
                  ...(character === 'peach' && {
                    width: '114px',
                    height: '135px',
                  }),
                }}
              />
            </>
          )}

          {!showGif && !isGameOver ? (
            <>
              <img
                ref={marioRef}
                className={`mario2 ${isJumping ? 'jump' : ''}`}
                src={
                  character === 'peach' ? `/assets/princess.png` :
                  isJumping
                    ? `/assets/running-stop.png` // add jump image if needed
                    : isMoving
                      ? `/assets/mario-running.gif`
                      : `/assets/running-stop.png` // standing
                }
                alt={character}
                style={{
                  transform: `translate(${position.x}px, ${position.y}px)`,
                  backgroundSize: 'cover',
                  transform: `translate(${position.x}px, ${position.y}px) scaleX(${facingDirection === 'left' ? -1 : 1})`,
                  ...(character === 'peach' && {
                    width: '100px',
                    height: '135px',
                  }),
                }}
              />
              {brickBlocks.map(brick => (
                <div
                  key={brick.id}
                  className="brick-block"
                  style={{
                    left: `${brick.x}px`,
                    bottom: `${brick.y}px`,
                  }}
                ></div>
              ))}

              {coins.map(coin => (
                <div
                  key={coin.id}
                  className="coin"
                  style={{
                    position: 'absolute',
                    left: `${coin.x}px`,
                    bottom: `${coin.y}px`,
                  }}
                />
              ))}

              <img
                src="/assets/shark.png"
                alt="Obstacle"
                className="obstacle"
                style={{
                  position: 'absolute',
                  bottom: '10px',
                  left: `${obstacle.x}px`,
                  width: '100px',
                  height: '85px',
                }}
              />
            </>
          ) : (
            !isGameOver && (
              <>
                <img
                  src={`/assets/${character === 'mario' ? 'mario-victory.gif' : 'princess-peach-wins.gif'}`}
                  alt="Victory"
                  className="mario-victory2"
                  style={{
                    backgroundSize: 'cover',
                    ...(character === 'peach' && {
                      width: '230px',
                      height: '205px',
                      bottom: '65px',
                    }),
                  }}
                />

                <div className="victory-popup">
                  <div className="victory-text">🎉 Congratulations! 🎉</div>
                  <div className="final-score">Your Score: {score}</div>
                  <>
                    <img
                      src="/assets/restart.png"
                      alt="Restart"
                      className="restart-icon"
                      onClick={handleRestart}
                    />
                    <div
                      className="next-level-button"
                      onClick={handlePrevLevel}
                    >
                      Previous Level
                    </div>
                  </>
                </div>
              </>
            )
          )}

          <img src="/assets/flag-mario.png" className="flag2" alt="Flag" />

          {showVolumeUI && (
            <div className="volume-ui">
              <div className="volume-bar-bg">
                <div
                  className="volume-bar-fill"
                  style={{ width: `${volume * 100}%` }}
                ></div>
              </div>
              <div className="volume-label">
                Volume: {Math.round(volume * 100)}%
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default SuperMario2;
