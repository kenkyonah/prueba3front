import React from 'react';
import { Row, Col, Empty } from 'antd';
import ProductCard from '../molecules/ProductCard';
import type { Product } from '../../types';

// Este componente recibe la lista de productos y los dibuja en una grilla
const ProductGrid: React.FC<{ products: Product[] }> = ({ products }) => {

    // Si la lista está vacía, mostramos un mensaje bonito de "No hay datos"
    if (products.length === 0) {
        return <Empty description="No se encontraron productos" image={Empty.PRESENTED_IMAGE_SIMPLE} />;
    }

    return (
        // Row es la fila. Gutter es el espacio entre tarjetas [horizontal, vertical]
        <Row gutter={[24, 24]}>
            {products.map(p => (
                // Col define el ancho. Total es 24.
                // xs={24}: En celular ocupa todo el ancho (1 columna)
                // sm={12}: En tablet ocupa la mitad (2 columnas)
                // lg={6}: En PC grande ocupa un cuarto (4 columnas)
                <Col key={p.id} xs={24} sm={12} md={8} lg={6}>
                    <ProductCard product={p} />
                </Col>
            ))}
        </Row>
    );
};

export default ProductGrid;