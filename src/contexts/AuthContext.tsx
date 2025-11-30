import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import type { UserData } from '../types';

export interface AuthContextValue {
    user: UserData | null;
    token: string | null;
    login: (token: string, userData: UserData) => void;
    logout: () => void;
    isAuthenticated: boolean;
    isAdmin: boolean;
    isVendedor: boolean;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

// ESTA LÍNEA MÁGICA SOLUCIONA LA ADVERTENCIA EN useAuth
// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = (): AuthContextValue => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth debe ser usado dentro de AuthProvider');
    return ctx;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    // Usamos 'as UserData' para asegurar el tipo al leer del storage
    const [user, setUser] = useState<UserData | null>(() => {
        const storedUser = localStorage.getItem('user');
        return storedUser ? (JSON.parse(storedUser) as UserData) : null;
    });

    const [token, setToken] = useState<string | null>(() => localStorage.getItem('token'));

    useEffect(() => {
        if (token) {
            localStorage.setItem('token', token);
        } else {
            localStorage.removeItem('token');
        }
    }, [token]);

    const login = useCallback((jwt: string, userData: UserData) => {
        setToken(jwt);
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
    }, []);

    const logout = useCallback(() => {
        setToken(null);
        setUser(null);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/';
    }, []);

    const isAuthenticated = !!token && !!user;
    const isAdmin = isAuthenticated && user!.role === 'ADMIN';
    const isVendedor = isAuthenticated && user!.role === 'VENDEDOR';

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