import api from './api';

export const orderService = {
    // Public tracking
    trackOrder: async (trackingId, email) => {
        const response = await api.post('/track', { trackingId, email });
        return response.data;
    },

    getOrderByToken: async (token) => {
        const response = await api.get(`/track/${token}`);
        return response.data;
    },

    // Backoffice
    getAllOrders: async () => {
        const response = await api.get('/orders');
        return response.data;
    },

    // Backoffice
    createOrder: async (orderData) => {
        const response = await api.post('/orders', orderData);
        return response.data;
    },

    updateOrder: async (id, updateData) => {
        const response = await api.patch(`/orders/${id}`, updateData);
        return response.data;
    },

    // Potential helper to get order by ID (if different from track)
    getOrder: async (id) => {
        const response = await api.get(`/orders/${id}`);
        return response.data;
    },

    getStatuses: async () => {
        const response = await api.get('/statuses');
        return response.data;
    }
};
