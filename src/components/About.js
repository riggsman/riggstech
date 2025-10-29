import React from 'react';
import { Container, Row, Col, Card, Badge, Button } from 'react-bootstrap';
import { FaGraduationCap, FaLaptopCode, FaMobileAlt, FaConsulting, FaUsers, FaCalendar, FaLinkedin, FaQuoteLeft, FaMapMarkerAlt, FaGithub, FaPeopleArrows } from 'react-icons/fa';

const About = () => {
  return (
    <>
      {/* Hero Section */}
      <section className="py-5 bg-primary text-white">
        <Container>
          <Row className="justify-content-center text-center">
            <Col lg={10}>
              <h1 className="display-4 fw-bold mb-4">About RiggsTech</h1>
              <Badge bg="warning" className="fs-4 px-4 py-2 mb-4">
                <FaCalendar className="me-2" /> Founded in 2025
              </Badge>
              <p className="lead fs-4 mb-0">
                An IT company born from passion for engineering and frustration with education gaps
              </p>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Main About Content - YOUR EXACT WORDS */}
      <section className="py-5 bg-light">
        <Container>
          <Row className="justify-content-center">
            <Col lg={10}>
              <Card className="border-0 shadow-sm mb-5">
                <Card.Body className="p-5">
                  <p className="fs-5 text-muted mb-0">
                    RiggsTech is an innovative IT company born from a deep passion for engineering and a profound frustration with the state of education today. 
                    Founded in 2025 by <strong>Eyambe Rigobert Ashu</strong>, a seasoned software engineer, our mission is to empower young people—whether recent graduates or lifelong learners—to acquire practical, lifelong skills that bridge the gap between academic qualifications and real-world competence. 
                    Too often, students emerge from HND, bachelor's, or even master's programs unable to confidently defend their degrees or apply their knowledge effectively. 
                    At RiggsTech, we are committed to changing that narrative, fostering financial independence, and equipping individuals to compete on a global stage with their contemporaries.
                  </p>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Our Story - YOUR EXACT WORDS */}
      <section className="py-5">
        <Container>
          <Row className="justify-content-center">
            <Col lg={10}>
              <Card className="border-0 shadow-sm mb-5">
                <Card.Body className="p-5">
                  <Row className="align-items-center g-5">
                    <Col lg={6}>
                      <div className="text-center mb-4">
                        <FaMapMarkerAlt size={60} className="text-primary mb-3" />
                        <h3 className="display-6 fw-bold mb-4">Our Story</h3>
                      </div>
                    </Col>
                    <Col lg={6}>
                      <p className="fs-5 text-muted mb-0">
                        Eyambe Rigobert Ashu established RiggsTech with a vision to transform the engineering and IT landscape. 
                        Drawing from his own experiences as a software engineer, he recognized the critical disconnect between theoretical education and practical application. 
                        What began as a personal drive to mentor and upskill has evolved into a dynamic company dedicated to nurturing talent and innovation. 
                        Based in <strong>Cameroon</strong>, RiggsTech stands as a beacon for aspiring professionals, offering hands-on training and solutions that drive real impact.
                      </p>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Our Mission - YOUR EXACT WORDS */}
      <section className="py-5 bg-light">
        <Container>
          <Row className="justify-content-center mb-5">
            <Col lg={10}>
              <div className="text-center mb-5">
                <h2 className="display-6 fw-bold mb-4">Our Mission</h2>
                <p className="lead text-muted mb-0">
                  We believe that true education extends beyond diplomas—it's about building skills that last a lifetime.
                </p>
              </div>

              <Row className="g-4">
                <Col md={4} className="text-center">
                  <div className="icon-wrapper mb-3 mx-auto">
                    <FaGraduationCap size={50} className="text-primary" />
                  </div>
                  <h5 className="fw-bold mb-3">Close the Skills Gap</h5>
                  <p className="text-muted mb-0">Providing targeted, industry-relevant training.</p>
                </Col>
                <Col md={4} className="text-center">
                  <div className="icon-wrapper mb-3 mx-auto">
                    <FaUsers size={50} className="text-success" />
                  </div>
                  <h5 className="fw-bold mb-3">Financial Independence</h5>
                  <p className="text-muted mb-0">Employable, competitive abilities to thrive globally.</p>
                </Col>
                <Col md={4} className="text-center">
                  <div className="icon-wrapper mb-3 mx-auto">
                    <FaLaptopCode size={50} className="text-warning" />
                  </div>
                  <h5 className="fw-bold mb-3">Innovation Community</h5>
                  <p className="text-muted mb-0">Foster innovators who thrive in the fast-paced tech world.</p>
                </Col>
              </Row>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Founder Background - YOUR EXACT WORDS */}
      <section className="py-5">
        <Container>
          <Row className="justify-content-center mb-5">
            <Col lg={10}>
              <div className="text-center mb-5">
                <h2 className="display-5 fw-bold mb-3">Founder Background: Eyambe Rigobert Ashu</h2>
              </div>

              <Row className="align-items-start g-5">
                <Col lg={4} className="text-center">
                  <div className="founder-image mb-4">
                    <img 
                      src="https://via.placeholder.com/250x250/667eea/ffffff?text=Eyambe+Rigobert+Ashu" 
                      alt="Eyambe Rigobert Ashu - Founder & CEO RiggsTech" 
                      className="img-fluid rounded-circle shadow-lg" 
                      style={{ width: '250px', height: '250px', objectFit: 'cover' }}
                    />
                  </div>
                  <div className="d-flex gap-2 justify-content-center">
                    <Button 
                      variant="primary" 
                      size="sm" 
                      className="rounded-pill px-3"
                      href="https://linkedin.com/in/eyamberigobert"
                      target="_blank"
                    >
                      <FaLinkedin className="me-1" /> LinkedIn
                    </Button>
                    <Button 
                      variant="dark" 
                      size="sm" 
                      className="rounded-pill px-3"
                      href="https://github.com/eyamberigobert"
                      target="_blank"
                    >
                      <FaGithub className="me-1" /> GitHub
                    </Button>
                  </div>
                </Col>
                
                <Col lg={8}>
                  <Card className="border-0 shadow-sm h-100">
                    <Card.Body className="p-5">
                      {/* Quote - YOUR EXACT WORDS */}
                      <div className="quote-wrapper mb-4">
                        <FaQuoteLeft size={30} className="text-primary mb-3" />
                        <p className="fs-5 text-muted fst-italic mb-0">
                          "I saw too many talented individuals sidelined by the lack of real-world skills. It wasn't about their intelligence; it was about the system failing to prepare them to defend their expertise and thrive independently."
                        </p>
                        <FaQuoteLeft size={30} className="text-primary ms-auto mt-2" style={{ transform: 'rotate(180deg)' }} />
                      </div>
                      
                      <h4 className="fw-bold text-primary mb-3">Eyambe Rigobert Ashu</h4>
                      <h6 className="text-muted mb-4">Founder & CEO, RiggsTech</h6>

                      {/* Education & Experience - YOUR EXACT WORDS */}
                      <div className="row g-4 mb-5">
                        <div className="col-md-6">
                          <strong><FaGraduationCap className="me-2 text-primary" /> Education:</strong>
                          <p className="text-muted mb-0 small">
                            Bachelor's degree from the University of Buea<br />
                            Advanced certifications in software development and systems architecture from Coursera and edX
                          </p>
                        </div>
                        <div className="col-md-6">
                          <strong><FaLaptopCode className="me-2 text-success" /> Experience:</strong>
                          <p className="text-muted mb-0 small">
                            Senior Software Engineer at Silcon Technologies (2018-2024)<br />
                            Expertise: JavaScript, Python, React, Node.js, MongoDB, PostgreSQL
                          </p>
                        </div>
                        <div className="col-md-6">
                          <strong><FaUsers className="me-2 text-warning" /> Key Achievement:</strong>
                          <p className="text-muted mb-0 small">
                            Cloud-based inventory system reducing costs by 40% for major Cameroonian retailer
                          </p>
                        </div>
                        <div className="col-md-6">
                          <strong><FaCalendar className="me-2 text-info" /> Community:</strong>
                          <p className="text-muted mb-0 small">
                            Co-organized 2023 Douala Hackathon (200+ participants)<br />
                            Open-source contributions on GitHub for African developers
                          </p>
                        </div>
                      </div>

                      {/* Full Bio - YOUR EXACT WORDS */}
                      <p className="fs-6 text-muted mb-0">
                        Eyambe Rigobert Ashu, the visionary founder of RiggsTech, embodies the spirit of innovation and resilience that defines the company's ethos. 
                        Born and raised in Cameroon, Ashu's journey into software engineering began during his formative years, where a fascination with technology and problem-solving ignited a lifelong passion. 
                        
                        Ashu's professional career took flight in 2018 when he joined Silcon Technologies as a Junior Software Engineer. 
                        At Silcon, a dynamic firm specializing in enterprise solutions, he quickly distinguished himself by leading the development of scalable web applications for clients in the financial and healthcare sectors. 
                        
                        What truly sets Ashu apart is his commitment to bridging the educational gap he observed firsthand. 
                        During his tenure at Silcon, he volunteered as a mentor for university internships, where he encountered the stark reality: brilliant minds graduating with advanced degrees—HND, bachelor's, and even master's—yet struggling to apply theoretical knowledge in practical settings. 
                        
                        Beyond his technical prowess, Ashu is a dedicated advocate for youth empowerment. 
                        Today, as CEO of RiggsTech, Ashu continues to lead by example, balancing strategic vision with hands-on involvement. 
                        His goal remains unwavering: to equip the next generation with lifelong skills that not only secure financial independence but also enable them to outpace global competitors. 
                        Under his guidance, RiggsTech is more than a company—it's a movement toward equitable, impactful education in the IT space.
                      </p>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Services We Offer - YOUR EXACT WORDS */}
      <section className="py-5 bg-light">
        <Container>
          <Row className="justify-content-center mb-5">
            <Col lg={10}>
              <div className="text-center mb-5">
                <h2 className="display-6 fw-bold mb-3">Services We Offer</h2>
                <p className="lead text-muted mb-0">At RiggsTech, we deliver comprehensive IT solutions tailored to individuals and businesses alike</p>
              </div>

              <Row className="g-4">
                <Col md={4}>
                  <Card className="hover-card border-0 shadow-sm h-100 text-center">
                    <Card.Body className="p-4">
                      <div className="icon-wrapper mb-3 mx-auto">
                        <FaGraduationCap size={40} className="text-primary" />
                      </div>
                      <h5 className="fw-bold mb-3">Tutoring and Training</h5>
                      <p className="text-muted mb-0">
                        Personalized programs in software engineering, web development, data science, and more, designed for graduates and beginners to gain defendable, practical expertise.
                      </p>
                    </Card.Body>
                  </Card>
                </Col>
                <Col md={4}>
                  <Card className="hover-card border-0 shadow-sm h-100 text-center">
                    <Card.Body className="p-4">
                      <div className="icon-wrapper mb-3 mx-auto">
                        <FaLaptopCode size={40} className="text-success" />
                      </div>
                      <h5 className="fw-bold mb-3">Software Development</h5>
                      <p className="text-muted mb-0">
                        Custom desktop applications, mobile apps (iOS/Android), and robust API integrations to meet your business needs.
                      </p>
                    </Card.Body>
                  </Card>
                </Col>
                <Col md={4}>
                  <Card className="hover-card border-0 shadow-sm h-100 text-center">
                    <Card.Body className="p-4">
                      <div className="icon-wrapper mb-3 mx-auto">
                        <FaPeopleArrows size={40} className="text-warning" />
                      </div>
                      <h5 className="fw-bold mb-3">Consultancy</h5>
                      <p className="text-muted mb-0">
                        Expert advice on IT strategy, project management, and technology adoption to optimize operations and drive growth.
                      </p>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            </Col>
          </Row>
        </Container>
      </section>

      {/* CTA - YOUR EXACT WORDS */}
      <section className="py-5 bg-primary text-white">
        <Container>
          <Row className="justify-content-center text-center">
            <Col lg={8}>
              <h2 className="display-5 fw-bold mb-4">Join us in redefining education and engineering excellence</h2>
              <p className="lead fs-5 mb-4">
                Whether you're a student seeking to bolster your resume or a company looking for reliable tech partners, RiggsTech is here to support your journey.
              </p>
              <Button 
                variant="warning" 
                size="lg" 
                className="rounded-pill px-5 py-3 fw-bold fs-5"
                href="/contact"
              >
                Contact RiggsTech Today
              </Button>
              <p className="mt-3 lead fs-6 opacity-75">
                Start building a brighter, more skilled future
              </p>
            </Col>
          </Row>
        </Container>
      </section>
    </>
  );
};

