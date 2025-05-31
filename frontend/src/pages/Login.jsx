import { useState } from 'react';
import { Container, Form, Button, Alert } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { userService } from '../services/api';
import '../styles/theme.css'; // Import theme file

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
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

    try {
      const response = await userService.login({
        email: formData.email,
        password: formData.password,
      });
      // Assuming the backend returns a token and user info
      localStorage.setItem('token', response.data.token);
      // TODO: Store user info in state management (e.g., context or Redux)
      console.log('Login successful:', response.data.user);
      // Redirect to home page or dashboard
      navigate('/');
    } catch (err) {
      console.error('Login failed:', err);
      setError(err.response?.data?.error || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <h2 className="mb-4" style={{ color: 'var(--base-black)' }}>Login</h2>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleSubmit}>
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

            <Button 
              type="submit" 
              className="w-100"
              disabled={loading}
              style={{
                backgroundColor: 'var(--accent-orange)',
                borderColor: 'var(--accent-orange)',
                color: 'var(--light-text)',
                '--bs-btn-hover-bg': 'var(--orange-hover)', // Bootstrap 5 custom property for hover background
                '--bs-btn-hover-border-color': 'var(--orange-hover)', // Bootstrap 5 custom property for hover border color
              }}
            >
              {loading ? 'Logging In...' : 'Login'}
            </Button>
          </Form>
          <p className="mt-3 text-center" style={{ color: 'var(--base-black)' }}>
            Don't have an account? <Link to="/register" style={{ color: 'var(--primary-pink)' }}>Register here</Link>
          </p>
        </div>
      </div>
    </Container>
  );
};

export default Login; 