import api from './api';

export const authService = {
    login: async (username, password) => {
        try {
            const response = await api.post('/auth/login', { username, password });
            const { token, user } = response.data;

            localStorage.setItem('authToken', token);
            localStorage.setItem('user', JSON.stringify(user));

            return { token, user };
        } catch (error) {
            throw error.response?.data?.error || 'Login failed';
        }
    },

    register: async (username, password, role, company_id) => {
        try {
            const response = await api.post('/auth/register', { username, password, role, company_id });
            return response.data;
        } catch (error) {
            throw error.response?.data?.error || 'Registration failed';
        }
    },

    logout: () => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
    },

    isAuthenticated: () => {
        return !!localStorage.getItem('authToken');
    },

    getUser: () => {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    },

    getToken: () => {
        return localStorage.getItem('authToken');
    }
};