export default About;















// import React from 'react';
// import { Container, Row, Col, Card, Badge, Button } from 'react-bootstrap';
// import { FaGraduationCap, FaLaptopCode, FaMobileAlt, FaUsers, FaCalendar, FaLinkedin, FaQuoteLeft, FaMapMarkerAlt } from 'react-icons/fa';

// const About = () => {
//   return (
//     <>
//       {/* Hero Section */}
//       <section className="py-5 bg-primary text-white">
//         <Container>
//           <Row className="justify-content-center text-center">
//             <Col lg={10}>
//               <h1 className="display-4 fw-bold mb-4">About RiggsTech</h1>
//               <Badge bg="warning" className="fs-4 px-4 py-2 mb-4">
//                 <FaCalendar className="me-2" /> Founded in 2025
//               </Badge>
//               <p className="lead fs-4 mb-0">
//                 An IT company born from passion for engineering and frustration with education gaps
//               </p>
//             </Col>
//           </Row>
//         </Container>
//       </section>

//       {/* Main About Content */}
//       <section className="py-5 bg-light">
//         <Container>
//           <Row className="justify-content-center">
//             <Col lg={10}>
//               <Card className="border-0 shadow-sm mb-5">
//                 <Card.Body className="p-5">
//                   <div className="text-center mb-5">
//                     <h2 className="display-6 fw-bold mb-3">RiggsTech is an innovative IT company...</h2>
//                   </div>
                  
