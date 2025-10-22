import React, { useEffect, useState } from 'react'
import './CSS/MatchStartingScreen.css'

interface MatchStartingInScreenProps{
    setShowPlayArea: React.Dispatch<React.SetStateAction<boolean>>;
    setShowMatchStartingScreen: React.Dispatch<React.SetStateAction<boolean>>;
}

const MatchStartingInScreen = ({setShowPlayArea, setShowMatchStartingScreen}: MatchStartingInScreenProps) => {

    const [timer, setTimer] = useState<number>(3);

    useEffect(() => {
        const interval = setInterval(() => {
        setTimer(prev => {
            if (prev === 0) {
            clearInterval(interval);
            return 0;
            }
            return prev - 1;
        });
        }, 1000);

        return () => clearInterval(interval); // cleanup on unmount
    }, [])

    useEffect(() => {
        if(timer === 0){
            setShowMatchStartingScreen(false);
            setShowPlayArea(true);
        }
    },[timer])

  return (
    <>
        <div className='mainBlurDiv'>
            <h1>Match Starting In... </h1>
            <h1 className='timer'>{timer}</h1>
        </div>
    </>
  )
}

export default MatchStartingInScreen