// Dependencies
import * as signalR from '@microsoft/signalr';

// Imports
import './CSS/RoomLobby.css'
import { useEffect, useState, useRef } from 'react';
import MatchStartingInScreen from './MatchStartingInScreen';
import PlayArea from './PlayArea';

// Interfaces
interface RoomLobbyProps {
    roomJoinedSuccessfully: boolean;
    roomCode: string;
    player1Name: string;
    myMoveSign: "X" | "O" | "";
    opponentName: string;
    setOpponentName: React.Dispatch<React.SetStateAction<string>>;
    playMode?: "Computer" | "AI" | "Friend";
}

// Functions
import { getOpponentName } from '../Services/RoomLobbyServices';

const RoomLobby = ({ roomJoinedSuccessfully, roomCode, player1Name, myMoveSign, opponentName, setOpponentName, playMode }: RoomLobbyProps) => {

    const connectionRef = useRef<signalR.HubConnection | null>(null);
    const [amIReady, setAmIReady] = useState<boolean>(false);
    const [isOpponentReady, setIsOpponentReady] = useState<boolean>(false);
    const [showMatchStartingScreen, setShowMatchStartingScreen] = useState<boolean>(false);
    const [showPlayArea, setShowPlayArea] = useState<boolean>(false);

    useEffect(() => {
        if(!playMode ){
            if (roomJoinedSuccessfully && !connectionRef.current)
                startConnection();
    
            return () => {
                if (connectionRef.current) {
                    connectionRef.current.stop();
                }
            };
        }

        else if(playMode === "Computer" || "AI" || "Friend"){
            setIsOpponentReady(true);
        }
    }, [roomJoinedSuccessfully])

    useEffect(() => {
        if(!playMode){
            if(amIReady) ready();
    
            if(opponentName){
                connectionRef.current?.on("Ready" , (PlayerName) => {
                    if(PlayerName && PlayerName !== player1Name && PlayerName === opponentName){
                        setIsOpponentReady(true);
                    }
                })
            }
    
            if(amIReady && isOpponentReady){
                indicateMatchStart();
            }
        }
        else if((playMode === "Computer" || "AI") && amIReady === true && isOpponentReady === true){
            setShowMatchStartingScreen(true);
        }
        else if(playMode === "Friend" && player1Name && opponentName){
            setAmIReady(true);
            setShowMatchStartingScreen(true)
        }
    }, [amIReady, opponentName, isOpponentReady])

    const startConnection = async () => {

        try {
            // Creating Connection With Our Hub -LobbyHub
            const connection = new signalR.HubConnectionBuilder()
                .withUrl(import.meta.env.VITE_SIGNALR_URL)
                .withAutomaticReconnect()
                .build();

            // Starting Connection and sending Message of our own joining by calling JoinRoom event at server side
            await connection.start();

            await connection.invoke("JoinRoom", Number(roomCode), player1Name);
            // Listen for opponent joining
            connection.on("PlayerJoined", (opponent) => {
                if(opponent && opponent != null){
                    receiveOpponentName();
                }
            })

            connectionRef.current = connection;
        } catch (error) {
        }
    }

    const receiveOpponentName = async () => {
        try{

            const data = {
                RoomNumber: roomCode,
                MyName: player1Name
            }

            const response = await getOpponentName(data);
            if(response.StatusCode === 200 && response.Status === 'Success' && response.PlayerName){
                setOpponentName(response.PlayerName);
                connectionRef.current?.off("PlayerJoined");
            }
        }
        catch(err){
        }
    }

    const ready = async () => {
        try{
            await connectionRef.current?.invoke("ReadyIndication", Number(roomCode), player1Name);
        }
        catch(err){
        }
    }

    const indicateMatchStart = async () => {
        
        connectionRef.current?.on("StartMatch", (PlayerName) => {
            if(PlayerName === player1Name && PlayerName !== opponentName){
                setShowMatchStartingScreen(true);
            }
        })
        await connectionRef.current?.invoke("MatchStartIndication", Number(roomCode), player1Name);
    }

    return (
        <>  
            {   showMatchStartingScreen &&
                <MatchStartingInScreen
                    setShowPlayArea={setShowPlayArea}
                    setShowMatchStartingScreen={setShowMatchStartingScreen}
                />
            }
            {
                showPlayArea &&
                <PlayArea
                    mode={playMode ? playMode : "PvP"}
                    myName={player1Name}
                    myMoveSign={myMoveSign}
                    opponentName={opponentName}
                    connectionRef={connectionRef}
                    roomCode={roomCode}
                />
            }
            {   !showPlayArea &&
                <div className='backdrop-filter-roomLobby'>
                <div className='headingBox'>
                    Waiting Lobby 😄🌠🌃
                </div>

                <div className='versusBox'>
                    <div className='player1stInfo'>
                        <h2>{player1Name}</h2>
                    </div>

                    <div className='versusDiv'>
                        Vs
                    </div>

                    <div className='player2ndInfo'>
                        <h2>{opponentName}</h2>
                    </div>
                </div>
                <div className='readyboxesDiv'>
                    <button
                        className={amIReady ? 'myReadyCheckGreen' :'myReadyCheck' }
                        onClick={() => {
                            setAmIReady(true);
                        }}
                        disabled={!opponentName}
                    >
                        {amIReady ? 'I am Ready' : 'Am I Ready'}
                    </button>
                    <button
                    className={isOpponentReady ? 'opponentReadyCheckGreen' : 'opponentReadyCheck'}
                    >
                        Opponent Ready
                    </button>
                </div>
                </div>
            }
        </>
    )
}

export default RoomLobby