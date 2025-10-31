import React, { useState, useEffect, useContext } from 'react';
import { Container, Table, Button, Modal, Form, Alert, Badge, Spinner,Row,Col } from 'react-bootstrap';
import AdminNav from './admin/AdminNav';  // ✅ CORRECT IMPORT
import { AdminContext } from '../context/AdminContext';
import envConfig from '../config/envConfig';

const API_URL = envConfig.API_URL;

const MessagesList = () => {
  const { token, stats, updateStats } = useContext(AdminContext);
  const [messages, setMessages] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [currentMessage, setCurrentMessage] = useState({});
  const [responseText, setResponseText] = useState('');
  const [modalError, setModalError] = useState('');
  const [sending, setSending] = useState(false);

  useEffect(() => {
    fetchMessages();
  }, [token]);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/admin/messages`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();

      if (response.ok) {
        setMessages(data || []);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  };

  const markRead = async (id) => {
    try {
      const response = await fetch(`/api/admin/messages/${id}/read`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.ok) {
        setMessages(messages.map(m => m.id === id ? { ...m, unread: false } : m));
        updateStats({ ...stats, newMessages: Math.max(0, stats.newMessages - 1) });
      }
    } catch (err) {
      console.error('Failed to mark read');
    }
  };

  const handleRespond = async () => {
    setSending(true);
    setModalError('');
    try {
      const response = await fetch(`${API_URL}/admin/message/respond`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json', 
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({
          contactId: currentMessage._id,
          to: currentMessage.email,
          subject: `Re: ${currentMessage.subject}`,
          html: `<p>Dear ${currentMessage.name},</p><p>${responseText}</p><p>Best regards,<br>SkillAcademy Team</p>`
        })
      });
      
      if (response.ok) {
        setShowModal(false);
        markRead(currentMessage._id);
        setResponseText('');
        alert('Response sent successfully!');
        fetchMessages(); // Refresh list
      } else {
        const data = await response.json();
        setModalError(data.message || 'Failed to send response');
      }
    } catch (err) {
      setModalError('Network error');
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <div>
        <AdminNav />
        <section className="py-5 bg-light min-vh-100 d-flex align-items-center justify-content-center">
          <Container><Spinner animation="border" /></Container>
        </section>
      </div>
    );
  }

  return (
    <div>
      <AdminNav />
      <section className="py-5 bg-light min-vh-100">
        <Container>
          <Row className="justify-content-center mb-5">
            <Col lg={10}>
              <h2 className="display-5 fw-bold text-center mb-4">Contact Messages ({messages.length})</h2>
              {error && <Alert variant="danger" className="mb-4 text-center rounded-pill">{error}</Alert>}
            </Col>
          </Row>

          <Table striped bordered hover responsive className="shadow-sm rounded-3 overflow-hidden">
            <thead className="bg-primary text-white">
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Subject</th>
                <th>Message Preview</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {messages.length === 0 ? (
                <tr><td colSpan="8" className="text-center py-4">No messages</td></tr>
              ) : (
                messages.map((msg, index) => (
                  <tr key={msg._id}>
                    <td>{index + 1}</td>
                    <td className="fw-bold">{msg.name}</td>
                    <td>{msg.email}</td>
                    <td>{msg.phone}</td>
                    <td>{msg.subject}</td>
                    <td>{msg.message.substring(0, 50)}...</td>
                    <td>
                      <Badge bg={msg.unread ? 'danger' : 'success'}>
                        {msg.unread ? 'Unread' : 'Read'}
                      </Badge>
                    </td>
                    <td>
                      <Button 
                        variant="primary" 
                        size="sm" 
                        className="me-1" 
                        onClick={() => {
                          setCurrentMessage(msg);
                          setResponseText('');
                          setShowModal(true);
                        }}
                      >
                        Respond
                      </Button>
                      {msg.unread && (
                        <Button 
                          variant="outline-secondary" 
                          size="sm" 
                          onClick={() => markRead(msg._id)}
                        >
                          Mark Read
                        </Button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>

          {/* Respond Modal */}
          <Modal show={showModal} onHide={() => setShowModal(false)} size="lg" centered>
            <Modal.Header closeButton>
              <Modal.Title>Respond to {currentMessage.name}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {modalError && <Alert variant="danger">{modalError}</Alert>}
              <Form.Group className="mb-3">
                <Form.Label>Email: {currentMessage.email}</Form.Label>
                <Form.Control 
                  as="textarea" 
                  rows={8} 
                  value={responseText} 
                  onChange={(e) => setResponseText(e.target.value)} 
                  className="rounded-3"
                  placeholder="Type your response here..."
                />
              </Form.Group>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={() => setShowModal(false)} disabled={sending}>
                Cancel
              </Button>
              <Button variant="primary" onClick={handleRespond} disabled={sending || !responseText.trim()}>
                {sending ? <><Spinner size="sm" className="me-2" />Sending...</> : 'Send Response'}
              </Button>
            </Modal.Footer>
          </Modal>
        </Container>
      </section>
    </div>
  );
};

export default MessagesList;












// import React, { useState, useEffect, useContext } from 'react';
// import { Container, Table, Button, Modal, Form, Alert,Spinner, Badge } from 'react-bootstrap';
// import AdminNav from './AdminNav';
// import { AdminContext } from '../../context/AdminContext';

// const MessagesList = () => {
//   const { token, updateStats } = useContext(AdminContext);
//   const [messages, setMessages] = useState([]);
//   const [error, setError] = useState('');
//   const [showModal, setShowModal] = useState(false);
//   const [currentMessage, setCurrentMessage] = useState({});
//   const [responseText, setResponseText] = useState('');
//   const [modalError, setModalError] = useState('');
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     const fetchMessages = async () => {
//       try {
//         const response = await fetch('/api/admin/messages', {
//           headers: { Authorization: `Bearer ${token}` }
//         });
//         const data = await response.json();
//         if (data.success) {
//           setMessages(data.messages);
//         } else {
//           setError(data.message);
//         }
//       } catch (err) {
//         setError('Network error');
//       }
//     };
//     if (token) fetchMessages();
//   }, [token]);

//   const markRead = async (id) => {
//     try {
//       const response = await fetch(`/api/admin/messages/${id}/read`, {
//         method: 'PUT',
//         headers: { Authorization: `Bearer ${token}` }
//       });
//       const data = await response.json();
//       if (data.success) {
//         const updatedMessages = messages.map(m => m._id === id ? { ...m, unread: false } : m);
//         setMessages(updatedMessages);
//         // eslint-disable-next-line no-undef
//         updateStats({ ...stats, newMessages: stats.newMessages - 1 });
//       }
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   const handleRespond = async () => {
//     setLoading(true);
//     setModalError('');
//     try {
//       const response = await fetch('/api/admin/respond-message', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
//         body: JSON.stringify({
//           contactId: currentMessage._id,
//           to: currentMessage.email,
//           subject: `Re: ${currentMessage.subject}`,
//           html: responseText
//         })
//       });
//       const data = await response.json();
//       if (data.success) {
//         setShowModal(false);
//         markRead(currentMessage._id);
//       } else {
//         setModalError(data.message || 'Failed to send');
//       }
//     } catch (err) {
//       setModalError('Network error');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <section className="py-5 bg-light min-vh-100">
//       <AdminNav />
//       <Container>
//         <h2 className="display-5 fw-bold mb-5 text-center">Contact Messages</h2>
//         {error && <Alert variant="danger" className="mb-4 text-center">{error}</Alert>}
//         <Table striped bordered hover responsive className="shadow-sm">
//           <thead className="bg-primary text-white">
//             <tr>
//               <th>Name</th>
//               <th>Email</th>
//               <th>Phone</th>
//               <th>Subject</th>
//               <th>Message</th>
//               <th>Status</th>
//               <th>Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {messages.length === 0 ? (
//               <tr><td colSpan="7" className="text-center">No messages</td></tr>
//             ) : (
//               messages.map((msg) => (
//                 <tr key={msg._id}>
//                   <td>{msg.name}</td>
//                   <td>{msg.email}</td>
//                   <td>{msg.phone}</td>
//                   <td>{msg.subject}</td>
//                   <td>{msg.message}</td>
//                   <td>
//                     <Badge bg={msg.unread ? 'danger' : 'success'}>
//                       {msg.unread ? 'Unread' : 'Read'}
//                     </Badge>
//                   </td>
//                   <td>
//                     <Button 
//                       variant="primary" 
//                       size="sm" 
//                       className="me-2" 
//                       onClick={() => {
//                         setCurrentMessage(msg);
//                         setResponseText('');
//                         setShowModal(true);
//                       }}
//                     >
//                       Respond
//                     </Button>
//                     {msg.unread && (
//                       <Button variant="secondary" size="sm" onClick={() => markRead(msg._id)}>
//                         Mark Read
//                       </Button>
//                     )}
//                   </td>
//                 </tr>
//               ))
//             )}
//           </tbody>
//         </Table>

//         {/* Respond Modal */}
//         <Modal show={showModal} onHide={() => setShowModal(false)} centered>
//           <Modal.Header closeButton>
//             <Modal.Title>Respond to {currentMessage.name}</Modal.Title>
//           </Modal.Header>
//           <Modal.Body>
//             {modalError && <Alert variant="danger">{modalError}</Alert>}
//             <Form.Group className="mb-3">
//               <Form.Label>Response Message</Form.Label>
//               <Form.Control 
//                 as="textarea" 
//                 rows={6} 
//                 value={responseText} 
//                 onChange={(e) => setResponseText(e.target.value)} 
//                 className="rounded-3"
//               />
//             </Form.Group>
//           </Modal.Body>
//           <Modal.Footer>
//             <Button variant="secondary" onClick={() => setShowModal(false)} disabled={loading}>
//               Cancel
//             </Button>
//             <Button variant="primary" onClick={handleRespond} disabled={loading}>
//               {loading ? <Spinner animation="border" size="sm" className="me-2" /> : null}
//               {loading ? 'Sending...' : 'Send Response'}
//             </Button>
//           </Modal.Footer>
//         </Modal>
//       </Container>
//     </section>
//   );
// };

// export default MessagesList;