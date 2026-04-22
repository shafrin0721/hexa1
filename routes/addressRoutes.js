// backend/routes/addressRoutes.js
const express = require('express');
const router = express.Router();
const db = require('../config/db');
const authMiddleware = require('../middleware/auth');

// Save address only (no order creation)
router.post('/address', authMiddleware, async (req, res) => {
  try {
    const { 
      email, firstName, lastName, address, city, 
      state, zipCode, phone 
    } = req.body;
    
    const userId = req.user.id;
    
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'User not authenticated'
      });
    }
    
    // Insert new address
    const [result] = await db.query(
      `INSERT INTO addresses 
       (user_id, first_name, last_name, email, address_line_1, 
        city, state, postal_code, country, phone, created_at, updated_at) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
      [userId, firstName, lastName, email, address, city, state || 'USA', zipCode, 'USA', phone]
    );
    
    res.json({
      success: true,
      addressId: result.insertId,
      message: 'Address saved successfully'
    });
    
  } catch (error) {
    console.error('Error saving address:', error);
    res.status(500).json({
      success: false,
      message: 'Error saving address: ' + error.message
    });
  }
});

// Get user's addresses
router.get('/address/:userId', authMiddleware, async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);
    
    if (userId !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }
    
    const [addresses] = await db.query(
      `SELECT 
        id,
        first_name, 
        last_name, 
        email,
        address_line_1 as address, 
        city, 
        state,
        postal_code as zipCode, 
        country,
        phone,
        is_default
       FROM addresses 
       WHERE user_id = ?
       ORDER BY is_default DESC, created_at DESC`,
      [userId]
    );
    
    res.json({
      success: true,
      addresses: addresses
    });
    
  } catch (error) {
    console.error('Error fetching addresses:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching addresses'
    });
  }
});

module.exports = router;