import React, { useState } from 'react';
import { Card, Form, Input, Button, message, Typography } from 'antd';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../api/api';

const { Title } = Typography;

// Interfaz para los valores del formulario
interface LoginFieldValues {
    username: string;
    password: string;
}

const LoginPage: React.FC = () => {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const onFinish = async (values: LoginFieldValues) => {
        setLoading(true);
        try {
            const response = await api.post('/auth/login', {
                username: values.username,
                password: values.password
            });

            const { token, user } = response.data;

            if (token && user) {
                login(token, user);
                message.success(`Bienvenido/a ${user.username}!`);
                navigate('/');
            } else {
                message.error('Respuesta de autenticación incompleta.');
            }

        } catch (error) {
            console.error(error);
            message.error('Credenciales inválidas o error de conexión.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
            <Card style={{ width: 400 }}>
                <Title level={3} style={{ textAlign: 'center' }}>Iniciar Sesión</Title>
                <Form
                    name="login"
                    initialValues={{ remember: true }}
                    onFinish={onFinish}
                    autoComplete="off"
                >
                    <Form.Item
                        name="username"
                        rules={[{ required: true, message: 'Por favor ingresa tu nombre de usuario!' }]}
                    >
                        <Input placeholder="Usuario" />
                    </Form.Item>

                    <Form.Item
                        name="password"
                        rules={[{ required: true, message: 'Por favor ingresa tu contraseña!' }]}
                    >
                        <Input.Password placeholder="Contraseña" />
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" loading={loading} style={{ width: '100%' }}>
                            Ingresar
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
        </div>
    );
};

export default LoginPage;