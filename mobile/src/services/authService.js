import api from './api';
import * as SecureStore from 'expo-secure-store';

export const authService = {
    login: async (username, password) => {
        const response = await api.post('/auth/login', { username, password });
        console.log(response);
        if (response.data.token) {
            console.log(response.data.token);
            console.log(response.data.user);
            await SecureStore.setItemAsync('token', response.data.token);
            await SecureStore.setItemAsync('user', JSON.stringify(response.data.user));
        }
        console.log(response.data);
        return response.data;
    },
    logout: async () => {
        await SecureStore.deleteItemAsync('token');
        await SecureStore.deleteItemAsync('user');
    },
    getUser: async () => {
        const user = await SecureStore.getItemAsync('user');
        return user ? JSON.parse(user) : null;
    },
    changePassword: async (currentPassword, newPassword) => {
        const response = await api.patch('/users/change-password', { currentPassword, newPassword });
        return response.data;
    }
};
