import React, { useState, useEffect, useContext } from 'react';
import { Container, Row, Col, Card, Button, Form, Alert, Spinner, Modal, Table, Badge } from 'react-bootstrap';
import { FaPlus, FaUsers, FaPaperPlane, FaCommentDots, FaTimes } from 'react-icons/fa';
import { AdminContext } from '../../context/AdminContext';  // Assume extended with socket.io

// Extend AdminContext with socket if needed (in context/AdminContext.js)
// const socket = io('/'); // Add socket to context

const MessagesUI = () => {
  const { token, isAdmin } = useContext(AdminContext);
  const [rooms, setRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [newRoomName, setNewRoomName] = useState('');
  const [addUserEmail, setAddUserEmail] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const socket = useContext(AdminContext).socket;  // Assume socket in context

  useEffect(() => {
    fetchRooms();
  }, [token]);

  useEffect(() => {
    if (socket) {
      socket.on('message', (msg) => {
        if (msg.roomId === selectedRoom?._id) {
          setMessages(prev => [...prev, msg]);
        }
      });

      return () => socket.off('message');
    }
  }, [socket, selectedRoom]);

  const fetchRooms = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/rooms', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      setRooms(data || []);
    } catch (err) {
      setError('Failed to load rooms');
    } finally {
      setLoading(false);
    }
  };

  const createRoom = async () => {
    if (!isAdmin) return setError('Only admin can create rooms');

    setLoading(true);
    try {
      const response = await fetch('/api/rooms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ name: newRoomName })
      });
      const data = await response.json();
      if (data.success) {
        setShowCreateModal(false);
        setNewRoomName('');
        fetchRooms();
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Failed to create room');
    } finally {
      setLoading(false);
    }
  };

  const addUserToRoom = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/room/${selectedRoom._id}/add-user`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ email: addUserEmail })
      });
      const data = await response.json();
      if (data.success) {
        setShowAddUserModal(false);
        setAddUserEmail('');
        setSelectedRoom(data.room);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Failed to add user');
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = () => {
    if (!newMessage.trim() || !selectedRoom) return;

    socket.emit('message', { roomId: selectedRoom._id, content: newMessage });
    setNewMessage('');
  };

  const loadRoomMessages = async (room) => {
    setSelectedRoom(room);
    setLoading(true);
    try {
      const response = await fetch(`/api/rooms/${room._id}/messages`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      setMessages(data.messages || []);
    } catch (err) {
      setError('Failed to load messages');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-5 bg-light" id="messages-ui">
      <Container>
        <Row className="justify-content-center mb-5">
          <Col lg={8} className="text-center">
            <div className="icon-wrapper mb-3">
              <FaCommentDots size={50} className="text-primary" />
            </div>
            <h2 className="display-5 fw-bold mb-3">Messages & Rooms</h2>
            <p className="lead text-muted">
              Manage and chat in rooms
            </p>
            {isAdmin && (
              <Button variant="primary" className="rounded-pill px-4" onClick={() => setShowCreateModal(true)}>
                <FaPlus className="me-2" /> Create Room
              </Button>
            )}
          </Col>
        </Row>

        {error && <Alert variant="danger" className="mb-4">{error}</Alert>}

        {/* Rooms List */}
        <Row>
          <Col lg={4}>
            <Card className="shadow-sm border-0 mb-4">
              <Card.Body className="p-4">
                <h5 className="fw-bold mb-3">Your Rooms</h5>
                <Table striped hover responsive>
                  <tbody>
                    {rooms.map((room) => (
                      <tr key={room._id} onClick={() => loadRoomMessages(room)} style={{ cursor: 'pointer' }}>
                        <td>
                          {room.name}
                          <Badge bg="info" className="ms-2">{room.users.length} users</Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Card.Body>
            </Card>
          </Col>

          {/* Chat Area */}
          <Col lg={8}>
            {selectedRoom ? (
              <Card className="shadow-sm border-0">
                <Card.Body className="p-4">
                  <h5 className="fw-bold mb-3">{selectedRoom.name}</h5>
                  {isAdmin && (
                    <Button variant="outline-primary" className="mb-3" onClick={() => setShowAddUserModal(true)}>
                      <FaUsers className="me-2" /> Add User
                    </Button>
                  )}
                  <div className="chat-messages" style={{ height: '400px', overflowY: 'scroll', border: '1px solid #ddd', padding: '1rem', marginBottom: '1rem' }}>
                    {messages.map((msg) => (
                      <div key={msg.id} className="mb-2">
                        <strong>{msg.senderName}: </strong>{msg.content}
                      </div>
                    ))}
                  </div>
                  <Form.Group className="d-flex">
                    <Form.Control 
                      type="text" 
                      value={newMessage} 
                      onChange={(e) => setNewMessage(e.target.value)} 
                      placeholder="Type message..."
                      className="rounded-pill me-2"
                    />
                    <Button variant="primary" className="rounded-pill" onClick={sendMessage}>
                      <FaPaperPlane />
                    </Button>
                  </Form.Group>
                </Card.Body>
              </Card>
            ) : (
              <Alert variant="info" className="text-center">
                Select a room to start chatting
              </Alert>
            )}
          </Col>
        </Row>

        {/* Create Room Modal */}
        <Modal show={showCreateModal} onHide={() => setShowCreateModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Create New Room</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Group>
              <Form.Label>Room Name</Form.Label>
              <Form.Control value={newRoomName} onChange={(e) => setNewRoomName(e.target.value)} />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowCreateModal(false)} disabled={loading}>
              Cancel
            </Button>
            <Button variant="primary" onClick={createRoom} disabled={loading}>
              {loading ? <Spinner size="sm" /> : 'Create'}
            </Button>
          </Modal.Footer>
        </Modal>

        {/* Add User Modal */}
        <Modal show={showAddUserModal} onHide={() => setShowAddUserModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Add User to {selectedRoom?.name}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Group>
              <Form.Label>User Email</Form.Label>
              <Form.Control value={addUserEmail} onChange={(e) => setAddUserEmail(e.target.value)} />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowAddUserModal(false)} disabled={loading}>
              Cancel
            </Button>
            <Button variant="primary" onClick={addUserToRoom} disabled={loading}>
              {loading ? <Spinner size="sm" /> : 'Add'}
            </Button>
          </Modal.Footer>
        </Modal>
      </Container>
    </section>
  );
};

export default MessagesUI;