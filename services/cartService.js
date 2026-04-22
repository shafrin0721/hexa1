import api from './api';

// Get user's cart
export const getCart = async () => {
    try {
        const response = await api.get('/cart');
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

// Add item to cart
export const addToCart = async (productId, variantId = null, quantity = 1) => {
    try {
        const response = await api.post('/cart/add', { productId, variantId, quantity });
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

// Update cart item quantity
export const updateCartItem = async (itemId, quantity) => {
    try {
        const response = await api.put(`/cart/${itemId}`, { quantity });
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

// Remove item from cart
export const removeFromCart = async (itemId) => {
    try {
        const response = await api.delete(`/cart/${itemId}`);
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

// Clear entire cart
export const clearCart = async () => {
    try {
        const response = await api.delete('/cart');
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};