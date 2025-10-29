// src/sections/ServicesSection.jsx
import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Spinner, Alert, ToggleButton, ToggleButtonGroup } from 'react-bootstrap';
import { iconMap } from '../components/iconMap';
import { fetchServices } from '../services/FetchServices';

const ServicesSection = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('online'); // default: online only

  useEffect(() => {
    const loadServices = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchServices(filter);
        setServices(data);
      } catch (err) {
        setError('Failed to load services. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    loadServices();
  }, [filter]);

  const handleFilterChange = (val) => setFilter(val);

  if (loading) {
    return (
      <section className="py-5 bg-light" id="services">
        <Container className="text-center">
          <Spinner animation="border" variant="primary" />
          <p className="mt-3">Loading training programs...</p>
        </Container>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-5 bg-light" id="services">
        <Container>
          <Alert variant="danger">{error}</Alert>
        </Container>
      </section>
    );
  }

  return (
    <section className="py-5 bg-light" id="services">
      <Container>
        <Row className="justify-content-center mb-5">
          <Col lg={8} className="text-center">
            <h2 className="display-5 fw-bold mb-3">Our Training Programs</h2>
            <p className="lead text-muted">
              Choose from our expert-led programs designed for beginners to advanced learners.
              Lifetime access + certification included!
            </p>
          </Col>
        </Row>

        {/* Filter Buttons */}
        <Row className="justify-content-center mb-4">
          <Col md={6} className="text-center">
            <ToggleButtonGroup type="radio" name="filter" value={filter} onChange={handleFilterChange}>
              <ToggleButton id="tbg-radio-all" value="all" variant="outline-primary">
                All Programs
              </ToggleButton>
              <ToggleButton id="tbg-radio-online" value="online" variant="outline-success">
                Online Only
              </ToggleButton>
              <ToggleButton id="tbg-radio-offline" value="offline" variant="outline-secondary">
                In-Person Only
              </ToggleButton>
            </ToggleButtonGroup>
          </Col>
        </Row>

        {/* Services Grid */}
        {services.length === 0 ? (
          <Alert variant="info" className="text-center">
            No {filter === 'all' ? '' : filter} programs available at the moment.
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
                      <div className="mb-3">
                        <span className={`badge ${service.isOnline ? 'bg-success' : 'bg-secondary'}`}>
                          {service.isOnline ? 'Online' : 'In-Person'}
                        </span>
                      </div>
                      <Button
                        variant="primary"
                        className="w-100"
                        onClick={() => window.location.href = '#enroll'}
                      >
                        Enroll Now
                      </Button>
                    </Card.Body>
                  </Card>
                </Col>
              );
            })}
          </Row>
        )}

        <div className="text-center mt-5">
          <Button variant="outline-primary" size="lg" className="px-5 py-3">
            View All 25+ Courses
          </Button>
        </div>
      </Container>
    </section>
  );
};

export default ServicesSection;













// import React from 'react';
// import { Container, Row, Col, Card, Button } from 'react-bootstrap';
// import { 
//   FaCode, 
//   FaChartBar,  
//   FaMobileAlt, 
//   FaDatabase, 
//   FaCloud, 
//   FaAssistiveListeningSystems,
//   FaMicrosoft,
//   FaServicestack,
//   FaBug
// } from 'react-icons/fa';

