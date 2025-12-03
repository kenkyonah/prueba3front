import React, { useState } from 'react';
import { Layout, Menu, Breadcrumb } from 'antd';
import { BarChartOutlined, AppstoreOutlined } from '@ant-design/icons';
import AdminProductsPage from './AdminProductsPage';
import SalesReportsPage from './SalesReportsPage';

const { Content, Sider } = Layout;

const AdminDashboardPage: React.FC = () => {
    // Estado para saber qué pestaña está seleccionada
    const [selectedKey, setSelectedKey] = useState('1');

    // Función para renderizar el componente según la selección
    const renderContent = () => {
        switch (selectedKey) {
            case '1': return <AdminProductsPage />; // CRUD Productos
            case '2': return <SalesReportsPage />;  // Reportes
            default: return <AdminProductsPage />;
        }
    };

    return (
        <Layout style={{ minHeight: '80vh', background: '#fff' }}>
            {/* Barra lateral */}
            <Sider width={200} style={{ background: '#fff' }} breakpoint="lg" collapsedWidth="0">
                <Menu
                    mode="inline"
                    defaultSelectedKeys={['1']}
                    style={{ height: '100%', borderRight: 0 }}
                    onClick={(e) => setSelectedKey(e.key)}
                    items={[
                        { key: '1', icon: <AppstoreOutlined />, label: 'Productos' },
                        { key: '2', icon: <BarChartOutlined />, label: 'Reportes Ventas' },
                    ]}
                />
            </Sider>

            {/* Contenido principal */}
            <Layout style={{ padding: '0 24px 24px' }}>
                <Breadcrumb style={{ margin: '16px 0' }}>
                    <Breadcrumb.Item>Admin</Breadcrumb.Item>
                    <Breadcrumb.Item>{selectedKey === '1' ? 'Gestión Productos' : 'Reportes'}</Breadcrumb.Item>
                </Breadcrumb>
                <Content
                    style={{
                        padding: 24,
                        margin: 0,
                        minHeight: 280,
                        background: '#fff',
                    }}
                >
                    {renderContent()}
                </Content>
            </Layout>
        </Layout>
    );
};

export default AdminDashboardPage;