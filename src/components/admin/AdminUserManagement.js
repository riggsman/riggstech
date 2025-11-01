// src/pages/admin/AdminUserManagement.jsx
import React, { useState, useEffect } from 'react';
import {
  Container, Row, Col, Card, Button, Form, Modal, Table,
  Badge, Spinner, Alert, InputGroup, Dropdown
} from 'react-bootstrap';
import {
  FaPlus, FaSearch, FaBan, FaCheckCircle, FaUserShield, FaUserTimes
} from 'react-icons/fa';
import envConfig from '../../config/envConfig';

const API_BASE = envConfig.API_URL;

const ROLES = ['admin', 'staff', 'student'];

const AdminUserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Create modal
  const [showCreate, setShowCreate] = useState(false);
  const [createForm, setCreateForm] = useState({
    first_name: '', last_name: '', email: '', username: '', password: '', role: 'student', phone: ''
  });

  // Filter
  const [filterPhone, setFilterPhone] = useState('');
  const [filterRole, setFilterRole] = useState('');

  // Role action
  const [roleAction, setRoleAction] = useState({ userId: null, action: '', role: '' });
  const [showAudit, setShowAudit] = useState(false);
  const [auditLog, setAuditLog] = useState([]);

  useEffect(() => {
    fetchUsers();
  }, [filterPhone, filterRole]);
  

