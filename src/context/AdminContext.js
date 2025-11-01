// src/context/AdminProvider.jsx
import React, { createContext, useState, useCallback, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import envConfig from '../config/envConfig';

export const AdminContext = createContext();

export const AdminProvider = ({ children }) => {
  const {API_URL,WS_URL} = envConfig;
 

  const [token, setToken] = useState(localStorage.getItem('adminToken'));
  const [isAdminLoggedIn, setIsLoggedIn] = useState(localStorage.getItem('isAdminLoggedIn') === 'true');

  // Cache
  const cache = useRef({
    students: { data: null, timestamp: 0 },
    messages: { data: null, timestamp: 0 },
  });
  const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

  const [stats, setStats] = useState({
    newStudents: 0,
    newMessages: 0,
    newEmails: 0,
    totalStudents: 0,
  });

  const socketRef = useRef(null);

  // === LOGIN / LOGOUT ===
  const login = (newToken) => {
    localStorage.setItem('adminToken', newToken.access_token);
    localStorage.setItem('adminRefreshToken', newToken.refreshToken);
    localStorage.setItem('isAdminLoggedIn', 'true');
    localStorage.removeItem("isLoggedIn");
    localStorage.setItem("isLoggedIn", "false");
    setToken(newToken.access_token);
    setIsLoggedIn(true);
    // initializeWebSocket(newToken.access_token);
    fetchStats(newToken.access_token);
  };

  const logout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminRefreshToken');
    localStorage.setItem('isAdminLoggedIn', 'false');
    setToken(null);
    setIsLoggedIn(false);
    setStats({ newStudents: 0, newMessages: 0, newEmails: 0, totalStudents: 0 });
    if (socketRef.current) socketRef.current.disconnect();
  };

  // // === WEBSOCKET SETUP ===
  // const initializeWebSocket = (currentToken) => {
  //   if (socketRef.current) return;

  //   const socket = io(WS_URL, {
  //     auth: { token: currentToken },
  //     transports: ['websocket'],
  //   });

  //   socket.on('connect', () => {
  //     console.log('WebSocket connected');
  //   });

  //   socket.on('new_message', () => {
  //     console.log('New message received → invalidating cache');
  //     invalidateCache('messages');
  //     fetchMessages(currentToken); // refetch immediately
  //   });

  //   socket.on('disconnect', () => {
  //     console.log('WebSocket disconnected');
  //   });

  //   socketRef.current = socket;
  // };

  // // === CACHE HELPERS ===
  // const isCacheValid = (key) => {
  //   const entry = cache.current[key];
  //   return entry?.data && Date.now() - entry.timestamp < CACHE_TTL;
  // };

  // const invalidateCache = (key) => {
  //   if (cache.current[key]) {
  //     cache.current[key] = { data: null, timestamp: 0 };
  //   }
  // };

  // const setCache = (key, data) => {
  //   cache.current[key] = { data, timestamp: Date.now() };
  // };

  // // === FETCH WITH CACHE ===
  const fetchStudents = async (currentToken) => {
    // if (isCacheValid('students')) {
    //   const { data } = cache.current.students;
    //   updateStatsFromStudents(data);
    //   return;
    // }

    try {
      const res = await fetch(`${API_URL}/admin/students`, {
        headers: { Authorization: `Bearer ${currentToken}` },
      });
      if (!res.ok) throw new Error('Failed to fetch students');
      const data = await res.json();
      // setCache('students', data);
      updateStatsFromStudents(data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchMessages = async (currentToken) => {
    // if (isCacheValid('messages')) {
    //   const { data } = cache.current.messages;
    //   updateStatsFromMessages(data);
    //   return;
    // }

    try {
      const response = await fetch(`${API_URL}/admin/messages`, {
        headers: { Authorization: `Bearer ${currentToken}` },
      });
      if(response.ok) {
        console.log("RESPONSE");
        const data = await response.json();
        console.log("DATA",data);
        updateStatsFromMessages(data);
      }
      // if (!res.ok) throw new Error('Failed to fetch messages');
      // const data = await res.json();
      // // setCache('messages', data);
      // // updateStatsFromMessages(data);
      // console.log("MESSAGES");
    } catch (err) {
      console.error(err);
    }
  };

  const updateStatsFromStudents = (students = []) => {
    const today = new Date().toDateString();
    const newStudents = students.filter(s => new Date(s.createdAt).toDateString() === today).length;
    const totalStudents = students.length;
    setStats(prev => ({ ...prev, newStudents, totalStudents }));
  };

  const updateStatsFromMessages = (messagesData) => {
    const messages = messagesData || [];
    const newMessages = messages.filter(m => m.unread).length;
    const readMessages = messages.filter(m => m.read).length;
    console.log("MESSAGES",readMessages);
    setStats(prev => ({ ...prev, newMessages, totalMessages: messages.length, readMessages }));
  };

  // === MASTER FETCH ===
  const fetchStats = useCallback(async (currentToken = token) => {
    if (!currentToken) return;
    await Promise.all([
      fetchStudents(currentToken),
      fetchMessages(currentToken),
    ]);
  }, [token]);

  // === AUTO REFRESH (fallback) ===
  useEffect(() => {
    if (token) {
      fetchStats();
      const interval = setInterval(() => fetchStats(), 5 * 60 * 1000); // every 5 mins
      return () => clearInterval(interval);
    }
  }, [token, fetchStats]);

  // === WEBSOCKET ON LOGIN ===
  useEffect(() => {
    if (token && !socketRef.current) {
      // initializeWebSocket(token);
    }
  }, [token]);

  return (
    <AdminContext.Provider value={{
      token,
      login,
      logout,
      stats,
      isAdminLoggedIn,
      fetchStats, // expose for manual refresh
    }}>
      {children}
    </AdminContext.Provider>
  );
};










// import React, { createContext, useState, useCallback, useEffect } from 'react';
// import envConfig from '../config/envConfig';

// export const AdminContext = createContext();

// export const AdminProvider = ({ children }) => {
//   const API_URL = envConfig.API_URL;

//   const [token, setToken] = useState(localStorage.getItem('adminToken'));
//   const [stats, setStats] = useState({newStudents: 0, newMessages: 0, newEmails: 0, totalStudents: 0 });
//   const [isAdminLoggedIn, setIsLoggedIn] = useState(localStorage.getItem('isLoggedIn') === 'true');

//   const login = (newToken) => {
//     localStorage.setItem('adminToken', newToken.access_token);
//     localStorage.setItem("adminRefreshToken", newToken.refreshToken);
//     localStorage.setItem("isLoggedIn", "true");
//     setToken(newToken.access_token);
//     setIsLoggedIn(true);
//     fetchStats(newToken.access_token); // fetch stats immediately after login
//   };

//   const logout = () => {
//     localStorage.removeItem('adminToken');
//     localStorage.removeItem('adminRefreshToken');
//     localStorage.setItem("isLoggedIn", "false");
//     setToken(null);
//     setStats({ newStudents: 0, newMessages: 0, newEmails: 0, totalStudents: 0 });
//     setIsLoggedIn(false);
//   };

//   const updateStats = useCallback((newStats) => {
//     setStats(prev => ({ ...prev, ...newStats }));
//   }, []);

//   // Fetch stats from API
//   const fetchStats = useCallback(async (currentToken = token) => {
//     if (!currentToken) return;

//     try {
//       // Fetch students
//       const studentsRes = await fetch(`${API_URL}/admin/students`, {
//         headers: { Authorization: `Bearer ${currentToken}` },
//         cache: 'no-store'
//       });
//       const studentsData = await studentsRes.json();
//       const students = studentsData || [];
//       const newStudents = students.filter(s => {
//         const created = new Date(s.createdAt);
//         return created.toDateString() === new Date().toDateString();
//       }).length;
//       const totalStudents = students.length;
//       console.log("NEW AND OLD STUDENTS ", newStudents, totalStudents)
//       // Fetch messages
//       const messagesRes = await fetch(`${API_URL}/admin/messages`, {
//         headers: { Authorization: `Bearer ${currentToken}` },
//         cache: 'no-store'
//       });
//       const messagesData = await messagesRes.json();
//       const messages = messagesData.unread || [];
//       const newMessages = messages.filter(m => m.unread).length;

//       const newEmails = 0;

//       updateStats({ newStudents, newMessages, newEmails, totalStudents });
//     } catch (err) {
//       console.error('Failed to fetch stats', err);
//     }
//   }, [API_URL, token, updateStats]);

//   // Fetch stats automatically on page load / refresh
//   useEffect(() => {
//     if (token) {
//       fetchStats();
//       const interval = setInterval(() => fetchStats(), 30000); // refresh every 30s
//       return () => clearInterval(interval);
//     }
//   }, [token, fetchStats]);

//   return (
//     <AdminContext.Provider value={{ token, login, logout, stats, updateStats, isAdminLoggedIn }}>
//       {children}
//     </AdminContext.Provider>
//   );
// };
















// // import React, { createContext, useState,useCallback  } from 'react';

// // export const AdminContext = createContext();

// // export const AdminProvider = ({ children }) => {
// //   const [token, setToken] = useState(localStorage.getItem('adminToken'));
// //   const [stats, setStats] = useState({ newStudents: 0, newMessages: 0, newEmails: 0 });  // Shared stats for badges
// //   const [isAdminLoggedIn, setIsLoggedIn] = useState(localStorage.getItem('isLoggedIn') === 'true');

// //   const login = (newToken) => {
// //     localStorage.setItem('adminToken', newToken.access_token);
// //     localStorage.setItem("adminRefreshToken", newToken.refreshToken);
// //     localStorage.setItem("isLoggedIn", "true");
// //     setToken(newToken.access_token);
// //     setIsLoggedIn(true);
// //   };

// //   const logout = () => {
// //     localStorage.removeItem('adminToken');
// //     setToken(null);
// //     setStats({ newStudents: 0, newMessages: 0, newEmails: 0 });
// //   };

// //   // const updateStats = (newStats) => {
// //   //   setStats(newStats);
// //   // };
// //   const updateStats = useCallback((newStats) => {
// //     setStats(prev => ({ ...prev, ...newStats }));
// //   }, []);
// //   return (
// //     <AdminContext.Provider value={{ token, login, logout, stats, updateStats, isAdminLoggedIn }}>
// //       {children}
// //     </AdminContext.Provider>
// //   );
// // };