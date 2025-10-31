import React, { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import envConfig from "../config/envConfig";

const API_URL = envConfig.API_URL;
const SocketContext = createContext();

export const SocketProvider = ({ children, token }) => {
  const [socket, setSocket] = useState(null);
  const [adminWS, setAdminWS] = useState(null);
  const [connected, setConnected] = useState(false);
  const [adminConnected, setAdminConnected] = useState(false);
  const [adminEvents, setAdminEvents] = useState([]);

  // === SOCKET.IO (Chat) CONNECTION ===
  useEffect(() => {
    if (!token) {
      // cleanup any existing socket
      setConnected(false);
      if (socket) socket.disconnect();
      setSocket(null);
      return;
    }

    const newSocket = io(API_URL, {
      path: "/socket.io",
      transports: ["websocket", "polling"],
      auth: { token },
      reconnectionAttempts: 5,
      reconnectionDelay: 2000,
    });

    newSocket.on("connect", () => {
      console.log("✅ Socket.IO connected:", newSocket.id);
      setConnected(true);
    });

    newSocket.on("disconnect", (reason) => {
      console.log("❌ Socket.IO disconnected:", reason);
      setConnected(false);
    });

    newSocket.on("connect_error", (err) => {
      console.error("⚠️ Socket.IO connection error:", err.message);
    });

    newSocket.on("system_message", (data) => {
      console.log("📢 System message:", data.message);
    });

    newSocket.on("new_message", (data) => {
      console.log("💬 Chat message:", data);
    });

    setSocket(newSocket);

    // cleanup
    return () => {
      newSocket.disconnect();
    };
  }, [token]); // ✅ only depend on token

  // === ADMIN WEBSOCKET CONNECTION ===
  useEffect(() => {
    if (!token) {
      setAdminConnected(false);
      if (adminWS) adminWS.close();
      setAdminWS(null);
      return;
    }

    const wsUrl = API_URL.replace(/^http/, "ws") + "/ws/admin";
    const adminSocket = new WebSocket(wsUrl);

    adminSocket.onopen = () => {
      console.log("✅ Admin WebSocket connected");
      setAdminConnected(true);
    };

    adminSocket.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        console.log("📨 Admin WS message:", message);
        setAdminEvents((prev) => [...prev, message]);
      } catch (err) {
        console.error("Error parsing admin WS message:", err);
      }
    };

    adminSocket.onclose = () => {
      console.log("❌ Admin WebSocket disconnected");
      setAdminConnected(false);
    };

    adminSocket.onerror = (err) => {
      console.error("⚠️ Admin WebSocket error:", err);
    };

    setAdminWS(adminSocket);

    return () => {
      adminSocket.close();
    };
  }, [adminWS, token]); // ✅ only depend on token

  return (
    <SocketContext.Provider
      value={{
        socket,
        connected,
        adminWS,
        adminConnected,
        adminEvents,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);




















// // src/context/SocketProvider.js
// import React, { createContext, useContext, useEffect, useState } from "react";
// import { io } from "socket.io-client";
// import envConfig from "../config/envConfig";

// const API_URL = envConfig.API_URL;
// const SocketContext = createContext();

// export const SocketProvider = ({ children, token }) => {
//   const [socket, setSocket] = useState(null);
//   const [connected, setConnected] = useState(false);

//   useEffect(() => {
//     if (!token) {
//       // disconnect socket if token becomes invalid
//       if (socket) socket.disconnect();
//       setSocket(null);
//       return;
//     }

//     // initialize Socket.IO connection
//     const newSocket = io(API_URL, {
//       path: "/socket.io", // matches FastAPI socketio.ASGIApp
//       transports: ["websocket", "polling"],
//       auth: { token }, // backend expects token in auth
//       reconnectionAttempts: 5, // auto-reconnect
//       reconnectionDelay: 2000,
//     });

//     // connection established
//     newSocket.on("connect", () => {
//       console.log("✅ Connected to Socket.IO:", newSocket.id);
//       setConnected(true);
//     });

//     // connection lost
//     newSocket.on("disconnect", (reason) => {
//       console.log("❌ Disconnected:", reason);
//       setConnected(false);
//     });

//     // errors
//     newSocket.on("connect_error", (err) => {
//       console.error("⚠️ Socket connection error:", err.message);
//     });

//     // incoming events from server
//     newSocket.on("system_message", (data) => {
//       console.log("📢 System message:", data.message);
//     });

//     newSocket.on("new_message", (data) => {
//       console.log("💬 New message:", data);
//     });

//     // cleanup on unmount or token change
//     setSocket(newSocket);
//     return () => newSocket.disconnect();
//   }, [token]);

//   return (
//     <SocketContext.Provider value={{ socket, connected }}>
//       {children}
//     </SocketContext.Provider>
//   );
// };

// export const useSocket = () => useContext(SocketContext);




















// // import React, { createContext, useContext, useEffect, useState } from "react";
// // import { io } from "socket.io-client";
// // import envConfig from "../config/envConfig";

// // const API_URL = envConfig.API_URL;

// // const SocketContext = createContext();

// // export const SocketProvider = ({ children, token }) => {
// //   const [socket, setSocket] = useState(null);

// //   useEffect(() => {
// //     if (!token) return;

// //     const newSocket = io(API_URL, {
// //       path: "/socket.io",
// //       transports: ["websocket", "polling"],
// //       auth: { token },
// //     });

// //     newSocket.on("connect", () => {
// //       console.log("✅ Socket connected:", newSocket.id);
// //     });

// //     newSocket.on("disconnect", () => {
// //       console.log("❌ Socket disconnected");
// //     });

// //     setSocket(newSocket);

// //     return () => newSocket.close();
// //   }, [token]);

// //   return <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>;
// // };

// // export const useSocket = () => useContext(SocketContext);














// // // import React, { createContext, useState } from 'react';

// // // export const UserContext = createContext();

// // // export const UserAuthProvider = ({ children }) => {
// // //   const [token, setToken] = useState(localStorage.getItem('userToken'));
// // //   const [exercises, setExercises] = useState({ newExercise: 0 });  // Shared stats for badges
// // //   const [isUser, setIsUser] = useState(true);  // Shared stats for badges


// // //   const login = (loginData) => {
// // //     localStorage.setItem('userToken', loginData.access_token);
// // //     localStorage.setItem("userRefreshToken", loginData.refreshToken);
// // //     setToken(loginData.access_token);
// // //   };

  

// // //   const logout = () => {
// // //     localStorage.removeItem('userToken');
// // //     setToken(null);
// // //     setExercises({ newExercise: 0 });
// // //   };

// // //   const updateExercises = (newExercises) => {
// // //     setExercises(newExercises);
// // //   };

// // //   return (
// // //     <UserContext.Provider value={{ token, login, logout, exercises, updateExercises , isUser}}>
// // //       {children}
// // //     </UserContext.Provider>
// // //   );
// // // };











// // // import React, { createContext, useContext, useEffect, useState } from "react";
// // // import { io } from "socket.io-client";
// // // import envConfig from "../config/envConfig";

// // // const API_URL = envConfig.API_URL;

// // // const SocketContext = createContext();

// // // export const SocketProvider = ({ children, token }) => {
// // //   const [socket, setSocket] = useState(null);

// // //   useEffect(() => {
// // //     if (!token) return;

// // //     const newSocket = io(API_URL, {
// // //       path: "/socket.io",
// // //       transports: ["websocket", "polling"],
// // //       auth: { token }, // optional if using JWT
// // //     });

// // //     newSocket.on("connect", () => {
// // //       console.log("✅ Socket connected:", newSocket.id);
// // //     });

// // //     newSocket.on("disconnect", () => {
// // //       console.log("❌ Socket disconnected");
// // //     });

// // //     setSocket(newSocket);

// // //     return () => newSocket.close();
// // //   }, [token]);

// // //   return <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>;
// // // };

// // // export const useSocket = () => useContext(SocketContext);














// // // // import React, { createContext, useEffect, useContext, useState } from "react";
// // // // import socket from "./../components/socket";
// // // // import { UserContext } from "./UserContext";

// // // // export const SocketContext = createContext();

// // // // export const SocketProvider = ({ children }) => {
// // // //   const { token } = useContext(UserContext);
// // // //   const [connected, setConnected] = useState(false);

// // // //   useEffect(() => {
// // // //     if (!token) return;

// // // //     socket.auth = { token };
// // // //     socket.connect();

// // // //     socket.on("connect", () => {
// // // //       console.log("✅ Socket connected:", socket.id);
// // // //       setConnected(true);   // 👈 mark connected
// // // //     });

// // // //     socket.on("disconnect", () => {
// // // //       console.log("❌ Socket disconnected");
// // // //       setConnected(false);  // 👈 mark disconnected
// // // //     });

// // // //     return () => {
// // // //       socket.disconnect();
// // // //     };
// // // //   }, [token]);

// // // //   return (
// // // //     <SocketContext.Provider value={{ socket, connected }}>
// // // //       {children}
// // // //     </SocketContext.Provider>
// // // //   );
// // // // };











// // // // // import React, { createContext, useEffect, useContext } from "react";
// // // // // import socket from "./../components/socket";
// // // // // import { UserContext } from "./UserContext";

// // // // // export const SocketContext = createContext();

// // // // // export const SocketProvider = ({ children }) => {
// // // // //   const { token } = useContext(UserContext);

// // // // //   useEffect(() => {
// // // // //     if (!token) return;

// // // // //     socket.auth = { token };
// // // // //     socket.connect();

// // // // //     socket.on("connect", () => {
// // // // //       console.log("✅ Socket connected:", socket.id);
// // // // //     });

// // // // //     socket.on("disconnect", () => {
// // // // //       console.log("❌ Socket disconnected");
// // // // //     });

// // // // //     return () => {
// // // // //       socket.disconnect();
// // // // //     };
// // // // //   }, [token]);

// // // // //   return (
// // // // //     <SocketContext.Provider value={socket}>
// // // // //       {children}
// // // // //     </SocketContext.Provider>
// // // // //   );
// // // // // };











// // // // // // // src/context/SocketContext.js
// // // // // // import React, { createContext, useEffect } from 'react';
// // // // // // import socket from './../components/socket';
// // // // // // import { useContext } from 'react';
// // // // // // import { UserContext } from './UserContext';

// // // // // // export const SocketContext = createContext();

// // // // // // export const SocketProvider = ({ children }) => {
// // // // // //   const { token } = useContext(UserContext);

// // // // // //   useEffect(() => {
// // // // // //     if (token) {
// // // // // //       socket.auth = { token };
// // // // // //       socket.connect();
// // // // // //     }
// // // // // //     return () => socket.disconnect();
// // // // // //   }, [token]);

// // // // // //   return (
// // // // // //     <SocketContext.Provider value={socket}>
// // // // // //       {children}
// // // // // //     </SocketContext.Provider>
// // // // // //   );
// // // // // // };
