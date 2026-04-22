const db = require('../config/db');

class Payment {
  static async create(paymentData) {
    const { 
      order_id, 
      amount, 
      payment_method, 
      card_last_four, 
      status,
      transaction_id,
      card_type 
    } = paymentData;
    
    const [result] = await db.query(
      `INSERT INTO payments (order_id, amount, payment_method, card_last_four, status, transaction_id, card_type, created_at) 
       VALUES (?, ?, ?, ?, ?, ?, ?, NOW())`,
      [order_id, amount, payment_method, card_last_four, status, transaction_id, card_type]
    );

    const [inserted] = await db.query(
      `SELECT * FROM payments WHERE id = ?`,
      [result.insertId]
    );
    return result.insertId;
  }

  static async findById(paymentId) {
    const [rows] = await db.query(
      `SELECT * FROM payments WHERE id = ?`,
      [paymentId]
    );
    return rows[0];
  }

  static async findByOrderId(orderId) {
    const [rows] = await db.query(
      `SELECT * FROM payments WHERE order_id = ?`,
      [orderId]
    );
    return rows[0];
  }

  static async updateStatus(paymentId, status) {
    const [result] = await db.query(
      `UPDATE payments SET status = ? WHERE id = ?`,
      [status, paymentId]
    );
    return result.affectedRows > 0;
  }

  static async updateTransactionId(paymentId, transactionId) {
    const [result] = await db.query(
      `UPDATE payments SET transaction_id = ? WHERE id = ?`,
      [transactionId, paymentId]
    );
    return result.affectedRows > 0;
  }
}

module.exports = Payment;