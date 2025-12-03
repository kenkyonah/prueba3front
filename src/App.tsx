import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainLayout from './components/layouts/MainLayout';
import HomePage from './pages/HomePage';
import CheckoutPage from './pages/CheckoutPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import AdminDashboardPage from './pages/AdminDashboardPage'; // Importamos la nueva página
import { CartProvider } from './contexts/CartContext';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/layouts/ProtectedRoute';

const App: React.FC = () => {
    return (
        <AuthProvider>
            <CartProvider>
                <BrowserRouter>
                    <MainLayout>
                        <Routes>
                            {/* Rutas Públicas */}
                            <Route path="/" element={<HomePage />} />
                            <Route path="/checkout" element={<CheckoutPage />} />
                            <Route path="/login" element={<LoginPage />} />
                            <Route path="/register" element={<RegisterPage />} />

                            {/* Rutas Privadas (Cualquier logueado) */}
                            <Route element={<ProtectedRoute allowedRoles={['ADMIN', 'VENDEDOR', 'CLIENTE']} />}>
                                <Route path="/profile" element={<ProfilePage />} />
                            </Route>

                            {/* Rutas de Administrador (Solo ADMIN) */}
                            <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
                                {/* Usamos el Dashboard unificado */}
                                <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
                                {/* Redirección para compatibilidad */}
                                <Route path="/admin/products" element={<AdminDashboardPage />} />
                            </Route>
                        </Routes>
                    </MainLayout>
                </BrowserRouter>
            </CartProvider>
        </AuthProvider>
    );
};

export default App;