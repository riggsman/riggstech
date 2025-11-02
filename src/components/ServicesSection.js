// src/sections/ServicesSection.jsx
import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Spinner, Alert } from 'react-bootstrap';
import { iconMap } from '../components/iconMap';
import { fetchServices } from '../services/FetchServices';

const ServicesSection = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadOnlineServices = async () => {
      try {
        setLoading(true);
        setError(null);
        // Always fetch only online services
        const data = await fetchServices('online');
        setServices(data);
      } catch (err) {
        setError('Failed to load training programs. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    loadOnlineServices();
  }, []);

  if (loading) {
    return (
      <section className="py-5 bg-light" id="services">
        <Container className="text-center">
          <Spinner animation="border" variant="primary" />
          <p className="mt-3">Loading training programs...</p>
        </Container>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-5 bg-light" id="services">
        <Container>
          <Alert variant="danger">{error}</Alert>
        </Container>
      </section>
    );
  }

  return (
    <section className="py-5 bg-light" id="services">
      <Container>
        <Row className="justify-content-center mb-5">
          <Col lg={8} className="text-center">
            <h2 className="display-5 fw-bold mb-3">Our Training Programs</h2>
            <p className="lead text-muted">
              Choose from our expert-led online programs. Lifetime access + certification included!
            </p>
          </Col>
        </Row>

        {/* Services Grid – Online Only */}
        {services.length === 0 ? (
          <Alert variant="info" className="text-center">
            No online programs available at the moment.
          </Alert>
        ) : (
          <Row>
            {services.map((service) => {
              const Icon = iconMap[service.icon];
              return (
                <Col lg={4} md={6} key={service.id} className="mb-4">
                  <Card className="h-100 shadow-sm border-0 hover-card">
                    <Card.Body className="p-4 text-center">
                      <div className="icon-wrapper mb-3">
                        {Icon && <Icon size={50} className="text-primary" />}
                      </div>
                      <Card.Title className="h5 fw-bold mb-3">
                        {service.title}
                      </Card.Title>
                      <Card.Text className="text-muted mb-3">
                        {service.description}
                      </Card.Text>
                      <div className="d-flex justify-content-between align-items-center mb-3">
                        <span className="badge bg-success">{service.duration}</span>
                        <span className="h6 fw-bold text-primary">{service.price}</span>
                      </div>

                      {/* REMOVED: Online/In-Person badge */}

                      <Button
                        variant="primary"
                        className="w-100"
                        onClick={() => window.location.href = '/register'}
                        // as='/register'
                      >
                        Enroll Now
                      </Button>
                    </Card.Body>
                  </Card>
                </Col>
              );
            })}
          </Row>
        )}

        <div className="text-center mt-5">
          <Button variant="outline-primary" size="lg" className="px-5 py-3">
            View All Online Courses
          </Button>
        </div>
      </Container>
    </section>
  );
};

export default ServicesSection;