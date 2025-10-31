import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, Alert } from 'react-bootstrap';
import { FaHeadset, FaEnvelope, FaUser, FaComment } from 'react-icons/fa';
import envConfig from '../config/envConfig'; 

const API_URL = envConfig.API_URL;

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch(`${API_URL}/contact/submit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });
    const data = await response.json();
    if (response.ok) {
      setShowSuccess(true);
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
    } 
    else {
      setShowError(true);
    }
  };

  return (
    <section className="py-5" id="contact">
      <Container>
        <Row className="justify-content-center mb-5">
          <Col lg={8} className="text-center">
            <div className="icon-wrapper mb-3">
              <FaHeadset size={50} className="text-primary" />
            </div>
            <h2 className="display-5 fw-bold mb-3">Get In Touch</h2>
            <p className="lead text-muted">
              Have questions? We're here to help. Reach out and we'll respond within 24 hours.
            </p>
          </Col>
        </Row>

        <Row className="justify-content-center">
          <Col lg={10}>
            <div className="row g-0">
              <Col lg={6}>
                <div className="bg-primary text-white p-5 rounded-start">
                  <h4 className="fw-bold mb-4">Contact Information</h4>
                  
                  <div className="d-flex align-items-center mb-4">
                    <FaEnvelope className="me-3 fs-4" />
                    <div>
                      <h6 className="mb-1">Email Us</h6>
                      <p className="mb-0">support@riggstech.com</p>
                    </div>
                  </div>

                  <div className="d-flex align-items-center mb-4">
                    <FaHeadset className="me-3 fs-4" />
                    <div>
                      <h6 className="mb-1">Call Us</h6>
                      <p className="mb-0">(+237) 682-835-503</p>
                    </div>
                  </div>

                  <div className="d-flex align-items-center">
                    <FaComment className="me-3 fs-4" />
                    <div>
                      <h6 className="mb-1">Live Chat</h6>
                      <p className="mb-0">Mon-Fri 9AM-6PM WAT</p>
                    </div>
                  </div>
                </div>
              </Col>
              
              <Col lg={6}>
                <div className="p-5 bg-light rounded-end">
                  {showSuccess && (
                    <Alert variant="success" className="mb-4">
                      ✅ Message sent successfully! We'll respond within 24 hours.
                    </Alert>
                  )}
                  {showError && (
                    <Alert variant="success" className="mb-4">
                      We are sorry. We're currently experiencing technical difficulties. Please try again later.
                    </Alert>
                  )}

                  <Form onSubmit={handleSubmit}>
                    <Row>
                      <Col md={6} className="mb-4">
                        <Form.Group>
                          <Form.Label className="fw-bold">
                            <FaUser className="me-2" />
                            Full Name
                          </Form.Label>
                          <Form.Control
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Your full name"
                            className="rounded-pill px-4"
                          />
                        </Form.Group>
                      </Col>
                      <Col md={6} className="mb-4">
                        <Form.Group>
                          <Form.Label className="fw-bold">
                            <FaEnvelope className="me-2" />
                            Email
                          </Form.Label>
                          <Form.Control
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="your@email.com"
                            className="rounded-pill px-4"
                          />
                        </Form.Group>
                      </Col>
                    </Row>

                    <Row>
                      <Col md={6} className="mb-4">
                        <Form.Group>
                          <Form.Label className="fw-bold">
                            <FaHeadset className="me-2" />
                            Phone
                          </Form.Label>
                          <Form.Control
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            placeholder="682835507"
                            className="rounded-pill px-4"
                          />
                        </Form.Group>
                      </Col>
                      <Col md={6} className="mb-4">
                        <Form.Group>
                          <Form.Label className="fw-bold">Subject</Form.Label>
                          <Form.Select
                            name="subject"
                            value={formData.subject}
                            onChange={handleChange}
                            className="rounded-pill px-4"
                          >
                            <option value="">Choose a subject</option>
                            <option value="course-inquiry">Course Inquiry</option>
                            <option value="technical-support">Technical Support</option>
                            <option value="payment-issue">Payment Issue</option>
                            <option value="other">Other</option>
                          </Form.Select>
                        </Form.Group>
                      </Col>
                    </Row>

                    <Form.Group className="mb-4">
                      <Form.Label className="fw-bold">
                        <FaComment className="me-2" />
                        Message
                      </Form.Label>
                      <Form.Control
                        as="textarea"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        rows={4}
                        placeholder="Tell us how we can help you..."
                        className="rounded-3 px-4"
                      />
                    </Form.Group>

                    <Button 
                      type="submit" 
                      variant="primary" 
                      size="lg" 
                      className="w-100 py-3 fw-bold rounded-pill"
                    >
                      Send Message
                    </Button>
                  </Form>
                </div>
              </Col>
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default ContactForm;