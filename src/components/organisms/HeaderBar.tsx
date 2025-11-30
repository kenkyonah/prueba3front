import React, { useState } from 'react';
import { Layout, Badge, Drawer, List, Button, Dropdown, Avatar, Space, Typography } from 'antd';
import type { MenuProps } from 'antd';
import { ShoppingCartOutlined, UserOutlined, LogoutOutlined, DashboardOutlined } from '@ant-design/icons';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';
import CartItem from '../molecules/CartItem';
import { Link, useNavigate } from 'react-router-dom';

const { Header } = Layout;
const { Text } = Typography;

const HeaderBar: React.FC = () => {
    const { items, total, clear } = useCart();
    const { user, isAuthenticated, logout, isAdmin } = useAuth();
    const [cartOpen, setCartOpen] = useState(false);
    const navigate = useNavigate();

    // Construcción del menú segura para TypeScript
    const menuItems: MenuProps['items'] = [];

    if (isAdmin) {
        menuItems.push({
            key: 'admin',
            label: <Link to="/admin/products">Administración</Link>,
            icon: <DashboardOutlined />
        });
    }

    menuItems.push({
        key: 'logout',
        label: 'Cerrar Sesión',
        icon: <LogoutOutlined />,
        onClick: logout
    });

    return (
        <>
            <Header style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                background: '#fff',
                padding: '0 24px',
                position: 'sticky',
                top: 0,
                zIndex: 1000,
                boxShadow: '0 2px 8px #f0f1f2'
            }}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <h3 style={{ margin: 0, fontSize: '1.2rem' }}>
                        <Link to="/" style={{ color: '#1677ff' }}>VentasApp</Link>
                    </h3>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                    {isAuthenticated ? (
                        // CORRECCIÓN: Usamos 'menu' en lugar de 'overlay'
                        <Dropdown menu={{ items: menuItems }} placement="bottomRight">
                            <Space style={{ cursor: 'pointer' }}>
                                <Avatar icon={<UserOutlined />} style={{ backgroundColor: '#1677ff' }} />
                                <Text strong className="desktop-only">{user?.username}</Text>
                            </Space>
                        </Dropdown>
                    ) : (
                        <Button type="default" onClick={() => navigate('/login')}>
                            Iniciar Sesión
                        </Button>
                    )}

                    <Badge count={items.length} showZero>
                        <Button
                            type="text"
                            icon={<ShoppingCartOutlined style={{ fontSize: 20 }} />}
                            onClick={() => setCartOpen(true)}
                        />
                    </Badge>
                </div>
            </Header>

            <Drawer title="Mi Carrito" placement="right" onClose={() => setCartOpen(false)} open={cartOpen} width={window.innerWidth > 400 ? 400 : '85%'}>
                <List
                    itemLayout="horizontal"
                    dataSource={items}
                    renderItem={item => <CartItem key={item.product.id} item={item} />}
                    locale={{ emptyText: 'Tu carrito está vacío' }}
                />

                {items.length > 0 && (
                    <div style={{ marginTop: 24, borderTop: '1px solid #f0f0f0', paddingTop: 16 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                            <Text strong style={{ fontSize: 16 }}>Total:</Text>
                            <Text strong style={{ fontSize: 16, color: '#1677ff' }}>
                                {total().toLocaleString('es-CL', { style: 'currency', currency: 'CLP' })}
                            </Text>
                        </div>
                        <Space direction="vertical" style={{ width: '100%' }}>
                            <Button type="primary" block size="large" onClick={() => { setCartOpen(false); navigate('/checkout'); }}>
                                Ir a Pagar
                            </Button>
                            <Button danger block onClick={clear}>
                                Vaciar Carrito
                            </Button>
                        </Space>
                    </div>
                )}
            </Drawer>

            <style>{`
                @media (max-width: 576px) {
                    .desktop-only { display: none; }
                }
            `}</style>
        </>
    );
};

export default HeaderBar;