//                   <p className="fs-5 text-muted mb-5">
//                     RiggsTech is an innovative IT company born from a deep passion for engineering and a profound frustration with the state of education today. 
//                     Founded in 2025 by <strong>Eyambe Rigobert Ashu</strong>, a seasoned software engineer, our mission is to empower young people—whether recent graduates or lifelong learners—to acquire practical, lifelong skills that bridge the gap between academic qualifications and real-world competence. 
//                     Too often, students emerge from HND, bachelor's, or even master's programs unable to confidently defend their degrees or apply their knowledge effectively. 
//                     At RiggsTech, we are committed to changing that narrative, fostering financial independence, and equipping individuals to compete on a global stage with their contemporaries.
//                   </p>
//                 </Card.Body>
//               </Card>
//             </Col>
//           </Row>
//         </Container>
//       </section>

//       {/* Our Story Section */}
//       <section className="py-5">
//         <Container>
//           <Row className="justify-content-center">
//             <Col lg={10}>
//               <Card className="border-0 shadow-sm">
//                 <Card.Body className="p-5">
//                   <Row className="align-items-center g-5">
//                     <Col lg={6}>
//                       <div className="text-center mb-4">
//                         <FaMapMarkerAlt size={60} className="text-primary mb-3" />
//                         <h3 className="display-6 fw-bold mb-4">Our Story</h3>
//                       </div>
//                     </Col>
//                     <Col lg={6}>
//                       <p className="fs-5 text-muted">
//                         Eyambe Rigobert Ashu established RiggsTech with a vision to transform the engineering and IT landscape. 
//                         Drawing from his own experiences as a software engineer, he recognized the critical disconnect between theoretical education and practical application. 
//                         What began as a personal drive to mentor and upskill has evolved into a dynamic company dedicated to nurturing talent and innovation. 
//                         Based in <strong>Cameroon</strong>, RiggsTech stands as a beacon for aspiring professionals, offering hands-on training and solutions that drive real impact.
//                       </p>
//                     </Col>
//                   </Row>
//                 </Card.Body>
//               </Card>
//             </Col>
//           </Row>
//         </Container>
//       </section>

