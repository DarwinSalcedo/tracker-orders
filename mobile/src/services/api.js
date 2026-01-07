import axios from 'axios';
import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';

const getBaseUrl = () => {
    // Replace with your machine's IP address if testing on a physical device
    // e.g., 'http://192.168.1.X:3000'
    if (Platform.OS === 'android') {
        return 'https://tracker-orders.onrender.com/api';
    }
    return 'https://tracker-orders.onrender.com/api';
};

const api = axios.create({
    baseURL: getBaseUrl(),
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use(
    async (config) => {
        const token = await SecureStore.getItemAsync('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;
