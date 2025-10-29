// src/pages/UserDashboard.jsx
import React, { useState, useEffect, useContext } from "react";
import {
  Container, Row, Col, Card, Button, Badge, Table,
  Form, Alert, Spinner,
} from "react-bootstrap";
import { FaBook, FaEnvelope, FaUpload, FaUserEdit } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
// import envConfig from "../config/envConfig";
import { useMessages } from "./../context/MessageContext";
import { UserContext } from "./../context/UserContext";

// const API_URL = envConfig.API_URL;

const UserDashboard = () => {
  const navigate = useNavigate();

  // ---- CONTEXT ----
  const {
    profileData,
    fetchUserProfile,
    registeredPrograms,
    fetchRegisteredPrograms,
    submitAssignment,
    activeSection,          // <-- from context
    setActiveSection,
  } = useContext(UserContext);

  const { unreadCount } = useMessages();

  // ---- LOCAL UI STATE ----
  // const [activeSection, setActiveSection] = useState(null);
  const [assignmentFile, setAssignmentFile] = useState(null);
  const [submissionStatus, setSubmissionStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  // ---- FILE HANDLER ----
  const handleFileChange = (e) => setAssignmentFile(e.target.files[0]);

  // ---- ASSIGNMENT SUBMIT ----
  const handleSubmitAssignment = async (e) => {
    e.preventDefault();
    if (!assignmentFile) return;

    setLoading(true);
    setSubmissionStatus(null);
    try {
      await submitAssignment(assignmentFile);
      setSubmissionStatus("success");
      setAssignmentFile(null);
    } catch (err) {
      setSubmissionStatus("error");
    } finally {
      setLoading(false);
    }
  };

  // ---- REFRESH DATA WHEN NEEDED ----
  useEffect(() => {
    if (!profileData) fetchUserProfile();
    if (registeredPrograms.length === 0) fetchRegisteredPrograms();
  }, [profileData, registeredPrograms]);

  // -----------------------------------------------------------------
  //  RENDER HELPERS
  // -----------------------------------------------------------------
  const renderSection = () => {
    switch (activeSection) {
      // ---------- PROFILE ----------
      case "profile":
        if (!profileData) return <Spinner animation="border" />;
        return (
          <Card className="shadow-sm border-0 hover-card">
            <Card.Body className="p-4">
              <FaUserEdit size={40} className="text-primary mb-3" />
              <Card.Title className="h5 fw-bold mb-3">Your Profile</Card.Title>
              <Table striped bordered hover responsive>
                <tbody>
                  <tr><td className="fw-bold">Name</td>
                    <td>{profileData.first_name} {profileData.last_name}</td></tr>
                  <tr><td className="fw-bold">Email</td><td>{profileData.email}</td></tr>
                  <tr><td className="fw-bold">Phone</td><td>{profileData.phone}</td></tr>
                  <tr><td className="fw-bold">Registered Since</td>
                    <td>{new Date(profileData.created_at).toLocaleDateString()}</td></tr>
                  <tr>
                    <td className="fw-bold">Payment Status</td>
                    <td>
                      <Badge bg={profileData.status === "initiated" ? "warning" : "success"}>
                        {profileData.status === "initiated" ? "Pending" : "Paid"}
                      </Badge>
                    </td>
                  </tr>
                </tbody>
              </Table>
              <Button variant="primary" className="w-100 mt-3"
                onClick={() => navigate("/profile/edit")}>
                Edit Profile
              </Button>
            </Card.Body>
          </Card>
        );

      // ---------- PROGRAMS ----------
      case "programs":
        return (
          <Card className="shadow-sm border-0 hover-card">
            <Card.Body className="p-4">
              <FaBook size={40} className="text-primary mb-3" />
              <Card.Title className="h5 fw-bold mb-3">Registered Programs</Card.Title>

              {registeredPrograms.length === 0 ? (
                <Alert variant="info">You are not enrolled in any program yet.</Alert>
              ) : (
                <Table striped bordered hover responsive>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Status</th>
                      <th>Start Date</th>
                      <th>Progress</th>
                    </tr>
                  </thead>
                  <tbody>
                    {registeredPrograms.map((p) => (
                      <tr key={p.id}>
                        <td>{p.name}</td>
                        <td>
                          <Badge bg={p.status === "active" ? "success" : "warning"}>
                            {p.status?.charAt(0).toUpperCase() + p.status?.slice(1)}
                          </Badge>
                        </td>
                        <td>{new Date(p.start_date).toLocaleDateString()}</td>
                        <td>{p.progress ?? 0}%</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )}
            </Card.Body>
          </Card>
        );

      // ---------- MESSAGES ----------
      case "messages":
        return (
          <Card className="shadow-sm border-0 hover-card">
            <Card.Body className="p-4">
              <FaEnvelope size={40} className="text-primary mb-3" />
              <Card.Title className="h5 fw-bold mb-3">Messages</Card.Title>
              {/* Keep your existing MessageContext list or replace with API */}
              {/* Example placeholder – replace with real fetch if you have one */}
              <Alert variant="secondary">Messages are managed by MessageContext.</Alert>
            </Card.Body>
          </Card>
        );

      // ---------- ASSIGNMENTS ----------
      case "assignments":
        return (
          <Card className="shadow-sm border-0 hover-card">
            <Card.Body className="p-4">
              <FaUpload size={40} className="text-primary mb-3" />
              <Card.Title className="h5 fw-bold mb-3">Submit Assignment</Card.Title>

              <Form onSubmit={handleSubmitAssignment}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">Upload File</Form.Label>
                  <Form.Control type="file" onChange={handleFileChange} required />
                </Form.Group>

                <Button type="submit" variant="primary" className="w-100"
                  disabled={loading || !assignmentFile}>
                  {loading ? (
                    <>
                      <Spinner animation="border" size="sm" className="me-2" />
                      Submitting...
                    </>
                  ) : (
                    "Submit Assignment"
                  )}
                </Button>
              </Form>

              {submissionStatus === "success" && (
                <Alert variant="success" className="mt-3">
                  Assignment submitted successfully!
                </Alert>
              )}
              {submissionStatus === "error" && (
                <Alert variant="danger" className="mt-3">
                  Failed to submit. Try again.
                </Alert>
              )}
            </Card.Body>
          </Card>
        );

      // ---------- DEFAULT ----------
      default:
        return (
          <Alert variant="info" className="text-center py-5">
            Click any button above to view your details.
          </Alert>
        );
    }
  };

  // -----------------------------------------------------------------
  //  JSX
  // -----------------------------------------------------------------
  return (
    <section className="py-5 bg-light" id="dashboard">
      <Container>
        <Row className="justify-content-center mb-4">
          <Col lg={8} className="text-center">
            <h2 className="fw-bold mb-3">Welcome to Your Dashboard</h2>
            <p className="text-muted">
              Manage your programs, messages, assignments, and profile.
            </p>
          </Col>
        </Row>

        {/* NAVIGATION BUTTONS */}
        <Row className="justify-content-center mb-4 text-center">
          <Col lg={10}>
            <Button
              variant={activeSection === "profile" ? "primary" : "outline-primary"}
              className="m-2"
              onClick={() => setActiveSection("profile")}
            >
              Profile
            </Button>

            <Button
              variant={activeSection === "programs" ? "primary" : "outline-primary"}
              className="m-2"
              onClick={() => setActiveSection("programs")}
            >
              Programs
            </Button>

            <Button
              variant={activeSection === "messages" ? "primary" : "outline-primary"}
              className="m-2 position-relative"
              onClick={() => setActiveSection("messages")}
            >
              Messages
              {unreadCount > 0 && (
                <Badge pill bg="danger"
                  style={{ position: "absolute", top: "-8px", right: "-8px", fontSize: "0.7rem" }}>
                  {unreadCount}
                </Badge>
              )}
            </Button>

            <Button
              variant={activeSection === "assignments" ? "primary" : "outline-primary"}
              className="m-2"
              onClick={() => setActiveSection("assignments")}
            >
              Assignments
            </Button>
          </Col>
        </Row>

        <Row>
          <Col lg={12}>{renderSection()}</Col>
        </Row>
      </Container>
    </section>
  );
};

export default UserDashboard;












// // import React, { useState, useEffect } from "react";
// // import {
// //   Container,
// //   Row,
// //   Col,
// //   Card,
// //   Button,
// //   Badge,
// //   Table,
// //   Form,
// //   Alert,
// //   Spinner,
// // } from "react-bootstrap";
// // import {
// //   FaBook,
// //   FaEnvelope,
// //   FaUpload,
// //   FaUserEdit,
// // } from "react-icons/fa";
// // import { motion, AnimatePresence } from "framer-motion";
// // import { useNavigate } from "react-router-dom";
// // import envConfig from "../config/envConfig";
// // import { useMessages } from "./../contexts/MessageContext";
// // const API_URL = envConfig.API_URL;

// // const UserDashboard = () => {
// //   const navigate = useNavigate();
// //   const [activeSection, setActiveSection] = useState(null);
// //   const { unreadCount } = useMessages();

// //   // Mock data
// //   const registeredPrograms = [
// //     { id: 1, name: "Web Development", status: "Active", startDate: "2025-11-01", progress: 25 },
// //     { id: 2, name: "Data Science", status: "Pending", startDate: "2025-12-01", progress: 0 },
// //   ];

// //   const messages = [
// //     { id: 1, subject: "Welcome to RiggsTech!", date: "2025-10-24", unread: true, content: "Thank you for registering!" },
// //     { id: 2, subject: "Assignment Reminder", date: "2025-10-25", unread: false, content: "Submit by end of week." },
// //   ];

// //   const profile = {
// //     name: "John Doe",
// //     email: "john@example.com",
// //     phone: "+256712345678",
// //     registeredSince: "2025-10-24",
// //     paymentStatus: "Paid",
// //   };

// //   const [assignmentFile, setAssignmentFile] = useState(null);
// //   const [submissionStatus, setSubmissionStatus] = useState(null);
// //   const [loading, setLoading] = useState(false);

// //   const handleFileChange = (e) => setAssignmentFile(e.target.files[0]);

// //   const handleSubmitAssignment = (e) => {
// //     e.preventDefault();
// //     if (!assignmentFile) return;
// //     setLoading(true);
// //     setTimeout(() => {
// //       setSubmissionStatus("success");
// //       setAssignmentFile(null);
// //       setLoading(false);
// //     }, 1500);
// //   };

// //   useEffect(() => {
// //     const fetchPrograms = async () => {
// //       const response = await fetch(`${API_URL}/user/programs`, {
// //         headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
// //       });
// //       await response.json();
// //     };
// //     fetchPrograms();
// //   }, []);

// //   // Animation variants
// //   const fadeVariant = {
// //     hidden: { opacity: 0, y: 15 },
// //     visible: { opacity: 1, y: 0 },
// //     exit: { opacity: 0, y: -15 },
// //   };

// //   // Section rendering with animation
// //   const renderSection = () => {
// //     switch (activeSection) {
// //       case "profile":
// //         return (
// //           <motion.div
// //             key="profile"
// //             variants={fadeVariant}
// //             initial="hidden"
// //             animate="visible"
// //             exit="exit"
// //             transition={{ duration: 0.4 }}
// //           >
// //             <Card className="shadow-sm border-0">
// //               <Card.Body className="p-4">
// //                 <FaUserEdit size={40} className="text-primary mb-3" />
// //                 <Card.Title className="h5 fw-bold mb-3">Your Profile</Card.Title>
// //                 <Table striped bordered hover responsive>
// //                   <tbody>
// //                     <tr><td className="fw-bold">Name</td><td>{profile.name}</td></tr>
// //                     <tr><td className="fw-bold">Email</td><td>{profile.email}</td></tr>
// //                     <tr><td className="fw-bold">Phone</td><td>{profile.phone}</td></tr>
// //                     <tr><td className="fw-bold">Registered Since</td><td>{profile.registeredSince}</td></tr>
// //                     <tr>
// //                       <td className="fw-bold">Payment Status</td>
// //                       <td>
// //                         <Badge bg={profile.paymentStatus === "Paid" ? "success" : "warning"}>
// //                           {profile.paymentStatus}
// //                         </Badge>
// //                       </td>
// //                     </tr>
// //                   </tbody>
// //                 </Table>
// //                 <Button
// //                   variant="primary"
// //                   className="w-100 mt-3"
// //                   onClick={() => navigate("/profile/edit")}
// //                 >
// //                   Edit Profile
// //                 </Button>
// //               </Card.Body>
// //             </Card>
// //           </motion.div>
// //         );

// //       case "programs":
// //         return (
// //           <motion.div
// //             key="programs"
// //             variants={fadeVariant}
// //             initial="hidden"
// //             animate="visible"
// //             exit="exit"
// //             transition={{ duration: 0.4 }}
// //           >
// //             <Card className="shadow-sm border-0">
// //               <Card.Body className="p-4">
// //                 <FaBook size={40} className="text-primary mb-3" />
// //                 <Card.Title className="h5 fw-bold mb-3">Registered Programs</Card.Title>
// //                 <Table striped bordered hover responsive>
// //                   <thead>
// //                     <tr>
// //                       <th>Name</th>
// //                       <th>Status</th>
// //                       <th>Start Date</th>
// //                       <th>Progress</th>
// //                     </tr>
// //                   </thead>
// //                   <tbody>
// //                     {registeredPrograms.map((program) => (
// //                       <tr key={program.id}>
// //                         <td>{program.name}</td>
// //                         <td>
// //                           <Badge bg={program.status === "Active" ? "success" : "warning"}>
// //                             {program.status}
// //                           </Badge>
// //                         </td>
// //                         <td>{program.startDate}</td>
// //                         <td>{program.progress}%</td>
// //                       </tr>
// //                     ))}
// //                   </tbody>
// //                 </Table>
// //               </Card.Body>
// //             </Card>
// //           </motion.div>
// //         );

// //       case "messages":
// //         return (
// //           <motion.div
// //             key="messages"
// //             variants={fadeVariant}
// //             initial="hidden"
// //             animate="visible"
// //             exit="exit"
// //             transition={{ duration: 0.4 }}
// //           >
// //             <Card className="shadow-sm border-0">
// //               <Card.Body className="p-4">
// //                 <FaEnvelope size={40} className="text-primary mb-3" />
// //                 <Card.Title className="h5 fw-bold mb-3">Messages</Card.Title>
// //                 <Table striped bordered hover responsive>
// //                   <thead>
// //                     <tr>
// //                       <th>Subject</th>
// //                       <th>Date</th>
// //                       <th>Status</th>
// //                       <th>Content</th>
// //                     </tr>
// //                   </thead>
// //                   <tbody>
// //                     {messages.map((msg) => (
// //                       <tr key={msg.id}>
// //                         <td>{msg.subject}</td>
// //                         <td>{msg.date}</td>
// //                         <td>
// //                           <Badge bg={msg.unread ? "danger" : "success"}>
// //                             {msg.unread ? "Unread" : "Read"}
// //                           </Badge>
// //                         </td>
// //                         <td>{msg.content}</td>
// //                       </tr>
// //                     ))}
// //                   </tbody>
// //                 </Table>
// //               </Card.Body>
// //             </Card>
// //           </motion.div>
// //         );

// //       case "assignments":
// //         return (
// //           <motion.div
// //             key="assignments"
// //             variants={fadeVariant}
// //             initial="hidden"
// //             animate="visible"
// //             exit="exit"
// //             transition={{ duration: 0.4 }}
// //           >
// //             <Card className="shadow-sm border-0">
// //               <Card.Body className="p-4">
// //                 <FaUpload size={40} className="text-primary mb-3" />
// //                 <Card.Title className="h5 fw-bold mb-3">Submit Assignment</Card.Title>
// //                 <Form onSubmit={handleSubmitAssignment}>
// //                   <Form.Group className="mb-3">
// //                     <Form.Label className="fw-bold">Upload Assignment</Form.Label>
// //                     <Form.Control type="file" onChange={handleFileChange} required />
// //                   </Form.Group>
// //                   <Button
// //                     type="submit"
// //                     variant="primary"
// //                     className="w-100"
// //                     disabled={loading}
// //                   >
// //                     {loading ? (
// //                       <>
// //                         <Spinner animation="border" size="sm" className="me-2" /> Submitting...
// //                       </>
// //                     ) : (
// //                       "Submit Assignment"
// //                     )}
// //                   </Button>
// //                 </Form>
// //                 {submissionStatus === "success" && (
// //                   <Alert variant="success" className="mt-3">
// //                     ✅ Assignment submitted successfully!
// //                   </Alert>
// //                 )}
// //               </Card.Body>
// //             </Card>
// //           </motion.div>
// //         );

// //       default:
// //         return (
// //           <motion.div
// //             key="default"
// //             variants={fadeVariant}
// //             initial="hidden"
// //             animate="visible"
// //             exit="exit"
// //             transition={{ duration: 0.4 }}
// //           >
// //             <Alert variant="info" className="text-center py-5">
// //               👋 Click on any button above to view your details.
// //             </Alert>
// //           </motion.div>
// //         );
// //     }
// //   };

// //   return (
// //     <section className="py-5 bg-light" id="dashboard">
// //       <Container>
// //         <Row className="justify-content-center mb-4">
// //           <Col lg={8} className="text-center">
// //             <h2 className="fw-bold mb-3">Welcome to Your Dashboard</h2>
// //             <p className="text-muted">
// //               Manage your programs, messages, assignments, and profile.
// //             </p>
// //           </Col>
// //         </Row>

// //         {/* Navigation Buttons */}
// //         <Row className="justify-content-center mb-4 text-center">
// //           <Col lg={10}>
// //             <Button
// //               variant={activeSection === "profile" ? "primary" : "outline-primary"}
// //               className="m-2"
// //               onClick={() => setActiveSection("profile")}
// //             >
// //               Profile
// //             </Button>
// //             <Button
// //               variant={activeSection === "programs" ? "primary" : "outline-primary"}
// //               className="m-2"
// //               onClick={() => setActiveSection("programs")}
// //             >
// //               Programs
// //             </Button>
// //             {/* <Button
// //               variant={activeSection === "messages" ? "primary" : "outline-primary"}
// //               className="m-2"
// //               onClick={() => setActiveSection("messages")}
// //             >
// //               Messages
// //             </Button> */}
// //           <button
// //             style={{
// //               position: "relative",
// //               background: "#007bff",
// //               color: "white",
// //               border: "none",
// //               borderRadius: "8px",
// //               padding: "10px 20px",
// //               cursor: "pointer",
// //             }}
// //              onClick={() => setActiveSection("messages")}
// //              variant={activeSection === "messages" ? "primary" : "outline-primary"}
// //             className="m-2"
// //           >
// //             💬 Messages
// //             {unreadCount > 0 && (
// //               <span
// //                 style={{
// //                   position: "absolute",
// //                   top: "0",
// //                   right: "5px",
// //                   background: "red",
// //                   borderRadius: "50%",
// //                   color: "white",
// //                   fontSize: "12px",
// //                   padding: "3px 6px",
// //                 }}
// //               >
// //                 {unreadCount}
// //               </span>
// //             )}
// //           </button>
// //             <Button
// //               variant={activeSection === "assignments" ? "primary" : "outline-primary"}
// //               className="m-2"
// //               onClick={() => setActiveSection("assignments")}
// //             >
// //               Assignments
// //             </Button>
// //           </Col>
// //         </Row>

// //         {/* Animated Section Content */}
// //         <Row>
// //           <Col lg={12}>
// //             <AnimatePresence mode="wait">{renderSection()}</AnimatePresence>
// //           </Col>
// //         </Row>
// //       </Container>
// //     </section>
// //   );
// // };

// // export default UserDashboard;













// import React, { useState, useEffect, useContext } from "react";
// import {
//   Container,
//   Row,
//   Col,
//   Card,
//   Button,
//   Badge,
//   Table,
//   Form,
//   Alert,
//   Spinner,
// } from "react-bootstrap";
// import {
//   FaBook,
//   FaEnvelope,
//   FaUpload,
//   FaUserEdit,
// } from "react-icons/fa";
// import { useNavigate } from "react-router-dom";
// import envConfig from "../config/envConfig";
// import { useMessages } from "./../context/MessageContext";
// import { UserContext } from "./../context/UserContext";



// const API_URL = envConfig.API_URL;

// const UserDashboard = () => {
//   const navigate = useNavigate();
//   const {ProfileData} = useContext(UserContext);

//   // Section management
//   const [activeSection, setActiveSection] = useState(null);
//   const { unreadCount } = useMessages();

//   // Mock data
//   const registeredPrograms = [
//     { id: 1, name: "Web Development", status: "Active", startDate: "2025-11-01", progress: 25 },
//     { id: 2, name: "Data Science", status: "Pending", startDate: "2025-12-01", progress: 0 },
//   ];

//   const messages = [
//     { id: 1, subject: "Welcome to RiggsTech!", date: "2025-10-24", unread: true, content: "Thank you for registering!" },
//     { id: 2, subject: "Assignment Reminder", date: "2025-10-25", unread: false, content: "Submit by end of week." },
//   ];

//   const profile = {
//     name: "John Doe",
//     email: "john@example.com",
//     phone: "+2376712345678",
//     registeredSince: "2025-10-24",
//     paymentStatus: "Paid",
//   };

//   // Assignment submission state
//   const [assignmentFile, setAssignmentFile] = useState(null);
//   const [submissionStatus, setSubmissionStatus] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [program, setProgram] = useState(null);

//   const handleFileChange = (e) => setAssignmentFile(e.target.files[0]);

//   const { profileData, fetchUserProfile } = useContext(UserContext);

//   // const handleProfileFetch = (e) =>{
//   //   ProfileData()
//   // }

//   const handleSubmitAssignment = (e) => {
//     e.preventDefault();
//     if (!assignmentFile) return;
//     setLoading(true);

//     setTimeout(() => {
//       setSubmissionStatus("success");
//       setAssignmentFile(null);
//       setLoading(false);
//     }, 1500);
//   };

//   useEffect(() => {
//     const fetchPrograms = async () => {
//       const response = await fetch(`${API_URL}/user/programs`, {
//         headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
//       });
//       setProgram(await response.json());
//     };
//     fetchPrograms();
//   }, []);

   

//   useEffect(() => {
//     if (!profileData) fetchUserProfile(); // optional refresh if not loaded yet
//   }, []);

//   // useEffect(() => {
//   //   const fetchUserProfile = async () => {
//   //     const response = await fetch(`${API_URL}/user/profile`, {
//   //       headers: { Authorization: `Bearer ${localStorage.getItem("userToken")}` },
//   //     });
//   //     const pData = await response.json();
//   //     console.log("PROFILE DATA FROM SERVER  ",pData)
//   //     // ProfileData(pData)
//   //   };
//   //   fetchUserProfile();
//   // }, []);
//   console.log("PROFILE DATA DASHBOARD new ",profileData)
//   console.log("PROGRAM DATA DASHBOARD new ",program)

//   // Render helper
//   const renderSection = () => {
//     switch (activeSection) {
//       case "profile":
//         return (
//           <Card className="shadow-sm border-0 hover-card">
//             <Card.Body className="p-4">
//               <FaUserEdit size={40} className="text-primary mb-3" />
//               <Card.Title className="h5 fw-bold mb-3">Your Profile</Card.Title>
//               <Table striped bordered hover responsive>
//                 <tbody>
//                   <tr><td className="fw-bold">Name</td><td>{profileData.first_name} {profileData.last_name}</td></tr>
//                   <tr><td className="fw-bold">Email</td><td>{profileData.email}</td></tr>
//                   <tr><td className="fw-bold">Phone</td><td>{profileData.phone}</td></tr>
//                   <tr><td className="fw-bold">Registered Since</td><td>{profileData.created_at}</td></tr>
//                   <tr>
//                     <td className="fw-bold">Payment Status</td>
//                     <td>
//                       <Badge bg={profileData.status === "initiated" ? "warning" : "success" }>
//                         {profileData.status === "initiated" ? "Pending" : "Paid" }
//                       </Badge>
//                     </td>
//                   </tr>
//                 </tbody>
//               </Table>
//               <Button variant="primary" className="w-100 mt-3" onClick={() => navigate("/profile/edit")}>
//                 Edit Profile
//               </Button>
//             </Card.Body>
//           </Card>
//         );

//       case "programs":
//         return (
//           <Card className="shadow-sm border-0 hover-card">
//             <Card.Body className="p-4">
//               <FaBook size={40} className="text-primary mb-3" />
//               <Card.Title className="h5 fw-bold mb-3">Registered Programs</Card.Title>
//               <Table striped bordered hover responsive>
//                 <thead>
//                   <tr>
//                     <th>Name</th>
//                     <th>Status</th>
//                     <th>Start Date</th>
//                     <th>Progress</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {registeredPrograms.map((program) => (
//                     <tr key={program.id}>
//                       <td>{program.name}</td>
//                       <td>
//                         <Badge bg={program.status === "Active" ? "success" : "warning"}>
//                           {program.status}
//                         </Badge>
//                       </td>
//                       <td>{program.startDate}</td>
//                       <td>{program.progress}%</td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </Table>
//             </Card.Body>
//           </Card>
//         );

//       case "messages":
//         return (
//           <Card className="shadow-sm border-0 hover-card">
//             <Card.Body className="p-4">
//               <FaEnvelope size={40} className="text-primary mb-3" />
//               <Card.Title className="h5 fw-bold mb-3">Messages</Card.Title>
//               <Table striped bordered hover responsive>
//                 <thead>
//                   <tr>
//                     <th>Subject</th>
//                     <th>Date</th>
//                     <th>Status</th>
//                     <th>Content</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {messages.map((msg) => (
//                     <tr key={msg.id}>
//                       <td>{msg.subject}</td>
//                       <td>{msg.date}</td>
//                       <td>
//                         <Badge bg={msg.unread ? "danger" : "success"}>
//                           {msg.unread ? "Unread" : "Read"}
//                         </Badge>
//                       </td>
//                       <td>{msg.content}</td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </Table>
//             </Card.Body>
//           </Card>
//         );

//       case "assignments":
//         return (
//           <Card className="shadow-sm border-0 hover-card">
//             <Card.Body className="p-4">
//               <FaUpload size={40} className="text-primary mb-3" />
//               <Card.Title className="h5 fw-bold mb-3">Submit Assignment</Card.Title>
//               <Form onSubmit={handleSubmitAssignment}>
//                 <Form.Group className="mb-3">
//                   <Form.Label className="fw-bold">Upload Assignment</Form.Label>
//                   <Form.Control type="file" onChange={handleFileChange} required />
//                 </Form.Group>
//                 <Button
//                   type="submit"
//                   variant="primary"
//                   className="w-100"
//                   disabled={loading}
//                 >
//                   {loading ? (
//                     <>
//                       <Spinner animation="border" size="sm" className="me-2" /> Submitting...
//                     </>
//                   ) : (
//                     "Submit Assignment"
//                   )}
//                 </Button>
//               </Form>
//               {submissionStatus === "success" && (
//                 <Alert variant="success" className="mt-3">
//                   ✅ Assignment submitted successfully!
//                 </Alert>
//               )}
//             </Card.Body>
//           </Card>
//         );

//       default:
//         return (
//           <Alert variant="info" className="text-center py-5">
//             👋 Click on any button above to view your details.
//           </Alert>
//         );
//     }
//   };

//   return (
//     <section className="py-5 bg-light" id="dashboard">
//       <Container>
//         <Row className="justify-content-center mb-4">
//           <Col lg={8} className="text-center">
//             <h2 className="fw-bold mb-3">Welcome to Your Dashboard</h2>
//             <p className="text-muted">Manage your programs, messages, assignments, and profile.</p>
//           </Col>
//         </Row>

//         {/* Navigation Buttons */}
//         <Row className="justify-content-center mb-4 text-center">
//           <Col lg={10}>
//             <Button
//               variant={activeSection === "profile" ? "primary" : "outline-primary"}
//               className="m-2"
//               onClick={() => setActiveSection("profile")}
//             >
//               Profile
//             </Button>
//             <Button
//               variant={activeSection === "programs" ? "primary" : "outline-primary"}
//               className="m-2"
//               onClick={() => setActiveSection("programs")}
//             >
//               Programs
//             </Button>
//             <Button
//             // style={{
//             //   position: "relative",
//             //   // background: "#007bff",
//             //   color: "white",
//             //   border: "none",
//             //   borderRadius: "8px",
//             //   padding: "10px 20px",
//             //   cursor: "pointer",
//             // }}
//              onClick={() => setActiveSection("messages")}
//              variant={activeSection === "messages" ? "primary" : "outline-primary"}
//             className="m-2"
//           >
//             💬 Messages
//             {unreadCount > 0 && (
//               <span
//                 style={{
//                   position: "absolute",
//                   top: "0",
//                   right: "5px",
//                   background: "red",
//                   borderRadius: "50%",
//                   color: "white",
//                   fontSize: "12px",
//                   padding: "3px 6px",
//                 }}
//               >
//                 {unreadCount}
//               </span>
//             )}
//           </Button>
//             <Button
//               variant={activeSection === "assignments" ? "primary" : "outline-primary"}
//               className="m-2"
//               onClick={() => setActiveSection("assignments")}
//             >
//               Assignments
//             </Button>
//           </Col>
//         </Row>

//         <Row>
//           <Col lg={12}>{renderSection()}</Col>
//         </Row>
//       </Container>
//     </section>
//   );
// };

// export default UserDashboard;

















// // // // import React, { useState, useEffect } from 'react';
// // // // import { Container, Row, Col, Card, Button, Badge, Table, Form, Alert, Spinner } from 'react-bootstrap';
// // // // import { FaBook, FaEnvelope, FaUpload, FaUserEdit, FaCalendarAlt, FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';
// // // // import { useNavigate } from 'react-router-dom';
// // // // import { UserContext } from '../context/UserContext';
// // // // import envConfig from "../config/envConfig";

// // // // const API_URL = envConfig.API_URL;

// // // // const UserDashboard = () => {
// // // //   const navigate = useNavigate();

// // // //   // Mock data - Replace with API fetches in useEffect
// // // //   const registeredPrograms = [
// // // //     { id: 1, name: 'Web Development', status: 'Active', startDate: '2025-11-01', progress: 25 },
// // // //     { id: 2, name: 'Data Science', status: 'Pending', startDate: '2025-12-01', progress: 0 }
// // // //   ];

// // // //   const messages = [
// // // //     { id: 1, subject: 'Welcome to RiggsTech!', date: '2025-10-24', unread: true, content: 'Thank you for registering!' },
// // // //     { id: 2, subject: 'Assignment Reminder', date: '2025-10-25', unread: false, content: 'Submit by end of week.' }
// // // //   ];

// // // //   const profile = {
// // // //     name: 'John Doe',
// // // //     email: 'john@example.com',
// // // //     phone: '+256712345678',
// // // //     registeredSince: '2025-10-24',
// // // //     paymentStatus: 'Paid'
// // // //   };

// // // //   // Assignment submission state
// // // //   const [assignmentFile, setAssignmentFile] = useState(null);
// // // //   const [submissionStatus, setSubmissionStatus] = useState(null);
// // // //   const [loading, setLoading] = useState(false);

// // // //   const handleFileChange = (e) => {
// // // //     setAssignmentFile(e.target.files[0]);
// // // //   };

// // // //   const handleSubmitAssignment = async (e) => {
// // // //     e.preventDefault();
// // // //     if (!assignmentFile) return;

// // // //     setLoading(true);
// // // //     // Mock API call - Replace with fetch('/api/user/assignments', { method: 'POST', body: formData })
// // // //     setTimeout(() => {
// // // //       setSubmissionStatus('success');
// // // //       setAssignmentFile(null);
// // // //       setLoading(false);
// // // //     }, 1500);
// // // //   };
  
// // // //   useEffect(() => {
// // // //   const fetchPrograms = async () => {
// // // //     const response = await fetch(`${API_URL}/user/programs`, {
// // // //       headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
// // // //     });
// // // //     const data = await response.json();
// // // //     // Set data
// // // //   };
// // // //   fetchPrograms();
// // // // }, []);

// // // //   return (
// // // //     <section className="py-5 bg-light" id="dashboard">
// // // //       <Container>
// // // //         <Row className="justify-content-center mb-5">
// // // //           <Col lg={8} className="text-center">
// // // //             <div className="icon-wrapper mb-3">
// // // //               <FaUserEdit size={50} className="text-primary" />
// // // //             </div>
// // // //             <h2 className="display-5 fw-bold mb-3">Your Dashboard</h2>
// // // //             <p className="lead text-muted">
// // // //               Manage your programs, messages, assignments, and profile.
// // // //             </p>
// // // //           </Col>
// // // //         </Row>

// // // //         {/* Profile Section */}
// // // //         <Row className="mb-5">
// // // //           <Col lg={12}>
// // // //             <Card className="h-100 shadow-sm border-0 hover-card">
// // // //               <Card.Body className="p-4">
// // // //                 <div className="icon-wrapper mb-3">
// // // //                   <FaUserEdit size={50} className="text-primary" />
// // // //                 </div>
// // // //                 <Card.Title className="h5 fw-bold mb-3">
// // // //                   Your Profile
// // // //                 </Card.Title>
// // // //                 <Table striped bordered hover responsive>
// // // //                   <tbody>
// // // //                     <tr>
// // // //                       <td className="fw-bold">Name</td>
// // // //                       <td>{profile.name}</td>
// // // //                     </tr>
// // // //                     <tr>
// // // //                       <td className="fw-bold">Email</td>
// // // //                       <td>{profile.email}</td>
// // // //                     </tr>
// // // //                     <tr>
// // // //                       <td className="fw-bold">Phone</td>
// // // //                       <td>{profile.phone}</td>
// // // //                     </tr>
// // // //                     <tr>
// // // //                       <td className="fw-bold">Registered Since</td>
// // // //                       <td>{profile.registeredSince}</td>
// // // //                     </tr>
// // // //                     <tr>
// // // //                       <td className="fw-bold">Payment Status</td>
// // // //                       <td>
// // // //                         <Badge bg={profile.paymentStatus === 'Paid' ? 'success' : 'warning'}>
// // // //                           {profile.paymentStatus}
// // // //                         </Badge>
// // // //                       </td>
// // // //                     </tr>
// // // //                   </tbody>
// // // //                 </Table>
// // // //                 <Button variant="primary" className="w-100 mt-3" onClick={() => navigate('/profile/edit')}>
// // // //                   Edit Profile
// // // //                 </Button>
// // // //               </Card.Body>
// // // //             </Card>
// // // //           </Col>
// // // //         </Row>

// // // //         {/* Registered Programs Section */}
// // // //         <Row className="mb-5">
// // // //           <Col lg={12}>
// // // //             <Card className="h-100 shadow-sm border-0 hover-card">
// // // //               <Card.Body className="p-4">
// // // //                 <div className="icon-wrapper mb-3">
// // // //                   <FaBook size={50} className="text-primary" />
// // // //                 </div>
// // // //                 <Card.Title className="h5 fw-bold mb-3">
// // // //                   Registered Programs
// // // //                 </Card.Title>
// // // //                 <Table striped bordered hover responsive>
// // // //                   <thead>
// // // //                     <tr>
// // // //                       <th>Name</th>
// // // //                       <th>Status</th>
// // // //                       <th>Start Date</th>
// // // //                       <th>Progress</th>
// // // //                     </tr>
// // // //                   </thead>
// // // //                   <tbody>
// // // //                     {registeredPrograms.map((program) => (
// // // //                       <tr key={program.id}>
// // // //                         <td>{program.name}</td>
// // // //                         <td>
// // // //                           <Badge bg={program.status === 'Active' ? 'success' : 'warning'}>
// // // //                             {program.status}
// // // //                           </Badge>
// // // //                         </td>
// // // //                         <td>{program.startDate}</td>
// // // //                         <td>{program.progress}%</td>
// // // //                       </tr>
// // // //                     ))}
// // // //                   </tbody>
// // // //                 </Table>
// // // //               </Card.Body>
// // // //             </Card>
// // // //           </Col>
// // // //         </Row>

// // // //         {/* Messages Section */}
// // // //         <Row className="mb-5">
// // // //           <Col lg={12}>
// // // //             <Card className="h-100 shadow-sm border-0 hover-card">
// // // //               <Card.Body className="p-4">
// // // //                 <div className="icon-wrapper mb-3">
// // // //                   <FaEnvelope size={50} className="text-primary" />
// // // //                 </div>
// // // //                 <Card.Title className="h5 fw-bold mb-3">
// // // //                   Messages
// // // //                 </Card.Title>
// // // //                 <Table striped bordered hover responsive>
// // // //                   <thead>
// // // //                     <tr>
// // // //                       <th>Subject</th>
// // // //                       <th>Date</th>
// // // //                       <th>Status</th>
// // // //                       <th>Content</th>
// // // //                     </tr>
// // // //                   </thead>
// // // //                   <tbody>
// // // //                     {messages.map((msg) => (
// // // //                       <tr key={msg.id}>
// // // //                         <td>{msg.subject}</td>
// // // //                         <td>{msg.date}</td>
// // // //                         <td>
// // // //                           <Badge bg={msg.unread ? 'danger' : 'success'}>
// // // //                             {msg.unread ? 'Unread' : 'Read'}
// // // //                           </Badge>
// // // //                         </td>
// // // //                         <td>{msg.content}</td>
// // // //                       </tr>
// // // //                     ))}
// // // //                   </tbody>
// // // //                 </Table>
// // // //               </Card.Body>
// // // //             </Card>
// // // //           </Col>
// // // //         </Row>

// // // //         {/* Submit Assignments Section */}
// // // //         <Row className="mb-5">
// // // //           <Col lg={12}>
// // // //             <Card className="h-100 shadow-sm border-0 hover-card">
// // // //               <Card.Body className="p-4">
// // // //                 <div className="icon-wrapper mb-3">
// // // //                   <FaUpload size={50} className="text-primary" />
// // // //                 </div>
// // // //                 <Card.Title className="h5 fw-bold mb-3">
// // // //                   Submit Assignments
// // // //                 </Card.Title>
// // // //                 <Form onSubmit={handleSubmitAssignment}>
// // // //                   <Form.Group className="mb-4">
// // // //                     <Form.Label className="fw-bold">Upload Assignment File</Form.Label>
// // // //                     <Form.Control 
// // // //                       type="file" 
// // // //                       onChange={handleFileChange} 
// // // //                       className="rounded-pill px-4"
// // // //                       required
// // // //                     />
// // // //                   </Form.Group>
// // // //                   <Button 
// // // //                     type="submit" 
// // // //                     variant="primary" 
// // // //                     className="w-100 rounded-pill py-3 fw-bold" 
// // // //                     disabled={loading}
// // // //                   >
// // // //                     {loading ? (
// // // //                       <>
// // // //                         <Spinner animation="border" size="sm" className="me-2" />
// // // //                         Submitting...
// // // //                       </>
// // // //                     ) : (
// // // //                       'Submit Assignment'
// // // //                     )}
// // // //                   </Button>
// // // //                 </Form>
// // // //                 {submissionStatus === 'success' && (
// // // //                   <Alert variant="success" className="mt-3">
// // // //                     ✅ Assignment submitted successfully!
// // // //                   </Alert>
// // // //                 )}
// // // //               </Card.Body>
// // // //             </Card>
// // // //           </Col>
// // // //         </Row>
// // // //       </Container>
// // // //     </section>
// // // //   );
// // // // };

// // // // export default UserDashboard;