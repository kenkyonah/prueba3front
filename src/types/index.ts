
// Define los roles que existen en el sistema
export type Role = 'ADMIN' | 'VENDEDOR' | 'CLIENTE';

// Define qué datos tiene una categoría
export interface Category {
    id: number;
    name: string;
}

// Define cómo es un producto (lo que viene de la base de datos)
export interface Product {
    id: number;
    name: string;
    description?: string;
    price: number;
    imageUrl?: string; // URL de la foto
    categoryId?: number;
}

// Define un ítem dentro del carrito visual del usuario
export interface CartItem {
    product: Product;
    quantity: number;
}

// Opciones de pago disponibles
export type PaymentMethod = 'CREDITO' | 'DEBITO' | 'EFECTIVO';

// Datos del usuario que guardamos en la sesión
export interface UserData {
    id: number;
    username: string;
    role: Role;
    name?: string; // Agregamos nombre real para mostrar en perfil
    email?: string;
}

// Estructura de un producto al enviarlo en una orden
export interface OrderItemPayload {
    productId: number;
    quantity: number;
}

// Estructura completa de la orden que se envía al Backend
export interface CreateOrderPayload {
    items: OrderItemPayload[];
    paymentMethod: PaymentMethod;
    cashierId?: number;
}

// Estructura para crear un producto nuevo (Sin ID, porque lo genera la BD)
export interface CreateProductPayload {
    name: string;
    price: number;
    categoryId: number;
    imageUrl?: string;
    description?: string;
}

// Estructura de un ítem dentro de una orden (Backend)
export interface OrderItemBackend {
    id: number;
    quantity: number;
    priceAtPurchase: number;
    product: Product; // Reutilizamos el tipo Product
}

// Estructura completa de una Orden que viene del Backend
export interface Order {
    id: number;
    date: string;
    total: number;
    paymentMethod: PaymentMethod;
    items: OrderItemBackend[];
}

// Datos calculados para la Boleta Visual
export interface ReceiptData {
    items: { product: Product; quantity: number }[];
    total: number;
    iva: number;
    neto: number;
    paymentMethod: PaymentMethod;
    cashGiven: number;
    change: number;
    date: string;
}