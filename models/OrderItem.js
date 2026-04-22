const db = require('../config/db');

class OrderItem {
  static async create(orderId, items) {
    const values = items.map(item => [
      orderId,
      item.id,
      item.quantity,
      item.price
    ]);
    
    const [result] = await db.query(
      `INSERT INTO order_items (order_id, product_id, quantity, price) 
       VALUES ?`,
      [values]
    );
    return result;
  }

  static async findByOrderId(orderId) {
    const [rows] = await db.query(
      `SELECT oi.*, p.name, p.image 
       FROM order_items oi 
       LEFT JOIN products p ON oi.product_id = p.id 
       WHERE oi.order_id = ?`,
      [orderId]
    );
    return rows;
  }
}

module.exports = OrderItem;