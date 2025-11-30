// src/components/layouts/ProtectedRoute.tsx
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import type {Role} from '../../types';
import { Result, Button } from 'antd';

// Este componente protege las rutas. Recibe una lista de roles permitidos.
const ProtectedRoute: React.FC<{ allowedRoles: Role[] }> = ({ allowedRoles }) => {
    const { isAuthenticated, user } = useAuth();

    // 1. Verificamos si el usuario inició sesión
    if (!isAuthenticated) {
        // Si no está logueado, lo se manda al login
        return <Navigate to="/login" replace />;
    }

    // 2. Verificamos si el usuario tiene el rol correcto
    // Si 'user' existe Y su rol NO está en la lista de permitidos...
    if (user && !allowedRoles.includes(user.role)) {
        // ... Se muestra en pantalla "Acceso Denegado" (403)
        return (
            <div style={{ padding: 50, display: 'flex', justifyContent: 'center' }}>
                <Result
                    status="403"
                    title="403 - Acceso Restringido"
                    subTitle={`Lo sentimos, tu rol (${user.role}) no tiene permisos para ver esta página.`}
                    extra={<Button type="primary" onClick={() => (window.location.href = '/')}>Volver al Inicio</Button>}
                />
            </div>
        );
    }

    // 3. Si pasa todas las pruebas, Se muestra el contenido real (Outlet)
    return <Outlet />;
};

export default ProtectedRoute;