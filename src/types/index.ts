// src/types/index.ts

// Roles de usuario
export type Role = 'ADMIN' | 'VENDEDOR' | 'CLIENTE';

// Categoría de producto
export interface Category {
    id: number;
    name: string;
}

// Producto
export interface Product {
    id: number;
    name: string;
    description?: string;
    price: number;
    imageUrl?: string;
    categoryId?: number;
}

// Item del carrito (Frontend)
export interface CartItem {
    product: Product;
    quantity: number;
}

// Métodos de pago
export type PaymentMethod = 'CREDITO' | 'DEBITO' | 'EFECTIVO';

// --- ESTOS SON LOS QUE FALTAN Y CAUSAN EL ERROR ---

// Datos del usuario logueado (Para AuthContext)
export interface UserData {
    id: number;
    username: string;
    role: Role;
}

// Estructura de item para enviar al backend (Para API)
export interface OrderItemPayload {
    productId: number;
    quantity: number;
}

// Estructura completa de la orden (Para CartContext y API)
export interface CreateOrderPayload {
    items: OrderItemPayload[];
    paymentMethod: PaymentMethod;
    cashierId?: number;
}