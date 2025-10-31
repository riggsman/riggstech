import React, { useEffect, useContext } from 'react';
import { Container, Row, Col, Card, Badge, Button } from 'react-bootstrap';
import { FaUsers, FaEnvelope, FaPaperPlane, FaSpinner, FaArrowCircleRight, FaTrashRestore, FaCircleNotch } from 'react-icons/fa';
import { AdminContext } from '../../context/AdminContext';
import AdminNav from './AdminNav';
import envConfig from '../../config/envConfig';

const {API_URL} = envConfig;

const Dashboard = () => {
  const { stats, updateStats, token ,fetchStats} = useContext(AdminContext);
  

  // useEffect(() => {
  //   if (!token) return;

  //   const fetchStats = async () => {
  //     try {
  //       // Fetch students
  //       const studentsRes = await fetch(`${API_URL}/admin/students`, {
  //         headers: { Authorization: `Bearer ${token}` },
          
  //       });
  //       const studentsData = await studentsRes.json();
  //       const students = studentsData || [];
  //       const newStudents = students.length;
  //       const allStudents = students.filter(s => {
  //       const created = new Date(s.createdAt);
  //         return created.toDateString() === new Date().toDateString();
  //       }).length;

  //       // Fetch messages
  //       const messagesRes = await fetch(`${API_URL}/admin/messages`, {
  //         headers: { Authorization: `Bearer ${token}` },
  //         cache: 'no-store',
  //       });
  //       const messagesData = await messagesRes.json();
  //       const messages = messagesData || [];
  //       const newMessages = messages.filter(m => m.unread).length;
  //       // console.log("NEW MESSAGE COUNT ",newMessages);
  //       const newEmails = 0;

  //       updateStats({ newStudents, newMessages, newEmails, allStudents});
  //     } catch (err) {
  //       console.error('Failed to fetch stats', err);
  //     }
  //   };

  //   // Initial fetch
  //   fetchStats();

  //   // Optional: auto-update every 30 seconds
  //   const interval = setInterval(fetchStats, 300000);

  //   return () => clearInterval(interval);
  // }, [token, updateStats]);

 

  return (
    <div>
      <AdminNav />
      <section className="py-5 bg-light min-vh-100">
        <Container>
          <Row className="justify-content-center mb-5">
            <Col lg={8}>
              <h2 className="display-5 fw-bold text-center mb-5">Admin Dashboard</h2>
            </Col>
           <Col lg={12}>
            <Button onClick={() => fetchStats()}><FaCircleNotch className="spinner" size={20} /></Button>
           </Col>
          </Row>

          <Row className="justify-content-center g-4">
            <Col md={4}>
              <Card className="hover-card shadow-sm border-0 text-center h-100">
                <Card.Body className="p-4">
                  <div className="icon-wrapper mb-3 mx-auto text-primary">
                    <FaUsers size={40} />
                  </div>
                  <h5 className="fw-bold mb-2">New Students Today</h5>
                  <Badge bg="warning" className="fs-3 px-3 py-2">{stats.newStudents}</Badge>
                </Card.Body>
              </Card>
            </Col>

            <Col md={4}>
              <Card className="hover-card shadow-sm border-0 text-center h-100">
                <Card.Body className="p-4">
                  <div className="icon-wrapper mb-3 mx-auto text-danger">
                    <FaUsers size={40} />
                  </div>
                  <h5 className="fw-bold mb-2">Total Registered Students</h5>
                  <Badge bg="danger" className="fs-3 px-3 py-2">{stats.totalStudents}</Badge>
                </Card.Body>
              </Card>
            </Col>

            <Col md={4}>
              <Card className="hover-card shadow-sm border-0 text-center h-100">
                <Card.Body className="p-4">
                  <div className="icon-wrapper mb-3 mx-auto text-danger">
                    <FaEnvelope size={40} />
                  </div>
                  <h5 className="fw-bold mb-2">Unread Messages</h5>
                  <Badge bg="danger" className="fs-3 px-3 py-2">{stats.newMessages}</Badge>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card className="hover-card shadow-sm border-0 text-center h-100">
                <Card.Body className="p-4">
                  <div className="icon-wrapper mb-3 mx-auto text-danger">
                    <FaEnvelope size={40} />
                  </div>
                  <h5 className="fw-bold mb-2">All Messages</h5>
                  <Badge bg="danger" className="fs-3 px-3 py-2">{stats.totalMessages}</Badge>
                </Card.Body>
              </Card>
            </Col>

            <Col md={4}>
              <Card className="hover-card shadow-sm border-0 text-center h-100">
                <Card.Body className="p-4">
                  <div className="icon-wrapper mb-3 mx-auto text-danger">
                    <FaEnvelope size={40} />
                  </div>
                  <h5 className="fw-bold mb-2">Inquiries</h5>
                  <Badge bg="danger" className="fs-3 px-3 py-2">{stats.totalMessages}</Badge>
                </Card.Body>
              </Card>
            </Col>

            <Col md={4}>
              <Card className="hover-card shadow-sm border-0 text-center h-100">
                <Card.Body className="p-4">
                  <div className="icon-wrapper mb-3 mx-auto text-success">
                    <FaPaperPlane size={40} />
                  </div>
                  <h5 className="fw-bold mb-2">Emails Sent</h5>
                  <Badge bg="success" className="fs-3 px-3 py-2">{stats.newEmails}</Badge>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>
    </div>
  );
};

