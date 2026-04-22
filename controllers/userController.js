const pool = require('../config/db');
const bcrypt = require('bcryptjs');

// Get user profile
exports.getUserProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const [user] = await pool.query('SELECT id, email, firstName, lastName, phone, address FROM users WHERE id = ?', [userId]);

        if (user.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({ message: 'User profile retrieved', data: user[0] });
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving user profile', error: error.message });
    }
};

// Update user profile
exports.updateUserProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const { firstName, lastName, phone, address } = req.body;

        await pool.query('UPDATE users SET firstName = ?, lastName = ?, phone = ?, address = ? WHERE id = ?', [firstName, lastName, phone, address, userId]);

        res.json({ message: 'Profile updated successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error updating profile', error: error.message });
    }
};

// Change password
exports.changePassword = async (req, res) => {
    try {
        const userId = req.user.id;
        const { oldPassword, newPassword } = req.body;

        const [user] = await pool.query('SELECT password FROM users WHERE id = ?', [userId]);

        if (!user.length) {
            return res.status(404).json({ message: 'User not found' });
        }

        const isPasswordValid = await bcrypt.compare(oldPassword, user[0].password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Old password is incorrect' });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await pool.query('UPDATE users SET password = ? WHERE id = ?', [hashedPassword, userId]);

        res.json({ message: 'Password changed successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error changing password', error: error.message });
    }
};

// Get all users (Admin only)
exports.getAllUsers = async (req, res) => {
    try {
        const [users] = await pool.query('SELECT id, email, firstName, lastName, role FROM users');
        res.json({ message: 'Users retrieved', data: users });
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving users', error: error.message });
    }
};

// Delete user account
exports.deleteUserAccount = async (req, res) => {
    try {
        const userId = req.user.id;
        await pool.query('DELETE FROM users WHERE id = ?', [userId]);
        res.json({ message: 'Account deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting account', error: error.message });
    }
};
