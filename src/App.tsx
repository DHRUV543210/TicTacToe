import React, { useEffect, useState } from 'react'
import backgroundAudio from '/Audios/backgroundMusic.mp3';
import './App.css'
import PvPPlayType from './Pages/PvPPlayType';
import ComputerPlayType from './Pages/ComputerPlayType';
import FriendPlayType from './Pages/FriendPlayType';

const App = () => {

  // States
  const [playButtonClicked, setPlayButtonClicked] = useState<boolean>(false);
  const [typeOfPlay, setTypeOfPlay] = useState<string>('');

  //Back States
  const [backFromPvPMode, setBackFromPvPMode] = useState<boolean>(false);
  const [backFromComputerMode, setBackFromComputerMode] = useState<boolean>(false);
  const [backFromFriendMode, setBackFromFriendMode] = useState<boolean>(false);

  // Effects

  useEffect(() => {
    if (playButtonClicked) {
      playBackgroundSound()
    }
  }, [playButtonClicked])

  useEffect(() => {
    if(backFromPvPMode){
      setTypeOfPlay("");
      setBackFromPvPMode(false);
    }
  },[backFromPvPMode])

  // Functions
  const playBackgroundSound = () => {
    const audio = new Audio(backgroundAudio);
    audio.loop = true;
    audio.play();
  };

  const playNowClicked = () => {
    setPlayButtonClicked(true);
  }

  return (
    <>
      {
        typeOfPlay === 'PvP' ?
          <PvPPlayType
            backFromPvPMode={backFromPvPMode}
            setBackFromPvPMode={setBackFromPvPMode}
          />
          :
          typeOfPlay === 'Computer' ?
            <ComputerPlayType
            />
            :
            typeOfPlay === 'Friend' ?
              <FriendPlayType
              />
              :
              <div className='background-div'>
                <div className='main-box'>
                  <div>
                    {
                      !playButtonClicked ?
                        <button
                          className='play-now'
                          onClick={(e) => {
                            e.preventDefault()
                            playNowClicked()
                          }}
                        >
                          Play Now
                        </button>
                        :
                        <button
                          className='choose-play-mode'
                        >
                          Choose Play Mode
                        </button>
                    }
                  </div>
                  {
                    playButtonClicked &&

                    <div className='play-options'>
                      <button
                        className='play-options-option'
                        onClick={(e) => {
                          e.preventDefault();
                          setTypeOfPlay('PvP');

                        }}
                      >
                        PvP (Online)
                      </button>

                      <button
                        className='play-options-option'
                        onClick={(e) => {
                          e.preventDefault();
                          setTypeOfPlay('Computer');

                        }}
                      >
                        Vs Computer
                      </button>

                      <button
                        className='play-options-option'
                        onClick={(e) => {
                          e.preventDefault();
                          setTypeOfPlay('Friend');

                        }}
                      >
                        Vs Friend (Offline)
                      </button>
                    </div>
                  }
                </div>
              </div>
      }
    </>
  )
}

export default App