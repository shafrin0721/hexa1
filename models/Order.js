const db = require('../config/db');

class Order {
  static async create(orderData) {
    const { user_id, total, status } = orderData;
    
    // Updated to match your orders table columns
    const [result] = await db.query(
      `INSERT INTO orders (user_id, total, status, created_at) 
       VALUES (?, ?, ?, NOW())`,
      [user_id, total, status || 'pending']
    );
    return result.insertId;
  }

  static async findById(orderId) {
    const [rows] = await db.query(
      `SELECT * FROM orders WHERE id = ?`,
      [orderId]
    );
    return rows[0];
  }

  static async findByUserId(userId) {
    const [rows] = await db.query(
      `SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC`,
      [userId]
    );
    return rows;
  }

  static async updateStatus(orderId, status) {
    const [result] = await db.query(
      `UPDATE orders SET status = ? WHERE id = ?`,
      [status, orderId]
    );
    return result.affectedRows > 0;
  }

  static async getAll() {
    const [rows] = await db.query(
      `SELECT o.*, u.name as user_name, u.email as user_email 
       FROM orders o 
       LEFT JOIN users u ON o.user_id = u.id 
       ORDER BY o.created_at DESC`
    );
    return rows;
  }

  static async getOrderWithDetails(orderId) {
    const [order] = await db.query(
      `SELECT * FROM orders WHERE id = ?`,
      [orderId]
    );
    
    const [items] = await db.query(
      `SELECT oi.*, p.name as product_name, p.image 
       FROM order_items oi 
       LEFT JOIN products p ON oi.product_id = p.id 
       WHERE oi.order_id = ?`,
      [orderId]
    );
    
    const [payment] = await db.query(
      `SELECT * FROM payments WHERE order_id = ?`,
      [orderId]
    );
    
    return {
      ...order[0],
      items,
      payment: payment[0]
    };
  }
}

module.exports = Order;