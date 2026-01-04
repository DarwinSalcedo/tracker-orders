import api from './api';

export const statusService = {
    getAllStatuses: async () => {
        const response = await api.get('/statuses');
        return response.data;
    },

    createStatus: async (statusData) => {
        const response = await api.post('/statuses', statusData);
        return response.data;
    },

    updateStatus: async (id, statusData) => {
        const response = await api.patch(`/statuses/${id}`, statusData);
        return response.data;
    },

    deleteStatus: async (id) => {
        const response = await api.delete(`/statuses/${id}`);
        return response.data;
    }
};
