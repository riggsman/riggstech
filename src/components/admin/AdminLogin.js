import React, { useState, useContext } from 'react';
import { Container, Row, Col, Form, Button, Alert, Card, Spinner } from 'react-bootstrap';
import { FaEnvelope, FaLock } from 'react-icons/fa';
import { AdminContext } from '../../context/AdminContext';
import { useNavigate } from 'react-router';
import envConfig from '../../config/envConfig';

const API_URL = envConfig.API_URL;

const AdminLogin = () => {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AdminContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      console.log("ADMIN LOGIN REQUEST ", response.headers)
      const data = await response.json();
      if (response.ok) {
        login(data);
        navigate('/admin/dashboard');
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="hero-section bg-primary text-white py-5 min-vh-100 d-flex align-items-center">
      <Container>
        <Row className="justify-content-center">
          <Col lg={5}>
            <Card className="shadow-lg border-0 rounded-3">
              <Card.Body className="p-5">
                <h2 className="display-6 fw-bold text-center mb-4 text-primary">Admin Login</h2>
                {error && <Alert variant="danger" className="mb-4 rounded-pill text-center">{error}</Alert>}
                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-4">
                    <Form.Label className="fw-bold"><FaEnvelope className="me-2" />Username</Form.Label>
                    <Form.Control 
                      type="text" 
                      name="username" 
                      value={formData.username} 
                      onChange={handleChange} 
                      className="rounded-pill px-4 py-3" 
                      required 
                    />
                  </Form.Group>
                  <Form.Group className="mb-4">
                    <Form.Label className="fw-bold"><FaLock className="me-2" />Password</Form.Label>
                    <Form.Control 
                      type="password" 
                      name="password" 
                      value={formData.password} 
                      onChange={handleChange} 
                      className="rounded-pill px-4 py-3" 
                      required 
                    />
                  </Form.Group>
                  <Button 
                    type="submit" 
                    variant="warning" 
                    size="lg" 
                    className="w-100 rounded-pill py-3 fw-bold" 
                    disabled={loading}
                  >
                    {loading ? <Spinner animation="border" size="sm" className="me-2" /> : null}
                    {loading ? 'Logging In...' : 'Login'}
                  </Button>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default AdminLogin;