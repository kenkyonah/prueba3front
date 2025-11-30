// src/components/molecules/ProductCard.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import ProductCard from './ProductCard';
import { CartProvider } from '../../contexts/CartContext';
import type { Product } from '../../types';

// CONFIGURACIÓN OBLIGATORIA PARA ANT DESIGN:
// Ant Design intenta detectar si es celular o PC usando 'matchMedia'.
// Como los tests corren en una terminal (sin pantalla real), esa función no existe.
// Aquí creamos una versión falsa (mock) para que el test no falle.
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

// DATOS DE PRUEBA (MOCK):
// Creamos un producto falso de jardinería para probar el componente.
const mockProduct: Product = {
    id: 1,
    name: 'Semillas Test',
    price: 5000,
    description: 'Descripción de prueba para semillas',
    imageUrl: '', // Sin imagen para el test
    categoryId: 1
};

// INICIO DE LAS PRUEBAS
describe('Componente ProductCard', () => {

    // PRUEBA 1: Verificar visualización
    it('Muestra el nombre y el precio correctamente', () => {
        // Renderizamos el componente dentro del contexto del carrito (porque usa useCart)
        render(
            <CartProvider>
                <ProductCard product={mockProduct} />
            </CartProvider>
        );

        // Verifica: ¿Existe el texto "Semillas Test" en el documento?
        expect(screen.getByText('Semillas Test')).toBeInTheDocument();

        // Verifica: ¿Existe el texto del precio? (AntD usa formatos especiales, buscamos parcial)
        // Buscamos algo que incluya "5.000"
        expect(screen.getByText((content) => content.includes('5.000'))).toBeInTheDocument();
    });

    // PRUEBA 2: Verificar interacción
    it('Tiene un botón "Añadir" que se puede cliquear', () => {
        render(
            <CartProvider>
                <ProductCard product={mockProduct} />
            </CartProvider>
        );

        // Buscamos el botón por su rol y nombre (escase-insensitive)
        const button = screen.getByRole('button', { name: /añadir/i });

        // ¿Existe el botón?
        expect(button).toBeInTheDocument();

        // Simulamos que el usuario hace clic
        fireEvent.click(button);

        // Si el test llega hasta aquí sin errores rojos, significa que el clic no rompió nada.
    });
});