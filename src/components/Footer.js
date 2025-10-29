import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { FaFacebook, FaTwitter, FaLinkedin, FaInstagram,FaGraduationCap } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-dark text-white py-5">
      <Container>
        <Row>
          <Col lg={4} md={6} className="mb-4">
            <h5 className="mb-3">
              <FaGraduationCap className="me-2" />
              <strong>RiggsTech</strong>
            </h5>
            <p className="text-muted">
              Empowering careers through world-class online training. 
              Join our community of successful learners today!
            </p>
            <div className="d-flex gap-3">
              <FaFacebook size={20} className="text-primary" />
              <FaTwitter size={20} className="text-info" />
              <FaLinkedin size={20} className="text-primary" />
              <FaInstagram size={20} className="text-danger" />
            </div>
          </Col>
          <Col lg={2} md={3} className="mb-4">
            <h6 className="mb-3">Courses</h6>
            <ul className="list-unstyled">
              {/* <li><a href="#" className="text-muted text-decoration-none">Web Dev</a></li>
              <li><a href="#" className="text-muted text-decoration-none">Data Science</a></li>
              <li><a href="#" className="text-muted text-decoration-none">Marketing</a></li> */}
            </ul>
          </Col>
          <Col lg={3} md={3} className="mb-4">
            <h6 className="mb-3">Company</h6>
            <ul className="list-unstyled">
              {/* <li><a href="#" className="text-muted text-decoration-none">About</a></li>
              <li><a href="#" className="text-muted text-decoration-none">Contact</a></li>
              <li><a href="#" className="text-muted text-decoration-none">Careers</a></li> */}
            </ul>
          </Col>
          <Col lg={3} md={6}>
            <h6 className="mb-3">Newsletter</h6>
            <p className="text-muted mb-3">Get latest course updates</p>
            <div className="input-group">
              <input 
                type="email" 
                className="form-control" 
                placeholder="Your email"
              />
              <button className="btn btn-primary">Subscribe</button>
            </div>
          </Col>
        </Row>
        <hr />
        <Row className="text-center">
          <Col>
            <p className="mb-0 text-muted">
              © 2025 SkillAcademy. All rights reserved.
            </p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;