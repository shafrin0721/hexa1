const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const auth = require('../middleware/auth');

// Get user profile (Protected route)
router.get('/profile', auth, userController.getUserProfile);

// Update user profile (Protected route)
router.put('/profile', auth, userController.updateUserProfile);

// Change password (Protected route)
router.put('/change-password', auth, userController.changePassword);

// Get all users (Protected route - Admins only)
router.get('/', auth, userController.getAllUsers);

// Delete user account (Protected route)
router.delete('/account', auth, userController.deleteUserAccount);

module.exports = router;
