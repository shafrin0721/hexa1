import api from './api';

// Get all products
export const getAllProducts = async (page = 1, limit = 12, sortBy = 'createdAt', order = 'DESC') => {
    try {
        const response = await api.get('/products', {
            params: { page, limit, sortBy, order }
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

// Get product by ID
export const getProductById = async (id) => {
    try {
        const response = await api.get(`/products/${id}`);
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

// Get products by category
export const getProductsByCategory = async (categoryId) => {
    try {
        const response = await api.get(`/products/category/${categoryId}`);
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

// Create product (Admin only)
export const createProduct = async (productData) => {
    try {
        const response = await api.post('/products', productData);
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

// Update product (Admin only)
export const updateProduct = async (id, productData) => {
    try {
        const response = await api.put(`/products/${id}`, productData);
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

// Delete product (Admin only)
export const deleteProduct = async (id) => {
    try {
        const response = await api.delete(`/products/${id}`);
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

// Search products (can be expanded based on backend support)
export const searchProducts = async (query) => {
    try {
        const response = await api.get('/products', {
            params: { search: query }
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};
