import axios from 'axios';
import type { CreateOrderPayload } from '../types';

// Creamos la conexión base con el backend
const api = axios.create({
    // Busca la URL en el archivo .env, si no la encuentra usa localhost
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080/api/v1',
    headers: { 'Content-Type': 'application/json' }
});

// Esto se ejecuta antes de cada petición (Interceptor)
api.interceptors.request.use(config => {
    // Buscamos si hay un token guardado en el navegador
    const token = localStorage.getItem('token');

    // Si hay token, lo pegamos en la cabecera de la petición
    if (token && config && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// --- Funciones para llamar al Backend ---

// Obtener lista de productos
export const getProducts = () => api.get('/products');

// Enviar una orden de compra
export const createOrder = (payload: CreateOrderPayload) => api.post('/orders', payload);

// Registrar un nuevo usuario (NUEVO)
export const registerUser = (userData: CreateOrderPayload) => api.post('/auth/register', userData);

export default api;