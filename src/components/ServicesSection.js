import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Spinner, Alert } from 'react-bootstrap';
import { iconMap } from '../components/iconMap';
import { fetchServices } from '../services/FetchServices';
import { useNavigate } from 'react-router-dom';

const ServicesSection = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadOnlineServices = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchServices('online');
        setServices(data);
      } catch (err) {
        setError('Failed to load training programs. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    loadOnlineServices();
  }, []);

  /** --------------------------------------------------------------
   *  When the user clicks “Enrol Now” we store ONLY the **course name**
   *  (and the id if you have it).  This is enough for the dropdown.
   *  -------------------------------------------------------------- */
  const handleEnrol = (service) => {
    const payload = {
      id: service.id,
      name: service.title,               // <-- the exact name shown in the dropdown
      price: service.price,
      // you can add anything else you need later
    };
    sessionStorage.setItem('selectedCourse', JSON.stringify(payload));
    navigate('/register');
  };

  /* ------------------------------------------------------------------ */
  if (loading) return <Spinner animation="border" className="d-block mx-auto my-5" />;
  if (error) return <Alert variant="danger">{error}</Alert>;

  return (
    <section className="py-5 bg-light" id="services">
      <Container>
        {/* … header … */}
        {services.length === 0 ? (
          <Alert variant="info" className="text-center">
            No online programs available at the moment.
          </Alert>
        ) : (
          <Row>
            {services.map((service) => {
              const Icon = iconMap[service.icon];
              return (
                <Col lg={4} md={6} key={service.id} className="mb-4">
                  <Card className="h-100 shadow-sm border-0 hover-card">
                    <Card.Body className="p-4 text-center">
                      <div className="icon-wrapper mb-3">
                        {Icon && <Icon size={50} className="text-primary" />}
                      </div>
                      <Card.Title className="h5 fw-bold mb-3">{service.title}</Card.Title>
                      <Card.Text className="text-muted mb-3">{service.description}</Card.Text>

                      <div className="d-flex justify-content-between align-items-center mb-3">
                        <span className="badge bg-success">{service.duration}</span>
                        <span className="h6 fw-bold text-primary">{service.price}</span>
                      </div>

                      <Button
                        variant="primary"
                        className="w-100 rounded-pill"
                        onClick={() => handleEnrol(service)}
                      >
                        Enrol Now
                      </Button>
                    </Card.Body>
                  </Card>
                </Col>
              );
            })}
          </Row>
        )}
        {/* … “View All” button … */}
      </Container>
    </section>
  );
};

export default ServicesSection;









// // src/sections/ServicesSection.jsx
// import React, { useState, useEffect } from 'react';
// import { Container, Row, Col, Card, Button, Spinner, Alert } from 'react-bootstrap';
// import { iconMap } from '../components/iconMap';
// import { fetchServices } from '../services/FetchServices';
// import { useNavigate } from 'react-router-dom';

// const ServicesSection = () => {
//   const [services, setServices] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const loadOnlineServices = async () => {
//       try {
//         setLoading(true);
//         setError(null);
//         const data = await fetchServices('online');
//         setServices(data);
//       } catch (err) {
//         setError('Failed to load training programs. Please try again later.');
//       } finally {
//         setLoading(false);
//       }
//     };
//     loadOnlineServices();
//   }, []);

//   // Save selected program to sessionStorage and redirect
//   const handleEnrollClick = (service) => {
//     const programData = {
//       id: service.id,
//       title: service.title,
//       price: service.price,
//       duration: service.duration,
//       icon: service.icon,
//       description: service.description,
//       selectedAt: new Date().toISOString(),
//     };

//     // Save to sessionStorage (persists during registration flow)
//     sessionStorage.setItem('selectedProgram', JSON.stringify(programData));

//     // Optional: Track in localStorage for longer persistence
//     // localStorage.setItem('lastSelectedProgram', JSON.stringify(programData));

//     // Navigate to registration
//     navigate('/register');
//   };

//   if (loading) {
//     return (
//       <section className="py-5 bg-light" id="services">
//         <Container className="text-center">
//           <Spinner animation="border" variant="primary" />
//           <p className="mt-3">Loading training programs...</p>
//         </Container>
//       </section>
//     );
//   }

//   if (error) {
//     return (
//       <section className="py-5 bg-light" id="services">
//         <Container>
//           <Alert variant="danger">{error}</Alert>
//         </Container>
//       </section>
//     );
//   }

//   return (
//     <section className="py-5 bg-light" id="services">
//       <Container>
//         <Row className="justify-content-center mb-5">
//           <Col lg={8} className="text-center">
//             <h2 className="display-5 fw-bold mb-3">Our Training Programs</h2>
//             <p className="lead text-muted">
//               Choose from our expert-led online programs. Lifetime access + certification included!
//             </p>
//           </Col>
//         </Row>

