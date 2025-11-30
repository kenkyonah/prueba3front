import React from 'react';
import { Card, Descriptions, Button, Avatar, Tag } from 'antd';
import { UserOutlined, LogoutOutlined } from '@ant-design/icons';
import { useAuth } from '../contexts/AuthContext';

const ProfilePage: React.FC = () => {
    const { user, logout } = useAuth();

    if (!user) return <div>Cargando...</div>;

    return (
        <div style={{ padding: 24, maxWidth: 800, margin: '0 auto' }}>
            <Card title="Mi Perfil de Usuario">
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: 24, flexDirection: 'column' }}>
                    <Avatar size={100} icon={<UserOutlined />} style={{ backgroundColor: '#87d068', marginBottom: 16 }} />
                    <h2>{user.name || user.username}</h2>
                    <Tag color="blue">{user.role}</Tag>
                </div>

                {/* Lista de detalles responsiva */}
                <Descriptions bordered column={{ xxl: 1, xl: 1, lg: 1, md: 1, sm: 1, xs: 1 }}>
                    <Descriptions.Item label="ID de Usuario">{user.id}</Descriptions.Item>
                    <Descriptions.Item label="Nombre de Usuario">{user.username}</Descriptions.Item>
                    <Descriptions.Item label="Rol en el Sistema">
                        {user.role === 'ADMIN' ? 'Administrador del Sistema' :
                            user.role === 'VENDEDOR' ? 'Vendedor de Tienda' : 'Cliente Registrado'}
                    </Descriptions.Item>
                    {user.email && <Descriptions.Item label="Correo">{user.email}</Descriptions.Item>}
                </Descriptions>

                <div style={{ marginTop: 24, textAlign: 'center' }}>
                    <Button danger icon={<LogoutOutlined />} onClick={logout} size="large">
                        Cerrar Sesión
                    </Button>
                </div>
            </Card>
        </div>
    );
};

export default ProfilePage;