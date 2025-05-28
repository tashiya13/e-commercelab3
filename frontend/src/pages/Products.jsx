import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';

const Products = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    // TODO: Fetch products from API
    const dummyProducts = [
      { id: 1, name: 'Product 1', price: 99.99, description: 'Description 1' },
      { id: 2, name: 'Product 2', price: 149.99, description: 'Description 2' },
      { id: 3, name: 'Product 3', price: 199.99, description: 'Description 3' },
    ];
    setProducts(dummyProducts);
  }, []);

  return (
    <Container>
      <h1 className="mb-4">Our Products</h1>
      <Row>
        {products.map((product) => (
          <Col key={product.id} md={4} className="mb-4">
            <Card>
              <Card.Body>
                <Card.Title>{product.name}</Card.Title>
                <Card.Text>{product.description}</Card.Text>
                <Card.Text className="h5">${product.price}</Card.Text>
                <Button variant="primary">Add to Cart</Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default Products; 