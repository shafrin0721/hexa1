const pool = require('../config/db');

// Get user's cart
exports.getCart = async (req, res) => {
    try {
        const userId = req.user.id;

        const [cartItems] = await pool.query(
            `SELECT 
                ci.id, 
                ci.product_id, 
                ci.variant_id,
                ci.quantity, 
                p.name, 
                p.price
             FROM cart_items ci
             JOIN products p ON ci.product_id = p.id
             WHERE ci.user_id = ?`,
            [userId]
        );

        const total = cartItems.reduce((sum, item) => sum + (parseFloat(item.price) * item.quantity), 0);

        res.json({
            success: true,
            message: 'Cart retrieved',
            data: {
                items: cartItems,
                total: total,
                itemCount: cartItems.length
            }
        });
    } catch (error) {
        console.error('Error fetching cart:', error);
        res.status(500).json({ 
            success: false,
            message: 'Error fetching cart', 
            error: error.message 
        });
    }
};

// Add item to cart
exports.addToCart = async (req, res) => {
    try {
        const userId = req.user.id;
        const { productId, variantId, quantity = 1 } = req.body;

        if (!productId || quantity < 1) {
            return res.status(400).json({ 
                success: false,
                message: 'Invalid product or quantity' 
            });
        }

        const [product] = await pool.query('SELECT id FROM products WHERE id = ?', [productId]);

        if (product.length === 0) {
            return res.status(404).json({ 
                success: false,
                message: 'Product not found' 
            });
        }

        const [existingItem] = await pool.query(
            'SELECT id, quantity FROM cart_items WHERE user_id = ? AND product_id = ? AND (variant_id = ? OR (variant_id IS NULL AND ? IS NULL))',
            [userId, productId, variantId || null, variantId || null]
        );

        if (existingItem.length > 0) {
            await pool.query(
                'UPDATE cart_items SET quantity = quantity + ? WHERE id = ?',
                [quantity, existingItem[0].id]
            );
        } else {
            await pool.query(
                'INSERT INTO cart_items (user_id, product_id, variant_id, quantity) VALUES (?, ?, ?, ?)',
                [userId, productId, variantId || null, quantity]
            );
        }

        res.status(201).json({ 
            success: true,
            message: 'Item added to cart' 
        });
    } catch (error) {
        console.error('Error adding to cart:', error);
        res.status(500).json({ 
            success: false,
            message: 'Error adding to cart', 
            error: error.message 
        });
    }
};

// Update cart item quantity
exports.updateCartItem = async (req, res) => {
    try {
        const userId = req.user.id;
        const { itemId } = req.params;
        const { quantity } = req.body;

        if (quantity < 1) {
            return res.status(400).json({ 
                success: false,
                message: 'Quantity must be at least 1' 
            });
        }

        const [cartItem] = await pool.query(
            'SELECT id FROM cart_items WHERE id = ? AND user_id = ?',
            [itemId, userId]
        );

        if (cartItem.length === 0) {
            return res.status(404).json({ 
                success: false,
                message: 'Cart item not found' 
            });
        }

        await pool.query(
            'UPDATE cart_items SET quantity = ? WHERE id = ?',
            [quantity, itemId]
        );

        res.json({ 
            success: true,
            message: 'Cart item updated' 
        });
    } catch (error) {
        console.error('Error updating cart item:', error);
        res.status(500).json({ 
            success: false,
            message: 'Error updating cart item', 
            error: error.message 
        });
    }
};

// Remove item from cart
exports.removeFromCart = async (req, res) => {
    try {
        const userId = req.user.id;
        const { itemId } = req.params;

        const [cartItem] = await pool.query(
            'SELECT id FROM cart_items WHERE id = ? AND user_id = ?',
            [itemId, userId]
        );

        if (cartItem.length === 0) {
            return res.status(404).json({ 
                success: false,
                message: 'Cart item not found' 
            });
        }

        await pool.query('DELETE FROM cart_items WHERE id = ?', [itemId]);

        res.json({ 
            success: true,
            message: 'Item removed from cart' 
        });
    } catch (error) {
        console.error('Error removing from cart:', error);
        res.status(500).json({ 
            success: false,
            message: 'Error removing from cart', 
            error: error.message 
        });
    }
};

// Clear entire cart
exports.clearCart = async (req, res) => {
    try {
        const userId = req.user.id;
        await pool.query('DELETE FROM cart_items WHERE user_id = ?', [userId]);

        res.json({ 
            success: true,
            message: 'Cart cleared' 
        });
    } catch (error) {
        console.error('Error clearing cart:', error);
        res.status(500).json({ 
            success: false,
            message: 'Error clearing cart', 
            error: error.message 
        });
    }
};