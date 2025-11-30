import React from 'react';
import { Card, Button } from 'antd';
import type { Product } from '../../types';
import { useCart } from '../../contexts/CartContext';

const { Meta } = Card;

const ProductCard: React.FC<{ product: Product }> = ({ product }) => {
    const { addToCart } = useCart();

    return (
        <Card
            hoverable
            style={{ width: 240 }}
            cover={<img alt={product.name} src={product.imageUrl || '/placeholder.png'} style={{ height: 180, objectFit: 'cover' }} />}
        >
            <Meta title={product.name} description={`${product.description || ''}`} />
            <div style={{ marginTop: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: 700 }}>{product.price.toLocaleString('es-CL', { style: 'currency', currency: 'CLP' })}</span>
                <Button type="primary" onClick={() => addToCart(product, 1)}>Añadir</Button>
            </div>
        </Card>
    );
};

export default ProductCard;
