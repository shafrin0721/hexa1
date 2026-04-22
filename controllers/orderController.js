const pool = require('../config/db');

// Get all orders (Admin only)
exports.getAllOrders = async (req, res) => {
    try {
        const [orders] = await pool.query('SELECT * FROM orders ORDER BY createdAt DESC');
        res.json({ message: 'Orders retrieved', data: orders });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching orders', error: error.message });
    }
};

// Get user's orders
exports.getUserOrders = async (req, res) => {
    try {
        const userId = req.user.id;
        const [orders] = await pool.query('SELECT * FROM orders WHERE userId = ? ORDER BY createdAt DESC', [userId]);
        res.json({ message: 'User orders retrieved', data: orders });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching user orders', error: error.message });
    }
};

// Get single order by ID
exports.getOrderById = async (req, res) => {
    try {
        const { id } = req.params;
        const [order] = await pool.query('SELECT * FROM orders WHERE id = ?', [id]);

        if (order.length === 0) {
            return res.status(404).json({ message: 'Order not found' });
        }

        // Get order items
        const [items] = await pool.query('SELECT * FROM orderItems WHERE orderId = ?', [id]);
        order[0].items = items;

        res.json({ message: 'Order retrieved', data: order[0] });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching order', error: error.message });
    }
};

// Update order status
exports.updateOrderStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, paymentStatus } = req.body;

        if (!status && !paymentStatus) {
            return res.status(400).json({ message: 'No fields to update' });
        }

        let query = 'UPDATE orders SET ';
        const params = [];

        if (status) {
            query += 'status = ?';
            params.push(status);
        }

        if (paymentStatus) {
            if (status) query += ', ';
            query += 'paymentStatus = ?';
            params.push(paymentStatus);
        }

        query += ' WHERE id = ?';
        params.push(id);

        await pool.query(query, params);
        res.json({ message: 'Order updated successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error updating order', error: error.message });
    }
};

// Delete order
exports.deleteOrder = async (req, res) => {
    try {
        const { id } = req.params;
        await pool.query('DELETE FROM orders WHERE id = ?', [id]);
        res.json({ message: 'Order deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting order', error: error.message });
    }
};

exports.createOrder = async (req, res) => {
  try {
    const { 
      items, 
      total, 
      payment_intent_id,
      payment_status,
      shipping_address, 
      payment_info 
    } = req.body;
    
    const user_id = req.user?.id || 1;

    if (!payment_intent_id) {
      throw new Error('payment_intent_id is required');
    }
    
    if (!payment_info || !payment_info.card_last4) {
      throw new Error('payment_info with card_last4 is required');
    }

    const connection = await require('../config/db').getConnection();
    await connection.beginTransaction();

    try {
      const paymentQuery = `
        INSERT INTO payments (order_id, amount, payment_method, card_last_four, status, transaction_id, card_type, created_at) 
        VALUES (?, ?, ?, ?, ?, ?, ?, NOW())
      `;
      
      const paymentValues = [
        null, 
        total,
        'credit_card',
        payment_info.card_last4, 
        payment_status || 'completed',
        payment_intent_id, 
        payment_info.card_type || 'unknown'
      ];
      
      const [paymentResult] = await connection.query(paymentQuery, paymentValues);
      const paymentId = paymentResult.insertId;

      // Modified to match your orders table columns
      const orderQuery = `
        INSERT INTO orders (user_id, total, status, created_at) 
        VALUES (?, ?, ?, NOW())
      `;
      
      const orderValues = [
        user_id,
        total,
        'pending'
      ];
      
      const [orderResult] = await connection.query(orderQuery, orderValues);
      const orderId = orderResult.insertId;

      await connection.query(
        `UPDATE payments SET order_id = ? WHERE id = ?`,
        [orderId, paymentId]
      );

      if (items && items.length > 0) {
        for (const item of items) {
          await connection.query(
            `INSERT INTO order_items (order_id, product_id, quantity, price) 
             VALUES (?, ?, ?, ?)`,
            [orderId, item.id, item.quantity, item.price]
          );
        }
      }

      await connection.commit();

      const [verifyPayment] = await connection.query(
        `SELECT * FROM payments WHERE id = ?`,
        [paymentId]
      );
      
      res.status(201).json({
        success: true,
        message: 'Order created successfully',
        data: {
          order: { id: orderId, total: total, status: 'pending' },
          payment: verifyPayment[0]
        }
      });
      
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create order',
      error: error.message
    });
  }
};
