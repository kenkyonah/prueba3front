import React from 'react';
import { Row, Col } from 'antd';
import ProductCard from '../molecules/ProductCard';
import type { Product } from '../../types';

const ProductGrid: React.FC<{ products: Product[] }> = ({ products }) => {
    return (
        <Row gutter={[16,16]}>
            {products.map(p => (
                <Col key={p.id} xs={24} sm={12} md={8} lg={6}>
                    <ProductCard product={p} />
                </Col>
            ))}
        </Row>
    );
};

export default ProductGrid;
