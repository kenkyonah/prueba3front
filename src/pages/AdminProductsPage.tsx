import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Input, InputNumber, Select, message, Space, Card, Popconfirm } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { getProducts, createProduct, updateProduct, deleteProduct } from '../api/api';
import type { Product, Category, CreateProductPayload } from '../types';

const AdminProductsPage: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Estado para saber si estamos editando (guarda el producto seleccionado)
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);

    const [form] = Form.useForm();

    const categories: Category[] = [
        { id: 1, name: 'Semillas y Cultivo' },
        { id: 2, name: 'Herramientas' },
        { id: 3, name: 'Macetas y Decoración' }
    ];

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const { data } = await getProducts();
            setProducts(data);
        } catch (error) {
            console.error(error);
            message.error('Error cargando productos');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    // ABRIR MODAL (CREAR O EDITAR)
    const openModal = (product?: Product) => {
        if (product) {
            // MODO EDICIÓN: Rellenamos el formulario con los datos del producto
            setEditingProduct(product);
            form.setFieldsValue(product);
        } else {
            // MODO CREACIÓN: Limpiamos todo
            setEditingProduct(null);
            form.resetFields();
        }
        setIsModalOpen(true);
    };

    // GUARDAR (CREAR O ACTUALIZAR)
    const handleSave = async (values: CreateProductPayload) => {
        try {
            if (editingProduct) {
                // Si existe editingProduct, es una ACTUALIZACIÓN
                await updateProduct(editingProduct.id, values);
                message.success('Producto actualizado correctamente');
            } else {
                // Si no, es una CREACIÓN
                await createProduct(values);
                message.success('Producto creado correctamente');
            }
            setIsModalOpen(false);
            form.resetFields();
            fetchProducts(); // Recargar tabla
        } catch (error) {
            console.error(error);
            message.error('Error al guardar.');
        }
    };

    // ELIMINAR
    const handleDelete = async (id: number) => {
        try {
            await deleteProduct(id);
            message.success('Producto eliminado');
            fetchProducts(); // Recargar tabla
        } catch (error) {
            console.error(error);
            message.error('No se pudo eliminar el producto');
        }
    };

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
                    {/* Botón Editar: Abre el modal con los datos */}
                    <Button
                        icon={<EditOutlined />}
                        size="small"
                        onClick={() => openModal(record)}
                    />

                    {/* Botón Eliminar: Muestra confirmación antes de borrar */}
                    <Popconfirm
                        title="¿Estás seguro?"
                        description="Esta acción no se puede deshacer"
                        onConfirm={() => handleDelete(record.id)}
                        okText="Sí, borrar"
                        cancelText="No"
                    >
                        <Button danger icon={<DeleteOutlined />} size="small" />
                    </Popconfirm>
                </Space>
            )
        }
    ];

    return (
        <div style={{ padding: 24 }}>
            <Card
                title="Gestión de Productos"
                extra={
                    <Button type="primary" icon={<PlusOutlined />} onClick={() => openModal()}>
                        Nuevo Producto
                    </Button>
                }
            >
                <Table
                    rowKey="id"
                    dataSource={products}
                    columns={columns}
                    loading={loading}
                    pagination={{ pageSize: 5 }}
                    scroll={{ x: 600 }}
                />
            </Card>

            <Modal
                title={editingProduct ? "Editar Producto" : "Nuevo Producto"}
                open={isModalOpen}
                onCancel={() => setIsModalOpen(false)}
                onOk={form.submit}
                okText="Guardar"
                cancelText="Cancelar"
            >
                <Form form={form} layout="vertical" onFinish={handleSave}>
                    <Form.Item name="name" label="Nombre" rules={[{ required: true, message: 'Falta el nombre' }]}>
                        <Input />
                    </Form.Item>

                    <Form.Item name="price" label="Precio" rules={[{ required: true, message: 'Falta el precio' }]}>
                        <InputNumber
                            style={{ width: '100%' }}
                            formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                            parser={(value) => value?.replace(/\$\s?|(,*)/g, '') as unknown as number}
                        />
                    </Form.Item>

                    <Form.Item name="categoryId" label="Categoría" rules={[{ required: true, message: 'Elige una categoría' }]}>
                        <Select placeholder="Selecciona una categoría">
                            {categories.map(c => <Select.Option key={c.id} value={c.id}>{c.name}</Select.Option>)}
                        </Select>
                    </Form.Item>

                    <Form.Item name="imageUrl" label="URL Imagen">
                        <Input placeholder="https://..." />
                    </Form.Item>

                    <Form.Item name="description" label="Descripción">
                        <Input.TextArea rows={3} />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default AdminProductsPage;