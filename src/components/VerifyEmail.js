import React, { useState, useEffect } from 'react';
import { Container } from 'react-bootstrap';

import { useSearchParams } from 'react-router-dom';

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const [status, setStatus] = useState('Verifying...');

  useEffect(() => {
    fetch(`http://localhost:8000/api/verify-email?token=${token}`)
      .then(r => r.json())
      .then(() => setStatus('Email verified! You can now log in.'))
      .catch(() => setStatus('Invalid or expired link.'));
  }, [token]);

  return <Container className="py-5 text-center"><h3>{status}</h3></Container>;
};