//       {/* Our Mission Section */}
//       <section className="py-5 bg-light">
//         <Container>
//           <Row className="justify-content-center mb-5">
//             <Col lg={10}>
//               <div className="text-center mb-5">
//                 <h2 className="display-6 fw-bold mb-4">Our Mission</h2>
//                 <p className="lead text-muted">We believe that true education extends beyond diplomas—it's about building skills that last a lifetime.</p>
//               </div>

//               <Row className="g-4">
//                 <Col md={4} className="text-center">
//                   <div className="icon-wrapper mb-3 mx-auto">
//                     <FaGraduationCap size={50} className="text-primary" />
//                   </div>
//                   <h5 className="fw-bold mb-3">Close the Skills Gap</h5>
//                   <p className="text-muted">Providing targeted, industry-relevant training for HND, Bachelor's & Master's graduates.</p>
//                 </Col>
//                 <Col md={4} className="text-center">
//                   <div className="icon-wrapper mb-3 mx-auto">
//                     <FaUsers size={50} className="text-success" />
//                   </div>
//                   <h5 className="fw-bold mb-3">Financial Independence</h5>
//                   <p className="text-muted">Employable, competitive abilities to thrive globally.</p>
//                 </Col>
//                 <Col md={4} className="text-center">
//                   <div className="icon-wrapper mb-3 mx-auto">
//                     <FaLaptopCode size={50} className="text-warning" />
//                   </div>
//                   <h5 className="fw-bold mb-3">Innovation Community</h5>
//                   <p className="text-muted">Foster innovators who thrive in the fast-paced tech world.</p>
//                 </Col>
//               </Row>
//             </Col>
//           </Row>
//         </Container>
//       </section>

