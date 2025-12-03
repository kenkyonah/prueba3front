import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Statistic, Table, Typography, Spin, Button, message } from 'antd';
import { DollarOutlined, CreditCardOutlined, BankOutlined, ReloadOutlined } from '@ant-design/icons';
import api from '../api/api';
// IMPORTANTE: Importamos los tipos correctos
import type { Order, Product } from '../types';

interface ProductStats {
    id: number;
    name: string;
    soldQuantity: number;
    totalAmount: number;
}

const SalesReportsPage: React.FC = () => {
    const [loading, setLoading] = useState(true);
    // Estado para guardar la fecha de la última actualización
    const [lastUpdate, setLastUpdate] = useState<string>('');

    const [stats, setStats] = useState({
        totalSales: 0,
        efectivo: 0,
        debito: 0,
        credito: 0,
        totalOrders: 0,
        productBreakdown: [] as ProductStats[]
    });

    // Función independiente para cargar datos (así la podemos llamar con el botón)
    const fetchData = async () => {
        setLoading(true);
        try {
            // Tipamos explícitamente las respuestas de la API
            const productsRes = await api.get<Product[]>('/products');
            const allProducts = productsRes.data;

            const ordersRes = await api.get<Order[]>('/orders');
            const allOrders = ordersRes.data;

            let total = 0;
            let ef = 0, deb = 0, cred = 0;
            const productMap = new Map<number, number>();

            allProducts.forEach((p) => productMap.set(p.id, 0));

            // Lógica de suma
            allOrders.forEach((order: Order) => {
                total += order.total;
                if (order.paymentMethod === 'EFECTIVO') ef += order.total;
                if (order.paymentMethod === 'DEBITO') deb += order.total;
                if (order.paymentMethod === 'CREDITO') cred += order.total;

                order.items.forEach((item) => {
                    if (item.product) {
                        const currentQty = productMap.get(item.product.id) || 0;
                        productMap.set(item.product.id, currentQty + item.quantity);
                    }
                });
            });

            const breakdown = allProducts.map((p) => ({
                id: p.id,
                name: p.name,
                soldQuantity: productMap.get(p.id) || 0,
                totalAmount: (productMap.get(p.id) || 0) * p.price
            }));

            setStats({
                totalSales: total,
                efectivo: ef,
                debito: deb,
                credito: cred,
                totalOrders: allOrders.length,
                productBreakdown: breakdown
            });

            // Actualizamos la hora de consulta
            setLastUpdate(new Date().toLocaleTimeString());
            message.success('Reporte actualizado correctamente');

        } catch (error) {
            console.error("Error calculando reportes:", error);
            message.error('No se pudieron cargar los datos');
        } finally {
            setLoading(false);
        }
    };

    // Cargar al inicio
    useEffect(() => {
        fetchData();
    }, []);

    return (
        <div>
            {/* Cabecera con Botón de Recarga */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <Typography.Title level={3} style={{ margin: 0 }}>Resumen de Ventas Global</Typography.Title>
                <div style={{ textAlign: 'right' }}>
                    <span style={{ marginRight: 10, color: '#888', fontSize: '0.9rem' }}>
                        Última act: {lastUpdate}
                    </span>
                    <Button
                        type="primary"
                        icon={<ReloadOutlined />}
                        onClick={fetchData}
                        loading={loading}
                    >
                        Actualizar Datos
                    </Button>
                </div>
            </div>

            {/* Si está cargando mostramos el Spin, si no, los datos */}
            {loading && !stats.totalOrders ? (
                <div style={{ textAlign: 'center', padding: 50 }}><Spin size="large" /></div>
            ) : (
                <>
                    <Row gutter={[16, 16]}>
                        <Col xs={24} sm={12} lg={6}>
                            <Card><Statistic title="Ventas Totales ($)" value={stats.totalSales} prefix="$" groupSeparator="." /></Card>
                        </Col>
                        <Col xs={24} sm={12} lg={6}>
                            <Card><Statistic title="Cant. Transacciones" value={stats.totalOrders} /></Card>
                        </Col>
                    </Row>

                    <Typography.Title level={4} style={{marginTop: 20}}>Desglose por Medio de Pago</Typography.Title>
                    <Row gutter={[16, 16]}>
                        <Col xs={24} sm={8}>
                            <Card><Statistic title="Efectivo" value={stats.efectivo} prefix={<DollarOutlined />} valueStyle={{ color: '#3f8600' }} groupSeparator="." /></Card>
                        </Col>
                        <Col xs={24} sm={8}>
                            <Card><Statistic title="Débito" value={stats.debito} prefix={<BankOutlined />} valueStyle={{ color: '#1677ff' }} groupSeparator="." /></Card>
                        </Col>
                        <Col xs={24} sm={8}>
                            <Card><Statistic title="Crédito" value={stats.credito} prefix={<CreditCardOutlined />} valueStyle={{ color: '#cf1322' }} groupSeparator="." /></Card>
                        </Col>
                    </Row>

                    <Typography.Title level={4} style={{marginTop: 20}}>Detalle por Producto</Typography.Title>
                    <Table
                        dataSource={stats.productBreakdown}
                        rowKey="id"
                        pagination={{ pageSize: 5 }}
                        columns={[
                            { title: 'Producto', dataIndex: 'name' },
                            {
                                title: 'Unidades Vendidas',
                                dataIndex: 'soldQuantity',
                                sorter: (a, b) => a.soldQuantity - b.soldQuantity,
                                render: (val) => val === 0 ? <span style={{color:'red'}}>0 (Sin ventas)</span> : val
                            },
                            { title: 'Monto Recaudado', dataIndex: 'totalAmount', render: val => `$ ${val.toLocaleString('es-CL')}` }
                        ]}
                    />
                </>
            )}
        </div>
    );
};

export default SalesReportsPage;