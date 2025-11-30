import React, { useState } from 'react';
import { Card, Radio, Button, message } from 'antd';
import { useCart } from '../contexts/CartContext';
import { createOrder } from '../api/api';
import type { PaymentMethod } from '../types';
import { useNavigate } from 'react-router-dom';

const CheckoutPage: React.FC = () => {
    const { items, total, createOrderPayload, clear } = useCart();
    const [payment, setPayment] = useState<PaymentMethod>('EFECTIVO');
    const navigate = useNavigate();

    const onConfirm = async () => {
        if (!items.length) return message.error('Carrito vacío');
        try {
            const payload = createOrderPayload(payment, 1); // cashierId hardcoded para demo
            await createOrder(payload);
            message.success('Venta registrada');
            clear();
            navigate('/');
        } catch (e) {
            console.error(e);
            message.error('Error registrando venta (ver consola)');
        }
    };

    return (
        <div style={{ padding: 16 }}>
            <Card title="Checkout">
                <div>Total: {total().toLocaleString('es-CL', { style: 'currency', currency: 'CLP' })}</div>
                <div style={{ marginTop: 12 }}>
                    <Radio.Group value={payment} onChange={(e) => setPayment(e.target.value)}>
                        <Radio value="EFECTIVO">Efectivo</Radio>
                        <Radio value="DEBITO">Débito</Radio>
                        <Radio value="CREDITO">Crédito</Radio>
                    </Radio.Group>
                </div>
                <div style={{ marginTop: 12 }}>
                    <Button type="primary" onClick={onConfirm}>Confirmar pago</Button>
                </div>
            </Card>
        </div>
    );
};

export default CheckoutPage;
