import React, { useState, useEffect, useContext, useMemo } from 'react';
import {
  Container, Table, Button, Modal, Form, Alert, Badge, Spinner,
  Row, Col, ButtonGroup, Pagination
} from 'react-bootstrap';
import AdminNav from './AdminNav';
import { AdminContext } from '../../context/AdminContext';
import envConfig from '../../config/envConfig';

const API_URL = envConfig.API_URL;
const PAGE_SIZE = 10;

const MessagesList = () => {
  const { token, stats, updateStats } = useContext(AdminContext);
  const [messages, setMessages] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  // Modals
  const [showReadModal, setShowReadModal] = useState(false);
  const [showRespondModal, setShowRespondModal] = useState(false);
  const [currentMessage, setCurrentMessage] = useState({});

  // Respond state
  const [responseText, setResponseText] = useState('');
  const [modalError, setModalError] = useState('');
  const [sending, setSending] = useState(false);

  // Filter & Pagination
  const [filter, setFilter] = useState('all');   // all | unread | read
  const [currentPage, setCurrentPage] = useState(1);

  /* ------------------------------------------------- FETCH ------------------------------------------------- */
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

      if (response.ok) setMessages(data || []);
      else setError(data.message);
    } catch {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  };

  /* ------------------------------------------------- MARK READ ------------------------------------------------- */
  const markRead = async (id) => {
    try {
      const response = await fetch(`${API_URL}/admin/messages/${id}/read`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.ok) {
        setMessages(prev => prev.map(m => m._id === id ? { ...m, unread: false } : m));
        updateStats({ ...stats, newMessages: Math.max(0, stats.newMessages - 1) });
      }
    } catch {
      console.error('Failed to mark read');
    }
  };

  /* ------------------------------------------------- RESPOND ------------------------------------------------- */
  const handleRespond = async () => {
    setSending(true);
    setModalError('');
    try {
      const customLink = `http://192.168.1.87:3000/services`;
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
          html: `<!DOCTYPE html>
<html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Automated Reply</title></head>
<body style="margin:0;padding:0;background:#f7f7f7;font-family:Arial,sans-serif">
<table width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#f7f7f7"><tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" border="0" bgcolor="#ffffff" style="border:1px solid #ddd">
<tr><td align="center" bgcolor="#4B0082" style="padding:20px;color:#fff;font-size:24px;font-weight:bold">
<img src="https://riggstech.com/logo.png" alt="Logo" width="40" style="vertical-align:middle;margin-right:10px">RiggsTech Automated Response
</td></tr>
<tr><td style="padding:20px;font-size:16px;line-height:1.5;color:#333">
<p>Dear ${currentMessage.name},</p><p>${responseText}</p>
<p style="text-align:center;margin:30px 0">
<a href="${customLink}" style="background:#4B0082;color:#fff;text-decoration:none;padding:12px 25px;border-radius:5px;font-weight:bold;display:inline-block">View Your Message</a>
</p>
<p>Best regards,<br>RiggsTech Team</p>
</td></tr>
<tr><td bgcolor="#800080" style="padding:15px;text-align:center;color:#fff;font-size:14px">
<table align="center" cellpadding="0" cellspacing="0" border="0">
<tr><td style="padding:5px 10px"><img src="https://img.icons8.com/ios-filled/50/ffffff/new-post.png" width="16" alt="Email" style="vertical-align:middle;margin-right:5px">
<a href="mailto:support@riggstech.com" style="color:#fff;text-decoration:none">support@riggstech.com</a></td></tr>
<tr><td style="padding:5px 10px"><img src="https://img.icons8.com/ios-filled/50/ffffff/phone.png" width="16" alt="Phone" style="vertical-align:middle;margin-right:5px">+237 123 456 789</td></tr>
<tr><td style="padding:5px 10px"><img src="https://img.icons8.com/ios-filled/50/ffffff/marker.png" width="16" alt="Address" style="vertical-align:middle;margin-right:5px">123 Tech Street, Yaoundé, Cameroon</td></tr>
</table></td></tr>
</table></td></tr></table></body></html>`
        })
      });

      if (response.ok) {
        setShowRespondModal(false);
        setResponseText('');
        markRead(currentMessage._id);
        alert('Response sent successfully!');
        fetchMessages();
      } else {
        const data = await response.json();
        setModalError(data.message || 'Failed to send response');
      }
    } catch {
      setModalError('Network error');
    } finally {
      setSending(false);
    }
  };

  /* ------------------------------------------------- FILTER & PAGINATION ------------------------------------------------- */
  const filteredMessages = useMemo(() => {
    if (filter === 'unread') return messages.filter(m => m.unread);
    if (filter === 'read') return messages.filter(m => !m.unread);
    return messages;
  }, [messages, filter]);

  const totalItems = filteredMessages.length;
  const totalPages = Math.ceil(totalItems / PAGE_SIZE);
  const startIdx = (currentPage - 1) * PAGE_SIZE;
  const endIdx = startIdx + PAGE_SIZE;
  const currentPageMessages = filteredMessages.slice(startIdx, endIdx);

  // Reset page when filter changes
  useEffect(() => setCurrentPage(1), [filter]);

  const unreadCount = messages.filter(m => m.unread).length;
  const readCount = messages.filter(m => !m.unread).length;

  const renderPagination = () => {
    if (totalPages <= 1) return null;
    const pages = [];
    const max = 5;
    let start = Math.max(1, currentPage - Math.floor(max / 2));
    let end = Math.min(totalPages, start + max - 1);
    if (end - start + 1 < max) start = Math.max(1, end - max + 1);

    for (let i = start; i <= end; i++) {
      pages.push(
        <Pagination.Item key={i} active={i === currentPage} onClick={() => setCurrentPage(i)}>
          {i}
        </Pagination.Item>
      );
    }

    return (
      <Pagination className="justify-content-center mt-4">
        <Pagination.Prev disabled={currentPage === 1} onClick={() => setCurrentPage(p => Math.max(1, p - 1))} />
        {pages}
        <Pagination.Next disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} />
      </Pagination>
    );
  };

  /* ------------------------------------------------- OPEN READ MODAL ------------------------------------------------- */
  const openReadModal = (msg) => {
    setCurrentMessage(msg);
    setShowReadModal(true);
    if (msg.unread) markRead(msg._id);
  };

  /* ------------------------------------------------- LOADING ------------------------------------------------- */
  if (loading) {
    return (
      <section className="py-5 bg-light min-vh-100 d-flex align-items-center justify-content-center">
        <Container><Spinner animation="border" /></Container>
      </section>
    );
  }

  /* ------------------------------------------------- RENDER ------------------------------------------------- */
  return (
    <section className="py-5 bg-light min-vh-100">
      <Container>
        <Row className="justify-content-center mb-4">
          <Col lg={10}>
            <h2 className="display-5 fw-bold text-center mb-3">Contact Messages</h2>

            {/* FILTER BUTTONS */}
            <div className="d-flex justify-content-center mb-3">
              <ButtonGroup>
                <Button variant={filter === 'all' ? 'primary' : 'outline-primary'} onClick={() => setFilter('all')} className="px-4">
                  All <Badge bg="light" text="dark" className="ms-1">{messages.length}</Badge>
                </Button>
                <Button variant={filter === 'unread' ? 'danger' : 'outline-danger'} onClick={() => setFilter('unread')} className="px-4">
                  Unread <Badge bg="light" text="dark" className="ms-1">{unreadCount}</Badge>
                </Button>
                <Button variant={filter === 'read' ? 'success' : 'outline-success'} onClick={() => setFilter('read')} className="px-4">
                  Read <Badge bg="light" text="dark" className="ms-1">{readCount}</Badge>
                </Button>
              </ButtonGroup>
            </div>

            {/* PAGE INFO */}
            {totalItems > 0 && (
              <div className="text-center text-muted mb-3">
                Showing {startIdx + 1}–{Math.min(endIdx, totalItems)} of {totalItems} messages
              </div>
            )}

            {error && <Alert variant="danger" className="mb-4 text-center rounded-pill">{error}</Alert>}
          </Col>
        </Row>

        {/* TABLE */}
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
            {currentPageMessages.length === 0 ? (
              <tr>
                <td colSpan={8} className="text-center py-4 text-muted">
                  {filter === 'all' ? 'No messages' : `No ${filter} messages`}
                </td>
              </tr>
            ) : (
              currentPageMessages.map((msg, idx) => (
                <tr
                  key={msg._id}
                  onClick={() => openReadModal(msg)}
                  style={{ cursor: 'pointer' }}
                  className={msg.unread ? 'table-warning' : ''}
                >
                  <td>{startIdx + idx + 1}</td>
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
                  <td onClick={e => e.stopPropagation()}>
                    <Button
                      variant="primary"
                      size="sm"
                      className="me-1"
                      onClick={() => {
                        setCurrentMessage(msg);
                        setResponseText('');
                        setShowRespondModal(true);
                      }}
                    >
                      Respond
                    </Button>
                    {msg.unread && (
                      <Button variant="outline-secondary" size="sm" onClick={() => markRead(msg._id)}>
                        Mark Read
                      </Button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </Table>

        {/* PAGINATION */}
        {renderPagination()}

        {/* ====================== READ FULL MESSAGE MODAL ====================== */}
        <Modal show={showReadModal} onHide={() => setShowReadModal(false)} size="lg" centered>
          <Modal.Header closeButton>
            <Modal.Title>Message from {currentMessage.name}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p><strong>Email:</strong> {currentMessage.email}</p>
            <p><strong>Phone:</strong> {currentMessage.phone}</p>
            <p><strong>Subject:</strong> {currentMessage.subject}</p>
            <hr />
            <p><strong>Full Message:</strong></p>
            <div
              className="p-3 border rounded bg-light"
              style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}
            >
              {currentMessage.message}
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="primary"
              onClick={() => {
                setShowReadModal(false);
                setShowRespondModal(true);
              }}
            >
              Respond
            </Button>
            <Button variant="secondary" onClick={() => setShowReadModal(false)}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>

        {/* ====================== RESPOND MODAL ====================== */}
        <Modal show={showRespondModal} onHide={() => setShowRespondModal(false)} size="lg" centered>
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
                onChange={e => setResponseText(e.target.value)}
                className="rounded-3"
                placeholder="Type your response here..."
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowRespondModal(false)} disabled={sending}>
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleRespond}
              disabled={sending || !responseText.trim()}
            >
              {sending ? <>Sending...</> : 'Send Response'}
            </Button>
          </Modal.Footer>
        </Modal>
      </Container>
    </section>
  );
};

export default MessagesList;















// import React, { useState, useEffect, useContext, useMemo } from 'react';
// import {
//   Container, Table, Button, Modal, Form, Alert, Badge, Spinner, Row, Col, ButtonGroup, Pagination
// } from 'react-bootstrap';
// import AdminNav from './AdminNav';
// import { AdminContext } from '../../context/AdminContext';
// import envConfig from '../../config/envConfig';

// const API_URL = envConfig.API_URL;

// const PAGE_SIZE = 10; // Change this to adjust items per page

// const MessagesList = () => {
//   const { token, stats, updateStats } = useContext(AdminContext);
//   const [messages, setMessages] = useState([]);
//   const [error, setError] = useState('');
//   const [loading, setLoading] = useState(true);
//   const [showModal, setShowModal] = useState(false);
//   const [currentMessage, setCurrentMessage] = useState({});
//   const [responseText, setResponseText] = useState('');
//   const [modalError, setModalError] = useState('');
//   const [sending, setSending] = useState(false);

//   // Filter & Pagination State
//   const [filter, setFilter] = useState('all'); // 'all', 'unread', 'read'
//   const [currentPage, setCurrentPage] = useState(1);

//   useEffect(() => {
//     fetchMessages();
//   }, [token]);

//   const fetchMessages = async () => {
//     try {
//       setLoading(true);
//       const response = await fetch(`${API_URL}/admin/messages`, {
//         headers: { Authorization: `Bearer ${token}` }
//       });
//       const data = await response.json();

//       if (response.ok) {
//         setMessages(data || []);
//       } else {
//         setError(data.message);
//       }
//     } catch (err) {
//       setError('Network error');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const markRead = async (id) => {
//     try {
//       const response = await fetch(`${API_URL}/admin/messages/${id}/read`, {
//         method: 'PUT',
//         headers: { Authorization: `Bearer ${token}` }
//       });
//       if (response.ok) {
//         setMessages(prev => prev.map(m => m._id === id ? { ...m, unread: false } : m));
//         updateStats({ ...stats, newMessages: Math.max(0, stats.newMessages - 1) });
//       }
//     } catch (err) {
//       console.error('Failed to mark read');
//     }
//   };

//   const handleRespond = async () => {
//     setSending(true);
//     setModalError('');
//     try {
//       const response = await fetch(`${API_URL}/admin/message/respond`, {
//         method: 'POST',
//         headers: { 
//           'Content-Type': 'application/json', 
//           Authorization: `Bearer ${token}` 
//         },
//         body: JSON.stringify({
//           contactId: currentMessage._id,
//           to: currentMessage.email,
//           subject: `Re: ${currentMessage.subject}`,
//           html: `<!DOCTYPE html>
// <html lang="en">
// <head>
//   <meta charset="UTF-8">
//   <meta name="viewport" content="width=device-width, initial-scale=1.0">
//   <title>Automated Reply</title>
// </head>
// <body style="margin:0; padding:0; background-color:#f7f7f7; font-family: Arial, sans-serif;">
//   <table width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#f7f7f7">
//     <tr>
//       <td align="center">
//         <table width="600" cellpadding="0" cellspacing="0" border="0" bgcolor="#ffffff" style="border:1px solid #ddd;">
//           <tr>
//             <td align="center" bgcolor="#4B0082" style="padding:20px; color:#ffffff; font-size:24px; font-weight:bold;">
//               <img src="https://riggstech.com/logo.png" alt="RiggsTech Logo" width="40" style="vertical-align:middle; display:inline-block; margin-right:10px;">
//               RiggsTech Automated Response
//             </td>
//           </tr>
//           <tr>
//             <td style="padding:20px; font-size:16px; line-height:1.5; color:#333333;">
//               <p>Dear ${currentMessage.name},</p>
//               <p>${responseText}</p>
//               <p style="text-align:center; margin:30px 0;">
//                 <a href="${currentMessage.link}" style="background-color:#4B0082; color:#ffffff; text-decoration:none; padding:12px 25px; border-radius:5px; font-weight:bold; display:inline-block;">
//                   View Your Message
//                 </a>
//               </p>
//               <p>Best regards,<br>RiggsTech Team</p>
//             </td>
//           </tr>
//           <tr>
//             <td bgcolor="#800080" style="padding:15px; text-align:center; color:#ffffff; font-size:14px;">
//               <table align="center" cellpadding="0" cellspacing="0" border="0">
//                 <tr>
//                   <td align="center" style="padding:5px 10px;">
//                     <img src="https://img.icons8.com/ios-filled/50/ffffff/new-post.png" width="16" alt="Email" style="vertical-align:middle; margin-right:5px;">
//                     <a href="mailto:support@riggstech.com" style="color:#ffffff; text-decoration:none;">support@riggstech.com</a>
//                   </td>
//                 </tr>
//                 <tr>
//                   <td align="center" style="padding:5px 10px;">
//                     <img src="https://img.icons8.com/ios-filled/50/ffffff/phone.png" width="16" alt="Phone" style="vertical-align:middle; margin-right:5px;">
//                     +237 123 456 789
//                   </td>
//                 </tr>
//                 <tr>
//                   <td align="center" style="padding:5px 10px;">
//                     <img src="https://img.icons8.com/ios-filled/50/ffffff/marker.png" width="16" alt="Address" style="vertical-align:middle; margin-right:5px;">
//                     123 Tech Street, Yaoundé, Cameroon
//                   </td>
//                 </tr>
//               </table>
//             </td>
//           </tr>
//         </table>
//       </td>
//     </tr>
//   </table>
// </body>
// </html>`
//         })
//       });
      
//       if (response.ok) {
//         setShowModal(false);
//         setResponseText('');
//         markRead(currentMessage._id);
//         alert('Response sent successfully!');
//         fetchMessages();
//       } else {
//         const data = await response.json();
//         setModalError(data.message || 'Failed to send response');
//       }
//     } catch (err) {
//       setModalError('Network error');
//     } finally {
//       setSending(false);
//     }
//   };

//   // === FILTER & PAGINATION LOGIC ===
//   const filteredMessages = useMemo(() => {
//     if (filter === 'unread') return messages.filter(m => m.unread);
//     if (filter === 'read') return messages.filter(m => !m.unread);
//     return messages;
//   }, [messages, filter]);

//   const totalItems = filteredMessages.length;
//   const totalPages = Math.ceil(totalItems / PAGE_SIZE);
//   const startIndex = (currentPage - 1) * PAGE_SIZE;
//   const endIndex = startIndex + PAGE_SIZE;
//   const currentPageMessages = filteredMessages.slice(startIndex, endIndex);

//   // Reset to page 1 when filter changes
//   useEffect(() => {
//     setCurrentPage(1);
//   }, [filter]);

//   const unreadCount = messages.filter(m => m.unread).length;
//   const readCount = messages.filter(m => m.read).length;
 

//   // === PAGINATION CONTROLS ===
//   const renderPagination = () => {
//     if (totalPages <= 1) return null;

//     const pageNumbers = [];
//     const maxVisible = 5;
//     let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2));
//     let endPage = Math.min(totalPages, startPage + maxVisible - 1);

//     if (endPage - startPage + 1 < maxVisible) {
//       startPage = Math.max(1, endPage - maxVisible + 1);
//     }

//     for (let i = startPage; i <= endPage; i++) {
//       pageNumbers.push(
//         <Pagination.Item
//           key={i}
//           active={i === currentPage}
//           onClick={() => setCurrentPage(i)}
//         >
//           {i}
//         </Pagination.Item>
//       );
//     }

//     return (
//       <Pagination className="justify-content-center mt-4">
//         <Pagination.Prev
//           onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
//           disabled={currentPage === 1}
//         />
//         {pageNumbers}
//         <Pagination.Next
//           onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
//           disabled={currentPage === totalPages}
//         />
//       </Pagination>
//     );
//   };

//   if (loading) {
//     return (
//       <div>
//         <section className="py-5 bg-light min-vh-100 d-flex align-items-center justify-content-center">
//           <Container><Spinner animation="border" /></Container>
//         </section>
//       </div>
//     );
//   }

//   return (
//     <div>
//       <section className="py-5 bg-light min-vh-100">
//         <Container>
//           <Row className="justify-content-center mb-4">
//             <Col lg={10}>
//               <h2 className="display-5 fw-bold text-center mb-3">Contact Messages</h2>

//               {/* Filter Buttons */}
//               <div className="d-flex justify-content-center mb-3">
//                 <ButtonGroup>
//                   <Button
//                     variant={filter === 'all' ? 'primary' : 'outline-primary'}
//                     onClick={() => setFilter('all')}
//                     className="px-4"
//                   >
//                     All <Badge bg="light" text="dark" className="ms-1">{messages.length}</Badge>
//                   </Button>
//                   <Button
//                     variant={filter === 'unread' ? 'danger' : 'outline-danger'}
//                     onClick={() => setFilter('unread')}
//                     className="px-4"
//                   >
//                     Unread <Badge bg="light" text="dark" className="ms-1">{unreadCount}</Badge>
//                   </Button>
//                   <Button
//                     variant={filter === 'read' ? 'success' : 'outline-success'}
//                     onClick={() => setFilter('read')}
//                     className="px-4"
//                   >
//                     Read <Badge bg="light" text="dark" className="ms-1">{readCount}</Badge>
//                   </Button>
//                 </ButtonGroup>
//               </div>

//               {/* Page Info */}
//               {totalItems > 0 && (
//                 <div className="text-center text-muted mb-3">
//                   Showing {startIndex + 1}–{Math.min(endIndex, totalItems)} of {totalItems} messages
//                 </div>
//               )}

//               {error && <Alert variant="danger" className="mb-4 text-center rounded-pill">{error}</Alert>}
//             </Col>
//           </Row>

//           {/* Messages Table */}
//           <Table striped bordered hover responsive className="shadow-sm rounded-3 overflow-hidden">
//             <thead className="bg-primary text-white">
//               <tr>
//                 <th>#</th>
//                 <th>Name</th>
//                 <th>Email</th>
//                 <th>Phone</th>
//                 <th>Subject</th>
//                 <th>Message Preview</th>
//                 <th>Status</th>
//                 <th>Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {currentPageMessages.length === 0 ? (
//                 <tr>
//                   <td colSpan="8" className="text-center py-4 text-muted">
//                     {filter === 'all' ? 'No messages' : `No ${filter} messages`}
//                   </td>
//                 </tr>
//               ) : (
//                 currentPageMessages.map((msg, index) => (
//                   <tr key={msg._id}>
//                     <td>{startIndex + index + 1}</td>
//                     <td className="fw-bold">{msg.name}</td>
//                     <td>{msg.email}</td>
//                     <td>{msg.phone}</td>
//                     <td>{msg.subject}</td>
//                     <td>{msg.message.substring(0, 50)}...</td>
//                     <td>
//                       <Badge bg={msg.unread ? 'danger' : 'success'}>
//                         {msg.unread ? 'Unread' : 'Read'}
//                       </Badge>
//                     </td>
//                     <td>
//                       { msg.unread ? <Button
//                         variant="primary" 
//                         size="sm" 
//                         className="me-1" 
//                         onClick={() => {
//                           setCurrentMessage(msg);
//                           setResponseText('');
//                           setShowModal(true);
//                         }}
//                       >
//                         Respond
//                       </Button> : <Button
//                         disabled={msg.read}
//                         variant="primary" 
//                         size="sm" 
//                         className="me-1" 
//                         onClick={() => {
//                           setCurrentMessage(msg);
//                           setResponseText('');
//                           setShowModal(true);
//                         }}
//                       >
//                         Respond
//                       </Button>}
//                       {msg.unread && (
//                         <Button 
//                           variant="outline-secondary" 
//                           size="sm" 
//                           onClick={() => markRead(msg._id)}
//                         >
//                           Mark Read
//                         </Button>
//                       )}
//                     </td>
//                   </tr>
//                 ))
//               )}
//             </tbody>
//           </Table>

//           {/* Pagination */}
//           {renderPagination()}

//           {/* Respond Modal */}
//           <Modal show={showModal} onHide={() => setShowModal(false)} size="lg" centered>
//             <Modal.Header closeButton>
//               <Modal.Title>Respond to {currentMessage.name}</Modal.Title>
//             </Modal.Header>
//             <Modal.Body>
//               {modalError && <Alert variant="danger">{modalError}</Alert>}
//               <Form.Group className="mb-3">
//                 <Form.Label>Email: {currentMessage.email}</Form.Label>
//                 <Form.Control 
//                   as="textarea" 
//                   rows={8} 
//                   value={responseText} 
//                   onChange={(e) => setResponseText(e.target.value)} 
//                   className="rounded-3"
//                   placeholder="Type your response here..."
//                 />
//               </Form.Group>
//             </Modal.Body>
//             <Modal.Footer>
//               <Button variant="secondary" onClick={() => setShowModal(false)} disabled={sending}>
//                 Cancel
//               </Button>
//               <Button 
//                 variant="primary" 
//                 onClick={handleRespond} 
//                 disabled={sending || !responseText.trim()}
//               >
//                 {sending ? <><Spinner size="sm" className="me-2" />Sending...</> : 'Send Response'}
//               </Button>
//             </Modal.Footer>
//           </Modal>
//         </Container>
//       </section>
//     </div>
//   );
// };

// export default MessagesList;











// // import React, { useState, useEffect, useContext, useMemo } from 'react';
// // import { 
// //   Container, Table, Button, Modal, Form, Alert, Badge, Spinner, Row, Col, ButtonGroup 
// // } from 'react-bootstrap';
// // import AdminNav from './AdminNav';
// // import { AdminContext } from '../../context/AdminContext';
// // import envConfig from '../../config/envConfig';

// // const API_URL = envConfig.API_URL;

// // const MessagesList = () => {
// //   const { token, stats, updateStats } = useContext(AdminContext);
// //   const [messages, setMessages] = useState([]);
// //   const [error, setError] = useState('');
// //   const [loading, setLoading] = useState(true);
// //   const [showModal, setShowModal] = useState(false);
// //   const [currentMessage, setCurrentMessage] = useState({});
// //   const [responseText, setResponseText] = useState('');
// //   const [modalError, setModalError] = useState('');
// //   const [sending, setSending] = useState(false);

// //   // Filter state
// //   const [filter, setFilter] = useState('all'); // 'all', 'unread', 'read'

// //   useEffect(() => {
// //     fetchMessages();
// //   }, [token]);

// //   const fetchMessages = async () => {
// //     try {
// //       setLoading(true);
// //       const response = await fetch(`${API_URL}/admin/messages`, {
// //         headers: { Authorization: `Bearer ${token}` }
// //       });
// //       const data = await response.json();

// //       if (response.ok) {
// //         setMessages(data || []);
// //       } else {
// //         setError(data.message);
// //       }
// //     } catch (err) {
// //       setError('Network error');
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   const markRead = async (id) => {
// //     try {
// //       const response = await fetch(`${API_URL}/admin/messages/${id}/read`, {
// //         method: 'PUT',
// //         headers: { Authorization: `Bearer ${token}` }
// //       });
// //       if (response.ok) {
// //         setMessages(prev => prev.map(m => m._id === id ? { ...m, unread: false } : m));
// //         updateStats({ ...stats, newMessages: Math.max(0, stats.newMessages - 1) });
// //       }
// //     } catch (err) {
// //       console.error('Failed to mark read');
// //     }
// //   };

// //   const handleRespond = async () => {
// //     setSending(true);
// //     setModalError('');
// //     try {
// //       const response = await fetch(`${API_URL}/admin/message/respond`, {
// //         method: 'POST',
// //         headers: { 
// //           'Content-Type': 'application/json', 
// //           Authorization: `Bearer ${token}` 
// //         },
// //         body: JSON.stringify({
// //           contactId: currentMessage._id,
// //           to: currentMessage.email,
// //           subject: `Re: ${currentMessage.subject}`,
// //           html: `<!DOCTYPE html>
// // <html lang="en">
// // <head>
// //   <meta charset="UTF-8">
// //   <meta name="viewport" content="width=device-width, initial-scale=1.0">
// //   <title>Automated Reply</title>
// // </head>
// // <body style="margin:0; padding:0; background-color:#f7f7f7; font-family: Arial, sans-serif;">
// //   <table width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#f7f7f7">
// //     <tr>
// //       <td align="center">
// //         <table width="600" cellpadding="0" cellspacing="0" border="0" bgcolor="#ffffff" style="border:1px solid #ddd;">
// //           <tr>
// //             <td align="center" bgcolor="#4B0082" style="padding:20px; color:#ffffff; font-size:24px; font-weight:bold;">
// //               <img src="https://riggstech.com/logo.png" alt="RiggsTech Logo" width="40" style="vertical-align:middle; display:inline-block; margin-right:10px;">
// //               RiggsTech Automated Response
// //             </td>
// //           </tr>
// //           <tr>
// //             <td style="padding:20px; font-size:16px; line-height:1.5; color:#333333;">
// //               <p>Dear ${currentMessage.name},</p>
// //               <p>${responseText}</p>
// //               <p style="text-align:center; margin:30px 0;">
// //                 <a href="${currentMessage.link}" style="background-color:#4B0082; color:#ffffff; text-decoration:none; padding:12px 25px; border-radius:5px; font-weight:bold; display:inline-block;">
// //                   View Your Message
// //                 </a>
// //               </p>
// //               <p>Best regards,<br>RiggsTech Team</p>
// //             </td>
// //           </tr>
// //           <tr>
// //             <td bgcolor="#800080" style="padding:15px; text-align:center; color:#ffffff; font-size:14px;">
// //               <table align="center" cellpadding="0" cellspacing="0" border="0">
// //                 <tr>
// //                   <td align="center" style="padding:5px 10px;">
// //                     <img src="https://img.icons8.com/ios-filled/50/ffffff/new-post.png" width="16" alt="Email" style="vertical-align:middle; margin-right:5px;">
// //                     <a href="mailto:support@riggstech.com" style="color:#ffffff; text-decoration:none;">support@riggstech.com</a>
// //                   </td>
// //                 </tr>
// //                 <tr>
// //                   <td align="center" style="padding:5px 10px;">
// //                     <img src="https://img.icons8.com/ios-filled/50/ffffff/phone.png" width="16" alt="Phone" style="vertical-align:middle; margin-right:5px;">
// //                     +237 123 456 789
// //                   </td>
// //                 </tr>
// //                 <tr>
// //                   <td align="center" style="padding:5px 10px;">
// //                     <img src="https://img.icons8.com/ios-filled/50/ffffff/marker.png" width="16" alt="Address" style="vertical-align:middle; margin-right:5px;">
// //                     123 Tech Street, Yaoundé, Cameroon
// //                   </td>
// //                 </tr>
// //               </table>
// //             </td>
// //           </tr>
// //         </table>
// //       </td>
// //     </tr>
// //   </table>
// // </body>
// // </html>`
// //         })
// //       });
      
// //       if (response.ok) {
// //         setShowModal(false);
// //         setResponseText('');
// //         markRead(currentMessage._id);
// //         alert('Response sent successfully!');
// //         fetchMessages();
// //       } else {
// //         const data = await response.json();
// //         setModalError(data.message || 'Failed to send response');
// //       }
// //     } catch (err) {
// //       setModalError('Network error');
// //     } finally {
// //       setSending(false);
// //     }
// //   };

// //   // Filter messages based on status
// //   const filteredMessages = useMemo(() => {
// //     if (filter === 'unread') return messages.filter(m => m.unread);
// //     if (filter === 'read') return messages.filter(m => !m.unread);
// //     return messages;
// //   }, [messages, filter]);

// //   // Count unread/read
// //   const unreadCount = messages.filter(m => m.unread).length;
// //   const readCount = messages.filter(m => !m.unread).length;

// //   if (loading) {
// //     return (
// //       <div>
// //         <section className="py-5 bg-light min-vh-100 d-flex align-items-center justify-content-center">
// //           <Container><Spinner animation="border" /></Container>
// //         </section>
// //       </div>
// //     );
// //   }

// //   return (
// //     <div>
// //       <section className="py-5 bg-light min-vh-100">
// //         <Container>
// //           <Row className="justify-content-center mb-4">
// //             <Col lg={10}>
// //               <h2 className="display-5 fw-bold text-center mb-3">Contact Messages</h2>

// //               {/* Filter Buttons */}
// //               <div className="d-flex justify-content-center mb-4">
// //                 <ButtonGroup>
// //                   <Button
// //                     variant={filter === 'all' ? 'primary' : 'outline-primary'}
// //                     onClick={() => setFilter('all')}
// //                     className="px-4"
// //                   >
// //                     All <Badge bg="light" text="dark" className="ms-1">{messages.length}</Badge>
// //                   </Button>
// //                   <Button
// //                     variant={filter === 'unread' ? 'danger' : 'outline-danger'}
// //                     onClick={() => setFilter('unread')}
// //                     className="px-4"
// //                   >
// //                     Unread <Badge bg="light" text="dark" className="ms-1">{unreadCount}</Badge>
// //                   </Button>
// //                   <Button
// //                     variant={filter === 'read' ? 'success' : 'outline-success'}
// //                     onClick={() => setFilter('read')}
// //                     className="px-4"
// //                   >
// //                     Read <Badge bg="light" text="dark" className="ms-1">{readCount}</Badge>
// //                   </Button>
// //                 </ButtonGroup>
// //               </div>

// //               {error && <Alert variant="danger" className="mb-4 text-center rounded-pill">{error}</Alert>}
// //             </Col>
// //           </Row>

// //           <Table striped bordered hover responsive className="shadow-sm rounded-3 overflow-hidden">
// //             <thead className="bg-primary text-white">
// //               <tr>
// //                 <th>#</th>
// //                 <th>Name</th>
// //                 <th>Email</th>
// //                 <th>Phone</th>
// //                 <th>Subject</th>
// //                 <th>Message Preview</th>
// //                 <th>Status</th>
// //                 <th>Actions</th>
// //               </tr>
// //             </thead>
// //             <tbody>
// //               {filteredMessages.length === 0 ? (
// //                 <tr>
// //                   <td colSpan="8" className="text-center py-4 text-muted">
// //                     {filter === 'all' ? 'No messages' : `No ${filter} messages`}
// //                   </td>
// //                 </tr>
// //               ) : (
// //                 filteredMessages.map((msg, index) => (
// //                   <tr key={msg._id}>
// //                     <td>{index + 1}</td>
// //                     <td className="fw-bold">{msg.name}</td>
// //                     <td>{msg.email}</td>
// //                     <td>{msg.phone}</td>
// //                     <td>{msg.subject}</td>
// //                     <td>{msg.message.substring(0, 50)}...</td>
// //                     <td>
// //                       <Badge bg={msg.unread ? 'danger' : 'success'}>
// //                         {msg.unread ? 'Unread' : 'Read'}
// //                       </Badge>
// //                     </td>
// //                     <td>
// //                       <Button 
// //                         variant="primary" 
// //                         size="sm" 
// //                         className="me-1" 
// //                         onClick={() => {
// //                           setCurrentMessage(msg);
// //                           setResponseText('');
// //                           setShowModal(true);
// //                         }}
// //                       >
// //                         Respond
// //                       </Button>
// //                       {msg.unread && (
// //                         <Button 
// //                           variant="outline-secondary" 
// //                           size="sm" 
// //                           onClick={() => markRead(msg._id)}
// //                         >
// //                           Mark Read
// //                         </Button>
// //                       )}
// //                     </td>
// //                   </tr>
// //                 ))
// //               )}
// //             </tbody>
// //           </Table>

// //           {/* Respond Modal */}
// //           <Modal show={showModal} onHide={() => setShowModal(false)} size="lg" centered>
// //             <Modal.Header closeButton>
// //               <Modal.Title>Respond to {currentMessage.name}</Modal.Title>
// //             </Modal.Header>
// //             <Modal.Body>
// //               {modalError && <Alert variant="danger">{modalError}</Alert>}
// //               <Form.Group className="mb-3">
// //                 <Form.Label>Email: {currentMessage.email}</Form.Label>
// //                 <Form.Control 
// //                   as="textarea" 
// //                   rows={8} 
// //                   value={responseText} 
// //                   onChange={(e) => setResponseText(e.target.value)} 
// //                   className="rounded-3"
// //                   placeholder="Type your response here..."
// //                 />
// //               </Form.Group>
// //             </Modal.Body>
// //             <Modal.Footer>
// //               <Button variant="secondary" onClick={() => setShowModal(false)} disabled={sending}>
// //                 Cancel
// //               </Button>
// //               <Button 
// //                 variant="primary" 
// //                 onClick={handleRespond} 
// //                 disabled={sending || !responseText.trim()}
// //               >
// //                 {sending ? <><Spinner size="sm" className="me-2" />Sending...</> : 'Send Response'}
// //               </Button>
// //             </Modal.Footer>
// //           </Modal>
// //         </Container>
// //       </section>
// //     </div>
// //   );
// // };

// // export default MessagesList;



















// // import React, { useState, useEffect, useContext } from 'react';
// // import { Container, Table, Button, Modal, Form, Alert, Badge, Spinner,Row,Col } from 'react-bootstrap';
// // import AdminNav from './AdminNav';  // ✅ CORRECT IMPORT
// // import { AdminContext } from '../../context/AdminContext';
// // import envConfig from '../../config/envConfig';

// // const API_URL = envConfig.API_URL;

// // const MessagesList = () => {
// //   const { token, stats, updateStats } = useContext(AdminContext);
// //   const [messages, setMessages] = useState([]);
// //   const [error, setError] = useState('');
// //   const [loading, setLoading] = useState(true);
// //   const [showModal, setShowModal] = useState(false);
// //   const [currentMessage, setCurrentMessage] = useState({});
// //   const [responseText, setResponseText] = useState('');
// //   const [modalError, setModalError] = useState('');
// //   const [sending, setSending] = useState(false);

// //   useEffect(() => {
// //     fetchMessages();
// //   }, [token]);

// //   const fetchMessages = async () => {
// //     try {
// //       setLoading(true);
// //       const response = await fetch(`${API_URL}/admin/messages`, {
// //         headers: { Authorization: `Bearer ${token}` }
// //       });
// //       const data = await response.json();

// //       if (response.ok) {
// //         setMessages(data || []);
// //       } else {
// //         setError(data.message);
// //       }
// //     } catch (err) {
// //       setError('Network error');
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   const markRead = async (id) => {
// //     try {
// //       const response = await fetch(`/api/admin/messages/${id}/read`, {
// //         method: 'PUT',
// //         headers: { Authorization: `Bearer ${token}` }
// //       });
// //       if (response.ok) {
// //         setMessages(messages.map(m => m.id === id ? { ...m, unread: false } : m));
// //         updateStats({ ...stats, newMessages: Math.max(0, stats.newMessages - 1) });
// //       }
// //     } catch (err) {
// //       console.error('Failed to mark read');
// //     }
// //   };

// //   const handleRespond = async () => {
// //     setSending(true);
// //     setModalError('');
// //     try {
// //       const response = await fetch(`${API_URL}/admin/message/respond`, {
// //         method: 'POST',
// //         headers: { 
// //           'Content-Type': 'application/json', 
// //           Authorization: `Bearer ${token}` 
// //         },
// //         body: JSON.stringify({
// //           contactId: currentMessage._id,
// //           to: currentMessage.email,
// //           subject: `Re: ${currentMessage.subject}`,
// //           html: `<!DOCTYPE html>
// // <html lang="en">
// // <head>
// //   <meta charset="UTF-8">
// //   <meta name="viewport" content="width=device-width, initial-scale=1.0">
// //   <title>Automated Reply</title>
// // </head>
// // <body style="margin:0; padding:0; background-color:#f7f7f7; font-family: Arial, sans-serif;">
// //   <table width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#f7f7f7">
// //     <tr>
// //       <td align="center">
// //         <!-- Container -->
// //         <table width="600" cellpadding="0" cellspacing="0" border="0" bgcolor="#ffffff" style="border:1px solid #ddd;">
          
// //           <!-- Header -->
// //           <tr>
// //             <td align="center" bgcolor="#4B0082" style="padding:20px; color:#ffffff; font-size:24px; font-weight:bold;">
// //               <img src="https://riggstech.com/logo.png" alt="RiggsTech Logo" width="40" style="vertical-align:middle; display:inline-block; margin-right:10px;">
// //               RiggsTech Automated Response
// //             </td>
// //           </tr>

// //           <!-- Body -->
// //           <tr>
// //             <td style="padding:20px; font-size:16px; line-height:1.5; color:#333333;">
// //               <p>Dear ${currentMessage.name},</p>
// //               <p>${responseText}</p>
// //               <p style="text-align:center; margin:30px 0;">
// //                 <!-- Personalized CTA Button -->
// //                 <a href="${currentMessage.link}" style="background-color:#4B0082; color:#ffffff; text-decoration:none; padding:12px 25px; border-radius:5px; font-weight:bold; display:inline-block;">
// //                   View Your Message
// //                 </a>
// //               </p>
// //               <p>Best regards,<br>RiggsTech Team</p>
// //             </td>
// //           </tr>

// //           <!-- Footer -->
// //           <tr>
// //             <td bgcolor="#800080" style="padding:15px; text-align:center; color:#ffffff; font-size:14px;">
// //               <table align="center" cellpadding="0" cellspacing="0" border="0">
// //                 <tr>
// //                   <td align="center" style="padding:5px 10px;">
// //                     <img src="https://img.icons8.com/ios-filled/50/ffffff/new-post.png" width="16" alt="Email" style="vertical-align:middle; margin-right:5px;">
// //                     <a href="mailto:support@riggstech.com" style="color:#ffffff; text-decoration:none;">support@riggstech.com</a>
// //                   </td>
// //                 </tr>
// //                 <tr>
// //                   <td align="center" style="padding:5px 10px;">
// //                     <img src="https://img.icons8.com/ios-filled/50/ffffff/phone.png" width="16" alt="Phone" style="vertical-align:middle; margin-right:5px;">
// //                     +237 123 456 789
// //                   </td>
// //                 </tr>
// //                 <tr>
// //                   <td align="center" style="padding:5px 10px;">
// //                     <img src="https://img.icons8.com/ios-filled/50/ffffff/marker.png" width="16" alt="Address" style="vertical-align:middle; margin-right:5px;">
// //                     123 Tech Street, Yaoundé, Cameroon
// //                   </td>
// //                 </tr>
// //               </table>
// //             </td>
// //           </tr>

// //         </table>
// //       </td>
// //     </tr>
// //   </table>
// // </body>
// // </html>
// // `
// //         })
// //       });
      
// //       if (response.ok) {
// //         setShowModal(false);
// //         markRead(currentMessage._id);
// //         setResponseText('');
// //         alert('Response sent successfully!');
// //         fetchMessages(); // Refresh list
// //       } else {
// //         const data = await response.json();
// //         setModalError(data.message || 'Failed to send response');
// //       }
// //     } catch (err) {
// //       setModalError('Network error');
// //     } finally {
// //       setSending(false);
// //     }
// //   };

// //   if (loading) {
// //     return (
// //       <div>
// //         <section className="py-5 bg-light min-vh-100 d-flex align-items-center justify-content-center">
// //           <Container><Spinner animation="border" /></Container>
// //         </section>
// //       </div>
// //     );
// //   }

// //   return (
// //     <div>
// //       <section className="py-5 bg-light min-vh-100">
// //         <Container>
// //           <Row className="justify-content-center mb-5">
// //             <Col lg={10}>
// //               <h2 className="display-5 fw-bold text-center mb-4">Contact Messages ({messages.length})</h2>
// //               {error && <Alert variant="danger" className="mb-4 text-center rounded-pill">{error}</Alert>}
// //             </Col>
// //           </Row>

// //           <Table striped bordered hover responsive className="shadow-sm rounded-3 overflow-hidden">
// //             <thead className="bg-primary text-white">
// //               <tr>
// //                 <th>#</th>
// //                 <th>Name</th>
// //                 <th>Email</th>
// //                 <th>Phone</th>
// //                 <th>Subject</th>
// //                 <th>Message Preview</th>
// //                 <th>Status</th>
// //                 <th>Actions</th>
// //               </tr>
// //             </thead>
// //             <tbody>
// //               {messages.length === 0 ? (
// //                 <tr><td colSpan="8" className="text-center py-4">No messages</td></tr>
// //               ) : (
// //                 messages.map((msg, index) => (
// //                   <tr key={msg._id}>
// //                     <td>{index + 1}</td>
// //                     <td className="fw-bold">{msg.name}</td>
// //                     <td>{msg.email}</td>
// //                     <td>{msg.phone}</td>
// //                     <td>{msg.subject}</td>
// //                     <td>{msg.message.substring(0, 50)}...</td>
// //                     <td>
// //                       <Badge bg={msg.unread ? 'danger' : 'success'}>
// //                         {msg.unread ? 'Unread' : 'Read'}
// //                       </Badge>
// //                     </td>
// //                     <td>
// //                       <Button 
// //                         variant="primary" 
// //                         size="sm" 
// //                         className="me-1" 
// //                         onClick={() => {
// //                           setCurrentMessage(msg);
// //                           setResponseText('');
// //                           setShowModal(true);
// //                         }}
// //                       >
// //                         Respond
// //                       </Button>
// //                       {msg.unread && (
// //                         <Button 
// //                           variant="outline-secondary" 
// //                           size="sm" 
// //                           onClick={() => markRead(msg._id)}
// //                         >
// //                           Mark Read
// //                         </Button>
// //                       )}
// //                     </td>
// //                   </tr>
// //                 ))
// //               )}
// //             </tbody>
// //           </Table>

// //           {/* Respond Modal */}
// //           <Modal show={showModal} onHide={() => setShowModal(false)} size="lg" centered>
// //             <Modal.Header closeButton>
// //               <Modal.Title>Respond to {currentMessage.name}</Modal.Title>
// //             </Modal.Header>
// //             <Modal.Body>
// //               {modalError && <Alert variant="danger">{modalError}</Alert>}
// //               <Form.Group className="mb-3">
// //                 <Form.Label>Email: {currentMessage.email}</Form.Label>
// //                 <Form.Control 
// //                   as="textarea" 
// //                   rows={8} 
// //                   value={responseText} 
// //                   onChange={(e) => setResponseText(e.target.value)} 
// //                   className="rounded-3"
// //                   placeholder="Type your response here..."
// //                 />
// //               </Form.Group>
// //             </Modal.Body>
// //             <Modal.Footer>
// //               <Button variant="secondary" onClick={() => setShowModal(false)} disabled={sending}>
// //                 Cancel
// //               </Button>
// //               <Button variant="primary" onClick={handleRespond} disabled={sending || !responseText.trim()}>
// //                 {sending ? <><Spinner size="sm" className="me-2" />Sending...</> : 'Send Response'}
// //               </Button>
// //             </Modal.Footer>
// //           </Modal>
// //         </Container>
// //       </section>
// //     </div>
// //   );
// // };

// // export default MessagesList;












// // import React, { useState, useEffect, useContext } from 'react';
// // import { Container, Table, Button, Modal, Form, Alert,Spinner, Badge } from 'react-bootstrap';
// // import AdminNav from './AdminNav';
// // import { AdminContext } from '../../context/AdminContext';

// // const MessagesList = () => {
// //   const { token, updateStats } = useContext(AdminContext);
// //   const [messages, setMessages] = useState([]);
// //   const [error, setError] = useState('');
// //   const [showModal, setShowModal] = useState(false);
// //   const [currentMessage, setCurrentMessage] = useState({});
// //   const [responseText, setResponseText] = useState('');
// //   const [modalError, setModalError] = useState('');
// //   const [loading, setLoading] = useState(false);

// //   useEffect(() => {
// //     const fetchMessages = async () => {
// //       try {
// //         const response = await fetch('/api/admin/messages', {
// //           headers: { Authorization: `Bearer ${token}` }
// //         });
// //         const data = await response.json();
// //         if (data.success) {
// //           setMessages(data.messages);
// //         } else {
// //           setError(data.message);
// //         }
// //       } catch (err) {
// //         setError('Network error');
// //       }
// //     };
// //     if (token) fetchMessages();
// //   }, [token]);

// //   const markRead = async (id) => {
// //     try {
// //       const response = await fetch(`/api/admin/messages/${id}/read`, {
// //         method: 'PUT',
// //         headers: { Authorization: `Bearer ${token}` }
// //       });
// //       const data = await response.json();
// //       if (data.success) {
// //         const updatedMessages = messages.map(m => m._id === id ? { ...m, unread: false } : m);
// //         setMessages(updatedMessages);
// //         // eslint-disable-next-line no-undef
// //         updateStats({ ...stats, newMessages: stats.newMessages - 1 });
// //       }
// //     } catch (err) {
// //       console.error(err);
// //     }
// //   };

// //   const handleRespond = async () => {
// //     setLoading(true);
// //     setModalError('');
// //     try {
// //       const response = await fetch('/api/admin/respond-message', {
// //         method: 'POST',
// //         headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
// //         body: JSON.stringify({
// //           contactId: currentMessage._id,
// //           to: currentMessage.email,
// //           subject: `Re: ${currentMessage.subject}`,
// //           html: responseText
// //         })
// //       });
// //       const data = await response.json();
// //       if (data.success) {
// //         setShowModal(false);
// //         markRead(currentMessage._id);
// //       } else {
// //         setModalError(data.message || 'Failed to send');
// //       }
// //     } catch (err) {
// //       setModalError('Network error');
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   return (
// //     <section className="py-5 bg-light min-vh-100">
// //       <AdminNav />
// //       <Container>
// //         <h2 className="display-5 fw-bold mb-5 text-center">Contact Messages</h2>
// //         {error && <Alert variant="danger" className="mb-4 text-center">{error}</Alert>}
// //         <Table striped bordered hover responsive className="shadow-sm">
// //           <thead className="bg-primary text-white">
// //             <tr>
// //               <th>Name</th>
// //               <th>Email</th>
// //               <th>Phone</th>
// //               <th>Subject</th>
// //               <th>Message</th>
// //               <th>Status</th>
// //               <th>Actions</th>
// //             </tr>
// //           </thead>
// //           <tbody>
// //             {messages.length === 0 ? (
// //               <tr><td colSpan="7" className="text-center">No messages</td></tr>
// //             ) : (
// //               messages.map((msg) => (
// //                 <tr key={msg._id}>
// //                   <td>{msg.name}</td>
// //                   <td>{msg.email}</td>
// //                   <td>{msg.phone}</td>
// //                   <td>{msg.subject}</td>
// //                   <td>{msg.message}</td>
// //                   <td>
// //                     <Badge bg={msg.unread ? 'danger' : 'success'}>
// //                       {msg.unread ? 'Unread' : 'Read'}
// //                     </Badge>
// //                   </td>
// //                   <td>
// //                     <Button 
// //                       variant="primary" 
// //                       size="sm" 
// //                       className="me-2" 
// //                       onClick={() => {
// //                         setCurrentMessage(msg);
// //                         setResponseText('');
// //                         setShowModal(true);
// //                       }}
// //                     >
// //                       Respond
// //                     </Button>
// //                     {msg.unread && (
// //                       <Button variant="secondary" size="sm" onClick={() => markRead(msg._id)}>
// //                         Mark Read
// //                       </Button>
// //                     )}
// //                   </td>
// //                 </tr>
// //               ))
// //             )}
// //           </tbody>
// //         </Table>

// //         {/* Respond Modal */}
// //         <Modal show={showModal} onHide={() => setShowModal(false)} centered>
// //           <Modal.Header closeButton>
// //             <Modal.Title>Respond to {currentMessage.name}</Modal.Title>
// //           </Modal.Header>
// //           <Modal.Body>
// //             {modalError && <Alert variant="danger">{modalError}</Alert>}
// //             <Form.Group className="mb-3">
// //               <Form.Label>Response Message</Form.Label>
// //               <Form.Control 
// //                 as="textarea" 
// //                 rows={6} 
// //                 value={responseText} 
// //                 onChange={(e) => setResponseText(e.target.value)} 
// //                 className="rounded-3"
// //               />
// //             </Form.Group>
// //           </Modal.Body>
// //           <Modal.Footer>
// //             <Button variant="secondary" onClick={() => setShowModal(false)} disabled={loading}>
// //               Cancel
// //             </Button>
// //             <Button variant="primary" onClick={handleRespond} disabled={loading}>
// //               {loading ? <Spinner animation="border" size="sm" className="me-2" /> : null}
// //               {loading ? 'Sending...' : 'Send Response'}
// //             </Button>
// //           </Modal.Footer>
// //         </Modal>
// //       </Container>
// //     </section>
// //   );
// // };

// // export default MessagesList;