useEffect(() => {
  if (showAudit) {
    fetch(`${API_BASE}/admin/audit-log`).then(r => r.json()).then(setAuditLog);
  }
}, [showAudit]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      let url = `${API_BASE}/admin/users`;
      const params = new URLSearchParams();
      if (filterPhone) params.append('phone', filterPhone);
      if (filterRole) params.append('role', filterRole);
      if (params.toString()) url += `?${params}`;

      const res = await fetch(url);
      if (!res.ok) throw new Error('Failed to load users');
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    try {
      const res = await fetch(`${API_BASE}/admin/user`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(createForm)
      });
      if (!res.ok) throw new Error('Create failed');
      setShowCreate(false);
      fetchUsers();
    } catch (err) {
      alert(err.message);
    }
  };

  const toggleBlock = async (userId) => {
    await fetch(`${API_BASE}/admin/users/${userId}/toggle`, { method: 'PATCH' });
    fetchUsers();
  };

  const manageRole = async () => {
    const { userId, action, role } = roleAction;
    await fetch(`${API_BASE}/admin/users/${userId}/roles?action=${action}&role=${role}`, {
      method: 'PATCH'
    });
    setRoleAction({ userId: null, action: '', role: '' });
    fetchUsers();
  };

  if (loading) return <Container className="py-5 text-center"><Spinner /></Container>;
  if (error) return <Container className="py-5"><Alert variant="danger">{error}</Alert></Container>;

  return (
    <section className="py-5">
      <Container>
        <Row className="mb-4 align-items-center">
          <Col>
            <h2 className="fw-bold">User Management</h2>
            <p className="text-muted">Create users, assign roles, block access</p>
          </Col>
          <Col xs="auto">
            <Button onClick={() => setShowCreate(true)} variant="primary">
              <FaPlus className="me-2" /> Create User
            </Button>
          </Col>
          <Col xs="auto">
            <Button variant="outline-success" href="/api/admin/users/export-csv" className="me-2">
                Export CSV
            </Button>
            <Button variant="outline-info" onClick={() => setShowAudit(true)}>
                View Audit Log
            </Button>
            </Col>
        </Row>

        {/* Filters */}
        <Card className="mb-4">
          <Card.Body>
            <Row>
              <Col md={6}>
                <InputGroup>
                  <InputGroup.Text><FaSearch /></InputGroup.Text>
                  <Form.Control
                    placeholder="Filter by phone..."
                    value={filterPhone}
                    onChange={(e) => setFilterPhone(e.target.value)}
                  />
                </InputGroup>
              </Col>
              <Col md={6}>
                <Form.Select value={filterRole} onChange={(e) => setFilterRole(e.target.value)}>
                  <option value="">All Roles</option>
                  {ROLES.map(r => (
                    <option key={r} value={r}>{r.charAt(0).toUpperCase() + r.slice(1)}</option>
                  ))}
                </Form.Select>
              </Col>
            </Row>
          </Card.Body>
        </Card>

        {/* Users Table */}
        <Card>
          <Card.Body>
            <Table hover responsive>
              <thead className="table-light">
                <tr>
                  <th>Full Name</th>
                  <th>Username</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Role</th>
                  <th>Extra Roles</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u.id}>
                    <td>{u.first_name} {u.last_name}</td>
                    <td>{u.username}</td>
                    <td>{u.email}</td>
                    <td>{u.phone || '—'}</td>
                    <td><Badge bg="primary">{u.role}</Badge></td>
                    <td>
                      {u.additional_roles.map(r => (
                        <Badge key={r} bg="info" className="me-1">{r}</Badge>
                      ))}
                      {u.additional_roles.length === 0 && '—'}
                    </td>
                    <td>
                      <Badge bg={u.is_active ? 'success' : 'danger'}>
                        {u.is_active ? 'Active' : 'Blocked'}
                      </Badge>
                    </td>
                    <td>
                      <Button
                        size="sm"
                        variant={u.is_active ? 'outline-danger' : 'outline-success'}
                        onClick={() => toggleBlock(u.id)}
                        className="me-1"
                      >
                        {u.is_active ? <FaCheckCircle />:<FaBan /> }
                      </Button>

                      <Dropdown size="sm" className="d-inline">
                        <Dropdown.Toggle variant="outline-secondary" size="sm">
                          <FaUserShield />
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                          {ROLES.map(r => {
                            const hasRole = u.role === r || u.additional_roles.includes(r);
                            return (
                              <Dropdown.Item
                                key={r}
                                onClick={() => setRoleAction({
                                  userId: u.id,
                                  action: hasRole ? 'remove' : 'add',
                                  role: r
                                })}
                                className={hasRole ? 'text-danger' : ''}
                              >
                                {hasRole ? <FaUserTimes /> : <FaPlus />} {hasRole ? 'Revoke' : 'Grant'} {r}
                              </Dropdown.Item>
                            );
                          })}
                        </Dropdown.Menu>
                      </Dropdown>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Card.Body>
        </Card>
      </Container>

      {/* Create User Modal */}
      <Modal show={showCreate} onHide={() => setShowCreate(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Create New User</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>First Name</Form.Label>
                  <Form.Control
                    value={createForm.first_name}
                    onChange={e => setCreateForm({ ...createForm, first_name: e.target.value })}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Last Name</Form.Label>
                  <Form.Control
                    value={createForm.last_name}
                    onChange={e => setCreateForm({ ...createForm, last_name: e.target.value })}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    value={createForm.email}
                    onChange={e => setCreateForm({ ...createForm, email: e.target.value })}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Username</Form.Label>
                  <Form.Control
                    value={createForm.username}
                    onChange={e => setCreateForm({ ...createForm, username: e.target.value })}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    value={createForm.password}
                    onChange={e => setCreateForm({ ...createForm, password: e.target.value })}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Phone (Optional)</Form.Label>
                  <Form.Control
                    value={createForm.phone}
                    onChange={e => setCreateForm({ ...createForm, phone: e.target.value })}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Default Role</Form.Label>
              <Form.Select
                value={createForm.role}
                onChange={e => setCreateForm({ ...createForm, role: e.target.value })}
              >
                {ROLES.map(r => (
                  <option key={r} value={r}>{r.charAt(0).toUpperCase() + r.slice(1)}</option>
                ))}
              </Form.Select>
            </Form.Group>
          </Form>
        </Modal.Body>

        {/* SHOWING LOG MODAL */}
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowCreate(false)}>Cancel</Button>
          <Button variant="primary" onClick={handleCreate}>Create User</Button>
        </Modal.Footer>
      </Modal>

      {/* Role Action Confirm */}
      <Modal show={!!roleAction.userId} onHide={() => setRoleAction({ userId: null, action: '', role: '' })} size="sm" centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {roleAction.action === 'add' ? 'Grant' : 'Revoke'} <strong>{roleAction.role}</strong> role?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setRoleAction({ userId: null, action: '', role: '' })}>Cancel</Button>
          <Button variant="primary" onClick={manageRole}>Confirm</Button>
        </Modal.Footer>
      </Modal>
      {/* Audit Log Modal */}
<Modal show={showAudit} onHide={() => setShowAudit(false)} size="xl">
  <Modal.Header closeButton>
    <Modal.Title>Audit Log</Modal.Title>
  </Modal.Header>
  <Modal.Body>
    <Table striped hover>
      <thead>
        <tr>
          <th>Time</th>
          <th>Admin</th>
          <th>Action</th>
          <th>Target</th>
          <th>Details</th>
        </tr>
      </thead>
      <tbody>
        {auditLog.map(log => (
          <tr key={log.id}>
            <td>{new Date(log.timestamp).toLocaleString()}</td>
            <td>Admin #{log.admin_id}</td>
            <td>{log.action}</td>
            <td>{log.target_user_id ? `User #${log.target_user_id}` : '—'}</td>
            <td>{log.details}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  </Modal.Body>
</Modal>
    </section>
  );
};

export default AdminUserManagement;