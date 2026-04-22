const jwt = require('jsonwebtoken');
const pool = require('../config/db');

const auth = async (req, res, next) => {
  try {
    let token;
    
    // Check for token in cookies (for web app)
    if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }
    // Check for token in Authorization header (for mobile/API)
    else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No authentication token, access denied'
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret_key');
    
    // Get user from database
    const [users] = await pool.query('SELECT id, email, role FROM users WHERE id = ?', [decoded.id]);
    
    if (users.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'User not found'
      });
    }
    
    req.user = users[0];
    next();
  } catch (error) {
    console.error('Auth error:', error);
    res.status(401).json({
      success: false,
      message: 'Token verification failed, authorization denied'
    });
  }
};

module.exports = auth;