//       {/* Founder Background Section */}
//       <section className="py-5">
//         <Container>
//           <Row className="justify-content-center mb-5">
//             <Col lg={10}>
//               <div className="text-center mb-5">
//                 <h2 className="display-5 fw-bold mb-3">Founder Background: Eyambe Rigobert Ashu</h2>
//               </div>

//               <Row className="align-items-center g-5">
//                 <Col lg={4} className="text-center">
//                   <div className="founder-image mb-4">
//                     <img 
//                       src="https://via.placeholder.com/250x250/667eea/ffffff?text=Eyambe+Rigobert+Ashu" 
//                       alt="Eyambe Rigobert Ashu - Founder & CEO RiggsTech" 
//                       className="img-fluid rounded-circle shadow-lg" 
//                       style={{ width: '250px', height: '250px', objectFit: 'cover' }}
//                     />
//                   </div>
//                   <Button 
//                     variant="primary" 
//                     size="lg" 
//                     className="rounded-pill px-4 w-100"
//                     href="https://linkedin.com/in/eyamberigobert"
//                     target="_blank"
//                   >
//                     <FaLinkedin className="me-2" /> Connect on LinkedIn
//                   </Button>
//                 </Col>
                
//                 <Col lg={8}>
//                   <Card className="border-0 shadow-sm h-100">
//                     <Card.Body className="p-5">
//                       <div className="quote-wrapper mb-4">
//                         <FaQuoteLeft size={30} className="text-primary mb-3" />
//                         <p className="fs-5 text-muted fst-italic">
//                           "I saw too many talented individuals sidelined by the lack of real-world skills. It wasn't about their intelligence; it was about the system failing to prepare them to defend their expertise and thrive independently."
//                         </p>
//                         <FaQuoteLeft size={30} className="text-primary ms-auto" style={{ transform: 'rotate(180deg)' }} />
//                       </div>
                      
//                       <h4 className="fw-bold text-primary mb-3">Eyambe Rigobert Ashu</h4>
//                       <h6 className="text-muted mb-4">Founder & CEO, RiggsTech</h6>

//                       <div className="row g-4 mb-5">
//                         <div className="col-md-6">
//                           <strong><FaGraduationCap className="me-2" /> Education:</strong><br />
//                           <span className="text-muted">BSc Computer Science, University of Buea</span><br />
//                           Coursera & edX Certifications (Software Development, Systems Architecture)
//                         </div>
//                         <div className="col-md-6">
//                           <strong><FaLaptopCode className="me-2" /> Experience:</strong><br />
//                           <span className="text-muted">Senior Software Engineer, Silcon Technologies (2018-2024)</span>
//                         </div>
//                         <div className="col-md-6">
//                           <strong><FaUsers className="me-2" /> Key Achievement:</strong><br />
//                           <span className="text-muted">40% cost reduction for major Cameroonian retailer via cloud system</span>
//                         </div>
//                         <div className="col-md-6">
//                           <strong><FaCalendar className="me-2" /> Community:</strong><br />
//                           <span className="text-muted">2023 Douala Hackathon (200+ participants)</span>
//                         </div>
//                       </div>

