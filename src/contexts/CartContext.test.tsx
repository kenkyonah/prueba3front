import { renderHook, act } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { CartProvider, useCart } from './CartContext';
import type { Product } from '../types';

// Mock de producto para las pruebas
const productA: Product = { id: 1, name: 'Pala', price: 1000, categoryId: 1 };
const productB: Product = { id: 2, name: 'Semillas', price: 500, categoryId: 1 };

describe('CartContext (Lógica del Carrito)', () => {

    // Función auxiliar para "montar" el hook dentro del proveedor
    const renderCartHook = () => {
        return renderHook(() => useCart(), { wrapper: CartProvider });
    };

    it('inicia con el carrito vacío', () => {
        const { result } = renderCartHook();
        expect(result.current.items).toEqual([]);
        expect(result.current.total()).toBe(0);
    });

    it('agrega un producto correctamente', () => {
        const { result } = renderCartHook();

        // Ejecutamos la acción de agregar dentro de 'act' (regla de React Testing)
        act(() => {
            result.current.addToCart(productA, 2);
        });

        expect(result.current.items).toHaveLength(1);
        expect(result.current.items[0].product.name).toBe('Pala');
        expect(result.current.items[0].quantity).toBe(2);
    });

    it('calcula el total correctamente con múltiples productos', () => {
        const { result } = renderCartHook();

        act(() => {
            result.current.addToCart(productA, 1); // 1000
            result.current.addToCart(productB, 2); // 500 * 2 = 1000
        });

        // Total esperado: 2000
        expect(result.current.total()).toBe(2000);
    });

    it('elimina un producto del carrito', () => {
        const { result } = renderCartHook();

        act(() => {
            result.current.addToCart(productA);
            result.current.removeFromCart(productA.id);
        });

        expect(result.current.items).toHaveLength(0);
        expect(result.current.total()).toBe(0);
    });

    it('vacía el carrito completamente', () => {
        const { result } = renderCartHook();

        act(() => {
            result.current.addToCart(productA);
            result.current.addToCart(productB);
            result.current.clear();
        });

        expect(result.current.items).toHaveLength(0);
    });
});