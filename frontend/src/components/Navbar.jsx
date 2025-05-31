import { Navbar, Nav, Container, Form, FormControl, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const Navigation = ({ searchQuery, setSearchQuery }) => {
  const { totalItems } = useCart();
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    // The actual filtering is handled in the Products page based on searchQuery state
    navigate('/products'); // Navigate to products page on search
  };

  return (
    <Navbar expand="lg" style={{ backgroundColor: 'var(--base-black)' }} variant="dark">
      <Container fluid>
        <Navbar.Brand as={Link} to="/" style={{ color: 'var(--primary-pink)', marginRight: '20px' }}>E-Commerce</Navbar.Brand>
        
        {/* Location Placeholder */}
        <Nav className="me-auto align-items-center">
          <Nav.Link href="#" style={{ color: 'var(--light-text)' }}>
            <i className="bi bi-geo-alt-fill me-1"></i>
            Deliver to
            <span style={{ fontWeight: 'bold', marginLeft: '5px' }}>User's Location</span> {/* Placeholder */}
          </Nav.Link>
        </Nav>

        {/* Search Bar */}
        <Form className="d-flex flex-grow-1 me-auto" onSubmit={handleSearch}>
          <FormControl
            type="search"
            placeholder="Search products"
            className="me-2"
            aria-label="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ maxWidth: '600px' }}
          />
          <Button variant="outline-light" type="submit" style={{ borderColor: 'var(--primary-pink)', color: 'var(--primary-pink)' }}>
            <i className="bi bi-search"></i>
          </Button>
        </Form>

        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav>
            <Nav.Link as={Link} to="/cart" style={{ color: 'var(--light-text)', position: 'relative' }}>
              <i className="bi bi-cart3" style={{ fontSize: '1.2rem' }}></i>
              {totalItems > 0 && (
                <span
                  style={{
                    position: 'absolute',
                    top: '-8px',
                    right: '-8px',
                    backgroundColor: 'var(--primary-pink)',
                    color: 'white',
                    borderRadius: '50%',
                    padding: '0.1rem 0.4rem',
                    fontSize: '0.7rem',
                    minWidth: '1.3rem',
                    textAlign: 'center',
                  }}
                >
                  {totalItems}
                </span>
              )}
            </Nav.Link>
            <Nav.Link as={Link} to="/login" style={{ color: 'var(--light-text)' }}>Login</Nav.Link>
            <Nav.Link as={Link} to="/register" style={{ color: 'var(--light-text)' }}>Register</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Navigation; 