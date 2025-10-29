// src/layouts/DashboardLayout.js
import React from "react";
import { DashboardProvider } from "../context/DashboardContext";
import UserNav from "../components/UserNav";
import UserDashboard from "./UserDashboard";

const DashboardLayout = () => {
  return (
    <DashboardProvider>
      <UserDashboard />
    </DashboardProvider>
  );
};

export default DashboardLayout;
