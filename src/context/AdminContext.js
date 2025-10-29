import React, { createContext, useState } from 'react';

export const AdminContext = createContext();

export const AdminProvider = ({ children }) => {
    localStorage.setItem("adminToken","1234567890");
  const [token, setToken] = useState(localStorage.getItem('adminToken'));
  const [stats, setStats] = useState({ newStudents: 0, newMessages: 0, newEmails: 0 });  // Shared stats for badges

  const login = (newToken) => {
    localStorage.setItem('adminToken', newToken);
    setToken(newToken);
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
    <AdminContext.Provider value={{ token, login, logout, stats, updateStats }}>
      {children}
    </AdminContext.Provider>
  );
};