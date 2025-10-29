// src/routes/AdminRoute.jsx
import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';

const AdminRoute = ({ children }) => {
  const { user } = useContext(UserContext);
  const isAdmin = user?.role === 'admin'; // or check email, etc.

  return isAdmin ? children : <Navigate to="/dashboard" />;
};

export default AdminRoute;