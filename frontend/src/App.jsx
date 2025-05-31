import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Login from './pages/Login';
import Register from './pages/Register';
import { CartProvider } from './context/CartContext';

function App() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <CartProvider>
      <Router>
        <div className="App">
          <Navbar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
          <div className="container mt-4">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/products" element={<Products searchQuery={searchQuery} />} />
              <Route path="/product/:id" element={<ProductDetail />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
            </Routes>
          </div>
        </div>
      </Router>
    </CartProvider>
  );
}

export default App;
