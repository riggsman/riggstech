import React, { useState, useEffect, useContext, useRef } from "react";
import { Container, Row, Col, Card, Button, Form, Alert, Table, Modal } from "react-bootstrap";
import { FaPlus, FaUsers, FaPaperPlane, FaCommentDots } from "react-icons/fa";
import { UserContext } from "../context/UserContext";
import { useSocket } from "../context/SocketContext";
import envConfig from "../config/envConfig";


const API_URL = envConfig.API_URL;

const MessagesUI = () => {
  const { token, isUser, userId, user } = useContext(UserContext);
  const socket = useSocket();
  const chatEndRef = useRef(null);

  const [rooms, setRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [newRoomName, setNewRoomName] = useState("");
  const [addUserEmail, setAddUserEmail] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // --- Fetch rooms ---
  const fetchRooms = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/room/get`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setRooms(data || []);
    } catch {
      setError("Failed to load rooms");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchRooms();
  }, [token]);

  // --- Load messages for selected room ---
  const loadRoomMessages = async (room) => {
    setSelectedRoom(room);
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/room/${room.id}/messages`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      console.log("messages from server", data);
      setMessages(data || []);
    } catch {
      setError("Failed to load messages");
    } finally {
      setLoading(false);
    }

    // Join Socket.IO room
    if (socket && room?.id) {
      socket.emit("join_room", { room_id: room.id });
    }
  };

const selectedRoomRef = useRef(selectedRoom);

useEffect(() => {
  selectedRoomRef.current = selectedRoom;
}, [selectedRoom]);

  // --- Listen for incoming messages ---
//   useEffect(() => {
//     if (!socket) return;

//     const handleNewMessage = (msg) => {
//       if (String(msg.room_id) === String(selectedRoom?.id)) {
//         setMessages((prev) => [...prev, msg]);
//       }
//     };

//     socket.on("new_message", handleNewMessage);
//     socket.on("system_message", (msg) => console.log("System:", msg));

