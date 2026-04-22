import api from './api';

// Create new order
export const createOrder = async (orderData) => {
    try {
        const response = await api.post('/orders', orderData);
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

// Get user's orders
export const getUserOrders = async () => {
    try {
        const response = await api.get('/orders/user');
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

// Get order by ID
export const getOrderById = async (id) => {
    try {
        const response = await api.get(`/orders/${id}`);
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

// Get all orders (Admin only)
export const getAllOrders = async () => {
    try {
        const response = await api.get('/orders');
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

// Update order status (Admin only)
export const updateOrderStatus = async (id, orderData) => {
    try {
        const response = await api.put(`/orders/${id}`, orderData);
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

// Delete order (Admin only)
export const deleteOrder = async (id) => {
    try {
        const response = await api.delete(`/orders/${id}`);
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

// Calculate order total
export const calculateOrderTotal = (items) => {
    return items.reduce((total, item) => total + (item.price * item.quantity), 0);
};
