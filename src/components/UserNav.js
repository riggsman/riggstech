// src/components/UserNav.jsx

import React, { useContext } from 'react';
import { Navbar as BootstrapNavbar, Nav, Container } from 'react-bootstrap';
import { FaSignOutAlt, FaBook, FaEnvelope, FaUpload, FaUser } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { UserContext } from './../context/UserContext';

const UserNav = () => {
  const navigate = useNavigate();
  const { logout, user, setActiveSection } = useContext(UserContext);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const goToSection = (section) => {
    setActiveSection(section);    // This now works!
    navigate('/dashboard');
  };

  return (
    <BootstrapNavbar bg="light" expand="lg" sticky="top" className="shadow-sm">
      <Container>
        <BootstrapNavbar.Brand href="/dashboard">RiggsTech</BootstrapNavbar.Brand>

        {user && (
          <BootstrapNavbar.Text className="mx-3">
            {user.first_name} {user.last_name}
          </BootstrapNavbar.Text>
        )}

        <BootstrapNavbar.Toggle aria-controls="user-nav" />
        <BootstrapNavbar.Collapse id="user-nav">
          <Nav className="ms-auto">
            <Nav.Link onClick={() => goToSection('programs')}>
              <FaBook className="me-1" /> Programs
            </Nav.Link>
            <Nav.Link onClick={() => goToSection('messages')}>
              <FaEnvelope className="me-1" /> Messages
            </Nav.Link>
            <Nav.Link onClick={() => goToSection('assignments')}>
              <FaUpload className="me-1" /> Assignments
            </Nav.Link>
            <Nav.Link onClick={() => goToSection('profile')}>
              <FaUser className="me-1" /> Profile
            </Nav.Link>
            <Nav.Link onClick={handleLogout}>
              <FaSignOutAlt className="me-1" /> Logout
            </Nav.Link>
          </Nav>
        </BootstrapNavbar.Collapse>
      </Container>
    </BootstrapNavbar>
  );
};

export default UserNav;








// // src/components/UserNav.jsx
// import React, { useContext } from 'react';
// import {
//   Navbar as BootstrapNavbar,
//   Nav,
//   Container,
//   Badge,
// } from 'react-bootstrap';
// import {
//   FaSignOutAlt,
//   FaHome,
//   FaBook,
//   FaEnvelope,
//   FaUpload,
//   FaUser,
// } from 'react-icons/fa';
// import { useNavigate } from 'react-router-dom';
// import { UserContext } from './../context/UserContext';

// const UserNav = () => {
//   const navigate = useNavigate();

//   const {
//     logout,
//     user,
//     setActiveSection,          // <-- NEW
//   } = useContext(UserContext);

//   const handleLogout = () => {
//     logout();
//     navigate('/');
//   };

//   /** Helper – switch Dashboard section without a full page reload */
//   const goToSection = (section) => {
//     setActiveSection(section);
//     navigate('/dashboard');           // ensure we are on the dashboard page
//   };

//   return (
//     <BootstrapNavbar bg="light" expand="lg" sticky="top" className="shadow-sm">
//       <Container>
//         <BootstrapNavbar.Brand href="/dashboard">
//           RiggsTech
//         </BootstrapNavbar.Brand>

//         {/* Show user name when logged in */}
//         {user && (
//           <BootstrapNavbar.Text className="mx-3">
//             {user.first_name} {user.last_name}
//           </BootstrapNavbar.Text>
//         )}

//         <BootstrapNavbar.Toggle aria-controls="user-nav" />
//         <BootstrapNavbar.Collapse id="user-nav">
//           <Nav className="ms-auto">

//             {/* ---------- PROGRAMS ---------- */}
//             <Nav.Link
//               onClick={() => goToSection('programs')}
//               className="d-flex align-items-center"
//             >
//               <FaBook className="me-1" /> Programs
//             </Nav.Link>

//             {/* ---------- MESSAGES ---------- */}
//             <Nav.Link
//               onClick={() => goToSection('messages')}
//               className="d-flex align-items-center"
//             >
//               <FaEnvelope className="me-1" /> Messages
//             </Nav.Link>

//             {/* ---------- ASSIGNMENTS ---------- */}
//             <Nav.Link
//               onClick={() => goToSection('assignments')}
//               className="d-flex align-items-center"
//             >
//               <FaUpload className="me-1" /> Assignments
//             </Nav.Link>

//             {/* ---------- PROFILE ---------- */}
//             <Nav.Link
//               onClick={() => goToSection('profile')}
//               className="d-flex align-items-center"
//             >
//               <FaUser className="me-1" /> Profile
//             </Nav.Link>

//             {/* ---------- LOGOUT ---------- */}
//             <Nav.Link onClick={handleLogout} className="d-flex align-items-center">
//               <FaSignOutAlt className="me-1" /> Logout
//             </Nav.Link>
//           </Nav>
//         </BootstrapNavbar.Collapse>
//       </Container>
//     </BootstrapNavbar>
//   );
// };

// export default UserNav;






// // import React,{useContext} from 'react';
// // import { Navbar as BootstrapNavbar, Nav, Container, Badge } from 'react-bootstrap';
// // import { FaSignOutAlt, FaHome, FaBook, FaEnvelope, FaUpload, FaUser } from 'react-icons/fa';
// // import { useNavigate } from 'react-router-dom';
// // import { UserContext } from './../context/UserContext';


// // const UserNav = () => {
// //   const navigate = useNavigate();
// //   const { logout,user } = useContext(UserContext);

// //   const handleLogout = () => {
// //     logout();
// //     navigate('/');
// //   };

// //   return (
// //     <BootstrapNavbar bg="light" expand="lg" sticky="top" className="shadow-sm">
// //       <Container>
// //         <BootstrapNavbar.Brand href="/dashboard">RiggsTech </BootstrapNavbar.Brand>
// //         {/* <BootstrapNavbar.Text style={{fontSize:23}}>{user.firstname} {user.lastname}</BootstrapNavbar.Text> */}
// //         <BootstrapNavbar.Toggle aria-controls="user-nav" />
// //         <BootstrapNavbar.Collapse id="user-nav">
// //           <Nav className="ms-auto">
// //             <Nav.Link onClick={()=>{}}>Programs</Nav.Link>
// //             <Nav.Link href="/dashboard/messages">Messages</Nav.Link>
// //             <Nav.Link href="/dashboard/assignments">Assignments</Nav.Link>
// //             <Nav.Link onClick={()=>{}}>Profile</Nav.Link>
// //             <Nav.Link onClick={handleLogout}>
// //               <FaSignOutAlt className="me-2" /> Logout
// //             </Nav.Link>
// //           </Nav>
// //         </BootstrapNavbar.Collapse>
// //       </Container>
// //     </BootstrapNavbar>
// //   );
// // };

// // export default UserNav;