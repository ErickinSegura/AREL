import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const RouteContext = createContext();

export const RouteProvider = ({ children }) => {
    const [currentRoute, setCurrentRoute] = useState('/login');
    const { isAuthenticated, isLoading } = useAuth();

    useEffect(() => {
        if (!isLoading) {
            if (isAuthenticated) {
                if (currentRoute === '/login') {
                    setCurrentRoute('/overview');
                }
            } else {
                setCurrentRoute('/login');
            }
        }
    }, [isAuthenticated, isLoading, currentRoute]);

    return (
        <RouteContext.Provider value={{ currentRoute, setCurrentRoute }}>
            {children}
        </RouteContext.Provider>
    );
};

export const useRoute = () => {
    const context = useContext(RouteContext);
    if (!context) {
        throw new Error('useRoute must be used within a RouteProvider');
    }
    return context;
};