
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import type {Role} from '../../types';
import { Result, Button } from 'antd';

const ProtectedRoute: React.FC<{ allowedRoles: Role[] }> = ({ allowedRoles }) => {
    const { isAuthenticated, user } = useAuth();

    // Si no está autenticado, redirige al login
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    // Si el usuario existe pero su rol no está permitido (ej. VENDEDOR intentando ir a /admin)
    if (user && !allowedRoles.includes(user.role)) {
        return (
            <div style={{ padding: 50 }}>
                <Result
                    status="403"
                    title="403 - Acceso Restringido"
                    subTitle={`Tu rol (${user.role}) no tiene permisos para acceder a esta sección.`}
                    extra={<Button type="primary" onClick={() => (window.location.href = '/')}>Volver a la Tienda</Button>}
                />
            </div>
        );
    }

    return <Outlet />;
};

export default ProtectedRoute;