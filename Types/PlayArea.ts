import type { HubConnection } from "@microsoft/signalr";

export interface HandleTicTacToeDataChangeProps{
  rowIndex: number;
  colIndex: number;
}

export interface PlayerAreaProps{
  mode: "PvP" | "Computer" | "AI" | "Friend";
  myName: string;
  myMoveSign: "X" | "O" | "";
  opponentName: string;
  connectionRef?: React.RefObject<HubConnection | null>;
  roomCode?: string;
}

// export interface PlayerAreaProps{
//   rowIndex: number;
//   colIndex: number;
// }

export interface HandlePvPPlayModeProps{
  rowIndex: number;
  colIndex: number;
  myMoveSign: "X" | "O" | "";
}

export interface HandleComputerPlayModeProps{
  rowIndex: number;
  colIndex: number;
}

export interface HandleFriendPlayModeProps{
  rowIndex: number;
  colIndex: number;
}