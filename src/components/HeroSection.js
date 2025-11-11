import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { FaRocket, FaLaptopCode, FaChartLine } from 'react-icons/fa';
// import landingimage from '../assets/landing.avif';

const HeroSection = () => {
  return (
    <section className="hero-section bg-primary text-white py-5" id="home">
      <Container>
        <Row className="align-items-center min-vh-100">
          <Col lg={6}>
            <h1 className="display-4 fw-bold mb-4">
              Master New Skills, <br />
              <span className="text-warning">Transform Your Career</span>
            </h1>
            <p className="lead mb-4">
              Join 50,000+ students learning cutting-edge skills from industry experts.
              Get certified and boost your career in just 8 weeks!
            </p>
            <div className="d-flex flex-column flex-sm-row gap-3 mb-4">
              <Button 
                variant="warning" 
                size="lg" 
                className="px-4 py-3 fw-bold"
                onClick={() => window.location.href = '/register'}
              >
                Get Started
              </Button>
              <Button 
                variant="outline-light" 
                size="lg" 
                className="px-4 py-3"
              >
                View All Programs
              </Button>
            </div>
            <div className="d-flex align-items-center gap-4">
              <div className="d-flex align-items-center">
                <FaRocket className="me-2" />
                <small>Success Rate: 95%</small>
              </div>
              <div className="d-flex align-items-center">
                <FaLaptopCode className="me-2" />
                <small>Online Learning</small>
              </div>
              <div className="d-flex align-items-center">
                <FaChartLine className="me-2" />
                <small>Job Ready</small>
              </div>
            </div>
          </Col>
          <Col lg={6}>
            <div className="hero-image text-center">
              <img 
                src="assets/landingimage.avif"
                alt="Students learning online" 
                className="img-fluid rounded shadow-lg"
                style={{ maxHeight: '500px', objectFit: 'cover' }}
              />
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default HeroSection;