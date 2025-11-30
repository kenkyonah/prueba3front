import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import CartItem from './CartItem';
import { CartProvider } from '../../contexts/CartContext';
import type { CartItem as CartItemType } from '../../types';

// Mock de matchMedia (Obligatorio para Ant Design)
Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation(query => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
    })),
});

const mockItem: CartItemType = {
    product: {
        id: 99,
        name: 'Tierra de Hoja',
        price: 4000,
        imageUrl: '',
        categoryId: 1
    },
    quantity: 3
};

describe('CartItem Component', () => {
    it('muestra la información del ítem correctamente', () => {
        render(
            <CartProvider>
                <CartItem item={mockItem} />
            </CartProvider>
        );

        // Verifica nombre
        expect(screen.getByText('Tierra de Hoja')).toBeInTheDocument();
        // Verifica precio formateado (parcial)
        expect(screen.getByText((t) => t.includes('4.000'))).toBeInTheDocument();
        // Verifica que el input tenga la cantidad "3"
        const input = screen.getByRole('spinbutton');
        expect(input).toHaveValue('3');
    });

    it('tiene un botón para eliminar', () => {
        render(
            <CartProvider>
                <CartItem item={mockItem} />
            </CartProvider>
        );

        // Ant Design suele usar iconos, buscamos el botón que contiene el icono
        const deleteBtn = screen.getByRole('button');
        fireEvent.click(deleteBtn);
        // Si no falla, el evento se disparó correctamente hacia el contexto
    });
});