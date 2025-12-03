import React, { useState } from 'react';
import {
    Card, Radio, Button, message, Divider, Typography, Row, Col, Statistic, InputNumber, Modal, Table,
    type DividerProps
} from 'antd';
import type { RadioChangeEvent } from 'antd';
import { useCart } from '../contexts/CartContext';
import { createOrder } from '../api/api';
import type { PaymentMethod, ReceiptData } from '../types';
import { useNavigate } from 'react-router-dom';
import { PrinterOutlined, CheckCircleOutlined, DollarOutlined } from '@ant-design/icons';

const {Text } = Typography;

const CheckoutPage: React.FC = () => {
    // Hooks del carrito para obtener total y productos
    const { items, total, createOrderPayload, clear } = useCart();

    // Estados locales
    const [payment, setPayment] = useState<PaymentMethod>('EFECTIVO');
    const [cashAmount, setCashAmount] = useState<number>(0);

    const [isReceiptOpen, setIsReceiptOpen] = useState(false);
    const [lastOrderData, setLastOrderData] = useState<ReceiptData | null>(null);

    const navigate = useNavigate();
    const totalAmount = total();

    // Cálculo del vuelto (Ley de redondeo)
    // Se calcula en cada renderizado, no necesita useEffect
    let calculatedChange = 0;
    if (payment === 'EFECTIVO') {
        const diff = cashAmount - totalAmount;
        // Redondeo hacia abajo a la decena más cercana (ej: 49 -> 40)
        const roundedChange = Math.floor(diff / 10) * 10;
        calculatedChange = roundedChange > 0 ? roundedChange : 0;
    }

    // Manejador del cambio de radio button (Tipo seguro)
    const handlePaymentChange = (e: RadioChangeEvent) => {
        setPayment(e.target.value);
    };

    const handleConfirmPayment = async () => {
        // Validaciones
        if (!items.length) return message.error('No hay productos para vender');

        if (payment === 'EFECTIVO' && cashAmount < totalAmount) {
            return message.error('El monto en efectivo es insuficiente');
        }

        try {
            // 1. Preparar payload para el backend
            const payload = createOrderPayload(payment, 1);

            // 2. Enviar la venta
            await createOrder(payload);

            // 3. Preparar datos para la boleta visual
            const receipt: ReceiptData = {
                items: [...items],
                total: totalAmount,
                iva: Math.round(totalAmount * 0.19), // 19% IVA
                neto: Math.round(totalAmount / 1.19), // Neto
                paymentMethod: payment,
                cashGiven: cashAmount,
                change: calculatedChange, // Usamos la variable calculada
                date: new Date().toLocaleString()
            };

            setLastOrderData(receipt);
            setIsReceiptOpen(true);
            clear(); // Vaciar carrito

        } catch (e) {
            console.error(e);
            message.error('Error al registrar la venta en el sistema');
        }
    };

    const handlePrint = () => {
        message.loading('Imprimiendo boleta...', 1.5).then(() => {
            message.success('Boleta impresa correctamente');
            setIsReceiptOpen(false);
            navigate('/');
        });
    };

    return (
        <div style={{ padding: '20px' }}>
            <Row justify="center">
                <Col xs={24} md={12} lg={10}>
                    <Card title="Caja - Finalizar Venta" style={{ borderTop: '4px solid #389e0d' }}>

                        <div style={{ textAlign: 'center', marginBottom: 20 }}>
                            <Statistic title="Total a Pagar" value={totalAmount} prefix="$" valueStyle={{ color: '#389e0d', fontWeight: 'bold', fontSize: '2.5rem' }} />
                        </div>


                        <Divider orientation={'left' as DividerProps['orientation']}>Método de Pago</Divider>

                        <Radio.Group value={payment} onChange={handlePaymentChange} buttonStyle="solid" style={{ width: '100%', textAlign: 'center' }}>
                            <Radio.Button value="EFECTIVO" style={{ width: '30%' }}>Efectivo</Radio.Button>
                            <Radio.Button value="DEBITO" style={{ width: '30%' }}>Débito</Radio.Button>
                            <Radio.Button value="CREDITO" style={{ width: '30%' }}>Crédito</Radio.Button>
                        </Radio.Group>

                        {payment === 'EFECTIVO' && (
                            <div style={{ background: '#f6ffed', padding: 15, marginTop: 20, borderRadius: 8, border: '1px solid #b7eb8f' }}>
                                <Text strong>Monto Entregado:</Text>
                                <InputNumber
                                    style={{ width: '100%', marginTop: 5, marginBottom: 10 }}
                                    size="large"
                                    prefix={<DollarOutlined />}
                                    formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, '.')}
                                    parser={(value) => value?.replace(/\$\s?|(\.*)/g, '') as unknown as number}
                                    onChange={(val) => setCashAmount(Number(val))}
                                />
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <Text style={{ fontSize: 16 }}>Vuelto sugerido:</Text>
                                    <Text strong style={{ fontSize: 18, color: calculatedChange >= 0 ? '#389e0d' : 'red' }}>
                                        $ {calculatedChange.toLocaleString('es-CL')}
                                    </Text>
                                </div>
                                <Text type="secondary" style={{ fontSize: 12 }}>* Redondeo a favor del cliente</Text>
                            </div>
                        )}

                        <Divider />
                        <Button type="primary" size="large" block icon={<CheckCircleOutlined />} onClick={handleConfirmPayment} style={{ height: 50 }}>
                            CONFIRMAR VENTA E IMPRIMIR BOLETA
                        </Button>
                    </Card>
                </Col>
            </Row>

            <Modal
                title="Boleta Electrónica - Huerto Hogar"
                open={isReceiptOpen}
                footer={[
                    <Button key="print" type="primary" icon={<PrinterOutlined />} onClick={handlePrint}>Imprimir y Cerrar</Button>
                ]}
                closable={false}
                centered
            >
                {lastOrderData && (
                    <div style={{ fontFamily: 'monospace', padding: 10, border: '1px dashed #ccc' }}>
                        <div style={{ textAlign: 'center', marginBottom: 15 }}>
                            <h3 style={{ margin: 0 }}>HUERTO HOGAR S.A.</h3>
                            <p style={{ margin: 0 }}>RUT: 77.777.777-7</p>
                            <p style={{ margin: 0 }}>Av. Siempre Viva 123, Santiago</p>
                            <p style={{ margin: 0 }}>Fecha: {lastOrderData.date}</p>
                        </div>

                        <Table
                            dataSource={lastOrderData.items}
                            rowKey={(r) => r.product.id}
                            pagination={false}
                            size="small"
                            columns={[
                                { title: 'Cant', dataIndex: 'quantity', width: 50 },
                                { title: 'Desc', dataIndex: ['product', 'name'] },
                                { title: 'Total', render: (_, r) => (r.product.price * r.quantity).toLocaleString('es-CL'), align: 'right' }
                            ]}
                            summary={() => (
                                <>
                                    <Table.Summary.Row>
                                        <Table.Summary.Cell index={0} colSpan={2}><Text strong>Neto:</Text></Table.Summary.Cell>
                                        <Table.Summary.Cell index={1} align="right">${lastOrderData.neto.toLocaleString('es-CL')}</Table.Summary.Cell>
                                    </Table.Summary.Row>
                                    <Table.Summary.Row>
                                        <Table.Summary.Cell index={0} colSpan={2}><Text strong>IVA (19%):</Text></Table.Summary.Cell>
                                        <Table.Summary.Cell index={1} align="right">${lastOrderData.iva.toLocaleString('es-CL')}</Table.Summary.Cell>
                                    </Table.Summary.Row>
                                    <Table.Summary.Row>
                                        <Table.Summary.Cell index={0} colSpan={2}><Text strong style={{fontSize:16}}>TOTAL:</Text></Table.Summary.Cell>
                                        <Table.Summary.Cell index={1} align="right"><Text strong style={{fontSize:16}}>${lastOrderData.total.toLocaleString('es-CL')}</Text></Table.Summary.Cell>
                                    </Table.Summary.Row>
                                </>
                            )}
                        />

                        <Divider style={{ margin: '10px 0' }} />
                        <div style={{ textAlign: 'right' }}>
                            <p style={{ margin: 0 }}>Pago: {lastOrderData.paymentMethod}</p>
                            {lastOrderData.paymentMethod === 'EFECTIVO' && (
                                <>
                                    <p style={{ margin: 0 }}>Efectivo: ${lastOrderData.cashGiven.toLocaleString('es-CL')}</p>
                                    <p style={{ margin: 0 }}>Vuelto: ${lastOrderData.change.toLocaleString('es-CL')}</p>
                                </>
                            )}
                        </div>
                        <div style={{ textAlign: 'center', marginTop: 15 }}>
                            <p>*** GRACIAS POR SU COMPRA ***</p>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default CheckoutPage;