// src/socket.js
import { io } from "socket.io-client";
import envConfig from "./../config/envConfig";

const socket = io(envConfig.API_URL, {
  transports: ["websocket", "polling"],
  path: "/socket.io",
  autoConnect: false, // manual control
});

export default socket;
