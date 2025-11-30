import React from 'react';
import { Layout } from 'antd';
import HeaderBar from '../organisms/HeaderBar';

const { Content, Footer } = Layout;

const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <Layout style={{ minHeight: '100vh' }}>
            <HeaderBar />
            <Content style={{ padding: '24px' }}>
                {children}
            </Content>
            <Footer style={{ textAlign: 'center' }}>VentasApp - Fullstack II</Footer>
        </Layout>
    );
};

export default MainLayout;
