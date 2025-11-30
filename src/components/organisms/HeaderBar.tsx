// src/components/organisms/HeaderBar.tsx
import React, { useState } from 'react';
import { Layout, Badge, Drawer, List, Button, Dropdown, Avatar, Space, Typography } from 'antd';
import type { MenuProps } from 'antd';
import { ShoppingCartOutlined, UserOutlined, LogoutOutlined, DashboardOutlined, ProfileOutlined } from '@ant-design/icons';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';
import CartItem from '../molecules/CartItem';
import { Link, useNavigate } from 'react-router-dom';

const { Header } = Layout;
const { Text } = Typography;

const HeaderBar: React.FC = () => {
    // Hooks para sacar datos del carrito y del usuario
    const { items, total, clear } = useCart();
    const { user, isAuthenticated, logout, isAdmin } = useAuth();

    // Estado local para saber si el carrito está abierto o cerrado
    const [cartOpen, setCartOpen] = useState(false);
    const navigate = useNavigate();

    // --- Construcción del menú desplegable del usuario ---
    const menuItems: MenuProps['items'] = [
        {
            key: 'profile',
            label: <Link to="/profile">Mi Perfil</Link>, // Enlace nuevo
            icon: <ProfileOutlined />
        }
    ];

    // Si es ADMIN, agregamos el botón de Administración
    if (isAdmin) {
        menuItems.unshift({ // Ponemos al principio
            key: 'admin',
            label: <Link to="/admin/products">Administración</Link>,
            icon: <DashboardOutlined />
        });
    }

    // Al final siempre el botón de salir
    menuItems.push({
        type: 'divider' // Línea separadora
    }, {
        key: 'logout',
        label: 'Cerrar Sesión',
        icon: <LogoutOutlined />,
        onClick: logout,
        danger: true // Lo pone en rojo
    });

    return (
        <>
            <Header style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                background: '#fff',
                padding: '0 24px',
                position: 'sticky', // Se queda fijo arriba
                top: 0,
                zIndex: 1000,
                boxShadow: '0 2px 8px #f0f1f2'
            }}>
                {/* Logo de la Tienda */}
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <h3 style={{ margin: 0, fontSize: '1.2rem' }}>
                        <Link to="/" style={{ color: '#52c41a', display: 'flex', alignItems: 'center', gap: 8 }}>
                            {/* Icono de hoja simple para Huerto Hogar */}
                            🌱 HuertoHogar
                        </Link>
                    </h3>
                </div>

                {/* Botones de la derecha */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>

                    {/* Lógica: Si está logueado mostramos su avatar, si no, botón de entrar */}
                    {isAuthenticated ? (
                        <Dropdown menu={{ items: menuItems }} placement="bottomRight" arrow>
                            <Space style={{ cursor: 'pointer' }}>
                                <Avatar icon={<UserOutlined />} style={{ backgroundColor: '#87d068' }} />
                                {/* Ocultamos el nombre en celulares muy chicos */}
                                <Text strong className="desktop-only">{user?.username}</Text>
                            </Space>
                        </Dropdown>
                    ) : (
                        <Space>
                            <Button type="default" onClick={() => navigate('/login')}>Ingresar</Button>
                            {/* Ocultamos botón registro en móvil para ahorrar espacio */}
                            <Button type="primary" className="desktop-only" onClick={() => navigate('/register')}>Crear Cuenta</Button>
                        </Space>
                    )}

                    {/* Botón del Carrito */}
                    <Badge count={items.length} showZero>
                        <Button
                            type="text"
                            icon={<ShoppingCartOutlined style={{ fontSize: 20 }} />}
                            onClick={() => setCartOpen(true)}
                        />
                    </Badge>
                </div>
            </Header>

            {/* Panel lateral del Carrito (Drawer) */}
            <Drawer
                title="Mi Carrito"
                placement="right"
                onClose={() => setCartOpen(false)}
                open={cartOpen}
                // Ancho dinámico: Pantalla completa en móvil, 400px en PC
                width={window.innerWidth > 400 ? 400 : '100%'}
            >
                <List
                    itemLayout="horizontal"
                    dataSource={items}
                    renderItem={item => <CartItem key={item.product.id} item={item} />}
                    locale={{ emptyText: 'Tu carrito de compras está vacío' }}
                />

                {/* Footer del carrito: Solo se muestra si hay items */}
                {items.length > 0 && (
                    <div style={{ marginTop: 24, borderTop: '1px solid #f0f0f0', paddingTop: 16 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                            <Text strong style={{ fontSize: 16 }}>Total a Pagar:</Text>
                            <Text strong style={{ fontSize: 18, color: '#52c41a' }}>
                                {total().toLocaleString('es-CL', { style: 'currency', currency: 'CLP' })}
                            </Text>
                        </div>
                        <Space direction="vertical" style={{ width: '100%' }}>
                            <Button type="primary" block size="large" onClick={() => { setCartOpen(false); navigate('/checkout'); }}>
                                Finalizar Compra
                            </Button>
                            <Button danger block onClick={clear}>
                                Vaciar Todo
                            </Button>
                        </Space>
                    </div>
                )}
            </Drawer>

            {/* CSS inline para ocultar cosas en móvil */}
            <style>{`
                @media (max-width: 576px) {
                    .desktop-only { display: none !important; }
                }
            `}</style>
        </>
    );
};

export default HeaderBar;