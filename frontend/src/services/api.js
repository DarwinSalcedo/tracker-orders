import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
    headers: {
        'Content-Type': 'application/json',
    },
});


api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('authToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor to handle expired tokens
api.interceptors.response.use(
    (response) => {
        // If the response is successful, just return it
        return response;
    },
    (error) => {
        // Check if the error is a 401 Unauthorized (expired or invalid token)
        if (error.response && error.response.status === 401) {
            // Clear authentication data
            localStorage.removeItem('authToken');
            localStorage.removeItem('user');
            
            // Redirect to login page
            // Only redirect if we're not already on the login page
            if (!window.location.pathname.includes('/backoffice/login')) {
                window.location.href = '/backoffice/login';
            }
        }
        
        return Promise.reject(error);
    }
);

export default api;
