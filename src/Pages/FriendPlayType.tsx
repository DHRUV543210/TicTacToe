import {useState} from 'react'
import '../Styles/FriendPlayType.css'

// Components
import RoomLobby from '../Components/RoomLobby';

const FriendPlayType = () => {
  const [myName, setMyName] = useState<string>("");
  const [friendName, setFriendName] = useState<string>("");
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
          opponentName={friendName}
          setOpponentName={() => {}}
          playMode={"Friend"}
        />
      }
      <div className='mainDiv'>
        {
          <div className='computerPlayOptionsDiv'>
            <div className='playOptionsTitle'>
              <h1>
              Vs
              </h1>
            </div>

            <div className='computerPlayOptions'>
              <div
                className='computerPlayOption1'
              >
                <h3>Your Name</h3>
                <input type="text" placeholder='Enter Your Name' value={myName} onChange={(e) => setMyName(e.target.value)}/>
              </div>

              <div
                className='computerPlayOption2'
              > 
                <h3>Friend's Name</h3>
                <input type="text" placeholder='Enter Your Name' value={friendName} onChange={(e) => setFriendName(e.target.value)}/>
              </div>
            </div>

            <div className='GoButton'>
              <button onClick={() => {
                if(myName && friendName) setShowLobby(true)
              }}>
                Go
              </button>
            </div>
          </div>
        }
      </div>
    </>
  )
}

export default FriendPlayType