//         {/* Services Grid – Online Only */}
//         {services.length === 0 ? (
//           <Alert variant="info" className="text-center">
//             No online programs available at the moment.
//           </Alert>
//         ) : (
//           <Row>
//             {services.map((service) => {
//               const Icon = iconMap[service.icon];
//               return (
//                 <Col lg={4} md={6} key={service.id} className="mb-4">
//                   <Card className="h-100 shadow-sm border-0 hover-card">
//                     <Card.Body className="p-4 text-center">
//                       <div className="icon-wrapper mb-3">
//                         {Icon && <Icon size={50} className="text-primary" />}
//                       </div>
//                       <Card.Title className="h5 fw-bold mb-3">
//                         {service.title}
//                       </Card.Title>
//                       <Card.Text className="text-muted mb-3">
//                         {service.description}
//                       </Card.Text>
//                       <div className="d-flex justify-content-between align-items-center mb-3">
//                         <span className="badge bg-success">{service.duration}</span>
//                         <span className="h6 fw-bold text-primary">{service.price}</span>
//                       </div>
//                       <Button
//                         variant="primary"
//                         className="w-100 rounded-pill"
//                         onClick={() => handleEnrollClick(service)}
//                       >
//                         Enroll Now
//                       </Button>
//                     </Card.Body>
//                   </Card>
//                 </Col>
//               );
//             })}
//           </Row>
//         )}
//         <div className="text-center mt-5">
//           <Button variant="outline-primary" size="lg" className="px-5 py-3">
//             View All Online Courses
//           </Button>
//         </div>
//       </Container>
//     </section>
//   );
// };

// export default ServicesSection;







// // // src/sections/ServicesSection.jsx
// // import React, { useState, useEffect } from 'react';
// // import { Container, Row, Col, Card, Button, Spinner, Alert } from 'react-bootstrap';
// // import { iconMap } from '../components/iconMap';
// // import { fetchServices } from '../services/FetchServices';

// // const ServicesSection = () => {
// //   const [services, setServices] = useState([]);
// //   const [loading, setLoading] = useState(true);
// //   const [error, setError] = useState(null);

// //   useEffect(() => {
// //     const loadOnlineServices = async () => {
// //       try {
// //         setLoading(true);
// //         setError(null);
// //         // Always fetch only online services
// //         const data = await fetchServices('online');
// //         setServices(data);
// //       } catch (err) {
// //         setError('Failed to load training programs. Please try again later.');
// //       } finally {
// //         setLoading(false);
// //       }
// //     };

// //     loadOnlineServices();
// //   }, []);

// //   if (loading) {
// //     return (
// //       <section className="py-5 bg-light" id="services">
// //         <Container className="text-center">
// //           <Spinner animation="border" variant="primary" />
// //           <p className="mt-3">Loading training programs...</p>
// //         </Container>
// //       </section>
// //     );
// //   }

// //   if (error) {
// //     return (
// //       <section className="py-5 bg-light" id="services">
// //         <Container>
// //           <Alert variant="danger">{error}</Alert>
// //         </Container>
// //       </section>
// //     );
// //   }

// //   return (
// //     <section className="py-5 bg-light" id="services">
// //       <Container>
// //         <Row className="justify-content-center mb-5">
// //           <Col lg={8} className="text-center">
// //             <h2 className="display-5 fw-bold mb-3">Our Training Programs</h2>
// //             <p className="lead text-muted">
// //               Choose from our expert-led online programs. Lifetime access + certification included!
// //             </p>
// //           </Col>
// //         </Row>

// //         {/* Services Grid – Online Only */}
// //         {services.length === 0 ? (
// //           <Alert variant="info" className="text-center">
// //             No online programs available at the moment.
// //           </Alert>
// //         ) : (
// //           <Row>
// //             {services.map((service) => {
// //               const Icon = iconMap[service.icon];
// //               return (
// //                 <Col lg={4} md={6} key={service.id} className="mb-4">
// //                   <Card className="h-100 shadow-sm border-0 hover-card">
// //                     <Card.Body className="p-4 text-center">
// //                       <div className="icon-wrapper mb-3">
// //                         {Icon && <Icon size={50} className="text-primary" />}
// //                       </div>
// //                       <Card.Title className="h5 fw-bold mb-3">
// //                         {service.title}
// //                       </Card.Title>
// //                       <Card.Text className="text-muted mb-3">
// //                         {service.description}
// //                       </Card.Text>
// //                       <div className="d-flex justify-content-between align-items-center mb-3">
// //                         <span className="badge bg-success">{service.duration}</span>
// //                         <span className="h6 fw-bold text-primary">{service.price}</span>
// //                       </div>

// //                       {/* REMOVED: Online/In-Person badge */}

// //                       <Button
// //                         variant="primary"
// //                         className="w-100"
// //                         onClick={() => window.location.href = '/register'}
// //                         // as='/register'
// //                       >
// //                         Enroll Now
// //                       </Button>
// //                     </Card.Body>
// //                   </Card>
// //                 </Col>
// //               );
// //             })}
// //           </Row>
// //         )}

// //         <div className="text-center mt-5">
// //           <Button variant="outline-primary" size="lg" className="px-5 py-3">
// //             View All Online Courses
// //           </Button>
// //         </div>
// //       </Container>
// //     </section>
// //   );
// // };

// // export default ServicesSection;