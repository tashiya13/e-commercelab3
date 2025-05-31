import { Container, Table, Button, Row, Col } from 'react-bootstrap';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';

const Cart = () => {
  const { cartItems, removeFromCart, updateQuantity, getCartTotal } = useCart();

  if (cartItems.length === 0) {
    return (
      <Container className="text-center py-5">
        <h2>Your cart is empty</h2>
        <p className="mb-4">Add some products to your cart to see them here!</p>
        <Button
          as={Link}
          to="/products"
          variant="primary"
          style={{
            backgroundColor: 'var(--primary-pink)',
            borderColor: 'var(--primary-pink)',
            '--bs-btn-hover-bg': 'var(--pink-hover)',
            '--bs-btn-hover-border-color': 'var(--pink-hover)',
          }}
        >
          Continue Shopping
        </Button>
      </Container>
    );
  }

  return (
    <Container>
      <h1 className="mb-4">Shopping Cart</h1>
      <Table responsive striped bordered hover>
        <thead>
          <tr>
            <th>Product</th>
            <th>Price</th>
            <th>Quantity</th>
            <th>Total</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {cartItems.map((item) => (
            <tr key={item.id}>
              <td>{item.name}</td>
              <td>${item.price.toFixed(2)}</td>
              <td>
                <div className="d-flex align-items-center">
                  <Button
                    variant="outline-secondary"
                    size="sm"
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="me-2"
                  >
                    -
                  </Button>
                  <span className="mx-2">{item.quantity}</span>
                  <Button
                    variant="outline-secondary"
                    size="sm"
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="ms-2"
                  >
                    +
                  </Button>
                </div>
              </td>
              <td>${(item.price * item.quantity).toFixed(2)}</td>
              <td>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => removeFromCart(item.id)}
                >
                  Remove
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td colSpan="3" className="text-end">
              <strong>Total:</strong>
            </td>
            <td colSpan="2">
              <strong>${getCartTotal().toFixed(2)}</strong>
            </td>
          </tr>
        </tfoot>
      </Table>
      <Row className="mt-4">
        <Col className="text-end">
          <Button
            as={Link}
            to="/products"
            variant="secondary"
            className="me-2"
          >
            Continue Shopping
          </Button>
          <Button
            variant="success"
            size="lg"
            onClick={() => {
              // TODO: Implement checkout functionality
              alert('Checkout functionality coming soon!');
            }}
          >
            Proceed to Checkout
          </Button>
        </Col>
      </Row>
    </Container>
  );
};

export default Cart; 