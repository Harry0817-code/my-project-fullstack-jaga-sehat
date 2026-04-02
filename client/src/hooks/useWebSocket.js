import { useContext } from "react";
import { WebSocketContext } from "../context/websocket/WebSocketContext.js";

export const useWebSocket = () => useContext(WebSocketContext);