//     return () => {
//       socket.off("new_message", handleNewMessage);
//     };
//   }, [socket, selectedRoom]);
useEffect(() => {
  if (!socket) return;

  const handleNewMessage = (msg) => {
    // Always check against the current selected room
    if (msg.room_id === selectedRoomRef.current?.id) {
      setMessages((prev) => [...prev, msg]);
    }
  };

  socket.on("new_message", handleNewMessage);

  return () => {
    socket.off("new_message", handleNewMessage);
  };
}, [socket]);

  // --- Auto scroll chat ---
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // --- Send message ---
  const sendMessage = () => {
    if (!socket?.connected) return setError("Socket not connected yet.");
    if (!newMessage.trim() || !selectedRoom) return;


    // const tempMessage = {
    //     id: `temp-${Date.now()}`,  // temporary unique ID
    //     room_id: selectedRoom.id,
    //     sender_id: userId,
    //     content: newMessage,
    //     timestamp: new Date().toISOString()
    // };

    // // Optimistically update UI
    // setMessages(prev => [...prev, tempMessage]);


    socket.emit("send_message", {
      room_id: selectedRoom.id,
      sender_id: user.user_id,
      content: newMessage,
    });
    setNewMessage("");
  };

  // --- Create room ---
  const createRoom = async () => {
    if (!isUser) return setError("Only users can create rooms");
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/room/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ name: newRoomName }),
      });
      const data = await res.json();
      if (data.success) {
        setShowCreateModal(false);
        setNewRoomName("");
        fetchRooms();
      } else setError(data.message);
    } catch {
      setError("Failed to create room");
    } finally {
      setLoading(false);
    }
  };

  // --- Add user to room ---
  const addUserToRoom = async () => {
    if (!selectedRoom) return;
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/room/${selectedRoom.id}/add_user`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ email: addUserEmail }),
      });
      const data = await res.json();
      if (data.success) {
        setShowAddUserModal(false);
        setAddUserEmail("");
      } else setError(data.message);
    } catch {
      setError("Failed to add user");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="py-5">
      <Row>
        <Col lg={4}>
          <Card className="mb-4">
            <Card.Body>
              <h5>Rooms</h5>
              <Table hover>
                <tbody>
                  {rooms.map((room) => (
                    <tr key={room.id} onClick={() => loadRoomMessages(room)} style={{ cursor: "pointer" }}>
                      <td>{room.name}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
              {isUser && <Button onClick={() => setShowCreateModal(true)}>Create Room</Button>}
            </Card.Body>
          </Card>
        </Col>
        <Col lg={8}>
          {selectedRoom ? (
            <Card>
              <Card.Body>
                <div style={{ flex: 1, display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                    <h5>{selectedRoom.name}</h5>
                    <h6>Threads: {messages.length}</h6>
                </div>
                <div style={{ height: "300px", overflowY: "scroll", border: "1px solid #ddd", padding: "1rem", marginBottom: "1rem" }}>
                  {messages.map((msg) => (
                    <div key={msg.id} style={{ overflowY: "scroll", border: "1px solid #3ce11bb2", padding: "1rem", marginBottom: "1rem", backgroundColor: "#57b56aff" }}>
                        <p className="btn btn-info">{msg.user_id === user.user_id ? `You` : msg.posted_by} </p>
                        <p>{msg.messages}</p>
                        <p style={{ fontSize: "0.6rem" }}>{msg.created_at}</p>
                      {/* <strong>{msg.sender_id === userId ? `You (${msg.user_id})` : msg.sender_name}: </strong> {msg.messages} ? {msg.content} */}
                    </div>
                  ))}
                  <div ref={chatEndRef}></div>
                </div>
                <Form.Group className="d-flex">
                  <Form.Control
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message..."
                  />
                  <Button onClick={sendMessage} className="ms-2"><FaPaperPlane /></Button>
                </Form.Group>
                {isUser && <Button className="mt-2" onClick={() => setShowAddUserModal(true)}>Add User</Button>}
              </Card.Body>
            </Card>
          ) : (
            <Alert>Select a room to start chatting</Alert>
          )}
        </Col>
      </Row>

      {/* Create Room Modal */}
      <Modal show={showCreateModal} onHide={() => setShowCreateModal(false)}>
        <Modal.Header closeButton><Modal.Title>Create Room</Modal.Title></Modal.Header>
        <Modal.Body>
          <Form.Control value={newRoomName} onChange={(e) => setNewRoomName(e.target.value)} placeholder="Room Name" />
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={() => setShowCreateModal(false)}>Cancel</Button>
          <Button onClick={createRoom} disabled={loading}>{loading ? "..." : "Create"}</Button>
        </Modal.Footer>
      </Modal>

      {/* Add User Modal */}
      <Modal show={showAddUserModal} onHide={() => setShowAddUserModal(false)}>
        <Modal.Header closeButton><Modal.Title>Add User</Modal.Title></Modal.Header>
        <Modal.Body>
          <Form.Control value={addUserEmail} onChange={(e) => setAddUserEmail(e.target.value)} placeholder="User Email" />
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={() => setShowAddUserModal(false)}>Cancel</Button>
          <Button onClick={addUserToRoom} disabled={loading}>{loading ? "..." : "Add"}</Button>
        </Modal.Footer>
      </Modal>

      {error && <Alert variant="danger">{error}</Alert>}
    </Container>
  );
};

export default MessagesUI;











// import React, { useState, useEffect, useContext } from "react";
// import { Container, Row, Col, Card, Button, Form, Alert, Spinner, Modal, Table, Badge } from "react-bootstrap";
// import { FaPlus, FaUsers, FaPaperPlane, FaCommentDots } from "react-icons/fa";
// import { UserContext } from "../context/UserContext";
// import { useSocket } from "../context/SocketContext";
// import envConfig from "../config/envConfig";

// const API_URL = envConfig.API_URL;

// const MessagesUI = () => {
//   const { token, isUser, userId } = useContext(UserContext);
//   const socket = useSocket();

//   const [rooms, setRooms] = useState([]);
//   const [selectedRoom, setSelectedRoom] = useState(null);
//   const [messages, setMessages] = useState([]);
//   const [newMessage, setNewMessage] = useState("");
//   const [newRoomName, setNewRoomName] = useState("");
//   const [addUserEmail, setAddUserEmail] = useState("");
//   const [showCreateModal, setShowCreateModal] = useState(false);
//   const [showAddUserModal, setShowAddUserModal] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");

//   // --- Fetch rooms ---
//   const fetchRooms = async () => {
//     setLoading(true);
//     try {
//       const res = await fetch(`${API_URL}/room/get`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       const data = await res.json();
//       setRooms(data || []);
//     } catch {
//       setError("Failed to load rooms");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (token) fetchRooms();
//   }, [token]);

//   // --- Load messages for selected room ---
//   const loadRoomMessages = async (room) => {
//     setSelectedRoom(room);
//     setLoading(true);
//     try {
//       const res = await fetch(`${API_URL}/room/${room.id}/messages`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       const data = await res.json();
//       console.log("MESSAGES FROM SERVER", data);
//       setMessages(data || []);
//     } catch {
//       setError("Failed to load messages");
//     } finally {
//       setLoading(false);
//     }

//     // Join Socket.IO room
//     if (socket && room?.id) {
//       socket.emit("join_room", { room_id: room.id });
//     }
//   };

//   // --- Listen for incoming messages ---
//   useEffect(() => {
//     if (!socket) return;

//     const handleNewMessage = (msg) => {
//       if (msg.room_id === selectedRoom?.id) {
//         setMessages((prev) => [...prev, msg]);
//       }
//     };

//     socket.on("new_message", handleNewMessage);
//     socket.on("system_message", (msg) => console.log("System:", msg));

//     return () => {
//       socket.off("new_message", handleNewMessage);
//     };
//   }, [socket, selectedRoom]);

//   // --- Send message ---
//   const sendMessage = () => {
//     if (!socket?.connected) return setError("Socket not connected yet.");
//     if (!newMessage.trim() || !selectedRoom) return;

//     socket.emit("send_message", {
//       room_id: selectedRoom.id,
//       sender_id: 43,
//       content: newMessage,
//     });
//     setNewMessage("");
//   };

//   // --- Create room ---
//   const createRoom = async () => {
//     if (!isUser) return setError("Only users can create rooms");
//     setLoading(true);
//     try {
//       const res = await fetch(`${API_URL}/room/create`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
//         body: JSON.stringify({ name: newRoomName }),
//       });
//       const data = await res.json();
//       if (data.success) {
//         setShowCreateModal(false);
//         setNewRoomName("");
//         fetchRooms();
//       } else setError(data.message);
//     } catch {
//       setError("Failed to create room");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // --- Add user to room ---
//   const addUserToRoom = async () => {
//     if (!selectedRoom) return;
//     setLoading(true);
//     try {
//       const res = await fetch(`${API_URL}/room/${selectedRoom.id}/add_user`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
//         body: JSON.stringify({ email: addUserEmail }),
//       });
//       const data = await res.json();
//       if (data.success) {
//         setShowAddUserModal(false);
//         setAddUserEmail("");
//       } else setError(data.message);
//     } catch {
//       setError("Failed to add user");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <Container className="py-5">
//       <Row>
//         <Col lg={4}>
//           <Card className="mb-4">
//             <Card.Body>
//               <h5>Rooms</h5>
//               <Table hover>
//                 <tbody>
//                   {rooms.map((room) => (
//                     <tr key={room.id} onClick={() => loadRoomMessages(room)} style={{ cursor: "pointer" }}>
//                       <td>{room.name}</td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </Table>
//               {isUser && <Button onClick={() => setShowCreateModal(true)}>Create Room</Button>}
//             </Card.Body>
//           </Card>
//         </Col>
//         <Col lg={8}>
//           {selectedRoom ? (
//             <Card>
//               <Card.Body>
//                 <h5>{selectedRoom.name}</h5>
//                 <div style={{ height: "300px", overflowY: "scroll", border: "1px solid #ddd", padding: "1rem", marginBottom: "1rem" }}>
//                   {messages.map((msg) => (
//                     <div key={msg.id}>
//                       <strong>{msg.sender_id}: </strong> {msg.content}
//                     </div>
//                   ))}
//                 </div>
//                 <Form.Group className="d-flex">
//                   <Form.Control
//                     type="text"
//                     value={newMessage}
//                     onChange={(e) => setNewMessage(e.target.value)}
//                     placeholder="Type a message..."
//                   />
//                   <Button onClick={sendMessage} className="ms-2">Send</Button>
//                 </Form.Group>
//                 {isUser && <Button className="mt-2" onClick={() => setShowAddUserModal(true)}>Add User</Button>}
//               </Card.Body>
//             </Card>
//           ) : (
//             <Alert>Select a room to start chatting</Alert>
//           )}
//         </Col>
//       </Row>

//       {/* Create Room Modal */}
//       <Modal show={showCreateModal} onHide={() => setShowCreateModal(false)}>
//         <Modal.Header closeButton><Modal.Title>Create Room</Modal.Title></Modal.Header>
//         <Modal.Body>
//           <Form.Control value={newRoomName} onChange={(e) => setNewRoomName(e.target.value)} placeholder="Room Name" />
//         </Modal.Body>
//         <Modal.Footer>
//           <Button onClick={() => setShowCreateModal(false)}>Cancel</Button>
//           <Button onClick={createRoom} disabled={loading}>{loading ? "..." : "Create"}</Button>
//         </Modal.Footer>
//       </Modal>

//       {/* Add User Modal */}
//       <Modal show={showAddUserModal} onHide={() => setShowAddUserModal(false)}>
//         <Modal.Header closeButton><Modal.Title>Add User</Modal.Title></Modal.Header>
//         <Modal.Body>
//           <Form.Control value={addUserEmail} onChange={(e) => setAddUserEmail(e.target.value)} placeholder="User Email" />
//         </Modal.Body>
//         <Modal.Footer>
//           <Button onClick={() => setShowAddUserModal(false)}>Cancel</Button>
//           <Button onClick={addUserToRoom} disabled={loading}>{loading ? "..." : "Add"}</Button>
//         </Modal.Footer>
//       </Modal>

//       {error && <Alert variant="danger">{error}</Alert>}
//     </Container>
//   );
// };

// export default MessagesUI;













// // import React, { useState, useEffect, useContext } from 'react';
// // import { Container, Row, Col, Card, Button, Form, Alert, Spinner, Modal, Table, Badge } from 'react-bootstrap';
// // import { FaPlus, FaUsers, FaPaperPlane, FaCommentDots } from 'react-icons/fa';
// // import { UserContext } from './../context/UserContext';
// // import { SocketProvider,useSocket } from './../context/SocketContext';
// // import envConfig from "../config/envConfig";


// // const API_URL = envConfig.API_URL;

// // const MessagesUI = () => {
// //   const { token, isUser } = useContext(UserContext);
// // //   const socket = useContext(SocketContext); // 👈 use shared socket
// //   const [rooms, setRooms] = useState([]);
// //   const [selectedRoom, setSelectedRoom] = useState(null);
// //   const [messages, setMessages] = useState([]);
// //   const [newMessage, setNewMessage] = useState('');
// //   const [newRoomName, setNewRoomName] = useState('');
// //   const [addUserEmail, setAddUserEmail] = useState('');
// //   const [showCreateModal, setShowCreateModal] = useState(false);
// //   const [showAddUserModal, setShowAddUserModal] = useState(false);
// //   const [loading, setLoading] = useState(false);
// //   const [error, setError] = useState('');
// // //   const { socket, connected } = useContext(SocketContext);
// //   const socket = useSocket();

// //   // ✅ Fetch rooms when user logs in
// //   useEffect(() => {
// //     if (token) fetchRooms();
// //   }, [token]);

// //   // ✅ Listen for incoming messages
// //   useEffect(() => {
// //     if (!socket) return;

// //     socket.on("message", (msg) => {
// //       if (msg.roomId === selectedRoom?.id) {
// //         setMessages((prev) => [...prev, msg]);
// //       }
// //     });

// //     return () => socket.off("message");
// //   }, [socket, selectedRoom]);

// //   const fetchRooms = async () => {
// //     setLoading(true);
// //     try {
// //       const response = await fetch(`${API_URL}/room/get`, {
// //         headers: { Authorization: `Bearer ${token}` }
// //       });
// //       const data = await response.json();
// //       setRooms(data || []);
// //     } catch {
// //       setError('Failed to load rooms');
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   const createRoom = async () => {
// //     if (!isUser) return setError('Only users can create rooms');
// //     setLoading(true);
// //     try {
// //       const response = await fetch(`${API_URL}/room/create`, {
// //         method: 'POST',
// //         headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
// //         body: JSON.stringify({ name: newRoomName })
// //       });
// //       const data = await response.json();
// //       if (data.success) {
// //         setShowCreateModal(false);
// //         setNewRoomName('');
// //         fetchRooms();
// //       } else {
// //         setError(data.message);
// //       }
// //     } catch {
// //       setError('Failed to create room');
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   const addUserToRoom = async () => {
// //     setLoading(true);
// //     try {
// //       const response = await fetch(`${API_URL}/room/${selectedRoom.id}/add_user`, {
// //         method: 'POST',
// //         headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
// //         body: JSON.stringify({ email: addUserEmail })
// //       });
// //       const data = await response.json();
// //       if (data.success) {
// //         setShowAddUserModal(false);
// //         setAddUserEmail('');
// //         setSelectedRoom(data.room);
// //       } else {
// //         setError(data.message);
// //       }
// //     } catch {
// //       setError('Failed to add user');
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// // //   const sendMessage = () => {
// // //     if (!socket || !socket.connected) {
// // //       setError("Socket not connected yet.");
// // //       return;
// // //     }
// // //     if (!newMessage.trim() || !selectedRoom) return;

// // //     socket.emit("message", {
// // //       roomId: selectedRoom.id,
// // //       content: newMessage,
// // //     });
// // //     setNewMessage('');
// // //   };


// // // const sendMessage = () => {
// // //   if (!connected) {
// // //     setError("Socket not connected yet.");
// // //     return;
// // //   }
// // //   if (!newMessage.trim() || !selectedRoom) return;

// // //   socket.emit("message", {
// // //     roomId: selectedRoom.id,
// // //     content: newMessage,
// // //   });
// // //   setNewMessage('');
// // // };



// // const sendMessage = () => {
// //   if (!socket || !socket.connected) return;
// //   if (!newMessage.trim() || !selectedRoom) return;

// //   socket.emit("send_message", {
// //     room_id: selectedRoom.id,
// //     sender_id: userId, // get from context/session
// //     content: newMessage,
// //   });
// //   setNewMessage("");
// // };

// // useEffect(() => {
// //   if (!socket) return;

// //   socket.on("new_message", (msg) => {
// //     if (msg.room_id === selectedRoom?.id) {
// //       setMessages((prev) => [...prev, msg]);
// //     }
// //   });

// //   return () => {
// //     socket.off("new_message");
// //   };
// // }, [socket, selectedRoom]);









// //   const loadRoomMessages = async (room) => {
// //     setSelectedRoom(room);
// //     setLoading(true);
// //     try {
// //       const response = await fetch(`${API_URL}/room/${room.id}/messages`, {
// //         headers: { Authorization: `Bearer ${token}` }
// //       });
// //       const data = await response.json();
// //       setMessages(data.messages || []);
// //     } catch {
// //       setError('Failed to load messages');
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   return (
// //     <section className="py-5 bg-light" id="messages-ui">
// //       <Container>
// //         <Row className="justify-content-center mb-5">
// //           <Col lg={8} className="text-center">
// //             <div className="icon-wrapper mb-3">
// //               <FaCommentDots size={50} className="text-primary" />
// //             </div>
// //             <h2 className="display-5 fw-bold mb-3">Messages & Rooms</h2>
// //             <p className="lead text-muted">Manage and chat in rooms</p>
// //             {isUser && (
// //               <Button variant="primary" className="rounded-pill px-4" onClick={() => setShowCreateModal(true)}>
// //                 <FaPlus className="me-2" /> Create Room
// //               </Button>
// //             )}
// //           </Col>
// //         </Row>

// //         {error && <Alert variant="danger" className="mb-4">{error}</Alert>}

// //         <Row>
// //           <Col lg={4}>
// //             <Card className="shadow-sm border-0 mb-4">
// //               <Card.Body className="p-4">
// //                 <h5 className="fw-bold mb-3">Your Rooms</h5>
// //                 <Table striped hover responsive>
// //                   <tbody>
// //                     {rooms.map((room) => (
// //                       <tr key={room.id} onClick={() => loadRoomMessages(room)} style={{ cursor: 'pointer' }}>
// //                         <td>
// //                           {room.name}
// //                           <Badge bg="info" className="ms-2">0 users</Badge>
// //                         </td>
// //                       </tr>
// //                     ))}
// //                   </tbody>
// //                 </Table>
// //               </Card.Body>
// //             </Card>
// //           </Col>

// //           <Col lg={8}>
// //             {selectedRoom ? (
// //               <Card className="shadow-sm border-0">
// //                 <Card.Body className="p-4">
// //                   <h5 className="fw-bold mb-3">{selectedRoom.name}</h5>
// //                   {isUser && (
// //                     <Button variant="outline-primary" className="mb-3" onClick={() => setShowAddUserModal(true)}>
// //                       <FaUsers className="me-2" /> Add User
// //                     </Button>
// //                   )}
// //                   <div className="chat-messages" style={{ height: '400px', overflowY: 'scroll', border: '1px solid #ddd', padding: '1rem', marginBottom: '1rem' }}>
// //                     {messages.map((msg) => (
// //                       <div key={msg.id} className="mb-2">
// //                         <strong>{msg.senderName}: </strong>{msg.content}
// //                       </div>
// //                     ))}
// //                   </div>
// //                   <Form.Group className="d-flex">
// //                     <Form.Control 
// //                       type="text" 
// //                       value={newMessage} 
// //                       onChange={(e) => setNewMessage(e.target.value)} 
// //                       placeholder="Type message..."
// //                       className="rounded-pill me-2"
// //                     />
// //                     <Button variant="primary" className="rounded-pill" onClick={sendMessage}>
// //                       <FaPaperPlane />
// //                     </Button>
// //                   </Form.Group>
// //                 </Card.Body>
// //               </Card>
// //             ) : (
// //               <Alert variant="info" className="text-center">
// //                 Select a room to start chatting
// //               </Alert>
// //             )}
// //           </Col>
// //         </Row>
// //       </Container>
// //     </section>
// //   );
// // };

// // export default MessagesUI;













// // // import React, { useState, useEffect, useContext } from 'react';
// // // import socket from './socket';
// // // import { Container, Row, Col, Card, Button, Form, Alert, Spinner, Modal, Table, Badge } from 'react-bootstrap';
// // // import { FaPlus, FaUsers, FaPaperPlane, FaCommentDots, FaTimes } from 'react-icons/fa';
// // // // import { AdminContext } from './../context/AdminContext';  // Assume extended with socket.io
// // // import { UserContext } from './../context/UserContext';  // Assume extended with socket.io
// // // import envConfig from "../config/envConfig";
// // // import io from "socket.io-client";

// // // const API_URL = envConfig.API_URL;

// // // // Extend AdminContext with socket if needed (in context/AdminContext.js)
// // // // const socket = io('/'); // Add socket to context

// // // const MessagesUI = () => {
// // //   const { token, isUser } = useContext(UserContext);
// // //   const [rooms, setRooms] = useState([]);
// // //   const [selectedRoom, setSelectedRoom] = useState(null);
// // //   const [messages, setMessages] = useState([]);
// // //   const [newMessage, setNewMessage] = useState('');
// // //   const [newRoomName, setNewRoomName] = useState('');
// // //   const [addUserEmail, setAddUserEmail] = useState('');
// // //   const [showCreateModal, setShowCreateModal] = useState(false);
// // //   const [showAddUserModal, setShowAddUserModal] = useState(false);
// // //   const [loading, setLoading] = useState(false);
// // //   const [error, setError] = useState('');
  
// // // //   const socket = useContext(UserContext).socket;  // Assume socket in context

// // //   const [socket, setSocket] = useState();

// // // useEffect(() => {
// // //     if (!token) return;
// // //     socket.auth = { token };
// // //     socket.connect();

// // //     socket.on("connect", () => {
// // //       console.log("✅ Connected to socket:", socket.id);
// // //     });

// // //     socket.on("message", (msg) => {
// // //       if (msg.roomId === selectedRoom?.id) {
// // //         setMessages((prev) => [...prev, msg]);
// // //       }
// // //     });

// // //     socket.on("disconnect", () => {
// // //       console.log("❌ Disconnected from socket");
// // //     });

// // //     return () => {
// // //       socket.off("message");
// // //       socket.disconnect();
// // //     };
// // //   }, [token, selectedRoom]);

// // //   const sendMessage = () => {
// // //     if (!socket.connected) {
// // //       setError("Socket not connected yet.");
// // //       return;
// // //     }
// // //     if (!newMessage.trim() || !selectedRoom) return;

// // //     socket.emit("message", {
// // //       roomId: selectedRoom.id,
// // //       content: newMessage,
// // //     });
// // //     setNewMessage('');
// // //   };




// // // // useEffect(() => {
// // // //   const newSocket = io(API_URL, {
// // // //     auth: { token }, // optional if your backend uses JWT auth
// // // //   });
// // // //   setSocket(newSocket);

// // // //   // Clean up on unmount
// // // //   return () => newSocket.close();
// // // // }, [API_URL, token]);


// // // //   useEffect(() => {
// // // //     fetchRooms();
// // // //   }, [token]);

// // // //   useEffect(() => {
// // // //     if (socket) {
// // // //       socket.on('message', (msg) => {
// // // //         if (msg.roomId === selectedRoom?._id) {
// // // //           setMessages(prev => [...prev, msg]);
// // // //         }
// // // //       });

// // // //       return () => socket.off('message');
// // // //     }
// // // //   }, [socket, selectedRoom]);

// // //   const fetchRooms = async () => {
// // //     setLoading(true);
// // //     try {
// // //       const response = await fetch(`${API_URL}/room/get`, {
// // //         headers: { Authorization: `Bearer ${token}` }
// // //       });
// // //       const data = await response.json();
// // //       console.log(data);
// // //       setRooms(data || []);
// // //     } catch (err) {
// // //       setError('Failed to load rooms');
// // //     } finally {
// // //       setLoading(false);
// // //     }
// // //   };

// // //   const createRoom = async () => {
// // //     if (!isUser) return setError('Only users can create rooms');

// // //     setLoading(true);
// // //     try {
// // //       const response = await fetch(`${API_URL}/room/create`, {
// // //         method: 'POST',
// // //         headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
// // //         body: JSON.stringify({ name: newRoomName })
// // //       });
// // //       const data = await response.json();
// // //       if (data.success) {
// // //         setShowCreateModal(false);
// // //         setNewRoomName('');
// // //         fetchRooms();
// // //       } else {
// // //         setError(data.message);
// // //       }
// // //     } catch (err) {
// // //       setError('Failed to create room');
// // //     } finally {
// // //       setLoading(false);
// // //     }
// // //   };

// // //   const addUserToRoom = async () => {
// // //     setLoading(true);
// // //     try {
// // //       const response = await fetch(`${API_URL}/room/${selectedRoom.id}/add_user`, {
// // //         method: 'POST',
// // //         headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
// // //         body: JSON.stringify({ email: addUserEmail })
// // //       });
// // //       const data = await response.json();
// // //       console.log(data);
// // //       if (data.success) {
// // //         setShowAddUserModal(false);
// // //         setAddUserEmail('');
// // //         setSelectedRoom(data.room);
// // //       } else {
// // //         setError(data.message);
// // //       }
// // //     } catch (err) {
// // //       setError('Failed to add user');
// // //     } finally {
// // //       setLoading(false);
// // //     }
// // //   };

// // // //   const sendMessage = () => {
// // // //     if (!newMessage.trim() || !selectedRoom) return;

// // // //     socket.emit('message', { roomId: selectedRoom.id, content: newMessage });
// // // //     setNewMessage('');
// // // //   };

// // //   const loadRoomMessages = async (room) => {
// // //     setSelectedRoom(room);
// // //     setLoading(true);
// // //     try {
// // //       const response = await fetch(`${API_URL}/room/${room.id}/messages`, {
// // //         headers: { Authorization: `Bearer ${token}` }
// // //       });
// // //       const data = await response.json();
// // //       setMessages(data.messages || []);
// // //     } catch (err) {
// // //       setError('Failed to load messages');
// // //     } finally {
// // //       setLoading(false);
// // //     }
// // //   };

// // //   return (
// // //     <section className="py-5 bg-light" id="messages-ui">
// // //       <Container>
// // //         <Row className="justify-content-center mb-5">
// // //           <Col lg={8} className="text-center">
// // //             <div className="icon-wrapper mb-3">
// // //               <FaCommentDots size={50} className="text-primary" />
// // //             </div>
// // //             <h2 className="display-5 fw-bold mb-3">Messages & Rooms</h2>
// // //             <p className="lead text-muted">
// // //               Manage and chat in rooms
// // //             </p>
// // //             {isUser && (
// // //               <Button variant="primary" className="rounded-pill px-4" onClick={() => setShowCreateModal(true)}>
// // //                 <FaPlus className="me-2" /> Create Room
// // //               </Button>
// // //             )}
// // //           </Col>
// // //         </Row>

// // //         {error && <Alert variant="danger" className="mb-4">{error}</Alert>}

// // //         {/* Rooms List */}
// // //         <Row>
// // //           <Col lg={4}>
// // //             <Card className="shadow-sm border-0 mb-4">
// // //               <Card.Body className="p-4">
// // //                 <h5 className="fw-bold mb-3">Your Rooms</h5>
// // //                 <Table striped hover responsive>
// // //                   <tbody>
// // //                     {rooms.map((room) => (
// // //                       <tr key={room.id} onClick={() => loadRoomMessages(room)} style={{ cursor: 'pointer' }}>
// // //                         <td>
// // //                           {room.name}
// // //                           {/* <Badge bg="info" className="ms-2">{room.users.length} users</Badge> */}
// // //                           <Badge bg="info" className="ms-2">0 users</Badge>

// // //                         </td>
// // //                       </tr>
// // //                     ))}
// // //                   </tbody>
// // //                 </Table>
// // //               </Card.Body>
// // //             </Card>
// // //           </Col>

// // //           {/* Chat Area */}
// // //           <Col lg={8}>
// // //             {selectedRoom ? (
// // //               <Card className="shadow-sm border-0">
// // //                 <Card.Body className="p-4">
// // //                   <h5 className="fw-bold mb-3">{selectedRoom.name}</h5>
// // //                   {isUser && (
// // //                     <Button variant="outline-primary" className="mb-3" onClick={() => setShowAddUserModal(true)}>
// // //                       <FaUsers className="me-2" /> Add User
// // //                     </Button>
// // //                   )}
// // //                   <div className="chat-messages" style={{ height: '400px', overflowY: 'scroll', border: '1px solid #ddd', padding: '1rem', marginBottom: '1rem' }}>
// // //                     {messages.map((msg) => (
// // //                       <div key={msg.id} className="mb-2">
// // //                         <strong>{msg.senderName}: </strong>{msg.content}
// // //                       </div>
// // //                     ))}
// // //                   </div>
// // //                   <Form.Group className="d-flex">
// // //                     <Form.Control 
// // //                       type="text" 
// // //                       value={newMessage} 
// // //                       onChange={(e) => setNewMessage(e.target.value)} 
// // //                       placeholder="Type message..."
// // //                       className="rounded-pill me-2"
// // //                     />
// // //                     <Button variant="primary" className="rounded-pill" onClick={sendMessage}>
// // //                       <FaPaperPlane />
// // //                     </Button>
// // //                   </Form.Group>
// // //                 </Card.Body>
// // //               </Card>
// // //             ) : (
// // //               <Alert variant="info" className="text-center">
// // //                 Select a room to start chatting
// // //               </Alert>
// // //             )}
// // //           </Col>
// // //         </Row>

// // //         {/* Create Room Modal */}
// // //         <Modal show={showCreateModal} onHide={() => setShowCreateModal(false)}>
// // //           <Modal.Header closeButton>
// // //             <Modal.Title>Create New Room</Modal.Title>
// // //           </Modal.Header>
// // //           <Modal.Body>
// // //             <Form.Group>
// // //               <Form.Label>Room Name</Form.Label>
// // //               <Form.Control value={newRoomName} onChange={(e) => setNewRoomName(e.target.value)} />
// // //             </Form.Group>
// // //           </Modal.Body>
// // //           <Modal.Footer>
// // //             <Button variant="secondary" onClick={() => setShowCreateModal(false)} disabled={loading}>
// // //               Cancel
// // //             </Button>
// // //             <Button variant="primary" onClick={createRoom} disabled={loading}>
// // //               {loading ? <Spinner size="sm" /> : 'Create'}
// // //             </Button>
// // //           </Modal.Footer>
// // //         </Modal>

// // //         {/* Add User Modal */}
// // //         <Modal show={showAddUserModal} onHide={() => setShowAddUserModal(false)}>
// // //           <Modal.Header closeButton>
// // //             <Modal.Title>Add User to {selectedRoom?.name}</Modal.Title>
// // //           </Modal.Header>
// // //           <Modal.Body>
// // //             <Form.Group>
// // //               <Form.Label>User Email</Form.Label>
// // //               <Form.Control value={addUserEmail} onChange={(e) => setAddUserEmail(e.target.value)} />
// // //             </Form.Group>
// // //           </Modal.Body>
// // //           <Modal.Footer>
// // //             <Button variant="secondary" onClick={() => setShowAddUserModal(false)} disabled={loading}>
// // //               Cancel
// // //             </Button>
// // //             <Button variant="primary" onClick={addUserToRoom} disabled={loading}>
// // //               {loading ? <Spinner size="sm" /> : 'Add'}
// // //             </Button>
// // //           </Modal.Footer>
// // //         </Modal>
// // //       </Container>
// // //     </section>
// // //   );
// // // };

// // // export default MessagesUI;

// // // import { io } from "socket.io-client";

// //     // export const socket = io("http://localhost:7000", {
// //     // transports: ["websocket", "polling"],
// //     // path: "/socket.io",
// //     // });

// //     // socket.on("connect", () => {
// //     // console.log("✅ Connected to Socket.IO:", socket.id);
// //     // });

// //     // socket.on("new_message", (msg) => {
// //     // console.log("📩 New message:", msg);
// //     // });













// // // import React, { useState, useEffect, useRef, useContext } from 'react';
// // // import { Container, Row, Col, Card, Button, Form, Alert, Spinner, Modal, Table, Badge } from 'react-bootstrap';
// // // import { FaPlus, FaUsers, FaPaperPlane, FaCommentDots, FaTimes, FaVideo, FaTrashAlt } from 'react-icons/fa';
// // // import { UserContext } from './../context/UserContext';  // Assume extended with socket.io
// // // // import Peer from 'peerjs';

// // // import * as PeerModule from 'peerjs';

// // // // // Get the actual constructor function
// // // // const Peer = PeerModule.default || PeerModule; 
// // // // // The actual class is now correctly assigned to the 'Peer' variable.

// // // const MessagesUI = () => {
// // //   const { token, isAdmin } = useContext(UserContext);
// // //   const [rooms, setRooms] = useState([]);
// // //   const [selectedRoom, setSelectedRoom] = useState(null);
// // //   const [messages, setMessages] = useState([]);
// // //   const [newMessage, setNewMessage] = useState('');
// // //   const [newRoomName, setNewRoomName] = useState('');
// // //   const [addUserEmail, setAddUserEmail] = useState('');
// // //   const [showCreateModal, setShowCreateModal] = useState(false);
// // //   const [showAddUserModal, setShowAddUserModal] = useState(false);
// // //   const [showVideoModal, setShowVideoModal] = useState(false);
// // //   const [peerId, setPeerId] = useState('');
// // //   const [remotePeerId, setRemotePeerId] = useState('');
// // //   const [peerInstance, setPeerInstance] = useState(null);
// // //   const localVideoRef = useRef(null);
// // //   const remoteVideoRef = useRef(null);
// // //   const [loading, setLoading] = useState(false);
// // //   const [error, setError] = useState('');
// // //   const socket = useContext(UserContext).socket;  // Assume socket in context
// // //   const Peer = PeerModule.default || PeerModule; 

// // //   useEffect(() => {
// // //     fetchRooms();
// // //     const peer = new Peer();
// // //     peer.on('open', (id) => {
// // //       setPeerId(id);
// // //     });
// // //     peer.on('call', (call) => {
// // //       navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((mediaStream) => {
// // //         localVideoRef.current.srcObject = mediaStream;
// // //         localVideoRef.current.play();
// // //         call.answer(mediaStream);
// // //         call.on('stream', (remoteStream) => {
// // //           remoteVideoRef.current.srcObject = remoteStream;
// // //           remoteVideoRef.current.play();
// // //         });
// // //       });
// // //     });
// // //     setPeerInstance(peer);

// // //     return () => {
// // //       peer.destroy();
// // //     };
// // //   }, []);

// // //   useEffect(() => {
// // //     if (socket) {
// // //       socket.on('message', (msg) => {
// // //         if (msg.roomId === selectedRoom?._id) {
// // //           setMessages(prev => [...prev, msg]);
// // //         }
// // //       });

// // //       return () => socket.off('message');
// // //     }
// // //   }, [socket, selectedRoom]);

// // //   const fetchRooms = async () => {
// // //     setLoading(true);
// // //     try {
// // //       const response = await fetch('/api/rooms', {
// // //         headers: { Authorization: `Bearer ${token}` }
// // //       });
// // //       const data = await response.json();
// // //       setRooms(data.rooms || []);
// // //     } catch (err) {
// // //       setError('Failed to load rooms');
// // //     } finally {
// // //       setLoading(false);
// // //     }
// // //   };

// // //   const createRoom = async () => {
// // //     if (!isAdmin) return setError('Only admin can create rooms');

// // //     setLoading(true);
// // //     try {
// // //       const response = await fetch('/api/rooms', {
// // //         method: 'POST',
// // //         headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
// // //         body: JSON.stringify({ name: newRoomName })
// // //       });
// // //       const data = await response.json();
// // //       if (data.success) {
// // //         setShowCreateModal(false);
// // //         setNewRoomName('');
// // //         fetchRooms();
// // //       } else {
// // //         setError(data.message);
// // //       }
// // //     } catch (err) {
// // //       setError('Failed to create room');
// // //     } finally {
// // //       setLoading(false);
// // //     }
// // //   };

// // //   const deleteRoom = async (roomId) => {
// // //     if (!isAdmin) return setError('Only admin can delete rooms');
// // //     if (!window.confirm('Are you sure you want to delete this room?')) return;

// // //     setLoading(true);
// // //     try {
// // //       const response = await fetch(`/api/rooms/${roomId}`, {
// // //         method: 'DELETE',
// // //         headers: { Authorization: `Bearer ${token}` }
// // //       });
// // //       const data = await response.json();
// // //       if (data.success) {
// // //         setSelectedRoom(null);
// // //         fetchRooms();
// // //       } else {
// // //         setError(data.message);
// // //       }
// // //     } catch (err) {
// // //       setError('Failed to delete room');
// // //     } finally {
// // //       setLoading(false);
// // //     }
// // //   };

// // //   const addUserToRoom = async () => {
// // //     setLoading(true);
// // //     try {
// // //       const response = await fetch(`/api/rooms/${selectedRoom._id}/add-user`, {
// // //         method: 'POST',
// // //         headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
// // //         body: JSON.stringify({ email: addUserEmail })
// // //       });
// // //       const data = await response.json();
// // //       if (data.success) {
// // //         setShowAddUserModal(false);
// // //         setAddUserEmail('');
// // //         setSelectedRoom(data.room);
// // //       } else {
// // //         setError(data.message);
// // //       }
// // //     } catch (err) {
// // //       setError('Failed to add user');
// // //     } finally {
// // //       setLoading(false);
// // //     }
// // //   };

// // //   const sendMessage = () => {
// // //     if (!newMessage.trim() || !selectedRoom) return;

// // //     socket.emit('message', { roomId: selectedRoom._id, content: newMessage });
// // //     setNewMessage('');
// // //   };

// // //   const loadRoomMessages = async (room) => {
// // //     setSelectedRoom(room);
// // //     setLoading(true);
// // //     try {
// // //       const response = await fetch(`/api/rooms/${room._id}/messages`, {
// // //         headers: { Authorization: `Bearer ${token}` }
// // //       });
// // //       const data = await response.json();
// // //       setMessages(data.messages || []);
// // //     } catch (err) {
// // //       setError('Failed to load messages');
// // //     } finally {
// // //       setLoading(false);
// // //     }
// // //   };

// // //   const startVideoCall = () => {
// // //     setShowVideoModal(true);
// // //     navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((mediaStream) => {
// // //       localVideoRef.current.srcObject = mediaStream;
// // //       localVideoRef.current.play();
// // //     });
// // //     // Share peerId via socket to room members
// // //     socket.emit('share-peer-id', { roomId: selectedRoom._id, peerId });
// // //   };

// // //   const callRemotePeer = () => {
// // //     navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((mediaStream) => {
// // //       localVideoRef.current.srcObject = mediaStream;
// // //       localVideoRef.current.play();
// // //       const call = peerInstance.call(remotePeerId, mediaStream);
// // //       call.on('stream', (remoteStream) => {
// // //         remoteVideoRef.current.srcObject = remoteStream;
// // //         remoteVideoRef.current.play();
// // //       });
// // //     });
// // //   };

// // //   return (
// // //     <section className="py-5 bg-light" id="messages-ui">
// // //       <Container>
// // //         <Row className="justify-content-center mb-5">
// // //           <Col lg={8} className="text-center">
// // //             <div className="icon-wrapper mb-3">
// // //               <FaCommentDots size={50} className="text-primary" />
// // //             </div>
// // //             <h2 className="display-5 fw-bold mb-3">Messages & Rooms</h2>
// // //             <p className="lead text-muted">
// // //               Manage and chat in rooms
// // //             </p>
// // //             {isAdmin && (
// // //               <Button variant="primary" className="rounded-pill px-4" onClick={() => setShowCreateModal(true)}>
// // //                 <FaPlus className="me-2" /> Create Room
// // //               </Button>
// // //             )}
// // //           </Col>
// // //         </Row>

// // //         {error && <Alert variant="danger" className="mb-4">{error}</Alert>}

// // //         {/* Rooms List */}
// // //         <Row className="g-4">
// // //           <Col lg={4}>
// // //             <Card className="shadow-sm border-0 mb-4">
// // //               <Card.Body className="p-4">
// // //                 <h5 className="fw-bold mb-3">Your Rooms</h5>
// // //                 <div className="list-group">
// // //                   {rooms.map((room) => (
// // //                     <div 
// // //                       key={room._id} 
// // //                       className="list-group-item list-group-item-action d-flex justify-content-between align-items-center"
// // //                       onClick={() => loadRoomMessages(room)}
// // //                       style={{ cursor: 'pointer' }}
// // //                     >
// // //                       <div>
// // //                         {room.name}
// // //                         <Badge bg="info" className="ms-2">{room.users.length} users</Badge>
// // //                       </div>
// // //                       {isAdmin && (
// // //                         <Button variant="danger" size="sm" onClick={(e) => { e.stopPropagation(); deleteRoom(room._id); }}>
// // //                           <FaTrashAlt />
// // //                         </Button>
// // //                       )}
// // //                     </div>
// // //                   ))}
// // //                 </div>
// // //               </Card.Body>
// // //             </Card>
// // //           </Col>

// // //           {/* Chat Area */}
// // //           <Col lg={8}>
// // //             {selectedRoom ? (
// // //               <Card className="shadow-sm border-0">
// // //                 <Card.Body className="p-4 d-flex flex-column" style={{ height: '60vh' }}>
// // //                   <div className="d-flex justify-content-between align-items-center mb-3">
// // //                     <h5 className="fw-bold mb-0">{selectedRoom.name}</h5>
// // //                     <div>
// // //                       {isAdmin && (
// // //                         <Button variant="outline-primary" className="me-2" onClick={() => setShowAddUserModal(true)}>
// // //                           <FaUsers className="me-2" /> Add User
// // //                         </Button>
// // //                       )}
// // //                       <Button variant="outline-success" onClick={startVideoCall}>
// // //                         <FaVideo className="me-2" /> Video Call
// // //                       </Button>
// // //                     </div>
// // //                   </div>
                  
// // //                   <div className="flex-grow-1 overflow-auto border rounded p-3 mb-3" style={{ background: '#f8f9fa' }}>
// // //                     {messages.map((msg) => (
// // //                       <div key={msg.id} className="mb-2">
// // //                         <strong>{msg.senderName}: </strong>{msg.content}
// // //                       </div>
// // //                     ))}
// // //                   </div>
                  
// // //                   <Form.Group className="d-flex">
// // //                     <Form.Control 
// // //                       type="text" 
// // //                       value={newMessage} 
// // //                       onChange={(e) => setNewMessage(e.target.value)} 
// // //                       placeholder="Type message..."
// // //                       className="rounded-pill me-2"
// // //                     />
// // //                     <Button variant="primary" className="rounded-pill px-4" onClick={sendMessage}>
// // //                       <FaPaperPlane />
// // //                     </Button>
// // //                   </Form.Group>
// // //                 </Card.Body>
// // //               </Card>
// // //             ) : (
// // //               <Alert variant="info" className="text-center">
// // //                 Select a room to start chatting
// // //               </Alert>
// // //             )}
// // //           </Col>
// // //         </Row>

// // //         {/* Create Room Modal */}
// // //         <Modal show={showCreateModal} onHide={() => setShowCreateModal(false)}>
// // //           <Modal.Header closeButton>
// // //             <Modal.Title>Create New Room</Modal.Title>
// // //           </Modal.Header>
// // //           <Modal.Body>
// // //             <Form.Group>
// // //               <Form.Label>Room Name</Form.Label>
// // //               <Form.Control value={newRoomName} onChange={(e) => setNewRoomName(e.target.value)} />
// // //             </Form.Group>
// // //           </Modal.Body>
// // //           <Modal.Footer>
// // //             <Button variant="secondary" onClick={() => setShowCreateModal(false)} disabled={loading}>
// // //               Cancel
// // //             </Button>
// // //             <Button variant="primary" onClick={createRoom} disabled={loading}>
// // //               {loading ? <Spinner size="sm" /> : 'Create'}
// // //             </Button>
// // //           </Modal.Footer>
// // //         </Modal>

// // //         {/* Add User Modal */}
// // //         <Modal show={showAddUserModal} onHide={() => setShowAddUserModal(false)}>
// // //           <Modal.Header closeButton>
// // //             <Modal.Title>Add User to {selectedRoom?.name}</Modal.Title>
// // //           </Modal.Header>
// // //           <Modal.Body>
// // //             <Form.Group>
// // //               <Form.Label>User Email</Form.Label>
// // //               <Form.Control value={addUserEmail} onChange={(e) => setAddUserEmail(e.target.value)} />
// // //             </Form.Group>
// // //           </Modal.Body>
// // //           <Modal.Footer>
// // //             <Button variant="secondary" onClick={() => setShowAddUserModal(false)} disabled={loading}>
// // //               Cancel
// // //             </Button>
// // //             <Button variant="primary" onClick={addUserToRoom} disabled={loading}>
// // //               {loading ? <Spinner size="sm" /> : 'Add'}
// // //             </Button>
// // //           </Modal.Footer>
// // //         </Modal>

// // //         {/* Video Call Modal */}
// // //         <Modal show={showVideoModal} onHide={() => setShowVideoModal(false)} size="lg">
// // //           <Modal.Header closeButton>
// // //             <Modal.Title>Video Call in {selectedRoom?.name}</Modal.Title>
// // //           </Modal.Header>
// // //           <Modal.Body className="d-flex flex-column flex-md-row gap-3">
// // //             <div className="flex-grow-1">
// // //               <video ref={localVideoRef} autoPlay muted className="w-100 rounded shadow" />
// // //               <p className="text-center mt-2">Your Video</p>
// // //             </div>
// // //             <div className="flex-grow-1">
// // //               <video ref={remoteVideoRef} autoPlay className="w-100 rounded shadow" />
// // //               <p className="text-center mt-2">Remote Video</p>
// // //             </div>
// // //           </Modal.Body>
// // //           <Modal.Footer>
// // //             <Form.Group className="flex-grow-1">
// // //               <Form.Label>Remote Peer ID (Share yours: {peerId})</Form.Label>
// // //               <Form.Control value={remotePeerId} onChange={(e) => setRemotePeerId(e.target.value)} />
// // //             </Form.Group>
// // //             <Button variant="success" onClick={callRemotePeer} className="ms-2">
// // //               Call
// // //             </Button>
// // //             <Button variant="secondary" onClick={() => setShowVideoModal(false)}>
// // //               Close
// // //             </Button>
// // //           </Modal.Footer>
// // //         </Modal>
// // //       </Container>
// // //     </section>
// // //   );
// // // };

// // // export default MessagesUI;