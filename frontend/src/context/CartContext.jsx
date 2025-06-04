import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    // Load cart from localStorage when the component initializes
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  // Effect to handle initial cart loading and syncing on user login
  useEffect(() => {
    const loadAndSyncCart = async () => {
      setLoading(true);
      try {
        if (user) {
          // Fetch cart from API for logged-in users
          const response = await axios.get('/api/cart');
          const backendCartItems = response.data.items || [];

          // Get cart from localStorage (might have items from before login)
          const localCartItems = JSON.parse(localStorage.getItem('cart') || '[]');

          // Merge local cart with backend cart (simple merge, prioritize backend if conflicts)
          const mergedCart = mergeCarts(localCartItems, backendCartItems);

          setCartItems(mergedCart);
          localStorage.setItem('cart', JSON.stringify(mergedCart)); // Update local storage with merged cart

          // Optionally, sync the merged cart back to the backend
           if (localCartItems.length > 0) {
               await axios.post('/api/cart/sync', { cart: mergedCart, userId: user.id });
           }



        } else {
          // For guests, cart is already loaded from localStorage by useState
          setLoading(false);
        }
      } catch (error) {
        console.error('Error loading or syncing cart:', error);
        // If API fails for logged-in user, still try to load from localStorage
        if (user) {
           const savedCart = localStorage.getItem('cart');
            if (savedCart) {
                setCartItems(JSON.parse(savedCart));
            }
        }
      } finally {
        setLoading(false);
      }
    };

    loadAndSyncCart();
  }, [user]); // Effect runs when user state changes

  // Function to merge carts (simple example)
  const mergeCarts = (localCart, backendCart) => {
    const merged = [...backendCart];
    localCart.forEach(localItem => {
      const existingBackendItem = merged.find(backendItem => backendItem.id === localItem.id);
      if (!existingBackendItem) {
        merged.push(localItem);
      } else {
        // You might want a more sophisticated merge here, e.g., summing quantities
        // For now, backend quantity takes precedence in this simple merge
      }
    });
    return merged;
  };

  // Save cart to localStorage whenever cartItems changes (for both guests and logged-in users)
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
    console.log('Cart state updated and saved to localStorage:', cartItems);
  }, [cartItems]); // Effect runs whenever cartItems changes

  // Update total items count (counting unique products)
  useEffect(() => {
    console.log('Calculating totalItems (unique products) from cartItems:', cartItems);
    // Calculate the number of unique items (products) in the cart
    const uniqueProductCount = cartItems.length;
    setTotalItems(uniqueProductCount);
    console.log('totalItems (unique products) updated to:', uniqueProductCount);
  }, [cartItems]); // Effect runs whenever cartItems changes

  const addToCart = async (product, quantity = 1) => {
    try {
      if (user) {
        // Add to cart via API for logged-in users
        const response = await axios.post('/api/cart/add', {
          productId: product.id,
          quantity
        });
        const updatedCart = response.data;
        setCartItems(updatedCart.items || []);
      } else {
        // Add to cart in localStorage for guests
        setCartItems(prevItems => {
          const existingItem = prevItems.find(item => item.id === product.id);
          
          if (existingItem) {
            return prevItems.map(item =>
              item.id === product.id
                ? { ...item, quantity: item.quantity + quantity }
                : item
            );
          }
          
          return [...prevItems, { ...product, quantity }];
        });
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      // Fallback to localStorage if API fails
      setCartItems(prevItems => {
        const existingItem = prevItems.find(item => item.id === product.id);
        
        if (existingItem) {
          return prevItems.map(item =>
            item.id === product.id
              ? { ...item, quantity: item.quantity + quantity }
              : item
          );
        }
        
        return [...prevItems, { ...product, quantity }];
      });
    }
  };

  const removeFromCart = async (productId) => {
    try {
      if (user) {
        // Remove from cart via API for logged-in users
        const response = await axios.delete(`/api/cart/remove/${productId}`);
        const updatedCart = response.data;
        setCartItems(updatedCart.items || []);
      } else {
        // Remove from cart in localStorage for guests
        setCartItems(prevItems => prevItems.filter(item => item.id !== productId));
      }
    } catch (error) {
      console.error('Error removing from cart:', error);
      // Fallback to localStorage if API fails
      setCartItems(prevItems => prevItems.filter(item => item.id !== productId));
    }
  };

  const updateQuantity = async (productId, newQuantity) => {
    if (newQuantity < 1) {
      await removeFromCart(productId);
      return;
    }

    try {
      if (user) {
        // Update quantity via API for logged-in users
        const response = await axios.post('/api/cart/add', {
          productId,
          quantity: newQuantity
        });
        const updatedCart = response.data;
        setCartItems(updatedCart.items || []);
      } else {
        // Update quantity in localStorage for guests
        setCartItems(prevItems =>
          prevItems.map(item =>
            item.id === productId
              ? { ...item, quantity: newQuantity }
              : item
          )
        );
      }
    } catch (error) {
      console.error('Error updating quantity:', error);
      // Fallback to localStorage if API fails
      setCartItems(prevItems =>
        prevItems.map(item =>
          item.id === productId
            ? { ...item, quantity: newQuantity }
            : item
        )
      );
    }
  };

  const clearCart = async () => {
    try {
      if (user) {
        // Clear cart via API for logged-in users
        await axios.post('/api/cart/clear');
      }
      // Clear cart in state and localStorage
      setCartItems([]);
      localStorage.removeItem('cart');
    } catch (error) {
      console.error('Error clearing cart:', error);
      // Fallback to clearing localStorage
      setCartItems([]);
      localStorage.removeItem('cart');
    }
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const value = {
    cartItems,
    totalItems,
    loading,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}; 