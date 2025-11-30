import axios from 'axios';
import type { CreateOrderPayload } from '../types';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080/api/v1',
    headers: { 'Content-Type': 'application/json' }
});

api.interceptors.request.use(config => {
    const token = localStorage.getItem('token');
    if (token && config && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const getProducts = () => api.get('/products');

// Usamos el tipo CreateOrderPayload en vez de any
export const createOrder = (payload: CreateOrderPayload) => api.post('/orders', payload);

export default api;