// Global Error Handler Middleware
const errorHandler = (err, req, res, next) => {
    console.error('Error:', err);

    // JWT Errors
    if (err.name === 'JsonWebTokenError') {
        return res.status(401).json({ message: 'Invalid token' });
    }

    if (err.name === 'TokenExpiredError') {
        return res.status(401).json({ message: 'Token expired' });
    }

    // Validation Errors
    if (err.status === 400) {
        return res.status(400).json({ message: err.message });
    }

    // Default Error
    res.status(err.status || 500).json({
        message: err.message || 'Internal Server Error',
        status: err.status || 500,
    });
};

module.exports = errorHandler;
