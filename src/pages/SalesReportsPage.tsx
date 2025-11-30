import React from 'react';
import { Card, Row, Col, Statistic, Table, Typography } from 'antd';
import { DollarOutlined, CreditCardOutlined, BankOutlined } from '@ant-design/icons';

// Tipos para el reporte
interface SalesReport {
    totalSales: number;
    byPaymentMethod: {
        EFECTIVO: number;
        DEBITO: number;
        CREDITO: number;
    };
    topProducts: { name: string; quantity: number; total: number }[];
}

const SalesReportsPage: React.FC = () => {
    // Mock de datos (Esto vendría de api.get('/reports/sales'))
    const data: SalesReport = {
        totalSales: 1500000,
        byPaymentMethod: {
            EFECTIVO: 300000,
            DEBITO: 700000,
            CREDITO: 500000
        },
        topProducts: [
            { name: 'Control PS5', quantity: 10, total: 890000 },
            { name: 'Cargador USB-C', quantity: 15, total: 194850 }
        ]
    };

    return (
        <div style={{ padding: 24 }}>
            <Typography.Title level={2}>Informe de Ventas</Typography.Title>

            {/* Tarjetas de Resumen - Responsive Grid */}
            <Row gutter={[16, 16]}>
                <Col xs={24} sm={12} lg={6}>
                    <Card bordered={false} style={{ background: '#e6f7ff' }}>
                        <Statistic title="Ventas Totales" value={data.totalSales} prefix="$" groupSeparator="." />
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card>
                        <Statistic
                            title="Efectivo"
                            value={data.byPaymentMethod.EFECTIVO}
                            prefix={<DollarOutlined />}
                            valueStyle={{ color: '#3f8600' }}
                            groupSeparator="."
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card>
                        <Statistic
                            title="Débito"
                            value={data.byPaymentMethod.DEBITO}
                            prefix={<BankOutlined />}
                            valueStyle={{ color: '#1677ff' }}
                            groupSeparator="."
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card>
                        <Statistic
                            title="Crédito"
                            value={data.byPaymentMethod.CREDITO}
                            prefix={<CreditCardOutlined />}
                            valueStyle={{ color: '#cf1322' }}
                            groupSeparator="."
                        />
                    </Card>
                </Col>
            </Row>

            <div style={{ marginTop: 24 }}>
                <Card title="Detalle por Producto">
                    <Table
                        dataSource={data.topProducts}
                        rowKey="name"
                        columns={[
                            { title: 'Producto', dataIndex: 'name' },
                            { title: 'Cantidad', dataIndex: 'quantity' },
                            { title: 'Monto Total', dataIndex: 'total', render: val => `$ ${val.toLocaleString('es-CL')}` }
                        ]}
                        pagination={false}
                        scroll={{ x: 400 }}
                    />
                </Card>
            </div>
        </div>
    );
};

export default SalesReportsPage;