import React, { useState } from 'react';
import { Layout, Badge, Drawer, List, Button, Dropdown, Avatar, Space, Typography, Tooltip } from 'antd';
import type { MenuProps } from 'antd';
import { ShoppingCartOutlined, UserOutlined, LogoutOutlined, DashboardOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';
import CartItem from '../molecules/CartItem';
import { Link, useNavigate } from 'react-router-dom';

const { Header } = Layout;
const { Text } = Typography;

const HeaderBar: React.FC = () => {
    // Hooks para acceder a la info del carrito y del usuario
    const { items, total, clear } = useCart();
    const { user, isAuthenticated, logout, isAdmin } = useAuth();

    // Estado para controlar si el cajón del carrito está abierto
    const [cartOpen, setCartOpen] = useState(false);
    const navigate = useNavigate();

    // Opciones del menú desplegable del usuario
    const menuItems: MenuProps['items'] = [
        {
            key: 'logout',
            label: 'Cerrar Sesión',
            icon: <LogoutOutlined />,
            onClick: logout,
            danger: true // Color rojo para indicar acción de salida
        }
    ];

    return (
        <>
            {/* Barra superior fija */}
            <Header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#fff', padding: '0 24px', boxShadow: '0 2px 8px #f0f1f2', position: 'sticky', top: 0, zIndex: 1000 }}>

                {/* Lado Izquierdo: Logo y Botón Admin */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
                    <h3 style={{ margin: 0, fontSize: '1.4rem' }}>
                        <Link to="/" style={{ color: '#389e0d', display: 'flex', alignItems: 'center', gap: 8 }}>
                            🌱 HuertoHogar <small style={{color: '#999', fontSize: '0.8rem'}}>POS System</small>
                        </Link>
                    </h3>

                    {/* Solo mostramos este botón si el usuario es ADMINISTRADOR */}
                    {isAdmin && (
                        <Button
                            type="primary"
                            icon={<DashboardOutlined />}
                            onClick={() => navigate('/admin/dashboard')}
                            style={{ backgroundColor: '#13c2c2' }}
                        >
                            Panel Admin
                        </Button>
                    )}
                </div>

                {/* Lado Derecho: Usuario y Carrito */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                    {isAuthenticated ? (
                        // Menú desplegable con el nombre del usuario
                        <Dropdown menu={{ items: menuItems }} placement="bottomRight" arrow>
                            <Space style={{ cursor: 'pointer' }}>
                                <Avatar icon={<UserOutlined />} style={{ backgroundColor: '#87d068' }} />
                                <Text strong className="desktop-only">
                                    {user?.username} ({user?.role === 'VENDEDOR' ? 'CAJERO' : user?.role})
                                </Text>
                            </Space>
                        </Dropdown>
                    ) : (
                        <Button type="primary" onClick={() => navigate('/login')}>Ingresar Cajero</Button>
                    )}

                    {/* Icono del carrito con contador de productos */}
                    <Badge count={items.length} showZero>
                        <Tooltip title="Ver Venta Actual">
                            <Button type="text" icon={<ShoppingCartOutlined style={{ fontSize: 24 }} />} onClick={() => setCartOpen(true)} />
                        </Tooltip>
                    </Badge>
                </div>
            </Header>

            {/* Panel lateral deslizante (Drawer) para ver la venta en curso */}
            <Drawer title="Venta en Curso" placement="right" onClose={() => setCartOpen(false)} open={cartOpen} width={window.innerWidth > 400 ? 400 : '100%'}>

                {/* Lista de productos escaneados */}
                <List
                    itemLayout="horizontal"
                    dataSource={items}
                    renderItem={item => <CartItem key={item.product.id} item={item} />}
                    locale={{ emptyText: 'No hay productos escaneados' }}
                />

                {/* Pie del carrito: Total y Botones de acción */}
                {items.length > 0 && (
                    <div style={{ marginTop: 24, borderTop: '1px solid #f0f0f0', paddingTop: 16 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                            <Text strong style={{ fontSize: 18 }}>Total a Pagar:</Text>
                            <Text strong style={{ fontSize: 20, color: '#389e0d' }}>
                                {total().toLocaleString('es-CL', { style: 'currency', currency: 'CLP' })}
                            </Text>
                        </div>

                        <Space direction="vertical" style={{ width: '100%' }}>
                            {/* Botón para ir a pagar */}
                            <Button type="primary" block size="large" onClick={() => { setCartOpen(false); navigate('/checkout'); }}>
                                Ir a Caja (Pagar)
                            </Button>

                            {/* Botón ovalado para cancelar todo */}
                            <Button
                                type="primary"
                                danger
                                shape="round"
                                block
                                icon={<CloseCircleOutlined />}
                                onClick={clear} // Limpia el contexto del carrito
                                style={{ marginTop: 8 }}
                            >
                                Cancelar Transacción
                            </Button>
                        </Space>
                    </div>
                )}
            </Drawer>
        </>
    );
};

export default HeaderBar;