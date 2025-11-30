import React, { useEffect, useState } from 'react';
import { Spin } from 'antd';
import ProductGrid from '../components/organisms/ProductGrid';
import { getProducts } from '../api/api';
import type { Product } from '../types';

const HomePage: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    // Este efecto se ejecuta al cargar la página
    useEffect(() => {
        // Intentamos obtener productos del backend
        getProducts()
            .then(res => setProducts(res.data))
            .catch(() => {
                // Si falla (porque el backend no está listo), usamos datos falsos DE HUERTO
                console.warn("Backend no conectado, usando datos mock de Huerto Hogar");
                setProducts([
                    {
                        id: 1,
                        name: 'Semillas de Tomate Cherry',
                        description: 'Sobre de 50 semillas orgánicas certificadas.',
                        price: 2990,
                        imageUrl: 'https://images.unsplash.com/photo-1592841200221-a6898f307baa?auto=format&fit=crop&w=300&q=80',
                        categoryId: 1
                    },
                    {
                        id: 2,
                        name: 'Kit de Herramientas Jardín',
                        description: 'Incluye pala, rastrillo y tijeras de podar.',
                        price: 15990,
                        imageUrl: 'https://images.unsplash.com/photo-1416872927374-393c5991308b?auto=format&fit=crop&w=300&q=80',
                        categoryId: 2
                    },
                    {
                        id: 3,
                        name: 'Tierra de Hoja 10L',
                        description: 'Sustrato natural enriquecido para macetas.',
                        price: 4500,
                        imageUrl: 'https://images.unsplash.com/photo-1622383563227-0440114a8520?auto=format&fit=crop&w=300&q=80',
                        categoryId: 1
                    },
                    {
                        id: 4,
                        name: 'Macetero Cerámica Medio',
                        description: 'Macetero artesanal esmaltado color blanco.',
                        price: 8900,
                        imageUrl: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=300&q=80',
                        categoryId: 3
                    }
                ]);
            })
            .finally(() => setLoading(false)); // Apagamos el "Cargando..."
    }, []);

    if (loading) return <div style={{ display:'flex', justifyContent:'center', marginTop: 50 }}><Spin size="large" /></div>;

    return (
        <div style={{ padding: 16 }}>
            {/* Banner de bienvenida */}
            <div style={{ marginBottom: 24, textAlign: 'center' }}>
                <h1 style={{ color: '#389e0d' }}>Bienvenidos a Huerto Hogar</h1>
                <p>Todo lo que necesitas para tu jardín en un solo lugar.</p>
            </div>

            {/* Componente que dibuja la grilla de productos */}
            <ProductGrid products={products} />
        </div>
    );
};

export default HomePage;