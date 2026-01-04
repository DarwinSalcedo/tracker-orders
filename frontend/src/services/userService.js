import api from './api';

export const userService = {
    getAllUsers: async () => {
        try {
            const response = await api.get('/users');
            return response.data;
        } catch (error) {
            throw error.response?.data?.error || 'Failed to fetch users';
        }
    },

    getPendingUsers: async () => {
        try {
            const response = await api.get('/users/pending');
            return response.data;
        } catch (error) {
            throw error.response?.data?.error || 'Failed to fetch pending users';
        }
    },

    approveUser: async (id) => {
        try {
            const response = await api.patch(`/users/${id}/approve`);
            return response.data;
        } catch (error) {
            throw error.response?.data?.error || 'Failed to approve user';
        }
    },

    deleteUser: async (id) => {
        try {
            const response = await api.delete(`/users/${id}`);
            return response.data;
        } catch (error) {
            throw error.response?.data?.error || 'Failed to delete user';
        }
    }
};