export default Dashboard;


















// import React, { useEffect, useContext } from 'react';
// import { Container, Row, Col, Card, Badge } from 'react-bootstrap';
// import { FaUsers, FaEnvelope, FaPaperPlane } from 'react-icons/fa';
// import { AdminContext } from '../../context/AdminContext';
// import AdminNav from './AdminNav';  // ✅ CORRECT IMPORT (same folder)
// import envConfig from '../../config/envConfig';

// const API_URL = envConfig.API_URL;

// const Dashboard = () => {
//   const { stats, updateStats, token } = useContext(AdminContext);

//   useEffect(() => {
//     const fetchStats = async () => {
//       try {
//         const studentsRes = await fetch(`${API_URL}/admin/students`, {
//           headers: { Authorization: `Bearer ${token}` }
//         });
//         const studentsData = await studentsRes.json();
//         const students = studentsData.students || [];
        
//         const newStudents = students.filter(s => {
//           const created = new Date(s.createdAt);
//           const today = new Date();
//           return created.toDateString() === today.toDateString();
//         }).length;

//         const messagesRes = await fetch(`${API_URL}/admin/messages`, {
//           headers: { Authorization: `Bearer ${token}`, cache: `no-cache` }
//         });
//         const messagesData = await messagesRes.json();
//         const messages = messagesData.messages || [];
//         const newMessages = messages.filter(m => m.unread).length;

//         const newEmails = 0;

//         updateStats({ newStudents, newMessages, newEmails });
//       } catch (err) {
//         console.error('Failed to fetch stats', err);
//       }
//     };
//     if (token) fetchStats();
//   }, [token, updateStats]);

//   return (
//     <div>
//       <AdminNav />  {/* ✅ NOW WORKS */}
//       <section className="py-5 bg-light min-vh-100">
//         <Container>
//           <Row className="justify-content-center mb-5">
//             <Col lg={8}>
//               <h2 className="display-5 fw-bold text-center mb-5">Admin Dashboard</h2>
//             </Col>
//           </Row>
          
//           <Row className="justify-content-center g-4">
//             <Col md={4}>
//               <Card className="hover-card shadow-sm border-0 text-center h-100">
//                 <Card.Body className="p-4">
//                   <div className="icon-wrapper mb-3 mx-auto text-primary">
//                     <FaUsers size={40} />
//                   </div>
//                   <h5 className="fw-bold mb-2">New Students Today</h5>
//                   <Badge bg="warning" className="fs-3 px-3 py-2">{stats.newStudents}</Badge>
//                 </Card.Body>
//               </Card>
//             </Col>

//             <Col md={4}>
//               <Card className="hover-card shadow-sm border-0 text-center h-100">
//                 <Card.Body className="p-4">
//                   <div className="icon-wrapper mb-3 mx-auto text-danger">
//                     <FaUsers size={40} />
//                   </div>
//                   <h5 className="fw-bold mb-2">Total Registered Students</h5>
//                   <Badge bg="danger" className="fs-3 px-3 py-2">{stats.newMessages}</Badge>
//                 </Card.Body>
//               </Card>
//             </Col>
            
