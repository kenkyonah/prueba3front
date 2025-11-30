
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainLayout from './components/layouts/MainLayout';
import HomePage from './pages/HomePage';
import CheckoutPage from './pages/CheckoutPage';
import LoginPage from './pages/LoginPage'; // ¡Añadiremos esta página!
import { CartProvider } from './contexts/CartContext';
import { AuthProvider } from './contexts/AuthContext'; // Nuevo Context
import ProtectedRoute from './components/layouts/ProtectedRoute'; // Lo crearemos en el paso 1.4

const App: React.FC = () => {
    return (

        <AuthProvider>
            <CartProvider>
                <BrowserRouter>
                    <MainLayout>
                        <Routes>
                            <Route path="/" element={<HomePage />} />
                            <Route path="/checkout" element={<CheckoutPage />} />
                            <Route path="/login" element={<LoginPage />} />


                            <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
                                <Route path="/admin/products" element={<h1>Admin Productos (TODO)</h1>} />
                                <Route path="/admin/reports" element={<h1>Informe de Ventas (TODO)</h1>} />
                            </Route>
                        </Routes>
                    </MainLayout>
                </BrowserRouter>
            </CartProvider>
        </AuthProvider>
    );
};

export default App;