// Simulating a real auth service
const MOCK_USER = {
    username: 'admin',
    password: 'password123'
};

export const authService = {
    login: async (username, password) => {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 800));

        if (username === MOCK_USER.username && password === MOCK_USER.password) {
            const token = 'mock-jwt-token-' + Date.now();
            localStorage.setItem('authToken', token);
            return { token, user: { name: 'Admin User', role: 'admin' } };
        }

        throw new Error('Invalid credentials');
    },

    logout: () => {
        localStorage.removeItem('authToken');
    },

    isAuthenticated: () => {
        return !!localStorage.getItem('authToken');
    },

    getToken: () => {
        return localStorage.getItem('authToken');
    }
};
