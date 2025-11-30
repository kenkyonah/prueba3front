import React, { useState } from 'react';
import { Card, Form, Input, Button, message, Typography } from 'antd';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/api';

const { Title, Text } = Typography;

// Definimos qué datos esperamos del formulario
interface LoginFieldValues {
    username: string;
    password: string;
}

const LoginPage: React.FC = () => {
    const { login } = useAuth(); // Sacamos la función login del contexto
    const navigate = useNavigate(); // Para cambiar de página
    const [loading, setLoading] = useState(false); // Para mostrar el circulito de carga

    // Esta función se ejecuta al enviar el formulario
    const onFinish = async (values: LoginFieldValues) => {
        setLoading(true); // Activamos carga
        try {
            // Llamamos al backend para verificar credenciales
            const response = await api.post('/auth/login', {
                username: values.username,
                password: values.password
            });

            // Si el backend responde bien, sacamos token y usuario
            const { token, user } = response.data;

            if (token && user) {
                // Guardamos la sesión en el contexto
                login(token, user);
                message.success(`¡Hola de nuevo, ${user.username}!`);
                navigate('/'); // Nos vamos al inicio
            } else {
                message.error('Error: El servidor no envió el token.');
            }

        } catch (error) {
            console.error(error);
            message.error('Usuario o contraseña incorrectos.');
        } finally {
            setLoading(false); // Desactivamos carga pase lo que pase
        }
    };

    return (
        // Contenedor centrado
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh', padding: 20 }}>
            <Card style={{ width: '100%', maxWidth: 400 }} title="Bienvenido a Huerto Hogar">
                <div style={{ textAlign: 'center', marginBottom: 20 }}>
                    <Title level={3}>Iniciar Sesión</Title>
                </div>

                <Form
                    name="login"
                    initialValues={{ remember: true }}
                    onFinish={onFinish}
                    autoComplete="off"
                    layout="vertical"
                >
                    <Form.Item
                        label="Usuario"
                        name="username"
                        rules={[{ required: true, message: '¡Ingresa tu usuario!' }]}
                    >
                        <Input placeholder="Ej: admin" />
                    </Form.Item>

                    <Form.Item
                        label="Contraseña"
                        name="password"
                        rules={[{ required: true, message: '¡Ingresa tu clave!' }]}
                    >
                        <Input.Password placeholder="******" />
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" loading={loading} block size="large">
                            Ingresar
                        </Button>
                    </Form.Item>

                    <div style={{ textAlign: 'center' }}>
                        <Text>¿No tienes cuenta? </Text>
                        <Link to="/register">Regístrate aquí</Link>
                    </div>
                </Form>
            </Card>
        </div>
    );
};

export default LoginPage;