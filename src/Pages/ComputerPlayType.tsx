import { useState } from 'react'
import '../Styles/ComputerPlayType.css'
import RoomLobby from '../Components/RoomLobby';

const ComputerPlayType = () => {

  const [playOptionClicked, setPlayOptionClicked] = useState<string>("");
  const [myName, setMyName] = useState<string>("");
  const [showLobby, setShowLobby] = useState<boolean>(false);

  return (
    <>
      {
        showLobby &&
        <RoomLobby 
          roomJoinedSuccessfully={true}
          roomCode={""}
          player1Name={myName}
          myMoveSign={"X"}
          opponentName={playOptionClicked === "Computer" ? "Mr.Computer" : "Mr.AI"}
          setOpponentName={() => {}}
          playMode={playOptionClicked === "Computer" ? "Computer" : "AI"}
        />
      }
      <div className='mainDiv'>
        {
          !playOptionClicked ?
          <div className='computerPlayOptionsDiv'>
            <div className='playOptionsTitle'>
              <h1>
              Vs
              </h1>
            </div>

            <div className='computerPlayOptions'>
              <div
                className='computerPlayOption1'
                onClick={() => setPlayOptionClicked("Computer")}
              >
                <h1>Computer</h1>
              </div>
              <div
                className='computerPlayOption2'
                onClick={() => setPlayOptionClicked("AI")}
              > 
                <h1>AI</h1>
              </div>
            </div>
          </div>
          :
          <div className='optionNameInput'>
            <div>
              <h1>Enter Your Name</h1>
            </div>
            <div className='nameInputBox'>
              <input type="text" placeholder='Enter Your Name' value={myName} onChange={(e) =>setMyName(e.target.value)}/>
              <button
                onClick={() => {
                  setShowLobby(true);
                }}
              >Go</button>
            </div>
          </div>
        }
      </div>
    </>
  )
}

export default ComputerPlayType