// src/App.tsx
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainLayout from './components/layouts/MainLayout';
import HomePage from './pages/HomePage';
import CheckoutPage from './pages/CheckoutPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import AdminProductsPage from './pages/AdminProductsPage';
import SalesReportsPage from './pages/SalesReportsPage';
import { CartProvider } from './contexts/CartContext';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/layouts/ProtectedRoute';

const App: React.FC = () => {
    return (
        // Proveedor de Autenticación envuelve todo
        <AuthProvider>
            {/* Proveedor del Carrito dentro de Auth */}
            <CartProvider>
                <BrowserRouter>
                    <MainLayout>
                        <Routes>
                            {/* Rutas Públicas */}
                            <Route path="/" element={<HomePage />} />
                            <Route path="/checkout" element={<CheckoutPage />} />
                            <Route path="/login" element={<LoginPage />} />
                            <Route path="/register" element={<RegisterPage />} />

                            {/* Rutas Privadas (Solo usuarios logueados) */}
                            {/* 'allowedRoles' vacío significa que cualquiera logueado puede entrar */}
                            <Route element={<ProtectedRoute allowedRoles={['ADMIN', 'VENDEDOR', 'CLIENTE']} />}>
                                <Route path="/profile" element={<ProfilePage />} />
                            </Route>

                            {/* Rutas de Administrador (Solo ADMIN) */}
                            <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
                                <Route path="/admin/products" element={<AdminProductsPage />} />
                                <Route path="/admin/reports" element={<SalesReportsPage />} />
                            </Route>
                        </Routes>
                    </MainLayout>
                </BrowserRouter>
            </CartProvider>
        </AuthProvider>
    );
};

export default App;