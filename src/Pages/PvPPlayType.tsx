import '../Styles/PvPPlayType.css'

import React, { useState } from 'react'
import { createRoomApi, joinRoomApi } from '../Services/PvPPlayTypeServices';

// Components
import RoomLobby from '../Components/RoomLobby';

interface PvPPlayTypeProp {
    backFromPvPMode: boolean;
    setBackFromPvPMode: React.Dispatch<React.SetStateAction<boolean>>;
}

const PvPPlayType: React.FC<PvPPlayTypeProp> = ({ setBackFromPvPMode }) => {

    const [roomType, setRoomType] = useState<string>('');
    const [roomCode, setRoomCode] = useState<string>('');
    const [playerName, setPlayerName] = useState<string>('');
    const [myMoveSign, setMyMoveSign] = useState<"X" | "O" | "">("");
    const [roomCreatedSuccessfully, setRoomCreatedSuccessfully] = useState<boolean>(false);
    const [roomJoinedSuccessfully, setRoomJoinedSuccessfully] = useState<boolean>(false);

    // Server Brings Us Opponent Name
    const [opponentName, setOpponentName] = useState<string>("");

    const JoinRoom = async () => {

        try {
            const joinRoomPayload = {
                RoomNumber: roomCode,
                PlayerName: playerName
            }

            const response = await joinRoomApi(joinRoomPayload);
            if (response.StatusCode === 200 && response.Status === 'Success') {
                window.alert(`Your Room ${response.RoomNumber} is ready to Join and your move is ${response.MoveSign}`);
                setMyMoveSign(response.MoveSign);
                setRoomJoinedSuccessfully(true);
            }
            else if(response.StatusCode !== 200){
                window.alert(response.Message);
            }
        }
        catch (error) {
        }
    }

    const CreateRoom = async () => {
        try {
            const createRoomPayload = {
                RoomNumber: roomCode,
                PlayerName: playerName
            }

            const response = await createRoomApi(createRoomPayload);
            if (response.StatusCode === 200 && response.Status === "Success") {
                window.alert(`Your Room ${response.RoomNumber} has been created. Click Join to enter the room !`);

                setRoomType("Join");
                setPlayerName(response.PlayerName);
                setRoomCode(response.RoomNumber);
                setRoomCreatedSuccessfully(true);
            }
            else if(response.StatusCode !== 200){
                window.alert(response.Message);
            }
        }
        catch (error) {
        }
    }

    return (
        <>
            {
                roomJoinedSuccessfully
                    ?
                    <RoomLobby
                        roomJoinedSuccessfully={roomJoinedSuccessfully}
                        roomCode={roomCode}
                        player1Name={playerName}
                        myMoveSign={myMoveSign}
                        opponentName={opponentName}
                        setOpponentName={setOpponentName}
                    />
                    :
                    <div className='background-div'>
                        <div className='main-box'>
                            {
                                roomType === 'Join' ?
                                    <form className='display-column'>
                                        <input
                                            type="text"
                                            placeholder='Enter Room Code'
                                            inputMode='numeric'
                                            pattern='\d{8}'
                                            maxLength={8}
                                            minLength={8}
                                            className='room-input-box'
                                            required
                                            value={roomCode}
                                            onChange={(e) => {

                                                const value = e.target.value;
                                                if (/^[0-9]*$/.test(value)) {
                                                    setRoomCode(value);
                                                }
                                            }}
                                            disabled={roomCreatedSuccessfully}
                                        />
                                        <input
                                            type="text"
                                            value={playerName}
                                            placeholder='Enter Your Name'
                                            className='room-input-box-name'
                                            required
                                            onChange={(e) => {
                                                const value = e.target.value;
                                                setPlayerName(value);
                                            }}
                                            disabled={roomCreatedSuccessfully}
                                        />
                                        <button
                                            type={'submit'}
                                            className='join-create-room-button'
                                            onClick={(e) => {
                                                e.preventDefault();
                                                JoinRoom();
                                            }}
                                        >
                                            Join Room
                                        </button>
                                    </form>
                                    :
                                    roomType === 'Create' ?
                                        <form className='display-column'>
                                            <input
                                                type="text"
                                                placeholder='Enter Room Code'
                                                inputMode='numeric'
                                                pattern='\d{8}'
                                                minLength={8}
                                                maxLength={8}
                                                required
                                                className='room-input-box'
                                                value={roomCode}
                                                onChange={(e) => {
                                                    const value = e.target.value;
                                                    if (/^\d*$/.test(value)) setRoomCode(e.target.value);
                                                }}
                                            />
                                            <input
                                                type="text"
                                                value={playerName}
                                                placeholder='Enter Your Name'
                                                className='room-input-box-name'
                                                required
                                                onChange={(e) => {
                                                    const value = e.target.value;
                                                    setPlayerName(value);
                                                }}
                                            />
                                            <button
                                                className='join-create-room-button'
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    CreateRoom();
                                                }}
                                            >
                                                Create Room
                                            </button>
                                        </form>
                                        :
                                        <div>
                                            <div className='room-options'>
                                                <button
                                                    className='option'
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        setRoomType('Create')
                                                    }}
                                                >Create Room
                                                </button>
                                                <button
                                                    className='option'
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        setRoomType('Join')
                                                    }}
                                                >
                                                    Join Room
                                                </button>
                                            </div>

                                            <div className='go-back-container'>
                                                <button
                                                    className='go-back-button'
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        setRoomType('')
                                                        setBackFromPvPMode(true);
                                                    }}
                                                >
                                                    Go Back
                                                </button>
                                            </div>
                                        </div>
                            }
                        </div>
                    </div>
            }



        </>
    )
}

export default PvPPlayType