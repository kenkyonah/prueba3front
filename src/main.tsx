import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { ConfigProvider } from 'antd'; // Importamos el proveedor de configuración
import 'antd/dist/reset.css'; // Estilos base

// Buscamos el elemento 'root' en el HTML y "montamos" la app ahí
ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        {/* ConfigProvider permite cambiar los colores globales de Ant Design */}
        <ConfigProvider
            theme={{
                token: {
                    colorPrimary: '#389e0d', // Color Verde
                    borderRadius: 8,         // Bordes redondeados suaves
                },
            }}
        >
            <App />
        </ConfigProvider>
    </React.StrictMode>
);