import api from './api';

export const orderService = {
    getMyOrders: async () => {
        const response = await api.get('/orders');
        return response.data;
    },
    updateOrder: async (id, data) => {
        console.log(id);
        console.log(data);
        const response = await api.patch(`/orders/${id}`, data);
        console.log("response");
        console.log(response);
        return response.data;
    },
    getStatuses: async () => {
        const response = await api.get('/statuses');
        return response.data;
    }
};
