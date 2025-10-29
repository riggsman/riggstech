// src/pages/admin/AdminServices.jsx
import React, { useState, useEffect, useContext } from 'react';
import {
  Container, Row, Col, Card, Button, Form, Modal, Table,
  Spinner, Alert, Badge, ToggleButton, ToggleButtonGroup
} from 'react-bootstrap';
import { FaEdit, FaTrash, FaPlus, FaSave, FaEye, FaEyeSlash } from 'react-icons/fa';
import { iconMap } from '../../components/iconMap';
import { UserContext } from '../../context/UserContext';

const API_BASE = 'http://localhost:8000/api';

const AdminServices = () => {
  const { user } = useContext(UserContext);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [formData, setFormData] = useState({
    id: null,
    icon: 'FaCode',
    title: '',
    description: '',
    duration: '',
    price: '',
    isOnline: true
  });

  // Load all services
  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/services`);
      if (!res.ok) throw new Error('Failed to load services');
      const data = await res.json();
      setServices(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (service = null) => {
    if (service) {
      setEditingService(service);
      setFormData({ ...service });
    } else {
      setEditingService(null);
      setFormData({
        id: Date.now(), // temp ID
        icon: 'FaCode',
        title: '', description: '', duration: '', price: '', isOnline: true
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingService(null);
  };

  const handleSave = async () => {
    try {
      const method = editingService ? 'PUT' : 'POST';
      const url = editingService
        ? `${API_BASE}/services/${editingService.id}`
        : `${API_BASE}/services`;

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (!res.ok) throw new Error('Save failed');
      await fetchServices();
      handleCloseModal();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this service?')) return;
    try {
      await fetch(`${API_BASE}/services/${id}`, { method: 'DELETE' });
      setServices(services.filter(s => s.id !== id));
    } catch (err) {
      alert('Delete failed');
    }
  };

  if (loading) return <Container className="py-5 text-center"><Spinner /></Container>;
  if (error) return <Container className="py-5"><Alert variant="danger">{error}</Alert></Container>;

  return (
    <section className="py-5" id="admin-services">
      <Container>
        <Row className="mb-4 align-items-center">
          <Col>
            <h2 className="fw-bold">Manage Training Programs</h2>
            <p className="text-muted">Create, edit, or toggle online/draft status</p>
          </Col>
          <Col xs="auto">
            <Button onClick={() => handleOpenModal()} variant="primary">
              <FaPlus className="me-2" /> Add New Service
            </Button>
          </Col>
        </Row>

        {/* Services Table */}
        <Card>
          <Card.Body>
            <Table hover responsive>
              <thead>
                <tr>
                  <th>Icon</th>
                  <th>Title</th>
                  <th>Duration</th>
                  <th>Price</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {services.map((s) => {
                  const Icon = iconMap[s.icon];
                  return (
                    <tr key={s.id}>
                      <td>{Icon && <Icon size={24} />}</td>
                      <td>{s.title}</td>
                      <td>{s.duration}</td>
                      <td>{s.price}</td>
                      <td>
                        <Badge bg={s.isOnline ? 'success' : 'secondary'}>
                          {s.isOnline ? <FaEye /> : <FaEyeSlash />} {s.isOnline ? 'Online' : 'Draft'}
                        </Badge>
                      </td>
                      <td>
                        <Button size="sm" variant="outline-primary" onClick={() => handleOpenModal(s)}>
                          <FaEdit />
                        </Button>{' '}
                        <Button size="sm" variant="outline-danger" onClick={() => handleDelete(s.id)}>
                          <FaTrash />
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          </Card.Body>
        </Card>
      </Container>

      {/* Create/Edit Modal */}
      <Modal show={showModal} onHide={handleCloseModal} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{editingService ? 'Edit' : 'Create'} Service</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Icon</Form.Label>
                  <Form.Select
                    value={formData.icon}
                    onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                  >
                    {Object.keys(iconMap).map(key => (
                      <option key={key} value={key}>{key}</option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Title</Form.Label>
                  <Form.Control
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g., Web Development"
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </Form.Group>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Duration</Form.Label>
                  <Form.Control
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    placeholder="e.g., 8 weeks"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Price</Form.Label>
                  <Form.Control
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="e.g., XAF 15,000"
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Status</Form.Label>
              <div>
                <ToggleButtonGroup type="radio" name="status" value={formData.isOnline} onChange={(val) => setFormData({ ...formData, isOnline: val })}>
                  <ToggleButton id="online" value={true} variant="outline-success">
                    <FaEye /> Online
                  </ToggleButton>
                  <ToggleButton id="draft" value={false} variant="outline-secondary">
                    <FaEyeSlash /> Draft (Offline)
                  </ToggleButton>
                </ToggleButtonGroup>
              </div>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>Cancel</Button>
          <Button variant="primary" onClick={handleSave}>
            <FaSave className="me-2" /> {editingService ? 'Update' : 'Create'}
          </Button>
        </Modal.Footer>
      </Modal>
    </section>
  );
};

export default AdminServices;