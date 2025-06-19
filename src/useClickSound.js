// useClickSound.js
import { useRef } from 'react';

const useClickSound = () => {
  const audioRef = useRef(new Audio('/assets/button-click.mp3'));

  const playClick = () => {
    console.log('Playing click sound');
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = 0;
    audio.volume = 1;
    audio.play().catch(() => {});
  };

  return playClick;
};

export default useClickSound;
