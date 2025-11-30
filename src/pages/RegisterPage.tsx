// src/pages/RegisterPage.tsx
import React, { useState } from 'react';
import { Card, Form, Input, Button, message, Typography } from 'antd';
import { useNavigate, Link } from 'react-router-dom';
import { registerUser } from '../api/api';
import type {CreateOrderPayload} from "../types";

const { Title } = Typography;

const RegisterPage: React.FC = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const onFinish = async (values: CreateOrderPayload) => {
        setLoading(true);
        try {
            // Enviamos los datos al backend para crear usuario
            // Nota: El backend debe asignar el rol 'CLIENTE' por defecto
            await registerUser(values);
            message.success('¡Cuenta creada! Ahora puedes iniciar sesión.');
            navigate('/login'); // Mandamos al usuario al login
        } catch (error) {
            console.error(error);
            message.error('Error al registrarse. Intenta con otro usuario.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh', padding: 20 }}>
            <Card style={{ width: '100%', maxWidth: 450 }}>
                <div style={{ textAlign: 'center', marginBottom: 20 }}>
                    <Title level={3}>Crear Cuenta</Title>
                </div>

                <Form layout="vertical" onFinish={onFinish}>
                    <Form.Item name="username" label="Usuario" rules={[{ required: true, min: 4 }]}>
                        <Input placeholder="Elige un nombre de usuario" />
                    </Form.Item>

                    <Form.Item name="name" label="Nombre Completo" rules={[{ required: true }]}>
                        <Input placeholder="Tu nombre real" />
                    </Form.Item>

                    <Form.Item name="email" label="Correo Electrónico" rules={[{ type: 'email', required: true }]}>
                        <Input placeholder="correo@ejemplo.com" />
                    </Form.Item>

                    <Form.Item name="password" label="Contraseña" rules={[{ required: true, min: 6 }]}>
                        <Input.Password placeholder="Mínimo 6 caracteres" />
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" loading={loading} block size="large">
                            Registrarse
                        </Button>
                    </Form.Item>

                    <div style={{ textAlign: 'center' }}>
                        <Link to="/login">¿Ya tienes cuenta? Inicia sesión</Link>
                    </div>
                </Form>
            </Card>
        </div>
    );
};

export default RegisterPage;