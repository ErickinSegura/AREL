import React, { createContext, useContext, useState } from 'react';
import { routes } from '../routes';

const RouteContext = createContext();

export const RouteProvider = ({ children }) => {
    const [currentRoute, setCurrentRoute] = useState(routes[0].path);

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