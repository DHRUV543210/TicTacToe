import { useEffect, useState, useRef } from 'react'
import './CSS/PlayArea.css'

// Interfaces
import type {HandleTicTacToeDataChangeProps, PlayerAreaProps, HandlePvPPlayModeProps, HandleComputerPlayModeProps, HandleFriendPlayModeProps} from '../../Types/PlayArea';

// Components
import WinnerOrDrawModal from './WinnerOrDrawModal';

const   PlayArea = ({mode, myName, myMoveSign, opponentName, connectionRef, roomCode}: PlayerAreaProps) => {

  const listenersAttachedRef = useRef(false);

  const hoverSound = new Audio('/Audios/hover-sound.wav');
  const clickSound = new Audio('/Audios/select-sound.wav');
  const timesUpSound = new Audio('/Audios/timeFreez-sound.mp3');

  const [isMyTurn, setIsMyTurn] = useState<boolean>(false);
  const [isDraw, setIsDraw] = useState<boolean>(false);
  const [winner, setWinner] = useState<string>("");
  const [winnerOrDrawBeingDecided, setWinnerOrDrawBeingDecided] = useState<boolean>(false);
  const [ticTacToeBox, setTicTacToeBox] = useState<string[][]>([
    ["", "", ""],
    ["", "", ""],
    ["", "", ""]
  ]);

  useEffect(() => {
    if(mode === "PvP") checkWhetherItsMyTurnForPvP();
    else if(mode === "Computer" && myMoveSign === "X"){
      setIsMyTurn(true);
    }
    else if(mode === "AI" && myMoveSign === "X") setIsMyTurn(true);
    else if(mode === "Friend" && myMoveSign === "X") setIsMyTurn(true);
  }, [mode])

  useEffect(() => {
    if(connectionRef && connectionRef?.current && !listenersAttachedRef.current){
      
      connectionRef?.current?.on("GetLatestBoardAndPossiblyWinner", (board, PlayerName, toMove, winOrDrawOrNone) => {
        
        setTicTacToeBox(board)
        if(board){
          clickSound.currentTime = 0;
          clickSound.play();
        }

        // Setting [Turn] Accordingly
        if(PlayerName === myName && toMove !== myMoveSign) setIsMyTurn(false);
        else if(PlayerName === opponentName && toMove === myMoveSign) setIsMyTurn(true);

        // Setting [Winner / Draw]
        if(winOrDrawOrNone && winOrDrawOrNone === myMoveSign && PlayerName === myName){
          timesUpSound.play();
          setWinner(myName);
        }
        else if(winOrDrawOrNone && winOrDrawOrNone !== myMoveSign && winOrDrawOrNone !== "Draw" && PlayerName === opponentName){
          timesUpSound.play();
          setWinner(opponentName);
        }
        else if(winOrDrawOrNone === "Draw"){
          timesUpSound.play();
          setIsDraw(true);
        }
      })

      listenersAttachedRef.current = true;
      
    }

  },[connectionRef])

  const checkWhetherItsMyTurnForPvP = async () => {
    if(connectionRef && connectionRef.current !== null){
      // Who Is Starting
      connectionRef.current.on("WhoStart", (PlayerName, Chance) => {
        if(PlayerName === myName && Chance === true) setIsMyTurn(true);
        else if(PlayerName === opponentName && Chance === true) setIsMyTurn(false);
      })

      await connectionRef.current?.invoke("WhoToStart", Number(roomCode), myName, myMoveSign)
    }
  }

  const handleTicTacToeDataChange = async ({rowIndex, colIndex}: HandleTicTacToeDataChangeProps) => {
    if(mode === "PvP") handlePvPPlayMode({rowIndex, colIndex, myMoveSign});

    else if(mode === "Computer") handleComputerPlayMode({rowIndex, colIndex});

    else if(mode === "AI") handleAIPlayMode({rowIndex, colIndex});

    else if(mode === "Friend") handleFriendPlayMode({rowIndex, colIndex});
  }

  const handlePvPPlayMode = async ({rowIndex, colIndex, myMoveSign}: HandlePvPPlayModeProps) => {
    if(!isMyTurn) return;

    const newBoard = ticTacToeBox.map(row => [...row]);
    newBoard[rowIndex][colIndex] = myMoveSign;

    setTicTacToeBox(prev => {
      return newBoard;
    })

    await connectionRef?.current?.invoke("SubmitLatestBoard", newBoard, Number(roomCode), myName, myMoveSign);
  }

  const handleComputerPlayMode = async ({rowIndex, colIndex}: HandleComputerPlayModeProps) => {
    if(!isMyTurn || winner || isDraw) return;

    const newBoard = ticTacToeBox.map(row => [...row]);
    newBoard[rowIndex][colIndex] = "X";

    setTicTacToeBox(newBoard);
    setIsMyTurn(false);

    var isAny = await checkWinnerOrDrawForOtherModes(newBoard, "X");
    if(isAny === "winner" || isAny === "Draw") return;

    const hasEmptySlot = newBoard.some(row => row.some(cell => cell === ""));

    if(hasEmptySlot) playByComputer(newBoard);
  }

  const handleAIPlayMode = async ({rowIndex, colIndex}: HandleComputerPlayModeProps) => {
    if(!isMyTurn || winner || isDraw) return;

    const newBoard = ticTacToeBox.map(row => [...row]);
    newBoard[rowIndex][colIndex] = "X";

    setTicTacToeBox(newBoard);
    setIsMyTurn(false);

    var isAny = await checkWinnerOrDrawForOtherModes(newBoard, "X");
    if(isAny === "winner" || isAny === "Draw") return;

    const hasEmptySlot = newBoard.some(row => row.some(cell => cell === ""));

    if(hasEmptySlot) playByAI(newBoard);
  }

  const handleFriendPlayMode = async ({rowIndex, colIndex}: HandleFriendPlayModeProps) => {
    
    if(winner || isDraw) return;

    const newBoard = ticTacToeBox.map(row => [...row]);

    if(isMyTurn){
      newBoard[rowIndex][colIndex] = myMoveSign;
      setIsMyTurn(false);
    }
    else if(!isMyTurn){
      newBoard[rowIndex][colIndex] = "O";
      setIsMyTurn(true);
    }

    setTicTacToeBox(newBoard);

    var isAny = await checkWinnerOrDrawForOtherModes(newBoard, isMyTurn ? "X" : "O");
    if(isAny === "winner" || isAny === "Draw") return;
  }

  // ------------------------------------------------------------------------

  const checkWinnerOrDrawForOtherModes = async (newBoard : string[][], moveSign: string) => {

    let result = "";
    let isDraw = true;

    // Row-wise
    for(let i=0; i<3; i++){
      if(newBoard[i][0] === moveSign && newBoard[i][0] === newBoard[i][1] && newBoard[i][1] === newBoard[i][2]){
        result = "winner";

        setWinnerOrDrawBeingDecided(true);

        if(moveSign === "X")
        setTimeout(() => {
          setWinner(myName);
        }, 1000);

        else if(moveSign === "O")
        setTimeout(() => {
          setWinner(opponentName);
        }, 1000);

        return result;
      }
    }

    // Column-wise
    for(let j=0; j<3; j++){
      if(newBoard[0][j] === moveSign && newBoard[0][j] === newBoard[1][j] && newBoard[1][j] === newBoard[2][j]){
        result = "winner";

        setWinnerOrDrawBeingDecided(true);

        if(moveSign === "X")
        setTimeout(() => {
          setWinner(myName);
        }, 1000);

        else if(moveSign === "O")
        setTimeout(() => {
          setWinner(opponentName);
        }, 1000);

        return result;
      }
    }

    // Diagonal Check
    if(newBoard[0][0] === moveSign && newBoard[0][0] === newBoard[1][1] && newBoard[1][1] === newBoard[2][2]){
      result = "winner";
      
      setWinnerOrDrawBeingDecided(true);

      if(moveSign === "X")
      setTimeout(() => {
        setWinner(myName);
      }, 1000);

      else if(moveSign === "O")
      setTimeout(() => {
        setWinner(opponentName);
      }, 1000);

      return result;
    }

    // Cross-Diagonal Check
    if(newBoard[0][2] === moveSign && newBoard[0][2] === newBoard[1][1] && newBoard[1][1] === newBoard[2][0]){
      result = "winner";
      
      setWinnerOrDrawBeingDecided(true);

      if(moveSign === "X")
      setTimeout(() => {
        setWinner(myName);
      }, 1000);

      else if(moveSign === "O")
      setTimeout(() => {
        setWinner(opponentName);
      }, 1000);

      return result;
    }

    // Draw Check
    for(let i=0; i<3; i++){
      for(let j=0; j< 3; j++){
        if(newBoard[i][j] === ""){
          isDraw = false;
          break;
        }
      }
    }

    if(isDraw === true){
      setWinnerOrDrawBeingDecided(true);
      setTimeout(() => {
        setIsDraw(true);
      }, 1000);
      return "Draw";
    }

    return result;
  }

  // COMPUTER PLAY MODE HELPER FUNCTION -------------------------------------

  const playByComputer = async (newBoard: string[][]) => {

    // Random Move By Computer On those indices where user hasn't moved yet

    let boardCopy = newBoard.map(row => [...row]);

    let rowIndex = 0;
    let colIndex = 0;

    while(true){
      rowIndex = Math.floor(Math.random() * (2-0+1)) + 0;
      colIndex = Math.floor(Math.random() * (2-0+1)) + 0;

      if(boardCopy[rowIndex][colIndex] === ""){
        boardCopy[rowIndex][colIndex] = "O";
        break;
      }
    }

    setTimeout(async () => {
      setTicTacToeBox(boardCopy);
      setIsMyTurn(true);

      let isAny = await checkWinnerOrDrawForOtherModes(boardCopy, "O");
      if(isAny === "winner" || isAny === "Draw") return;
    }, 1200);

    return;
  }

  const playByAI = async (newBoard: string[][]) => {
    let bestVal = -Infinity;
    let bestMove = { row: -1, col: -1 };

    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (newBoard[i][j] === "") {
          newBoard[i][j] = "O";
          const moveVal = miniMax(newBoard, 0, false);
          newBoard[i][j] = "";
          if (moveVal > bestVal) {
            bestMove = { row: i, col: j };
            bestVal = moveVal;
          }
        }
      }
    }

    if (bestMove.row !== -1 && bestMove.col !== -1) {
      const updated = newBoard.map(r => [...r]);
      updated[bestMove.row][bestMove.col] = "O";

      setTimeout(async () => {
        setTicTacToeBox(updated);
        setIsMyTurn(true);

        let isAny = await checkWinnerOrDrawForOtherModes(updated, "O");
        if(isAny === "winner" || isAny === "Draw") return;
      }, 1200);
    }
  }

  // AI PLAY MODE HELPER FUNCTION------------------------------------------------------------------------

  const evaluateBoard = (board: string[][]): number => {

    // ROWS AND COLUMNS
    for(let i=0; i<3; i++){
      if(board[i][0] !== "" && board[i][0] === board[i][1] && board[i][1] === board[i][2])
      return board[i][0] === "O" ? +10 : -10;

      if(board[0][i] !== "" && board[0][i] === board[1][i] && board[1][i] === board[2][i])
      return board[0][i] === "O" ? +10 : -10;
    }

    // DIAGONALS

    if(board[0][0] !== "" && board[0][0] === board[1][1] && board[1][1] === board[2][2])
    return board[0][0] === "O" ? +10 : -10;

    if(board[0][2] !== "" && board[0][2] === board[1][1] && board[2][0] === board[1][1])
    return board[0][0] === "O" ? +10 : -10;

    return 0;
  }
  
  const miniMax = (board: string[][], depth: number, isMaximizing: boolean): number => {
    const score = evaluateBoard(board);

    if (score === 10) return score - depth;     // Prefer faster wins
    if (score === -10) return score + depth;    // Prefer slower losses

    // Check for available moves
    const hasEmpty = board.some(row => row.includes(""));
    if (!hasEmpty) return 0; // draw

    if (isMaximizing) {
      let best = -Infinity;
      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
          if (board[i][j] === "") {
            board[i][j] = "O";
            best = Math.max(best, miniMax(board, depth + 1, false));
            board[i][j] = "";
          }
        }
      }
      return best;
    } else {
      let best = Infinity;
      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
          if (board[i][j] === "") {
            board[i][j] = "X";
            best = Math.min(best, miniMax(board, depth + 1, true));
            board[i][j] = "";
          }
        }
      }
      return best;
    }
  };

  // ------------------------------------------------------------------------

  return (
  <>
    { winner ?
      <WinnerOrDrawModal winner={winner} myName={myName}/>
      :
      isDraw ?
      <WinnerOrDrawModal isDraw={isDraw} myName={myName}/>
      :
      <div className='mainPlayAreaBackground'>
      <div className='playerNameHeading'>
        <h1>{isMyTurn ? myName : opponentName}'s Turn</h1>
      </div>
      <div className="tictactoeBox">
        {
          ticTacToeBox.map((row, rowIndex) => (
            <div
              className="row"
              key={rowIndex}  
            >
              {
                row.map((col, colIndex) => (
                  <div
                    className="semiBox"
                    key={colIndex}
                    onClick={() => {
                      if(winnerOrDrawBeingDecided) return;
                      clickSound.currentTime = 0;
                      if(isMyTurn || mode === "Friend") clickSound.play();

                      if(ticTacToeBox[rowIndex][colIndex] === "")
                      handleTicTacToeDataChange({rowIndex, colIndex});
                    }}
                    onMouseEnter={() => {
                      hoverSound.currentTime = 0;
                      hoverSound.play();
                    }}
                  >
                    <h1>{ticTacToeBox[rowIndex][colIndex]}</h1>
                  </div>
                ))
              }
            </div>
          ))
        }
        </div>
      </div>
    }
  </>
  )
}

export default PlayArea