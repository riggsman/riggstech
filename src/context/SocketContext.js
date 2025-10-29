import React, { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import envConfig from "../config/envConfig";

const API_URL = envConfig.API_URL;

const SocketContext = createContext();

export const SocketProvider = ({ children, token }) => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    if (!token) return;

    const newSocket = io(API_URL, {
      path: "/socket.io",
      transports: ["websocket", "polling"],
      auth: { token },
    });

    newSocket.on("connect", () => {
      console.log("✅ Socket connected:", newSocket.id);
    });

    newSocket.on("disconnect", () => {
      console.log("❌ Socket disconnected");
    });

    setSocket(newSocket);

    return () => newSocket.close();
  }, [token]);

  return <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>;
};

export const useSocket = () => useContext(SocketContext);














// import React, { createContext, useState } from 'react';

// export const UserContext = createContext();

// export const UserAuthProvider = ({ children }) => {
//   const [token, setToken] = useState(localStorage.getItem('userToken'));
//   const [exercises, setExercises] = useState({ newExercise: 0 });  // Shared stats for badges
//   const [isUser, setIsUser] = useState(true);  // Shared stats for badges


//   const login = (loginData) => {
//     localStorage.setItem('userToken', loginData.access_token);
//     localStorage.setItem("userRefreshToken", loginData.refreshToken);
//     setToken(loginData.access_token);
//   };

  

//   const logout = () => {
//     localStorage.removeItem('userToken');
//     setToken(null);
//     setExercises({ newExercise: 0 });
//   };

//   const updateExercises = (newExercises) => {
//     setExercises(newExercises);
//   };

//   return (
//     <UserContext.Provider value={{ token, login, logout, exercises, updateExercises , isUser}}>
//       {children}
//     </UserContext.Provider>
//   );
// };











// import React, { createContext, useContext, useEffect, useState } from "react";
// import { io } from "socket.io-client";
// import envConfig from "../config/envConfig";

// const API_URL = envConfig.API_URL;

// const SocketContext = createContext();

// export const SocketProvider = ({ children, token }) => {
//   const [socket, setSocket] = useState(null);

//   useEffect(() => {
//     if (!token) return;

//     const newSocket = io(API_URL, {
//       path: "/socket.io",
//       transports: ["websocket", "polling"],
//       auth: { token }, // optional if using JWT
//     });

//     newSocket.on("connect", () => {
//       console.log("✅ Socket connected:", newSocket.id);
//     });

//     newSocket.on("disconnect", () => {
//       console.log("❌ Socket disconnected");
//     });

//     setSocket(newSocket);

//     return () => newSocket.close();
//   }, [token]);

//   return <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>;
// };

// export const useSocket = () => useContext(SocketContext);














// // import React, { createContext, useEffect, useContext, useState } from "react";
// // import socket from "./../components/socket";
// // import { UserContext } from "./UserContext";

// // export const SocketContext = createContext();

// // export const SocketProvider = ({ children }) => {
// //   const { token } = useContext(UserContext);
// //   const [connected, setConnected] = useState(false);

// //   useEffect(() => {
// //     if (!token) return;

// //     socket.auth = { token };
// //     socket.connect();

// //     socket.on("connect", () => {
// //       console.log("✅ Socket connected:", socket.id);
// //       setConnected(true);   // 👈 mark connected
// //     });

// //     socket.on("disconnect", () => {
// //       console.log("❌ Socket disconnected");
// //       setConnected(false);  // 👈 mark disconnected
// //     });

// //     return () => {
// //       socket.disconnect();
// //     };
// //   }, [token]);

// //   return (
// //     <SocketContext.Provider value={{ socket, connected }}>
// //       {children}
// //     </SocketContext.Provider>
// //   );
// // };











// // // import React, { createContext, useEffect, useContext } from "react";
// // // import socket from "./../components/socket";
// // // import { UserContext } from "./UserContext";

// // // export const SocketContext = createContext();

// // // export const SocketProvider = ({ children }) => {
// // //   const { token } = useContext(UserContext);

// // //   useEffect(() => {
// // //     if (!token) return;

// // //     socket.auth = { token };
// // //     socket.connect();

// // //     socket.on("connect", () => {
// // //       console.log("✅ Socket connected:", socket.id);
// // //     });

// // //     socket.on("disconnect", () => {
// // //       console.log("❌ Socket disconnected");
// // //     });

// // //     return () => {
// // //       socket.disconnect();
// // //     };
// // //   }, [token]);

// // //   return (
// // //     <SocketContext.Provider value={socket}>
// // //       {children}
// // //     </SocketContext.Provider>
// // //   );
// // // };











// // // // // src/context/SocketContext.js
// // // // import React, { createContext, useEffect } from 'react';
// // // // import socket from './../components/socket';
// // // // import { useContext } from 'react';
// // // // import { UserContext } from './UserContext';

// // // // export const SocketContext = createContext();

// // // // export const SocketProvider = ({ children }) => {
// // // //   const { token } = useContext(UserContext);

// // // //   useEffect(() => {
// // // //     if (token) {
// // // //       socket.auth = { token };
// // // //       socket.connect();
// // // //     }
// // // //     return () => socket.disconnect();
// // // //   }, [token]);

// // // //   return (
// // // //     <SocketContext.Provider value={socket}>
// // // //       {children}
// // // //     </SocketContext.Provider>
// // // //   );
// // // // };
