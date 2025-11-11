import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Alert, Spinner, Card } from 'react-bootstrap';
import { FaUserPlus, FaLock, FaEnvelope, FaPhone, FaGraduationCap } from 'react-icons/fa';
import PaymentForm from './PaymentForm';
import { RegistrationProvider } from '../services/FetchPrograms';
import { useNavigate } from 'react-router';


const RegistrationForm = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    firstName: '', lastName: '', email: '', phone: '', password: '', confirmPassword: '', program: '', username: '', price: ''
  });
  const [paymentData, setPaymentData] = useState({});
  const [showSuccess, setShowSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  let _enrollmentData = sessionStorage.getItem("selectedProgram");
  let enrollmentData = JSON.parse(_enrollmentData);
  console.log("ENROLLMANE DATA ",enrollmentData.price)

  /** --------------------------------------------------------------
   *  On mount read the course that was saved by ServicesSection.
   *  If nothing is saved we keep the placeholder.
   *  -------------------------------------------------------------- */
  useEffect(() => {
    const saved = sessionStorage.getItem("selectedCourse");
    if (saved) {
      const course = JSON.parse(saved);
      // The <option> values below match the **course name** exactly.
      setFormData((prev) => ({ ...prev, program: course.name }));
    }
  }, []);

  // const handleChange = (e) => {
  //   setFormData({ ...formData, [e.target.name]: e.target.value });
  // };
  const handleChange = (e) => {
  const { name, value } = e.target;
  setFormData((prev) => ({
    ...prev,
    [name]: value,
  }));
};

  const validateForm = () => {
    const newErrors = {};
    if (!formData.firstName) newErrors.firstName = 'First name is required';
    if (!formData.username) newErrors.username = 'Username is required';
    if (!formData.lastName) newErrors.lastName = 'Last name is required';
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.phone) newErrors.phone = 'Phone number is required';
    if (formData.password.length < 6) newErrors.password = 'Password must be 6+ characters';
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // In your Register or Payment component
  useEffect(() => {
    const savedProgram = sessionStorage.getItem('selectedProgram');
    if (savedProgram) {
      const program = JSON.parse(savedProgram);
      console.log("Selected Program:", program);
      // Use: program.price, program.title, etc.
    } else {
      // Optional: redirect back if no program selected
      // navigate('/services');
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setLoading(true);
      setError('');
      const response = await RegistrationProvider(formData);
      if (response.statusCode === 409) {
        setError("User already exists");
        console.log("status code 409");
      }
      if (response.success === true && response?.token !== "") {
          localStorage.setItem('token', response.token);
          setPaymentData({ userId: response.data.id, email: formData.email, phone: formData.phone }); 
          setStep(2);
          setShowSuccess(true);
      }else {
        setError(response.error);
      }
       
    } catch (err) {
      console.log(err);
      setError('Network error. Please try again111.',err);
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentComplete = (success) => {
    if (success) {
      setShowSuccess(true);
      error && setError('');
      setTimeout(() => alert('Welcome to SkillAcademy!'), 2000);
      navigate('/login');
    }
  };

  if (step === 2) {
    return (
      <PaymentForm
        userData={paymentData}
        onComplete={handlePaymentComplete}
        onBack={() => setStep(1)}
        isRegistration={true}
      />
    );
  }

  return (
    <section className="py-5 bg-light" id="register">
      <Container>
        <Row className="justify-content-center mb-5">
          <Col lg={8} className="text-center">
            <div className="icon-wrapper mb-3">
              <FaUserPlus size={50} className="text-primary" />
            </div>
            <h2 className="display-5 fw-bold mb-3">Create a Profile</h2>
            <p className="lead text-muted">Join other students and start your learning journey today with a broad Community base!</p>
          </Col>
        </Row>

        <Row className="justify-content-center">
          <Col lg={8}>
            <Card className="shadow-lg border-0">
              <Card.Body className="p-5">
                {showSuccess && <Alert variant="success" className="mb-4">✅ Account created successfully!</Alert>}
                {error && <Alert variant="danger" className="mb-4">{error}</Alert>}

                <Form onSubmit={handleSubmit}>
                  <Row>
                    <Col md={6} className="mb-4">
                      <Form.Group>
                        <Form.Label className="fw-bold"><FaUserPlus className="me-2" />First Name</Form.Label>
                        <Form.Control
                          type="text" name="firstName" value={formData.firstName} onChange={handleChange}
                          isInvalid={!!errors.firstName} className="rounded-pill px-4"
                        />
                        <Form.Control.Feedback type="invalid">{errors.firstName}</Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                    <Col md={6} className="mb-4">
                      <Form.Group>
                        <Form.Label className="fw-bold"><FaUserPlus className="me-2" />Last Name</Form.Label>
                        <Form.Control
                          type="text" name="lastName" value={formData.lastName} onChange={handleChange}
                          className="rounded-pill px-4"
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  <Row>
                    <Col md={6} className="mb-4">
                      <Form.Group>
                        <Form.Label className="fw-bold"><FaEnvelope className="me-2" />Email</Form.Label>
                        <Form.Control
                          type="email" name="email" value={formData.email} onChange={handleChange}
                          isInvalid={!!errors.email} className="rounded-pill px-4"
                        />
                        <Form.Control.Feedback type="invalid">{errors.email}</Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                    <Col md={6} className="mb-4">
                      <Form.Group className="mb-3">
                        <Form.Label className="fw-bold">
                          <FaGraduationCap className="me-2" />Program
                        </Form.Label>
                        <Form.Control
                          as="select"
                          name="program"
                          value={formData.program}
                          onChange={handleChange}
                          isInvalid={!!errors.program}
                          className="rounded-pill px-4"
                        >
                          {/* 1. If a course was selected on the services page → show it first */}
                          {formData.program && (
                            <option value={formData.program}>{formData.program}</option>
                          )}

                          {/* 2. Default options – keep them in sync with your backend */}
                          <option value="">Select your program</option>
                          <option value="Web Development">Web Development</option>
                          <option value="Data Science">Data Science</option>
                          <option value="Graphic Design">Graphic Design</option>
                        </Form.Control>

                        <Form.Control.Feedback type="invalid">
                          {errors.program}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                  </Row>
                  <Row>
                    <Col md={6} className="mb-4">
                      <Form.Group>
                        <Form.Label className="fw-bold"><FaPhone className="me-2" />Phone</Form.Label>
                        <Form.Control
                          type="tel" name="phone" value={formData.phone} onChange={handleChange}
                          isInvalid={!!errors.phone} placeholder="+237 623 123 456" className="rounded-pill px-4"
                        />
                        <Form.Control.Feedback type="invalid">{errors.phone}</Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                    <Col md={6} className="mb-4">
                      <Form.Group>
                        <Form.Label className="fw-bold"><FaUserPlus className="me-2" />Username</Form.Label>
                        <Form.Control
                          type="text" name="username" value={formData.username} onChange={handleChange}
                          isInvalid={!!errors.username} className="rounded-pill px-4"
                        />
                        <Form.Control.Feedback type="invalid">{errors.username}</Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                  </Row>

                  <Row>
                    <Col md={6} className="mb-4">
                      <Form.Group>
                        <Form.Label className="fw-bold"><FaLock className="me-2" />Password</Form.Label>
                        <Form.Control
                          type="password" name="password" value={formData.password} onChange={handleChange}
                          isInvalid={!!errors.password} className="rounded-pill px-4"
                        />
                        <Form.Control.Feedback type="invalid">{errors.password}</Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                    <Col md={6} className="mb-4">
                      <Form.Group>
                        <Form.Label className="fw-bold"><FaLock className="me-2" />Confirm Password</Form.Label>
                        <Form.Control
                          type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange}
                          isInvalid={!!errors.confirmPassword} className="rounded-pill px-4"
                        />
                        <Form.Control.Feedback type="invalid">{errors.confirmPassword}</Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                  </Row>

                  <Button type="submit" className="w-100 py-3 fw-bold rounded-pill btn-primary" disabled={loading}>
                    {loading ? (
                      <>
                        <Spinner animation="border" size="sm" className="me-2" />
                        Creating Account...
                      </>
                    ) : (
                      <>
                        <FaGraduationCap className="me-2" />
                        Create Account & Pay {enrollmentData.price}
                      </>
                    )}
                  </Button>
                </Form>                    
                <div className="text-center mt-4">
                  <small className="text-muted">
                    By creating an account, you agree to our <a href="http://192.168.137.1:7000/terms" className="text-primary">Terms</a> and <a href="http://192.168.137.1:7000/privacy" className="text-primary">Privacy Policy</a>
                  </small>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default RegistrationForm;













// // import React, { useState } from 'react';
// // import { Container, Row, Col, Form, Button, Alert } from 'react-bootstrap';
// // import { FaUserPlus, FaLock, FaEnvelope, FaPhone, FaGraduationCap } from 'react-icons/fa';

// // const RegistrationForm = () => {
// //   const [formData, setFormData] = useState({
// //     firstName: '',
// //     lastName: '',
// //     email: '',
// //     phone: '',
// //     password: '',
// //     confirmPassword: ''
// //   });
// //   const [showSuccess, setShowSuccess] = useState(false);
// //   const [errors, setErrors] = useState({});

// //   const handleChange = (e) => {
// //     setFormData({
// //       ...formData,
// //       [e.target.name]: e.target.value
// //     });
// //   };

// //   const validateForm = () => {
// //     const newErrors = {};
    
// //     if (!formData.firstName) newErrors.firstName = 'First name is required';
// //     if (!formData.email) newErrors.email = 'Email is required';
// //     if (!formData.phone) newErrors.phone = 'Phone number is required';
// //     if (formData.password.length < 6) newErrors.password = 'Password must be 6+ characters';
// //     if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';

// //     setErrors(newErrors);
// //     return Object.keys(newErrors).length === 0;
// //   };

// //   const handleSubmit = (e) => {
// //     e.preventDefault();
// //     if (validateForm()) {
// //       // Simulate API call
// //       setTimeout(() => {
// //         setShowSuccess(true);
// //         setFormData({ firstName: '', lastName: '', email: '', phone: '', password: '', confirmPassword: '' });
// //       }, 1000);
// //     }
// //   };

// //   return (
// //     <section className="py-5 bg-light" id="register">
// //       <Container>
// //         <Row className="justify-content-center mb-5">
// //           <Col lg={8} className="text-center">
// //             <div className="icon-wrapper mb-3">
// //               <FaUserPlus size={50} className="text-primary" />
// //             </div>
// //             <h2 className="display-5 fw-bold mb-3">Create Your Account</h2>
// //             <p className="lead text-muted">
// //               Join 50,000+ students. Start your learning journey today!
// //             </p>
// //           </Col>
// //         </Row>

// //         <Row className="justify-content-center">
// //           <Col lg={8}>
// //             <div className="card shadow-lg border-0">
// //               <div className="card-body p-5">
// //                 {showSuccess && (
// //                   <Alert variant="success" className="mb-4">
// //                     ✅ Registration successful! Welcome to SkillAcademy!
// //                   </Alert>
// //                 )}

// //                 <Form onSubmit={handleSubmit}>
// //                   <Row>
// //                     <Col md={6} className="mb-4">
// //                       <Form.Group>
// //                         <Form.Label className="fw-bold">
// //                           <FaUserPlus className="me-2" />
// //                           First Name
// //                         </Form.Label>
// //                         <Form.Control
// //                           type="text"
// //                           name="firstName"
// //                           value={formData.firstName}
// //                           onChange={handleChange}
// //                           isInvalid={!!errors.firstName}
// //                           placeholder="Enter your first name"
// //                           className="rounded-pill px-4"
// //                         />
// //                         <Form.Control.Feedback type="invalid">
// //                           {errors.firstName}
// //                         </Form.Control.Feedback>
// //                       </Form.Group>
// //                     </Col>
// //                     <Col md={6} className="mb-4">
// //                       <Form.Group>
// //                         <Form.Label className="fw-bold">
// //                           <FaUserPlus className="me-2" />
// //                           Last Name
// //                         </Form.Label>
// //                         <Form.Control
// //                           type="text"
// //                           name="lastName"
// //                           value={formData.lastName}
// //                           onChange={handleChange}
// //                           placeholder="Enter your last name"
// //                           className="rounded-pill px-4"
// //                         />
// //                       </Form.Group>
// //                     </Col>
// //                   </Row>

// //                   <Row>
// //                     <Col md={6} className="mb-4">
// //                       <Form.Group>
// //                         <Form.Label className="fw-bold">
// //                           <FaEnvelope className="me-2" />
// //                           Email
// //                         </Form.Label>
// //                         <Form.Control
// //                           type="email"
// //                           name="email"
// //                           value={formData.email}
// //                           onChange={handleChange}
// //                           isInvalid={!!errors.email}
// //                           placeholder="your@email.com"
// //                           className="rounded-pill px-4"
// //                         />
// //                         <Form.Control.Feedback type="invalid">
// //                           {errors.email}
// //                         </Form.Control.Feedback>
// //                       </Form.Group>
// //                     </Col>
// //                     <Col md={6} className="mb-4">
// //                       <Form.Group>
// //                         <Form.Label className="fw-bold">
// //                           <FaPhone className="me-2" />
// //                           Phone
// //                         </Form.Label>
// //                         <Form.Control
// //                           type="tel"
// //                           name="phone"
// //                           value={formData.phone}
// //                           onChange={handleChange}
// //                           isInvalid={!!errors.phone}
// //                           placeholder="+1 (555) 123-4567"
// //                           className="rounded-pill px-4"
// //                         />
// //                         <Form.Control.Feedback type="invalid">
// //                           {errors.phone}
// //                         </Form.Control.Feedback>
// //                       </Form.Group>
// //                     </Col>
// //                   </Row>

// //                   <Row>
// //                     <Col md={6} className="mb-4">
// //                       <Form.Group>
// //                         <Form.Label className="fw-bold">
// //                           <FaLock className="me-2" />
// //                           Password
// //                         </Form.Label>
// //                         <Form.Control
// //                           type="password"
// //                           name="password"
// //                           value={formData.password}
// //                           onChange={handleChange}
// //                           isInvalid={!!errors.password}
// //                           placeholder="Create password"
// //                           className="rounded-pill px-4"
// //                         />
// //                         <Form.Control.Feedback type="invalid">
// //                           {errors.password}
// //                         </Form.Control.Feedback>
// //                       </Form.Group>
// //                     </Col>
// //                     <Col md={6} className="mb-4">
// //                       <Form.Group>
// //                         <Form.Label className="fw-bold">
// //                           <FaLock className="me-2" />
// //                           Confirm Password
// //                         </Form.Label>
// //                         <Form.Control
// //                           type="password"
// //                           name="confirmPassword"
// //                           value={formData.confirmPassword}
// //                           onChange={handleChange}
// //                           isInvalid={!!errors.confirmPassword}
// //                           placeholder="Confirm password"
// //                           className="rounded-pill px-4"
// //                         />
// //                         <Form.Control.Feedback type="invalid">
// //                           {errors.confirmPassword}
// //                         </Form.Control.Feedback>
// //                       </Form.Group>
// //                     </Col>
// //                   </Row>

// //                   <Button 
// //                     type="submit" 
// //                     variant="primary" 
// //                     size="lg" 
// //                     className="w-100 py-3 fw-bold rounded-pill"
// //                   >
// //                     <FaGraduationCap className="me-2" />
// //                     Create Account & Start Learning
// //                   </Button>
// //                 </Form>

// //                 <div className="text-center mt-4">
// //                   <small className="text-muted">
// //                     By creating an account, you agree to our{' '}
// //                     <a href="#" className="text-primary">Terms of Service</a> and{' '}
// //                     <a href="#" className="text-primary">Privacy Policy</a>
// //                   </small>
// //                 </div>
// //               </div>
// //             </div>
// //           </Col>
// //         </Row>
// //       </Container>
// //     </section>
// //   );
// // };

// // export default RegistrationForm;


// import React, { useState } from 'react';
// import { Container, Row, Col, Form, Button, Alert, Spinner, Card } from 'react-bootstrap';
// import { FaUserPlus, FaLock, FaEnvelope, FaPhone, FaGraduationCap, FaCreditCard } from 'react-icons/fa';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';
// import PaymentForm from './PaymentForm';  // NEW: Import PaymentForm

// const API_URL = 'http://localhost:5000/api';

// const RegistrationForm = () => {
//   const [step, setStep] = useState(1);  // NEW: Stepper (1: Register, 2: Pay)
//   const [formData, setFormData] = useState({
//     firstName: '', lastName: '', email: '', phone: '', password: '', confirmPassword: ''
//   });
//   const [paymentData, setPaymentData] = useState({});  // NEW: For payment step
//   const [showSuccess, setShowSuccess] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');
//   const [errors, setErrors] = useState({});
//   const navigate = useNavigate();

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const validateForm = () => {
//     const newErrors = {};
//     if (!formData.firstName) newErrors.firstName = 'First name is required';
//     if (!formData.email) newErrors.email = 'Email is required';
//     if (!formData.phone) newErrors.phone = 'Phone number is required';
//     if (formData.password.length < 6) newErrors.password = 'Password must be 6+ characters';
//     if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (validateForm()) {
//       try {
//         setLoading(true);
//         const response = await axios.post(`${API_URL}/auth/register`, formData);
//         if (response.data.success) {
//           localStorage.setItem('token', response.data.token);
//           setPaymentData({ userId: response.data.user.id, email: formData.email });  // Pass to payment
//           setStep(2);  // NEW: Advance to payment step
//           setShowSuccess(true);  // Show registration success briefly
//         }
//       } catch (err) {
//         setError(err.response?.data?.message || 'Registration failed');
//       } finally {
//         setLoading(false);
//       }
//     }
//   };

//   // NEW: Handle payment completion
//   const handlePaymentComplete = (paymentSuccess) => {
//     if (paymentSuccess) {
//       setShowSuccess(true);
//       setTimeout(() => navigate('/dashboard'), 2000);  // Redirect to dashboard
//     }
//   };

//   return (
//     <section className="py-5 bg-light" id="register">
//       <Container>
//         <Row className="justify-content-center mb-5">
//           <Col lg={8} className="text-center">
//             <div className="icon-wrapper mb-3">
//               <FaUserPlus size={50} className="text-primary" />
//             </div>
//             <h2 className="display-5 fw-bold mb-3">
//               {step === 1 ? 'Create Your Account' : 'Complete Payment for Premium Access'}
//             </h2>
//             <p className="lead text-muted">
//               {step === 1 ? 'Join 50,000+ students.' : 'One-time $49 payment unlocks lifetime access & certification.'}
//             </p>
//           </Col>
//         </Row>

//         <Row className="justify-content-center">
//           <Col lg={8}>
//             <Card className="shadow-lg border-0">
//               <Card.Body className="p-5">
//                 {showSuccess && step === 1 && (
//                   <Alert variant="success" className="mb-4">
//                     ✅ Account created! Now complete payment to start learning.
//                   </Alert>
//                 )}

//                 {step === 1 ? (
//                   // ORIGINAL REGISTRATION FORM
//                   <Form onSubmit={handleSubmit}>
//                     {/* ... (Keep all original form fields: Row for names, email/phone, passwords) ... */}
//                     <Row>
//                       <Col md={6} className="mb-4">
//                         <Form.Group>
//                           <Form.Label className="fw-bold">
//                             <FaUserPlus className="me-2" /> First Name
//                           </Form.Label>
//                           <Form.Control
//                             type="text" name="firstName" value={formData.firstName} onChange={handleChange}
//                             isInvalid={!!errors.firstName} placeholder="Enter your first name"
//                             className="rounded-pill px-4"
//                           />
//                           <Form.Control.Feedback type="invalid">{errors.firstName}</Form.Control.Feedback>
//                         </Form.Group>
//                       </Col>
//                       <Col md={6} className="mb-4">
//                         <Form.Group>
//                           <Form.Label className="fw-bold">
//                             <FaUserPlus className="me-2" /> Last Name
//                           </Form.Label>
//                           <Form.Control
//                             type="text" name="lastName" value={formData.lastName} onChange={handleChange}
//                             placeholder="Enter your last name" className="rounded-pill px-4"
//                           />
//                         </Form.Group>
//                       </Col>
//                     </Row>
//                     {/* Add similar for email, phone, password, confirmPassword */}
//                     <Row>
//                       <Col md={6} className="mb-4">
//                         <Form.Group>
//                           <Form.Label className="fw-bold"><FaEnvelope className="me-2" /> Email</Form.Label>
//                           <Form.Control type="email" name="email" value={formData.email} onChange={handleChange}
//                             isInvalid={!!errors.email} placeholder="your@email.com" className="rounded-pill px-4" />
//                           <Form.Control.Feedback type="invalid">{errors.email}</Form.Control.Feedback>
//                         </Form.Group>
//                       </Col>
//                       <Col md={6} className="mb-4">
//                         <Form.Group>
//                           <Form.Label className="fw-bold"><FaPhone className="me-2" /> Phone</Form.Label>
//                           <Form.Control type="tel" name="phone" value={formData.phone} onChange={handleChange}
//                             isInvalid={!!errors.phone} placeholder="+256 7XX XXX XXX" className="rounded-pill px-4" />
//                           <Form.Control.Feedback type="invalid">{errors.phone}</Form.Control.Feedback>
//                         </Form.Group>
//                       </Col>
//                     </Row>
//                     <Row>
//                       <Col md={6} className="mb-4">
//                         <Form.Group>
//                           <Form.Label className="fw-bold"><FaLock className="me-2" /> Password</Form.Label>
//                           <Form.Control type="password" name="password" value={formData.password} onChange={handleChange}
//                             isInvalid={!!errors.password} placeholder="Create password" className="rounded-pill px-4" />
//                           <Form.Control.Feedback type="invalid">{errors.password}</Form.Control.Feedback>
//                         </Form.Group>
//                       </Col>
//                       <Col md={6} className="mb-4">
//                         <Form.Group>
//                           <Form.Label className="fw-bold"><FaLock className="me-2" /> Confirm Password</Form.Label>
//                           <Form.Control type="password" name="confirmPassword" value={formData.confirmPassword}
//                             onChange={handleChange} isInvalid={!!errors.confirmPassword} placeholder="Confirm password"
//                             className="rounded-pill px-4" />
//                           <Form.Control.Feedback type="invalid">{errors.confirmPassword}</Form.Control.Feedback>
//                         </Form.Group>
//                       </Col>
//                     </Row>

//                     <Button type="submit" variant="primary" size="lg" className="w-100 py-3 fw-bold rounded-pill"
//                       disabled={loading}>
//                       {loading ? (
//                         <>
//                           <Spinner animation="border" size="sm" className="me-2" />
//                           Creating Account...
//                         </>
//                       ) : (
//                         <>
//                           <FaGraduationCap className="me-2" />
//                           Create Account
//                         </>
//                       )}
//                     </Button>
//                   </Form>
//                 ) : (
//                   // NEW: PAYMENT STEP
//                   <PaymentForm
//                     userData={paymentData}
//                     onComplete={handlePaymentComplete}
//                     onBack={() => setStep(1)}
//                   />
//                 )}

//                 {error && <Alert variant="danger" className="mt-3">{error}</Alert>}

//                 {step === 2 && (
//                   <Button variant="outline-secondary" className="mt-3" onClick={() => setStep(1)}>
//                     Back to Registration
//                   </Button>
//                 )}

//                 <div className="text-center mt-4">
//                   <small className="text-muted">
//                     By proceeding, you agree to our <a href="#" className="text-primary">Terms</a> and <a href="#" className="text-primary">Privacy Policy</a>
//                   </small>
//                 </div>
//               </Card.Body>
//             </Card>
//           </Col>
//         </Row>
//       </Container>
//     </section>
//   );
// };

// export default RegistrationForm;