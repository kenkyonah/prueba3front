import React from 'react';
import { List, InputNumber, Button, Avatar } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import type { CartItem as CartItemType } from '../../types';
import { useCart } from '../../contexts/CartContext';

// Recibe un "item" del carrito (producto + cantidad)
const CartItem: React.FC<{ item: CartItemType }> = ({ item }) => {
    // Usamos las funciones para actualizar cantidad y borrar del contexto
    const { updateQty, removeFromCart } = useCart();

    return (
        <List.Item
            // Acciones a la derecha del item (Input de cantidad y Botón borrar)
            actions={[
                <InputNumber
                    min={1}
                    max={99}
                    value={item.quantity}
                    // Al cambiar el número, avisamos al contexto
                    onChange={(val) => updateQty(item.product.id, Number(val))}
                    size="small"
                />,
                <Button
                    type="text"
                    danger
                    icon={<DeleteOutlined />}
                    // Al hacer click, lo sacamos del carro
                    onClick={() => removeFromCart(item.product.id)}
                />
            ]}
        >
            <List.Item.Meta
                // Foto del producto (pequeña)
                avatar={<Avatar src={item.product.imageUrl || '/placeholder.png'} shape="square" size="large" />}
                // Nombre del producto
                title={item.product.name}
                // Precio unitario en pesos chilenos
                description={`$ ${item.product.price.toLocaleString('es-CL')}`}
            />
        </List.Item>
    );
};

export default CartItem;