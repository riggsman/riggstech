import React from 'react';
import { Container, Row, Col, Button, Alert } from 'react-bootstrap';
import { FaCheckCircle, FaGraduationCap } from 'react-icons/fa';

const SuccessPage = () => {
  return (
    <section className="py-5 bg-success text-white">
      <Container>
        <Row className="justify-content-center text-center">
          <Col lg={8}>
            <div className="mb-4">
              <FaCheckCircle size={100} className="text-warning mb-3" />
            </div>
            
            <h1 className="display-4 fw-bold mb-4">
              Payment Successful! 🎉
            </h1>
            
            <p className="lead mb-4">
              Welcome to SkillAcademy! Your premium access is now active.
            </p>
            
            <Alert variant="warning" className="border-0">
              <strong>Account Created:</strong> user@example.com<br />
              <strong>Payment:</strong> $49 via MTN Mobile Money
            </Alert>
            
            <div className="d-grid gap-3">
              <Button 
                variant="warning" 
                size="lg" 
                className="fw-bold rounded-pill py-3"
                onClick={() => window.location.href = '/'}
              >
                <FaGraduationCap className="me-2" />
                Start Learning Now
              </Button>
              
              <Button 
                variant="outline-light" 
                size="lg" 
                className="rounded-pill py-3"
                onClick={() => window.location.href = '/'}
              >
                Back to Home
              </Button>
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default SuccessPage;