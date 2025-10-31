import React, { useState, useEffect, useContext } from 'react';
import { Container, Table, Alert, Badge,Row,Col } from 'react-bootstrap';
import AdminNav from './AdminNav';  // ✅ CORRECT IMPORT
import { AdminContext } from '../../context/AdminContext';
import envConfig from '../../config/envConfig';

const {API_URL} = envConfig;

const StudentsList = () => {
  const { token } = useContext(AdminContext);
  const [students, setStudents] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_URL}/admin/students`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await response.json();
        if (response.ok) {
          setStudents(data || []);
        } else {
          setError(data.message || 'Failed to load students');
        }
      } catch (err) {
        setError('Network error');
      } finally {
        setLoading(false);
      }
    };
    if (token) fetchStudents();
  }, [token]);

  if (loading) {
    return (
      <div>
        <section className="py-5 bg-light min-vh-100 d-flex align-items-center justify-content-center">
          <Container>
            <div className="text-center">Loading students...</div>
          </Container>
        </section>
      </div>
    );
  }

  return (
    <div>
      <section className="py-5 bg-light min-vh-100">
        <Container>
          <Row className="justify-content-center mb-5">
            <Col lg={10}>
              <h2 className="display-5 fw-bold text-center mb-4">Registered Students ({students.length})</h2>
              {error && <Alert variant="danger" className="mb-4 text-center rounded-pill">{error}</Alert>}
            </Col>
          </Row>

          <Table striped bordered hover responsive className="shadow-sm rounded-3 overflow-hidden">
            <thead className="bg-primary text-white">
              <tr>
                <th>#</th>
                <th>Full Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Payment Status</th>
                <th>Registered</th>
              </tr>
            </thead>
            <tbody>
              {students.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-4">
                    No students found
                  </td>
                </tr>
              ) : (
                students.map((student, index) => (
                  <tr key={student._id}>
                    <td>{index + 1}</td>
                    <td className="fw-bold">{student.first_name} {student.last_name}</td>
                    <td>{student.email}</td>
                    <td>{student.phone}</td>
                    <td>
                      <Badge 
                        bg={student.status === 'verified' ? 'success' : 'warning'}
                        className="px-2 py-1"
                      >
                        {student.status === 'verified' ? 'PAID' : 'PENDING'}
                      </Badge>
                    </td>
                    <td>{new Date(student.createdAt).toLocaleDateString('en-US')}</td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>
        </Container>
      </section>
    </div>
  );
};

export default StudentsList;