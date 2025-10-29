import React, { createContext, useState } from 'react';

export const AdminContext = createContext();

export const AdminProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('adminToken'));
  const [stats, setStats] = useState({ newStudents: 0, newMessages: 0, newEmails: 0 });  // Shared stats for badges
  const [isAdminLoggedIn, setIsLoggedIn] = useState(localStorage.getItem('isLoggedIn') === 'true');

  const login = (newToken) => {
    localStorage.setItem('adminToken', newToken.access_token);
    localStorage.setItem("adminRefreshToken", newToken.refreshToken);
    localStorage.setItem("isLoggedIn", "true");
    setToken(newToken.access_token);
    setIsLoggedIn(true);
  };

  const logout = () => {
    localStorage.removeItem('adminToken');
    setToken(null);
    setStats({ newStudents: 0, newMessages: 0, newEmails: 0 });
  };

  const updateStats = (newStats) => {
    setStats(newStats);
  };

  return (
    <AdminContext.Provider value={{ token, login, logout, stats, updateStats, isAdminLoggedIn }}>
      {children}
    </AdminContext.Provider>
  );
};