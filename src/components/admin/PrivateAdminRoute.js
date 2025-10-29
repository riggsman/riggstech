import React, { useContext } from 'react';
import { Navigate } from 'react-router';
import { AdminContext } from '../../context/AdminContext';

const PrivateAdminRoute = ({ children }) => {
  const { token } = useContext(AdminContext);
  
  // If token exists in localStorage but not in context, refresh it
  const storedToken = localStorage.getItem('adminToken');
  if (!token && storedToken) {
    // Context will update on next render
    window.location.reload();
    return <div>Loading...</div>;
  }

  return token ? children : <Navigate to="/admin/login" />;
};

export default PrivateAdminRoute;





// import React, { useContext } from 'react';
// import { Navigate }  from 'react-router';
// import { AdminContext } from '../../context/AdminContext';

// const PrivateAdminRoute = ({ children }) => {
//   const { token } = useContext(AdminContext);
//   return token ? children : <Navigate to="/admin/login" />;
// };

// // export default PrivateAdminRoute;