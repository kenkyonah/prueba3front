import React from 'react';
import { Layout } from 'antd';
import HeaderBar from '../organisms/HeaderBar';

const { Content, Footer } = Layout;

// Este componente envuelve a todas las páginas para que tengan el mismo Header y Footer
const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <Layout style={{ minHeight: '100vh' }}> {/* Ocupa al menos el 100% del alto de pantalla */}

            {/* La barra de navegación superior */}
            <HeaderBar />

            {/* Aquí va el contenido cambiante (Home, Checkout, Login, etc.) */}
            <Content style={{ padding: '24px', maxWidth: 1200, margin: '0 auto', width: '100%' }}>
                {children}
            </Content>

            {/* Pie de página simple */}
            <Footer style={{ textAlign: 'center', background: '#f6ffed' }}>
                Huerto Hogar ©2024 - Sistema de Ventas Fullstack II
            </Footer>
        </Layout>
    );
};

export default MainLayout;