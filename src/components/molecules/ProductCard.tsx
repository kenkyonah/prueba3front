import React from 'react';
import { Card, Button } from 'antd';
import type { Product } from '../../types';
import { useCart } from '../../contexts/CartContext';

// Sacamos el sub-componente Meta de la tarjeta para usarlo fácil
const { Meta } = Card;

const ProductCard: React.FC<{ product: Product }> = ({ product }) => {
    // Necesitamos la función 'addToCart' del contexto para vender
    const { addToCart } = useCart();

    return (
        <Card
            hoverable // Efecto visual al pasar el mouse por encima
            style={{ width: '100%' }} // Ocupa todo el ancho de su columna (Responsivo)
            cover={
                // La foto del producto. Si no tiene, usa una por defecto.
                <img
                    alt={product.name}
                    src={product.imageUrl || '/placeholder.png'}
                    style={{ height: 200, objectFit: 'cover' }} // 'cover' evita que la foto se deforme
                />
            }
        >
            {/* Título y descripción del producto */}
            <Meta
                title={product.name}
                description={product.description || 'Sin descripción'}
            />

            {/* Pie de la tarjeta: Precio y Botón */}
            <div style={{ marginTop: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>

                {/* Precio en Verde Huerto Hogar y formato CLP */}
                <span style={{ fontWeight: 'bold', fontSize: '1.1rem', color: '#389e0d' }}>
                    {product.price.toLocaleString('es-CL', { style: 'currency', currency: 'CLP' })}
                </span>

                {/* Al hacer clic, agrega 1 unidad al carrito */}
                <Button type="primary" onClick={() => addToCart(product, 1)}>
                    Añadir
                </Button>
            </div>
        </Card>
    );
};

export default ProductCard;