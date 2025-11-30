import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import type { UserData } from '../types';

// Definimos qué funciones y datos estarán disponibles para toda la app
export interface AuthContextValue {
    user: UserData | null;      // Datos del usuario (null si no hay nadie)
    token: string | null;       // El token de seguridad JWT
    login: (token: string, userData: UserData) => void; // Función para entrar
    logout: () => void;         // Función para salir
    isAuthenticated: boolean;   // Logueado true/false
    isAdmin: boolean;           // Admin true/false
    isVendedor: boolean;        // Vendedor true/false
}

// Creamos el contexto vacío
const AuthContext = createContext<AuthContextValue | undefined>(undefined);

// Hook para usar este contexto fácil en otros archivos
// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = (): AuthContextValue => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth debe usarse dentro de AuthProvider');
    return ctx;
};

// El componente que envuelve a la app y maneja la sesión
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {

    // Al iniciar, intentamos leer el usuario guardado en el navegador (localStorage)
    const [user, setUser] = useState<UserData | null>(() => {
        const storedUser = localStorage.getItem('user');
        // Si existe, lo convertimos de texto a objeto JSON
        return storedUser ? (JSON.parse(storedUser) as UserData) : null;
    });

    // También leemos el token
    const [token, setToken] = useState<string | null>(() => localStorage.getItem('token'));

    // Cada vez que cambia el token, actualizamos el localStorage
    useEffect(() => {
        if (token) {
            localStorage.setItem('token', token);
        } else {
            // Si el token es null, lo borramos de la memoria del navegador
            localStorage.removeItem('token');
        }
    }, [token]);

    // Función para Iniciar Sesión (guarda los datos)
    const login = useCallback((jwt: string, userData: UserData) => {
        setToken(jwt);
        setUser(userData);
        // Guardamos los datos del usuario en texto
        localStorage.setItem('user', JSON.stringify(userData));
    }, []);

    // Función para Cerrar Sesión (borra todo)
    const logout = useCallback(() => {
        setToken(null);
        setUser(null);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        // Redirigimos a la página de inicio
        window.location.href = '/';
    }, []);

    // Permisos rápidos
    const isAuthenticated = !!token && !!user; // Verdadero si existen ambos
    const isAdmin = isAuthenticated && user!.role === 'ADMIN';
    const isVendedor = isAuthenticated && user!.role === 'VENDEDOR';

    // Empaquetamos todo para enviarlo a la app
    const value = useMemo(() => ({
        user,
        token,
        login,
        logout,
        isAuthenticated,
        isAdmin,
        isVendedor
    }), [user, token, login, logout, isAuthenticated, isAdmin, isVendedor]);

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};