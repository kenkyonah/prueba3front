import React, { useState } from 'react';
import { Layout, Badge, Drawer, List, Button } from 'antd';
import { ShoppingCartOutlined } from '@ant-design/icons';
import { useCart } from '../../contexts/CartContext';
import CartItem from '../molecules/CartItem';
import { Link } from 'react-router-dom';

const { Header } = Layout;

const HeaderBar: React.FC = () => {
    const { items, total, clear } = useCart();
    const [open, setOpen] = useState(false);

    return (
        <>
            <Header style={{ display:'flex', justifyContent:'space-between', alignItems:'center', background:'#fff' }}>
                <h3 style={{ margin: 0 }}><Link to="/">VentasApp</Link></h3>
                <div>
                    <Badge count={items.length}>
                        <Button icon={<ShoppingCartOutlined />} onClick={() => setOpen(true)} />
                    </Badge>
                </div>
            </Header>

            <Drawer title="Carrito" placement="right" onClose={() => setOpen(false)} open={open} width={420}>
                <List
                    dataSource={items}
                    renderItem={item => (
                        <CartItem key={item.product.id} item={item} />
                    )}
                />
                <div style={{ marginTop: 12, fontWeight: 700 }}>
                    Total: {total().toLocaleString('es-CL', { style: 'currency', currency: 'CLP' })}
                </div>
                <div style={{ display:'flex', gap:8, marginTop:12 }}>
                    <Button type="primary" onClick={() => { setOpen(false); window.location.href = '/checkout'; }}>Finalizar</Button>
                    <Button danger onClick={clear}>Vaciar</Button>
                </div>
            </Drawer>
        </>
    );
};

export default HeaderBar;
