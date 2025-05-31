import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Form, Toast, ToastContainer, Badge } from 'react-bootstrap';
import { products } from '../data/products';
import { useCart } from '../context/CartContext';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  useEffect(() => {
    // In a real app, you would fetch product data by ID from an API
    // For now, find the product in the static data array
    const foundProduct = products.find(p => p.id === parseInt(id));
    setProduct(foundProduct);
    setLoading(false);
  }, [id]);

  const handleAddToCart = () => {
    if (!product || quantity <= 0 || quantity > product.stock) return; // Basic validation
    // Add the specified quantity of the product to the cart
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
    setToastMessage(`${quantity} x ${product.name} added to cart!`);
    setShowToast(true);
    setQuantity(1); // Reset quantity after adding to cart
  };

  const handleBuyNow = () => {
     if (!product || quantity <= 0 || quantity > product.stock) return; // Basic validation
    // Add to cart and navigate to the cart page
     for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
    navigate('/cart');
  };

  if (loading) {
    return (
      <Container className="my-5 text-center">
        <div>Loading product details...</div>
      </Container>
    );
  }

  if (!product) {
    return (
      <Container className="my-5 text-center">
        <h2>Product Not Found</h2>
        <p>The product you are looking for does not exist.</p>
        <Button variant="primary" onClick={() => navigate('/products')}>
          Back to Products
        </Button>
      </Container>
    );
  }

  return (
    <Container className="my-5">
      <Row className="g-4">
        {/* Left Column: Product Image */}
        <Col md={5} className="d-flex justify-content-center align-items-start">
          <Card className="shadow-sm w-100">
            <Card.Img 
              variant="top" 
              src={product.image} 
              alt={product.name} 
              style={{ maxHeight: '500px', objectFit: 'contain' }}
            />
          </Card>
        </Col>

        {/* Right Column: Product Details and Actions */}
        <Col md={7}>
          <h1 className="mb-2 fs-3">{product.name}</h1>
          {product.brand && <p className="text-muted mb-2">Visit the {product.brand} Store</p>}
          
          <div className="mb-3">
            <span className="text-warning me-2 fs-5">
              {'★'.repeat(Math.floor(product.rating))}
              {'☆'.repeat(5 - Math.floor(product.rating))}
            </span>
            <small className="text-muted">({product.rating} out of 5)</small>
          </div>
          
          <hr className="my-3"/>

          <div className="mb-4">
            <div className="d-flex align-items-center mb-2">
               <span className="text-muted me-2">Price:</span>
               <h4 className="d-inline-block mb-0">${product.price.toFixed(2)}</h4>
            </div>
             {product.stock > 0 ? (
              <Badge bg="success">In Stock ({product.stock})</Badge>
            ) : (
              <Badge bg="danger">Out of Stock</Badge>
            )}
          </div>

          <hr className="my-3"/>

          <p className="mb-4 fs-6">{product.description}</p>

           <hr className="my-3"/>

          <div className="mb-3 d-flex align-items-center">
            <Form.Label className="me-2 mb-0">Quantity:</Form.Label>
            <Form.Control
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value))}
              style={{ width: '80px' }}
              disabled={product.stock === 0}
            />
          </div>

          <div className="d-grid gap-2">
            <Button 
              variant="primary" 
              size="lg"
              onClick={handleAddToCart}
              disabled={product.stock === 0 || quantity > product.stock || quantity <= 0}
              style={{
                backgroundColor: '#FFD814', // Amazon yellow
                borderColor: '#FCD200', // Amazon darker yellow
                color: '#000',
                '--bs-btn-hover-bg': '#F7DA64',
                '--bs-btn-hover-border-color': '#F2C200',
              }}
            >
              Add to Cart
            </Button>
            <Button 
              variant="success" 
              size="lg"
              onClick={handleBuyNow}
               disabled={product.stock === 0 || quantity > product.stock || quantity <= 0}
              style={{
                backgroundColor: '#FFA41C', // Amazon orange
                borderColor: '#N/A', // Amazon darker orange (using same as bg for simplicity)
                 color: '#000',
                '--bs-btn-hover-bg': '#FAAF40',
                '--bs-btn-hover-border-color': '#FAAF40',
              }}
            >
              Buy Now
            </Button>
          </div>
        </Col>
      </Row>
      
      {/* Toast for feedback */}
      <ToastContainer position="bottom-end" className="p-3">
        <Toast onClose={() => setShowToast(false)} show={showToast} delay={3000} autohide>
          <Toast.Header>
            <strong className="me-auto">Notification</strong>
          </Toast.Header>
          <Toast.Body>{toastMessage}</Toast.Body>
        </Toast>
      </ToastContainer>
    </Container>
  );
};

export default ProductDetail;