import { useState } from 'react';
import { Container, Form, Button, Alert } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { userService } from '../services/api';
import '../styles/theme.css'; // Import theme file

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Clear previous errors
    setLoading(true);

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      await userService.register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });
      // Redirect to login page on successful registration
      navigate('/login');
    } catch (err) {
      console.error('Registration failed:', err);
      setError(err.response?.data?.error || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <h2 className="mb-4" style={{ color: 'var(--base-black)' }}>Register</h2>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label style={{ color: 'var(--base-black)' }}>Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                style={{ borderColor: 'var(--border-color)' }}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label style={{ color: 'var(--base-black)' }}>Email address</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                style={{ borderColor: 'var(--border-color)' }}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label style={{ color: 'var(--base-black)' }}>Password</Form.Label>
              <Form.Control
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                style={{ borderColor: 'var(--border-color)' }}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label style={{ color: 'var(--base-black)' }}>Confirm Password</Form.Label>
              <Form.Control
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                style={{ borderColor: 'var(--border-color)' }}
              />
            </Form.Group>

            <Button 
              type="submit" 
              className="w-100"
              disabled={loading}
              style={{
                backgroundColor: 'var(--primary-pink)',
                borderColor: 'var(--primary-pink)',
                color: 'var(--light-text)',
                '--bs-btn-hover-bg': 'var(--pink-hover)', // Bootstrap 5 custom property for hover background
                '--bs-btn-hover-border-color': 'var(--pink-hover)', // Bootstrap 5 custom property for hover border color
              }}
            >
              {loading ? 'Registering...' : 'Register'}
            </Button>
          </Form>
          <p className="mt-3 text-center" style={{ color: 'var(--base-black)' }}>
            Already have an account? <Link to="/login" style={{ color: 'var(--primary-pink)' }}>Login here</Link>
          </p>
        </div>
      </div>
    </Container>
  );
};

export default Register; 