// const services = [
//   {
//     icon: FaCode,
//     title: "Web Development",
//     description: "Master HTML, CSS, JavaScript, React & Node.js. Build responsive websites.",
//     duration: "8 weeks",
//     price: "XAF 15,000"
//   },
//   {
//     icon: FaChartBar,
//     title: "Data Science",
//     description: "Learn Python, SQL, Machine Learning & Data Visualization. Analyze real datasets.",
//     duration: "12 weeks",
//     price: "XAF 15,000"
//   },
//   {
//     icon: FaMobileAlt,
//     title: "Digital Marketing",
//     description: "SEO, Social Media, Google Ads & Analytics. Drive traffic and conversions.",
//     duration: "6 weeks",
//     price: "XAF 15,000"
//   },
//   {
//     icon: FaServicestack,
//     title: "Backend Development",
//     description: "Node.js, Express, Fastapi, Django & Flask. Build scalable backend applications.",
//     duration: "10 weeks",
//     price: "XAF 15,000"
//   },
//   {
//     icon: FaMobileAlt,
//     title: "Database Administration",
//     description: "SQL, NoSQL, PostgreSQL & MongoDB. Design and manage enterprise databases.",
//     duration: "10 weeks",
//     price: "XAF 15,000"
//   },
//   {
//     icon: FaMobileAlt,
//     title: "Frontend Development",
//     description: "HTML, CSS, JavaScript, React & Node.js. Build responsive websites.",
//     duration: "8 weeks",
//     price: "XAF 15,000"
//   },
//   {
//     icon: FaMobileAlt,
//     title: "Full Stack Development",
//     description: "Node.js, Express, MongoDB & PostgreSQL. Build scalable backend applications.",
//     duration: "10 weeks",
//     price: "XAF 15,000"
//   },
//   {
//     icon: FaMobileAlt,
//     title: "Mobile App Dev",
//     description: "iOS & Android development with React Native & Flutter. Build cross-platform apps.",
//     duration: "10 weeks",
//     price: "XAF 15,000"
//   },
//   {
//     icon: FaDatabase,
//     title: "Database Management",
//     description: "SQL, NoSQL, PostgreSQL & MongoDB. Design and manage enterprise databases.",
//     duration: "8 weeks",
//     price: "XAF 15,000"
//   }
//   ,
//   {
//     icon: FaMicrosoft,
//     title: "Microsoft Office Skills",
//     description: "Excel, Word, PowerPoint & Access. Master essential Microsoft Office skills.",
//     duration: "6 weeks",
//     price: "XAF 15,000"
//   },
//   {
//     icon: FaBug,
//     title: "Test Automation",
//     description: "Learn test manual ad automated testing skills using Selenium, Cypress, Playwright, Appium, Python and more. Ensure software quality.",
//     duration: "10 weeks",
//     price: "XAF 15,000"
//   },
//   {
//     icon: FaCloud,
//     title: "Cloud Computing",
//     description: "AWS, Azure & Google Cloud. Deploy scalable applications in the cloud.",
//     duration: "10 weeks",
//     price: "XAF 15,000"
//   }
// ];

// const ServicesSection = () => {
//   return (
//     <section className="py-5 bg-light" id="services">
//       <Container>
//         <Row className="justify-content-center mb-5">
//           <Col lg={8} className="text-center">
//             <h2 className="display-5 fw-bold mb-3">Our Training Programs</h2>
//             <p className="lead text-muted">
//               Choose from our expert-led programs designed for beginners to advanced learners.
//               Lifetime access + certification included!
//             </p>
//           </Col>
//         </Row>
        
//         <Row>
//           {services.map((service, index) => (
//             <Col lg={4} md={6} key={index} className="mb-4">
//               <Card className="h-100 shadow-sm border-0 hover-card">
//                 <Card.Body className="p-4 text-center">
//                   <div className="icon-wrapper mb-3">
//                     <service.icon 
//                       size={50} 
//                       className="text-primary" 
//                     />
//                   </div>
//                   <Card.Title className="h5 fw-bold mb-3">
//                     {service.title}
//                   </Card.Title>
//                   <Card.Text className="text-muted mb-3">
//                     {service.description}
//                   </Card.Text>
//                   <div className="d-flex justify-content-between align-items-center mb-3">
//                     <span className="badge bg-success">{service.duration}</span>
//                     <span className="h6 fw-bold text-primary">{service.price}</span>
//                   </div>
//                   <Button 
//                     variant="primary" 
//                     className="w-100"
//                     onClick={() => window.location.href = '#enroll'}
//                   >
//                     Enroll Now
//                   </Button>
//                 </Card.Body>
//               </Card>
//             </Col>
//           ))}
//         </Row>

//         <div className="text-center mt-5">
//           <Button 
//             variant="outline-primary" 
//             size="lg"
//             className="px-5 py-3"
//           >
//             View All 25+ Courses
//           </Button>
//         </div>
//       </Container>
//     </section>
//   );
// };

// export default ServicesSection;