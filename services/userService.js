import api from './api';

// Get user profile
export const getUserProfile = async () => {
    try {
        const response = await api.get('/user/profile');
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

// Update user profile
export const updateUserProfile = async (profileData) => {
    try {
        const response = await api.put('/user/profile', profileData);
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

// Change password
export const changePassword = async (oldPassword, newPassword) => {
    try {
        const response = await api.put('/user/change-password', {
            oldPassword,
            newPassword
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

// Get all users (Admin only)
export const getAllUsers = async () => {
    try {
        const response = await api.get('/user');
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

// Delete user account
export const deleteUserAccount = async () => {
    try {
        const response = await api.delete('/user/account');
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};
