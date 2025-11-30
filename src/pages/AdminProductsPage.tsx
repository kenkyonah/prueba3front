import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Input, InputNumber, Select, message, Space, Card } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { getProducts } from '../api/api';
import type { Product, Category } from '../types';

interface ProductFormValues {
    name: string;
    price: number;
    categoryId: number;
    imageUrl?: string;
    description?: string;
}

const AdminProductsPage: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [form] = Form.useForm();

    const categories: Category[] = [
        { id: 1, name: 'Electrónica' },
        { id: 2, name: 'Accesorios' },
        { id: 3, name: 'Juegos' }
    ];

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const { data } = await getProducts();
            setProducts(data);
        } catch (error) {
            console.error(error);
            setProducts([
                { id:1, name:'PS5 Controller', price:59000, categoryId:2, description:'Dualsense' },
                { id:2, name:'Monitor 144hz', price:150000, categoryId:1, description:'LG UltraGear' }
            ]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const handleCreate = (values: ProductFormValues) => {
        console.log('Crear producto:', values);
        message.success('Producto creado (simulado)');
        setIsModalOpen(false);
        form.resetFields();
    };

    // Tipamos las columnas correctamente
    const columns: ColumnsType<Product> = [
        { title: 'ID', dataIndex: 'id', width: 60, responsive: ['md'] },
        { title: 'Nombre', dataIndex: 'name' },
        {
            title: 'Precio',
            dataIndex: 'price',
            render: (val: number) => val.toLocaleString('es-CL', { style: 'currency', currency: 'CLP' })
        },
        {
            title: 'Categoría',
            dataIndex: 'categoryId',
            render: (id: number) => categories.find(c => c.id === id)?.name || 'General',
            responsive: ['sm']
        },
        {
            title: 'Acciones',
            key: 'actions',
            render: (_, record) => (
                <Space>
                    <Button icon={<EditOutlined />} size="small" />
                    <Button danger icon={<DeleteOutlined />} size="small" onClick={() => console.log(record.id)} />
                </Space>
            )
        }
    ];

    return (
        <div style={{ padding: 24 }}>
            <Card title="Gestión de Productos" extra={<Button type="primary" icon={<PlusOutlined />} onClick={() => setIsModalOpen(true)}>Nuevo Producto</Button>}>
                <Table
                    rowKey="id"
                    dataSource={products}
                    columns={columns}
                    loading={loading}
                    pagination={{ pageSize: 5 }}
                    scroll={{ x: 600 }}
                />
            </Card>

            <Modal title="Nuevo Producto" open={isModalOpen} onCancel={() => setIsModalOpen(false)} onOk={form.submit}>
                <Form form={form} layout="vertical" onFinish={handleCreate}>
                    <Form.Item name="name" label="Nombre" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="price" label="Precio" rules={[{ required: true }]}>
                        <InputNumber style={{ width: '100%' }} formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} />
                    </Form.Item>
                    <Form.Item name="categoryId" label="Categoría" rules={[{ required: true }]}>
                        <Select placeholder="Selecciona una categoría">
                            {categories.map(c => <Select.Option key={c.id} value={c.id}>{c.name}</Select.Option>)}
                        </Select>
                    </Form.Item>
                    <Form.Item name="imageUrl" label="URL Imagen">
                        <Input placeholder="http://..." />
                    </Form.Item>
                    <Form.Item name="description" label="Descripción">
                        <Input.TextArea />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default AdminProductsPage;