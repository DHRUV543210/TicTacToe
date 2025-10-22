import { useEffect, useMemo } from 'react';
import './CSS/WinnerOrDrawModal.css'

interface WinnerOrDrawModalProps{
  isDraw?: boolean;
  winner?: string;
  myName: string;
}

const WinnerOrDrawModal = ({isDraw, winner, myName}: WinnerOrDrawModalProps) => {

  const showModal = isDraw || !!winner;

  const sound = useMemo(() => {
    if (isDraw) return new Audio('/Audios/sadWhisle-sound.mp3');
    if (winner && winner === myName) return new Audio('/Audios/cheering-sound.wav');
    if (winner && winner !== myName) return new Audio('/Audios/sadWhisle-sound.mp3');
    return null;
  }, [isDraw, winner, myName]);

  useEffect(() => {
    if (sound) {
      sound.currentTime = 0;
      sound.play();
    }
  },[sound])

  return (
    <div className={`winnerOrDrawModalDiv ${showModal ? 'show' : ''}`}>
        {isDraw && <h1>Draw 😑</h1>}
        
        {winner && <h1>{winner} is the Winner ☺️</h1>}

        <p>{winner && winner !== myName ? 'Dont worry, you can win Next Time 😉' : null}</p>

        <button
            onClick={() => window.location.reload()}
        >
            Go Home 🏠
        </button>
    </div>
  )
}

export default WinnerOrDrawModal