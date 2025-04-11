import React from 'react';
import AppLayout from './layouts/AppLayout';
import { RouteProvider } from './contexts/RouteContext';
import { AuthProvider } from './contexts/AuthContext';
import {ProjectProvider} from "./hooks/useProjects";

export const App = () => {
    return (
        <AuthProvider>
            <RouteProvider>
                <ProjectProvider>
                    <AppLayout defaultOpen={false} accentColor="#C74634" />
                </ProjectProvider>
            </RouteProvider>
        </AuthProvider>
    );
};