import axios from "axios";
import { BaseURL } from "../Shared/BaseURLClass";

export const joinRoomApi = async (data: object) => {
    const response = await axios.post(`${BaseURL.baseURL}TicTacToe/joinRoom`, data);
    return response.data;
}

export const createRoomApi = async (data: Object) => {
    const response = await axios.post(`${BaseURL.baseURL}TicTacToe/createRoom`, data);
    return response.data;
}