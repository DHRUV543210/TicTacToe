import axios from "axios";
import { BaseURL } from "../Shared/BaseURLClass";
    
export const getOpponentName = async (data: any) => {
    const response = await axios.get(`${BaseURL.baseURL}MasterData/getOpponentName`, {
        params: {
            RoomNumber: data.RoomNumber,
            MyName: data.MyName
        }
    });
    return response.data;
}