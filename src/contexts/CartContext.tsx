import React, { createContext, useContext, useState } from 'react';
import type { CartItem, Product, PaymentMethod } from '../types';

interface CartContextValue {
    items: CartItem[];
    addToCart: (product: Product, qty?: number) => void;
    removeFromCart: (productId: number) => void;
    updateQty: (productId: number, qty: number) => void;
    clear: () => void;
    total: () => number;
    createOrderPayload: (paymentMethod: PaymentMethod, cashierId?: number) => any;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

export const useCart = (): CartContextValue => {
    const ctx = useContext(CartContext);
    if (!ctx) throw new Error('useCart must be used inside CartProvider');
    return ctx;
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [items, setItems] = useState<CartItem[]>([]);

    const addToCart = (product: Product, qty = 1) => {
        setItems(prev => {
            const found = prev.find(i => i.product.id === product.id);
            if (found) {
                return prev.map(i =>
                    i.product.id === product.id ? { ...i, quantity: i.quantity + qty } : i
                );
            }
            return [...prev, { product, quantity: qty }];
        });
    };

    const removeFromCart = (productId: number) => {
        setItems(prev => prev.filter(i => i.product.id !== productId));
    };

    const updateQty = (productId: number, qty: number) => {
        setItems(prev => prev.map(i => i.product.id === productId ? { ...i, quantity: qty } : i));
    };

    const clear = () => setItems([]);

    const total = () => items.reduce((s, it) => s + it.quantity * it.product.price, 0);

    const createOrderPayload = (paymentMethod: PaymentMethod, cashierId?: number) => ({
        items: items.map(i => ({ productId: i.product.id, quantity: i.quantity })),
        paymentMethod,
        cashierId
    });

    const value: CartContextValue = {
        items,
        addToCart,
        removeFromCart,
        updateQty,
        clear,
        total,
        createOrderPayload
    };

    return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
