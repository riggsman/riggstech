import React, {useContext} from 'react';
import { Navbar as BootstrapNavbar, Nav, Container } from 'react-bootstrap';
import { FaGraduationCap } from 'react-icons/fa';
import { UserContext } from './../context/UserContext';

const Navbar = () => {
  const { logout,isLoggedIn } = useContext(UserContext);

  const logoutUser = () => {
    logout();
    window.location.href = "/";
};
  return (
    <BootstrapNavbar 
      bg="light" 
      expand="lg" 
      sticky="top" 
      className="shadow-sm"
    >
      <Container>
        <BootstrapNavbar.Brand href="#home">
          <FaGraduationCap className="me-2" />
          <strong>RiggsTech</strong>
        </BootstrapNavbar.Brand>
        <BootstrapNavbar.Toggle aria-controls="basic-navbar-nav" />
        <BootstrapNavbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            <Nav.Link href="/">Home</Nav.Link>
            <Nav.Link href="/programs">Programs</Nav.Link>
            <Nav.Link href="/services">Services</Nav.Link>
            <Nav.Link href="/about">About</Nav.Link>
            <Nav.Link href="/contact">Contact</Nav.Link>
             {localStorage.getItem("isLoggedIn") === "true" ? null : <Nav.Link href="/register">Register</Nav.Link>}
            {localStorage.getItem("isLoggedIn") === "true" ? <Nav.Link href="/payment">Make Payment</Nav.Link> : null}
            {localStorage.getItem("isLoggedIn") === "true" ? <Nav.Link onClick={logoutUser}>Logout</Nav.Link> : <Nav.Link href="/login">Login</Nav.Link>}
          </Nav>
          {/* <button className="btn btn-outline-primary ms-3">Get Started</button> */}
        </BootstrapNavbar.Collapse>
      </Container>
    </BootstrapNavbar>
  );
};



// console.log("USER LOGIN STATE ",userstate)

export default Navbar;