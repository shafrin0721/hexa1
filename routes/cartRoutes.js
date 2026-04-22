const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const auth = require('../middleware/auth');

// Get user's cart
router.get('/', auth, cartController.getCart);

// Add item to cart
router.post('/add', auth, cartController.addToCart);

// Update cart item quantity
router.put('/:itemId', auth, cartController.updateCartItem);

// Remove item from cart
router.delete('/:itemId', auth, cartController.removeFromCart);

// Clear entire cart
router.delete('/', auth, cartController.clearCart);

module.exports = router;
