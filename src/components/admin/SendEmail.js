import React, { useState, useContext } from 'react';
import { Container, Row, Col, Form, Button, Alert, Spinner, Card } from 'react-bootstrap';
import AdminNav from './AdminNav';  // ✅ CORRECT IMPORT
import { AdminContext } from '../../context/AdminContext';

const SendEmail = () => {
  const { token } = useContext(AdminContext);
  const [formData, setFormData] = useState({ to: '', subject: '', html: '' });
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      const response = await fetch('/api/admin/send-email', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json', 
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({
          ...formData,
          html: `<p>${formData.html}</p>`
        })
      });
      
      const data = await response.json();
      if (data.success) {
        setSuccess(true);
        setFormData({ to: '', subject: '', html: '' });
      } else {
        setError(data.message || 'Failed to send email');
      }
    } catch (err) {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <AdminNav />
      <section className="py-5 bg-light min-vh-100">
        <Container>
          <Row className="justify-content-center mb-5">
            <Col lg={8}>
              <h2 className="display-5 fw-bold text-center mb-4">Send Email to Students</h2>
              {success && <Alert variant="success" className="mb-4 rounded-pill text-center">✅ Email sent successfully!</Alert>}
              {error && <Alert variant="danger" className="mb-4 rounded-pill text-center">❌ {error}</Alert>}
            </Col>
          </Row>

          <Row className="justify-content-center">
            <Col lg={8}>
              <Card className="shadow-lg border-0">
                <Card.Body className="p-5">
                  <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-4">
                      <Form.Label className="fw-bold fs-5">To (Email Address)</Form.Label>
                      <Form.Control 
                        type="email" 
                        name="to" 
                        value={formData.to} 
                        onChange={handleChange} 
                        className="rounded-pill px-4 py-3 fs-6" 
                        required 
                        placeholder="student@example.com"
                      />
                    </Form.Group>

                    <Form.Group className="mb-4">
                      <Form.Label className="fw-bold fs-5">Subject</Form.Label>
                      <Form.Control 
                        type="text" 
                        name="subject" 
                        value={formData.subject} 
                        onChange={handleChange} 
                        className="rounded-pill px-4 py-3 fs-6" 
                        required 
                        placeholder="Course Update - Important!"
                      />
                    </Form.Group>

                    <Form.Group className="mb-4">
                      <Form.Label className="fw-bold fs-5">Message</Form.Label>
                      <Form.Control 
                        as="textarea" 
                        rows={8} 
                        name="html" 
                        value={formData.html} 
                        onChange={handleChange} 
                        className="rounded-3 p-4 fs-6" 
                        required 
                        placeholder="Hello Student,&#10;&#10;This is an important update about your course...&#10;&#10;Best regards,&#10;SkillAcademy Team"
                      />
                    </Form.Group>

                    <Button 
                      type="submit" 
                      variant="primary" 
                      size="lg" 
                      className="w-100 rounded-pill py-3 fw-bold fs-6" 
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <Spinner animation="border" size="sm" className="me-2" />
                          Sending Email...
                        </>
                      ) : (
                        'Send Email Now'
                      )}
                    </Button>
                  </Form>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>
    </div>
  );
};

export default SendEmail;












// import React, { useState, useContext } from 'react';
// import { Container, Form, Button, Alert, Spinner, Card } from 'react-bootstrap';
// import AdminNav from './AdminNav';
// import { AdminContext } from '../../context/AdminContext';

// const SendEmail = () => {
//   const { token } = useContext(AdminContext);
//   const [formData, setFormData] = useState({ to: '', subject: '', html: '' });
//   const [success, setSuccess] = useState(false);
//   const [error, setError] = useState('');
//   const [loading, setLoading] = useState(false);

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError('');
//     setSuccess(false);
//     try {
//       const response = await fetch('/api/admin/send-email', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
//         body: JSON.stringify(formData)
//       });
//       const data = await response.json();
//       if (data.success) {
//         setSuccess(true);
//         setFormData({ to: '', subject: '', html: '' });
//       } else {
//         setError(data.message || 'Failed to send email');
//       }
//     } catch (err) {
//       setError('Network error');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <section className="py-5 bg-light min-vh-100">
//       <AdminNav />
//       <Container>
//         <h2 className="display-5 fw-bold mb-5 text-center">Send Email to Students</h2>
//         {success && <Alert variant="success" className="mb-4 text-center rounded-pill">✅ Email sent successfully!</Alert>}
//         {error && <Alert variant="danger" className="mb-4 text-center rounded-pill">{error}</Alert>}
//         <Card className="shadow-lg border-0">
//           <Card.Body className="p-5">
//             <Form onSubmit={handleSubmit}>
//               <Form.Group className="mb-4">
//                 <Form.Label className="fw-bold">To (Email)</Form.Label>
//                 <Form.Control 
//                   type="email" 
//                   name="to" 
//                   value={formData.to} 
//                   onChange={handleChange} 
//                   className="rounded-pill px-4 py-3" 
//                   required 
//                   placeholder="student@example.com"
//                 />
//               </Form.Group>
//               <Form.Group className="mb-4">
//                 <Form.Label className="fw-bold">Subject</Form.Label>
//                 <Form.Control 
//                   type="text" 
//                   name="subject" 
//                   value={formData.subject} 
//                   onChange={handleChange} 
//                   className="rounded-pill px-4 py-3" 
//                   required 
//                   placeholder="Important Update"
//                 />
//               </Form.Group>
//               <Form.Group className="mb-4">
//                 <Form.Label className="fw-bold">Message (HTML)</Form.Label>
//                 <Form.Control 
//                   as="textarea" 
//                   rows={8} 
//                   name="html" 
//                   value={formData.html} 
//                   onChange={handleChange} 
//                   className="rounded-3 p-4" 
//                   required 
//                   placeholder="<p>Hello, this is an update...</p>"
//                 />
//               </Form.Group>
//               <Button 
//                 type="submit" 
//                 variant="primary" 
//                 size="lg" 
//                 className="w-100 rounded-pill py-3 fw-bold" 
//                 disabled={loading}
//               >
//                 {loading ? <Spinner animation="border" size="sm" className="me-2" /> : null}
//                 {loading ? 'Sending...' : 'Send Email'}
//               </Button>
//             </Form>
//           </Card.Body>
//         </Card>
//       </Container>
//     </section>
//   );
// };

// export default SendEmail;