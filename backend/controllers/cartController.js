const { CartItem, Product } = require('../models');

// Get user's cart
exports.getCart = async (req, res) => {
  try {
    const cartItems = await CartItem.findAll({
      where: { userId: req.user.id },
      include: [{
        model: Product,
        attributes: ['id', 'name', 'price', 'image']
      }]
    });

    const formattedCart = cartItems.map(item => ({
      id: item.Product.id,
      name: item.Product.name,
      price: item.Product.price,
      image: item.Product.image,
      quantity: item.quantity
    }));

    res.json({ items: formattedCart });
  } catch (error) {
    console.error('Error fetching cart:', error);
    res.status(500).json({ error: 'Failed to fetch cart' });
  }
};

// Add item to cart
exports.addToCart = async (req, res) => {
  const { productId, quantity } = req.body;
  
  try {
    const [cartItem, created] = await CartItem.findOrCreate({
      where: {
        userId: req.user.id,
        productId
      },
      defaults: {
        quantity
      }
    });

    if (!created) {
      cartItem.quantity += quantity;
      await cartItem.save();
    }

    const updatedCart = await CartItem.findAll({
      where: { userId: req.user.id },
      include: [{
        model: Product,
        attributes: ['id', 'name', 'price', 'image']
      }]
    });

    const formattedCart = updatedCart.map(item => ({
      id: item.Product.id,
      name: item.Product.name,
      price: item.Product.price,
      image: item.Product.image,
      quantity: item.quantity
    }));

    res.json({ items: formattedCart });
  } catch (error) {
    console.error('Error adding to cart:', error);
    res.status(500).json({ error: 'Failed to add item to cart' });
  }
};

// Remove item from cart
exports.removeFromCart = async (req, res) => {
  const { productId } = req.params;

  try {
    await CartItem.destroy({
      where: {
        userId: req.user.id,
        productId
      }
    });

    const updatedCart = await CartItem.findAll({
      where: { userId: req.user.id },
      include: [{
        model: Product,
        attributes: ['id', 'name', 'price', 'image']
      }]
    });

    const formattedCart = updatedCart.map(item => ({
      id: item.Product.id,
      name: item.Product.name,
      price: item.Product.price,
      image: item.Product.image,
      quantity: item.quantity
    }));

    res.json({ items: formattedCart });
  } catch (error) {
    console.error('Error removing from cart:', error);
    res.status(500).json({ error: 'Failed to remove item from cart' });
  }
};

// Clear cart
exports.clearCart = async (req, res) => {
  try {
    await CartItem.destroy({
      where: { userId: req.user.id }
    });
    res.json({ message: 'Cart cleared successfully' });
  } catch (error) {
    console.error('Error clearing cart:', error);
    res.status(500).json({ error: 'Failed to clear cart' });
  }
};

// Sync cart (for when user logs in)
exports.syncCart = async (req, res) => {
  const { cart } = req.body;

  try {
    // Clear existing cart
    await CartItem.destroy({
      where: { userId: req.user.id }
    });

    // Add new items
    for (const item of cart) {
      await CartItem.create({
        userId: req.user.id,
        productId: item.id,
        quantity: item.quantity
      });
    }

    const updatedCart = await CartItem.findAll({
      where: { userId: req.user.id },
      include: [{
        model: Product,
        attributes: ['id', 'name', 'price', 'image']
      }]
    });

    const formattedCart = updatedCart.map(item => ({
      id: item.Product.id,
      name: item.Product.name,
      price: item.Product.price,
      image: item.Product.image,
      quantity: item.quantity
    }));

    res.json({ items: formattedCart });
  } catch (error) {
    console.error('Error syncing cart:', error);
    res.status(500).json({ error: 'Failed to sync cart' });
  }
}; 