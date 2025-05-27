import React from 'react';
import AppLayout from './layouts/AppLayout';
import { RouteProvider } from './contexts/RouteContext';
import { AuthProvider } from './contexts/AuthContext';
import {ProjectProvider} from "./hooks/useProjects";
import { Helmet } from 'react-helmet';

export const App = () => {
    return (
        <>
            <Helmet>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
                <link href="https://fonts.googleapis.com/css2?family=Chakra+Petch:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
            </Helmet>
            <AuthProvider>
                <RouteProvider>
                    <ProjectProvider>
                        <AppLayout defaultOpen={false} accentColor="#C74634" />
                    </ProjectProvider>
                </RouteProvider>
            </AuthProvider>
        </>
    )
};