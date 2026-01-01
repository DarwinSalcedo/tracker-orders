import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:3000/api', // Make this configurable via env vars ideally
    headers: {
        'Content-Type': 'application/json',
    },
});

export default api;
