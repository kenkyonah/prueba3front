import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainLayout from './components/layouts/MainLayout';
import HomePage from './pages/HomePage';
import CheckoutPage from './pages/CheckoutPage';
import { CartProvider } from './contexts/CartContext';

const App: React.FC = () => {
    return (
        <CartProvider>
            <BrowserRouter>
                <MainLayout>
                    <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/checkout" element={<CheckoutPage />} />
                    </Routes>
                </MainLayout>
            </BrowserRouter>
        </CartProvider>
    );
};

export default App;
