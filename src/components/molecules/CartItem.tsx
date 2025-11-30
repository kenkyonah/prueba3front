import React from 'react';
import { List, InputNumber, Button } from 'antd';
import type { CartItem as CI } from '../../types';
import { useCart } from '../../contexts/CartContext';

const CartItem: React.FC<{ item: CI }> = ({ item }) => {
    const { updateQty, removeFromCart } = useCart();
    return (
        <List.Item
            extra={<img src={item.product.imageUrl || '/placeholder.png'} style={{ width: 64, height: 64, objectFit: 'cover' }} />}
            actions={[
                <InputNumber min={1} max={99} value={item.quantity} onChange={(v) => updateQty(item.product.id, Number(v))} />,
                <Button danger onClick={() => removeFromCart(item.product.id)}>Eliminar</Button>
            ]}
        >
            <List.Item.Meta title={item.product.name} description={`${item.product.price.toLocaleString('es-CL', { style: 'currency', currency: 'CLP' })}`} />
        </List.Item>
    );
};

export default CartItem;
