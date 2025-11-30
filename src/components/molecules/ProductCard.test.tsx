import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import ProductCard from './ProductCard';
import { CartProvider } from '../../contexts/CartContext';
import type { Product } from '../../types';

// Mockeamos matchMedia que usa Ant Design internamente
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

const mockProduct: Product = {
    id: 1,
    name: 'Test Product',
    price: 1000,
    description: 'Description',
    imageUrl: '',
    categoryId: 1
};

describe('ProductCard', () => {
    it('renderiza el nombre y precio del producto correctamente', () => {
        render(
            <CartProvider>
                <ProductCard product={mockProduct} />
            </CartProvider>
        );

        expect(screen.getByText('Test Product')).toBeInTheDocument();
        // Antd puede separar el precio por formato, buscamos el texto parcial
        expect(screen.getByText('$1.000')).toBeInTheDocument();
    });

    it('tiene un botón para añadir al carrito', () => {
        render(
            <CartProvider>
                <ProductCard product={mockProduct} />
            </CartProvider>
        );

        const button = screen.getByRole('button', { name: /añadir/i });
        expect(button).toBeInTheDocument();
        fireEvent.click(button);
        // Si no explota, pasó la prueba básica de integración con el contexto
    });
});