//             <Col md={4}>
//               <Card className="hover-card shadow-sm border-0 text-center h-100">
//                 <Card.Body className="p-4">
//                   <div className="icon-wrapper mb-3 mx-auto text-danger">
//                     <FaEnvelope size={40} />
//                   </div>
//                   <h5 className="fw-bold mb-2">Unread Messages</h5>
//                   <Badge bg="danger" className="fs-3 px-3 py-2">{stats.newMessages}</Badge>
//                 </Card.Body>
//               </Card>
//             </Col>
//             <Col md={4}>
//               <Card className="hover-card shadow-sm border-0 text-center h-100">
//                 <Card.Body className="p-4">
//                   <div className="icon-wrapper mb-3 mx-auto text-danger">
//                     <FaEnvelope size={40} />
//                   </div>
//                   <h5 className="fw-bold mb-2">Inquiries</h5>
//                   <Badge bg="danger" className="fs-3 px-3 py-2">{stats.newMessages}</Badge>
//                 </Card.Body>
//               </Card>
//             </Col>
//             <Col md={4}>
//               <Card className="hover-card shadow-sm border-0 text-center h-100">
//                 <Card.Body className="p-4">
//                   <div className="icon-wrapper mb-3 mx-auto text-success">
//                     <FaPaperPlane size={40} />
//                   </div>
//                   <h5 className="fw-bold mb-2">Emails Sent</h5>
//                   <Badge bg="success" className="fs-3 px-3 py-2">{stats.newEmails}</Badge>
//                 </Card.Body>
//               </Card>
//             </Col>
//           </Row>
//         </Container>
//       </section>
//     </div>
//   );
// };

// export default Dashboard;












// // import React, { useEffect, useContext } from 'react';
// // import { Container, Row, Col, Card, Badge } from 'react-bootstrap';
// // import { FaUsers, FaEnvelope, FaPaperPlane } from 'react-icons/fa';
// // import { AdminContext } from '../../context/AdminContext';
// // import AdminNav from './AdminNav';

// // const Dashboard = () => {
// //   const { stats, updateStats, token } = useContext(AdminContext);

// //   useEffect(() => {
// //     const fetchStats = async () => {
// //       try {
// //         // Fetch students
// //         const studentsRes = await fetch('/api/admin/students', {
// //           headers: { Authorization: `Bearer ${token}` }
// //         });
// //         const students = await studentsRes.json().students || [];
// //         const newStudents = students.filter(s => {
// //           const created = new Date(s.createdAt);
// //           const today = new Date();
// //           return created.toDateString() === today.toDateString();
// //         }).length;

// //         // Fetch messages
// //         const messagesRes = await fetch('/api/admin/messages', {
// //           headers: { Authorization: `Bearer ${token}` }
// //         });
// //         const messages = await messagesRes.json().messages || [];
// //         const newMessages = messages.filter(m => m.unread).length;

// //         // New emails placeholder (extend with EmailLog if needed)
// //         const newEmails = 0;

// //         updateStats({ newStudents, newMessages, newEmails });
// //       } catch (err) {
// //         console.error('Failed to fetch stats', err);
// //       }
// //     };
// //     if (token) fetchStats();
// //   }, [token, updateStats]);

// //   return (
// //     <section className="py-5 bg-light min-vh-100">
// //       <AdminNav />
// //       <Container>
// //         <h2 className="display-5 fw-bold mb-5 text-center">Admin Dashboard</h2>
// //         <Row className="justify-content-center">
// //           <Col md={4} className="mb-4">
// //             <Card className="hover-card shadow-sm border-0 text-center">
// //               <Card.Body className="p-5">
// //                 <div className="icon-wrapper mb-3 mx-auto">
// //                   <FaUsers size={50} />
// //                 </div>
// //                 <h5 className="fw-bold mb-3">New Students</h5>
// //                 <Badge bg="warning" className="fs-5 px-3 py-2">{stats.newStudents}</Badge>
// //               </Card.Body>
// //             </Card>
// //           </Col>
// //           <Col md={4} className="mb-4">
// //             <Card className="hover-card shadow-sm border-0 text-center">
// //               <Card.Body className="p-5">
// //                 <div className="icon-wrapper mb-3 mx-auto">
// //                   <FaEnvelope size={50} />
// //                 </div>
// //                 <h5 className="fw-bold mb-3">New Messages</h5>
// //                 <Badge bg="warning" className="fs-5 px-3 py-2">{stats.newMessages}</Badge>
// //               </Card.Body>
// //             </Card>
// //           </Col>
// //           <Col md={4} className="mb-4">
// //             <Card className="hover-card shadow-sm border-0 text-center">
// //               <Card.Body className="p-5">
// //                 <div className="icon-wrapper mb-3 mx-auto">
// //                   <FaPaperPlane size={50} />
// //                 </div>
// //                 <h5 className="fw-bold mb-3">New Emails</h5>
// //                 <Badge bg="warning" className="fs-5 px-3 py-2">{stats.newEmails}</Badge>
// //               </Card.Body>
// //             </Card>
// //           </Col>
// //         </Row>
// //       </Container>
// //     </section>
// //   );
// // };

// // export default Dashboard;