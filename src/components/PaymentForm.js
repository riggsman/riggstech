import React, { useState } from 'react';
import { Form, Button, Row, Col, Alert, Spinner, Card } from 'react-bootstrap';
import { FaMobileAlt, FaDollarSign, FaShieldAlt, FaCreditCard, FaCheckCircle, FaMoneyBill } from 'react-icons/fa';
import axios from 'axios';
import { Link, Links } from 'react-router-dom';
import envConfig from "../config/envConfig";
import { paymentInitiatorProvider, paymentProvider, paymentVerificationProvider } from '../services/PaymentProcessor';
const API_URL = envConfig.API_URL;



// const PaymentForm = ({ userData, onComplete, onBack }) => {
 console.log("islogged in ", localStorage.getItem("isLoggedIn") )
const PaymentForm = ({ userData, onComplete, onBack, isRegistration = false }) => {
  const [formData, setFormData] = useState({
    provider: 'mtn',  // Default: MTN
    phone: '',  // Pre-fill from registration  userData.phone ||
    amount: 15000,  // Default premium fee
    userCode: '',
    userId: localStorage.getItem('userId')
  });
  const [step, setStep] = useState(1);  // 1: Enter details, 2: Enter code
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateDetails = () => {
    // if (!formData.phone.match(/^\+237[0-9]{9}$/) || !formData.phone.startsWith('+237')) return 'Invalid phone number format';
    if (formData.phone.startsWith('+237') && formData.phone.length > 13) {
      setLoading(false);
      return 'Phone number can not be longer than 13 digits (+237) inclusive';
      }
    if (formData.phone.startsWith('6') && formData.phone.length > 9) {
      setLoading(false);
      return 'Phone number can not be longer than 9 digits beginning with 6';
      }
    if (formData.phone.startsWith('6') && formData.phone.length < 9) {
      setLoading(false);
      return 'Phone number must be at least 9 digits beginning with 6';
      }
    if (formData.amount < 15000 ) {
      setLoading(false);
      return 'Amount must be from XAF 15,000';
      }
    return '';
  };

  const handleInitiate = async (e) => {
    e.preventDefault();
    const phoneError = validateDetails();
    setLoading(true);
    if (phoneError) return setError(phoneError);
      const result = isRegistration ? await await paymentInitiatorProvider(formData,userData) : await paymentProvider(formData); //userData
      try{
        setLoading(true);
      if (result.success) {
        setStep(2);  // Advance to code entry
        // In production: User gets USSD prompt on phone
      }
    else {
      setLoading(false);
    }
  }catch(err){
    setError(result.error);
  }finally{
    setLoading(false);
  }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    if (formData.userCode.length !== 6) return setError('User code must be 6 digits');
    const result = await paymentVerificationProvider(formData); //userData
    if (result.success) {
      setSuccess(true);
      setTimeout(() => onComplete(true), 2000);
    } else {
      setError('Invalid user code. Try again.');
    }
  };

  const getProviderConfig = () => {
    const configs = {
      orange: { icon: FaMobileAlt, name: 'Orange Money', ussd: '#150#', desc: 'Fast & secure mobile payments' },
      mtn: { icon: FaMobileAlt, name: 'MTN Mobile Money', ussd: '*126#', desc: 'Fast & secure mobile payments' },
      payflex: { icon: FaCreditCard, name: 'PayFlex', ussd: (
      <a
        href="https://www.payflex.com"
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-600 underline hover:text-blue-800"
      >
        Visit PayFlex
      </a>
    ), desc: 'You should have an account with PayFlex to use this service' }
    };
    return configs[formData.provider];
  };

  const { icon: Icon, name, ussd, desc } = getProviderConfig();

  return (
    <div>
      {step === 1 ? (
        // STEP 1: Payment Details
        <>
          <Form onSubmit={handleInitiate}>
            <Row>
              <Col md={12} className="mb-4">
                <Form.Group>
                  <Form.Label className="fw-bold">
                    <Icon className="me-2 text-primary" /> Provider
                  </Form.Label>
                  <Form.Select name="provider" value={formData.provider} onChange={handleChange}
                    className="rounded-pill px-4">
                    <option value="mtn">MTN Mobile Money</option>
                    <option value="orange">Orange Money</option>
                    <option value="payflex">PayFlex</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6} className="mb-4">
                <Form.Group>
                  <Form.Label className="fw-bold">
                    <FaMobileAlt className="me-2" /> Phone Number
                  </Form.Label>
                  <Form.Control
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value.startsWith('+237') ? e.target.value : '+237' + e.target.value.replace(/\D/g, '') })}
                    placeholder="+237 6XXXXXXXX"
                    className="rounded-pill px-4"
                  />
                </Form.Group>
              </Col>
              <Col md={6} className="mb-4">
                <Form.Group>
                  <Form.Label className="fw-bold">
                    <FaMoneyBill className="me-2" /> Amount (XAF)
                  </Form.Label>
                  <Form.Control
                    type="number"
                    name="amount"
                    value={formData.amount}
                    onChange={handleChange}
                    min="10"
                    step="0.01"
                    placeholder="100"
                    className="rounded-pill px-4"
                  />
                </Form.Group>
              </Col>
            </Row>

            <div className="d-flex align-items-center mb-4 p-3 bg-light rounded">
              <Icon className="me-2 text-primary fs-4" />
              <div>
                <h6 className="mb-1 fw-bold">{name}</h6>
                <p className="mb-0 text-muted small">{desc} | Dial {ussd} to confirm</p>
              </div>
            </div>

            <Button type="submit" variant="primary" size="lg" className="w-100 py-3 fw-bold rounded-pill"
              disabled={loading}>
              {loading ? (
                <>
                  <Spinner animation="border" size="sm" className="me-2" />
                  Initiating Payment...
                </>
              ) : (
                <>
                  <FaShieldAlt className="me-2" />
                  Pay Now
                </>
              )}
            </Button>
          </Form>

          {error && <Alert variant="danger" className="mt-3">{error}</Alert>}
        </>
      ) : (
        //////// ////////////////////////////////
        //      STEP 2 : ENTER USER CODE       //
        //////// ////////////////////////////////
        <>
          <div className="text-center mb-4">
            <FaMobileAlt size={60} className="text-success mb-3" />
            <h5>Check Your Email</h5>
            <p className="text-muted">Enter the 6-digit code sent to </p> {/**{userData.email} */}
            </div>

          <Form onSubmit={handleVerify}>
            <Form.Group className="mb-4">
              <Form.Label className="fw-bold text-center d-block">
                <FaCheckCircle className="me-2" /> Verification Code
              </Form.Label>
              <Form.Control
                type="text"
                name="userCode"
                value={formData.userCode}
                onChange={handleChange}
                maxLength="6"
                placeholder="123456"
                className="rounded-pill px-4 text-center fs-3"
                style={{ fontFamily: 'monospace' }}
              />
              <Form.Text className="text-muted">Code expires in 5 minutes</Form.Text>
            </Form.Group>

            <Button type="submit" variant="success" size="lg" className="w-100 py-3 fw-bold rounded-pill"
              disabled={loading || formData.userCode.length !== 6}>
              {loading ? (
                <>
                  <Spinner animation="border" size="sm" className="me-2" />
                  Verifying...
                </>
              ) : (
                'Confirm Payment'
              )}
            </Button>
          </Form>

          {error && <Alert variant="warning" className="mt-3">{error}</Alert>}
          {success && <Alert variant="success" className="mt-3">✅ Payment successful! Redirecting...</Alert>}

          <Button variant="outline-secondary" className="w-100 mt-3 py-2" onClick={() => setStep(1)}>
            Change Details
          </Button>
        </>
      )}

      <Button variant="outline-secondary" className="w-100 mt-3 py-2" onClick={onBack}>
        Back to Registration
      </Button>
    </div>
  );
};

export default PaymentForm;