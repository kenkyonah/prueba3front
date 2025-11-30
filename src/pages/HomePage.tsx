import React, { useEffect, useState } from 'react';
import { Spin } from 'antd';
import ProductGrid from '../components/organisms/ProductGrid';
import { getProducts } from '../api/api';
import type { Product } from '../types';

const HomePage: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getProducts().then(res => setProducts(res.data)).catch(() => {
            // fallback mock if backend no está corriendo
            setProducts([
                { id:1, name:'Control PS5', description:'Control inalámbrico', price: 89000, imageUrl:'/sample/control-ps5.jpg' },
                { id:2, name:'Cargador USB-C', description:'Cargador rapido', price: 12990, imageUrl:'/sample/charger.jpg' }
            ]);
        }).finally(() => setLoading(false));
    }, []);

    if (loading) return <Spin />;

    return (
        <div style={{ padding: 16 }}>
            <ProductGrid products={products} />
        </div>
    );
};

export default HomePage;
