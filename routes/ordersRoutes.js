// backend/routes/orderRoutes.js (Complete working version)
const express = require("express");
const router = express.Router();
const db = require('../config/db');
const authMiddleware = require('../middleware/auth');

// Create order from review page
router.post("/create-order", authMiddleware, async (req, res) => {
  try {
    const { items, total, subtotal, shipping, payment_intent_id, payment_info, shipping_address } = req.body;
    const user_id = req.user.id; // Get from authenticated user, NOT hardcoded

    if (!user_id) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated"
      });
    }

    const connection = await db.getConnection();
    await connection.beginTransaction();

    try {
      // Get or create address
      let addressId = shipping_address?.addressId;
      
      if (!addressId) {
        // Check if address already exists
        const [existingAddress] = await connection.query(
          `SELECT id FROM addresses 
           WHERE user_id = ? AND address_line_1 = ? AND postal_code = ?`,
          [user_id, shipping_address?.address, shipping_address?.zipCode]
        );
        
        if (existingAddress.length > 0) {
          addressId = existingAddress[0].id;
        } else {
          // Insert new address
          const [addressResult] = await connection.query(
            `INSERT INTO addresses 
             (user_id, first_name, last_name, email, address_line_1, 
              city, state, postal_code, country, phone, created_at, updated_at) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
            [user_id, 
             shipping_address?.firstName || 'Unknown',
             shipping_address?.lastName || 'Unknown',
             shipping_address?.email || 'unknown@email.com',
             shipping_address?.address || 'Unknown',
             shipping_address?.city || 'Unknown',
             shipping_address?.state || 'Unknown',
             shipping_address?.zipCode || '00000',
             'USA',
             shipping_address?.phone || '0000000000']
          );
          addressId = addressResult.insertId;
        }
      }

      // Insert payment
      const [paymentResult] = await connection.query(
        `INSERT INTO payments (amount, payment_method, card_last_four, card_type, status, transaction_id, created_at) 
         VALUES (?, ?, ?, ?, 'completed', ?, NOW())`,
        [total, "credit_card", payment_info?.card_last4 || '0000', payment_info?.card_type || 'visa', payment_intent_id],
      );
      const paymentId = paymentResult.insertId;

      // Insert order with address_id
      const [orderResult] = await connection.query(
        `INSERT INTO orders (user_id, address_id, total, status, shipping_cost, created_at) 
         VALUES (?, ?, ?, 'pending', ?, NOW())`,
        [user_id, addressId, total, shipping || 0]
      );
      const orderId = orderResult.insertId;

      // Update payment with order_id
      await connection.query(
        `UPDATE payments SET order_id = ? WHERE id = ?`,
        [orderId, paymentId]
      );

      // Insert order items
      for (const item of items) {
        await connection.query(
          `INSERT INTO order_items (order_id, product_id, quantity, price) 
           VALUES (?, ?, ?, ?)`,
          [orderId, item.id, item.quantity || 1, item.price || 0],
        );
      }

      await connection.commit();

      res.status(201).json({
        success: true,
        message: "Order created successfully",
        data: {
          order: {
            id: orderId,
            total: total,
            status: "pending",
            created_at: new Date(),
          },
          payment: {
            id: paymentId,
            amount: total,
            status: "completed",
          },
          address_id: addressId
        },
      });
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error("Create order error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create order",
      error: error.message,
    });
  }
});

// Get order totals from cart
router.get("/totals", authMiddleware, async (req, res) => {
  try {
    const user_id = req.user.id;
    
    const [cartItems] = await db.query(`
      SELECT 
        ci.product_id,
        ci.quantity,
        p.name,
        p.price,
        p.image
      FROM cart_items ci
      JOIN products p ON ci.product_id = p.id
      WHERE ci.user_id = ?
    `, [user_id]);

    if (cartItems.length === 0) {
      return res.json({
        success: true,
        data: {
          items: [],
          subtotal: 0,
          shipping: 0,
          total: 0,
        },
      });
    }

    let subtotal = 0;
    const items = cartItems.map((item) => {
      const itemTotal = item.quantity * parseFloat(item.price);
      subtotal += itemTotal;
      return {
        id: item.product_id,
        name: item.name,
        price: parseFloat(item.price),
        quantity: item.quantity,
        image: item.image
      };
    });

    const shipping = subtotal > 50 ? 0 : 12.87;
    const total = subtotal + shipping;

    res.json({
      success: true,
      data: {
        items,
        subtotal: parseFloat(subtotal.toFixed(2)),
        shipping: parseFloat(shipping.toFixed(2)),
        total: parseFloat(total.toFixed(2)),
      },
    });
  } catch (error) {
    console.error("Error fetching order totals:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch order totals",
      error: error.message,
    });
  }
});

// Get order by ID
router.get("/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const user_id = req.user.id;

    const [orders] = await db.query(
      `SELECT * FROM orders WHERE id = ? AND user_id = ?`,
      [id, user_id]
    );

    if (orders.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }
    
    const [items] = await db.query(`
      SELECT oi.*, p.name, p.image
      FROM order_items oi
      LEFT JOIN products p ON oi.product_id = p.id
      WHERE oi.order_id = ?
    `, [id]);
    
    const [payment] = await db.query(`
      SELECT * FROM payments WHERE order_id = ?
    `, [id]);
    
    res.json({
      success: true,
      data: {
        order: orders[0],
        items: items,
        payment: payment[0] || null
      }
    });
  } catch (error) {
    console.error("Error fetching order:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch order",
      error: error.message,
    });
  }
});

module.exports = router;