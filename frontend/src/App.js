import React from 'react';
import AppLayout from './layouts/AppLayout';
import { RouteProvider } from './contexts/RouteContext';
import { AuthProvider } from './contexts/AuthContext';

export const App = () => {
    return (
        <AuthProvider>
            <RouteProvider>
                <AppLayout defaultOpen={false} accentColor="#C74634" />
            </RouteProvider>
        </AuthProvider>
    );
};