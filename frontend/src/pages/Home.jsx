import { Container, Row, Col, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  const handleSectionClick = (sectionType) => {
    // Navigate to the products page and pass the section type as state
    navigate('/products', { state: { section: sectionType } });
  };

  return (
    <Container>
      <Row className="mb-4">
        <Col>
          <h1>Welcome to Our E-Commerce Store</h1>
          <p>Discover amazing products at great prices!</p>
        </Col>
      </Row>
      <Row>
        <Col md={4}>
          <Card 
            className="mb-4 shadow-sm" 
            onClick={() => handleSectionClick('featured')}
            style={{ cursor: 'pointer' }}
          >
            <Card.Body>
              <Card.Title>Featured Products</Card.Title>
              <Card.Text>
                Check out our latest and most popular products.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card 
            className="mb-4 shadow-sm" 
            onClick={() => handleSectionClick('offers')}
             style={{ cursor: 'pointer' }}
          >
            <Card.Body>
              <Card.Title>Special Offers</Card.Title>
              <Card.Text>
                Don't miss our exclusive deals and discounts.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card 
            className="mb-4 shadow-sm" 
            onClick={() => handleSectionClick('newarrivals')}
             style={{ cursor: 'pointer' }}
          >
            <Card.Body>
              <Card.Title>New Arrivals</Card.Title>
              <Card.Text>
                Be the first to see our newest products.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Home; 