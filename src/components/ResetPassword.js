import React, { useState } from 'react';
import { Container, Card, Form, Button, Alert } from 'react-bootstrap';
import { useSearchParams } from 'react-router-dom';

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch('http://localhost:8000/api/reset-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ token, new_password: password })
    });
    const data = await res.json();
    setMessage(data.message || 'Error');
  };

  return (
    <Container className="py-5">
      <Card className="p-4 max-w-md mx-auto">
        <h4>Reset Password</h4>
        <Form onSubmit={handleSubmit}>
          <Form.Control
            type="password"
            placeholder="New password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="mb-3"
          />
          <Button type="submit">Reset</Button>
        </Form>
        {message && <Alert variant="info" className="mt-3">{message}</Alert>}
      </Card>
    </Container>
  );
};