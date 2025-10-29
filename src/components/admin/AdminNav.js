import React, { useContext } from 'react';
import { Navbar as BootstrapNavbar, Nav, Container, Badge } from 'react-bootstrap';
import { FaSignOutAlt, FaHome, FaUsers, FaEnvelope, FaPaperPlane } from 'react-icons/fa';
import { AdminContext } from '../../context/AdminContext';
import { useNavigate, NavLink } from 'react-router';

const AdminNav = () => {
  const { logout, stats } = useContext(AdminContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <BootstrapNavbar 
      bg="dark" 
      variant="dark" 
      expand="lg" 
      sticky="top" 
      className="shadow-sm border-bottom"
      style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}
    >
      <Container>
        <BootstrapNavbar.Brand as={NavLink} to="/admin/dashboard" className="fw-bold fs-4">
          <FaHome className="me-2" /> SkillAcademy Admin
        </BootstrapNavbar.Brand>
        
        <BootstrapNavbar.Toggle aria-controls="admin-nav" />
        
        <BootstrapNavbar.Collapse id="admin-nav">
          <Nav className="me-auto">
            <Nav.Link as={NavLink} to="/admin/dashboard" className="fw-bold">
              <FaHome className="me-1" /> Dashboard
            </Nav.Link>
            
            <Nav.Link as={NavLink} to="/admin/students" className="fw-bold position-relative">
              <FaUsers className="me-1" /> Students
              {stats.newStudents > 0 && (
                <Badge 
                  bg="warning" 
                  className="position-absolute top-0 start-100 translate-middle badge rounded-pill"
                  style={{ fontSize: '0.7em' }}
                >
                  {stats.newStudents}
                </Badge>
              )}
            </Nav.Link>
            
            <Nav.Link as={NavLink} to="/admin/messages" className="fw-bold position-relative">
              <FaEnvelope className="me-1" /> Messages
              {stats.newMessages > 0 && (
                <Badge 
                  bg="danger" 
                  className="position-absolute top-0 start-100 translate-middle badge rounded-pill"
                  style={{ fontSize: '0.7em' }}
                >
                  {stats.newMessages}
                </Badge>
              )}
            </Nav.Link>
            
            <Nav.Link as={NavLink} to="/admin/send-email" className="fw-bold">
              <FaPaperPlane className="me-1" /> Send Email
            </Nav.Link>
          </Nav>
          
          <Nav>
            <Nav.Link onClick={handleLogout} className="text-warning fw-bold">
              <FaSignOutAlt className="me-1" /> Logout
            </Nav.Link>
          </Nav>
        </BootstrapNavbar.Collapse>
      </Container>
    </BootstrapNavbar>
  );
};

export default AdminNav;