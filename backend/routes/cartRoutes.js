const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const auth = require('../middleware/auth');

// ✅ All cart routes require authentication
router.use(auth);

// ✅ Get user's cart
router.get('/', cartController.getCart);

// ✅ Add item to cart
router.post('/add', cartController.addToCart);

// ✅ Remove item from cart
router.delete('/remove/:productId', cartController.removeFromCart);

// ✅ Clear cart
router.post('/clear', cartController.clearCart);

// ✅ Sync cart (for when user logs in)
router.post('/sync', cartController.syncCart);

module.exports = router;
