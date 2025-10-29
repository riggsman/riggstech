import React,{useContext} from 'react';
import { Navbar as BootstrapNavbar, Nav, Container, Badge } from 'react-bootstrap';
import { FaSignOutAlt, FaHome, FaBook, FaEnvelope, FaUpload, FaUser } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { UserContext } from './../context/UserContext';


const UserNav = () => {
  const navigate = useNavigate();
  const { logout,user } = useContext(UserContext);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <BootstrapNavbar bg="light" expand="lg" sticky="top" className="shadow-sm">
      <Container>
        <BootstrapNavbar.Brand href="/dashboard">RiggsTech </BootstrapNavbar.Brand>
        {/* <BootstrapNavbar.Text style={{fontSize:23}}>{user.firstname} {user.lastname}</BootstrapNavbar.Text> */}
        <BootstrapNavbar.Toggle aria-controls="user-nav" />
        <BootstrapNavbar.Collapse id="user-nav">
          <Nav className="ms-auto">
            <Nav.Link onClick={()=>{}}>Programs</Nav.Link>
            <Nav.Link href="/dashboard/messages">Messages</Nav.Link>
            <Nav.Link href="/dashboard/assignments">Assignments</Nav.Link>
            <Nav.Link onClick={()=>{}}>Profile</Nav.Link>
            <Nav.Link onClick={handleLogout}>
              <FaSignOutAlt className="me-2" /> Logout
            </Nav.Link>
          </Nav>
        </BootstrapNavbar.Collapse>
      </Container>
    </BootstrapNavbar>
  );
};

export default UserNav;