//                       <p className="fs-6 text-muted">
//                         Born and raised in Cameroon, Ashu's journey began with a fascination for technology. From internships at local startups to leading enterprise projects at Silcon Technologies, he mastered full-stack development (JavaScript, Python, React, Node.js, MongoDB, PostgreSQL). 
//                         This frustration propelled him to launch RiggsTech in early 2025—a movement toward equitable, impactful education in the IT space.
//                       </p>
//                     </Card.Body>
//                   </Card>
//                 </Col>
//               </Row>
//             </Col>
//           </Row>
//         </Container>
//       </section>

//       {/* Services Section */}
//       <section className="py-5 bg-light">
//         <Container>
//           <Row className="justify-content-center mb-5">
//             <Col lg={10}>
//               <div className="text-center mb-5">
//                 <h2 className="display-6 fw-bold mb-3">Services We Offer</h2>
//                 <p className="lead text-muted">Comprehensive IT solutions tailored to individuals and businesses alike</p>
//               </div>

//               <Row className="g-4">
//                 <Col md={4}>
//                   <Card className="hover-card border-0 shadow-sm h-100 text-center">
//                     <Card.Body className="p-4">
//                       <div className="icon-wrapper mb-3 mx-auto">
//                         <FaGraduationCap size={40} className="text-primary" />
//                       </div>
//                       <h5 className="fw-bold mb-3">Tutoring and Training</h5>
//                       <p className="text-muted">
//                         Personalized programs in software engineering, web development, data science, and more, designed for graduates and beginners to gain defendable, practical expertise.
//                       </p>
//                     </Card.Body>
//                   </Card>
//                 </Col>
//                 <Col md={4}>
//                   <Card className="hover-card border-0 shadow-sm h-100 text-center">
//                     <Card.Body className="p-4">
//                       <div className="icon-wrapper mb-3 mx-auto">
//                         <FaLaptopCode size={40} className="text-success" />
//                       </div>
//                       <h5 className="fw-bold mb-3">Software Development</h5>
//                       <p className="text-muted">
//                         Custom desktop applications, mobile apps (iOS/Android), and robust API integrations to meet your business needs.
//                       </p>
//                     </Card.Body>
//                   </Card>
//                 </Col>
//                 <Col md={4}>
//                   <Card className="hover-card border-0 shadow-sm h-100 text-center">
//                     <Card.Body className="p-4">
//                       <div className="icon-wrapper mb-3 mx-auto">
//                         <FaLaptopCode size={40} className="text-warning" />
//                       </div>
//                       <h5 className="fw-bold mb-3">Consultancy</h5>
//                       <p className="text-muted">
//                         Expert advice on IT strategy, project management, and technology adoption to optimize operations and drive growth.
//                       </p>
//                     </Card.Body>
//                   </Card>
//                 </Col>
//               </Row>
//             </Col>
//           </Row>
//         </Container>
//       </section>

//       {/* CTA Section */}
//       <section className="py-5 bg-primary text-white">
//         <Container>
//           <Row className="justify-content-center text-center">
//             <Col lg={8}>
//               <h2 className="display-5 fw-bold mb-4">Join us in redefining education and engineering excellence</h2>
//               <p className="lead fs-5 mb-4">
//                 Whether you're a student seeking to bolster your resume or a company looking for reliable tech partners, RiggsTech is here to support your journey.
//               </p>
//               <Button 
//                 variant="warning" 
//                 size="lg" 
//                 className="rounded-pill px-5 py-3 fw-bold fs-5"
//                 href="/contact"
//               >
//                 Contact RiggsTech Today
//               </Button>
//             </Col>
//           </Row>
//         </Container>
//       </section>
//     </>
//   );
// };

// export default About;