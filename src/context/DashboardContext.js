import React, { createContext, useState, useContext } from "react";

const DashboardContext = createContext();

export const DashboardProvider = ({ children }) => {
  const [activeSection, setActiveSection] = useState(null);
  return (
    <DashboardContext.Provider value={{ activeSection, setActiveSection }}>
      {children}
    </DashboardContext.Provider>
  );
};

// ✅ This is critical
export const useDashboard = () => {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error("useDashboard must be used within a DashboardProvider");
  }
  return context;
};

