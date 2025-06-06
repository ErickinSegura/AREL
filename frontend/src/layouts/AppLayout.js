import React, { useState, useEffect } from 'react';
import Sidebar from '../components/sidebar/sideBar';
import { useRoute } from '../contexts/RouteContext';
import { routes, sidebarRoutes } from '../routes';
import { useAuth } from '../contexts/AuthContext';
import { PageLoading } from "../lib/ui/Loading";

const AppLayout = ({ defaultOpen = false, accentColor = "#C74634" }) => {
    const { currentRoute } = useRoute();
    const { isAuthenticated, isLoading } = useAuth();
    const [isMobile, setIsMobile] = useState(false);

    const CurrentView = routes.find(route => route.path === currentRoute)?.component || routes[0].component;

    const isPublicRoute = routes.find(route => route.path === currentRoute)?.public || false;

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
        };

        handleResize();

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    if (isLoading) {
        return <PageLoading message={"Loading..."} />;
    }

    return (
        <div className={`${isMobile ? 'flex flex-col' : 'flex'} h-screen overflow-hidden`}>
            {isAuthenticated && !isPublicRoute && (
                <Sidebar
                    defaultOpen={defaultOpen}
                    accentColor={accentColor}
                    defaultSelected={sidebarRoutes.find(route => route.path === currentRoute)?.label || sidebarRoutes[0].label}
                />
            )}

            <main className={`flex-1 overflow-auto ${isMobile && isAuthenticated && !isPublicRoute ? 'pt-8' : ''}`}>
                <CurrentView />
            </main>
        </div>
    );
};

export default AppLayout;