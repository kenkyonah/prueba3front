import React, { useState } from 'react';
import { Card, Radio, Button, message, Divider, Typography, Row, Col, Statistic } from 'antd';
import { useCart } from '../contexts/CartContext';
import { createOrder } from '../api/api';
import type { PaymentMethod } from '../types';
import { useNavigate } from 'react-router-dom';
import { CheckCircleOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const CheckoutPage: React.FC = () => {
    // Traemos las funciones del carrito (items, total, función para crear orden)
    const { items, total, createOrderPayload, clear } = useCart();

    // Estado para guardar qué medio de pago eligió el usuario (por defecto EFECTIVO)
    const [payment, setPayment] = useState<PaymentMethod>('EFECTIVO');

    // Hook para movernos a otra página
    const navigate = useNavigate();

    // Función que se ejecuta al hacer clic en "Confirmar Pago"
    const onConfirm = async () => {
        // 1. Validación: Si no hay cosas en el carro, no dejamos comprar
        if (!items.length) return message.error('Tu carrito está vacío');

        try {
            // 2. Preparamos los datos para enviarlos al Backend
            // (payment es el método elegido, 1 es el ID del cajero temporal)
            const payload = createOrderPayload(payment, 1);

            // 3. Enviamos la orden al servidor (API)
            await createOrder(payload);

            // 4. Si todo sale bien:
            message.success('¡Venta realizada con éxito!');
            clear(); // Limpiamos el carrito
            navigate('/'); // Volvemos al inicio

        } catch (e) {
            // 5. Si algo falla (ej. servidor apagado)
            console.error(e);
            message.error('Hubo un error al procesar la venta.');
        }
    };

    return (
        <div style={{ padding: '20px 0' }}>
            <Title level={2} style={{ textAlign: 'center', color: '#389e0d' }}>Finalizar Compra</Title>

            {/* Grid responsivo: Centrado en pantallas grandes */}
            <Row justify="center">
                <Col xs={24} sm={20} md={12} lg={10}>
                    <Card hoverable style={{ borderTop: '4px solid #389e0d' }}>

                        {/* Resumen de montos */}
                        <div style={{ textAlign: 'center', marginBottom: 20 }}>
                            <Statistic
                                title="Total a Pagar"
                                value={total()}
                                precision={0}
                                prefix="$"
                                valueStyle={{ color: '#389e0d', fontWeight: 'bold' }}
                            />
                            <Text type="secondary">{items.length} productos en el carro</Text>
                        </div>

                        <Divider>Método de Pago</Divider>

                        {/* Selección de pago */}
                        <div style={{ display: 'flex', justifyContent: 'center' }}>
                            <Radio.Group
                                value={payment}
                                onChange={(e) => setPayment(e.target.value)}
                                size="large"
                                buttonStyle="solid"
                            >
                                <Radio.Button value="EFECTIVO">Efectivo</Radio.Button>
                                <Radio.Button value="DEBITO">Débito</Radio.Button>
                                <Radio.Button value="CREDITO">Crédito</Radio.Button>
                            </Radio.Group>
                        </div>

                        <Divider />

                        {/* Botón de acción final */}
                        <Button
                            type="primary"
                            size="large"
                            block
                            icon={<CheckCircleOutlined />}
                            onClick={onConfirm}
                            style={{ height: 50, fontSize: 18 }}
                        >
                            Confirmar y Pagar
                        </Button>
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default CheckoutPage;