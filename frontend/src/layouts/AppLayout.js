import React, { useState, useEffect } from 'react';
import Sidebar from '../components/sidebar/sideBar';
import { useRoute } from '../contexts/RouteContext';
import { routes } from '../routes';

const AppLayout = ({ defaultOpen = false, accentColor = "#e74c3c" }) => {
    const { currentRoute } = useRoute();
    const [isMobile, setIsMobile] = useState(false);

    // Determine the current component to render
    const CurrentView = routes.find(route => route.path === currentRoute)?.component || routes[0].component;

    // Check viewport size on mount and window resize
    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
        };

        // Initial check
        handleResize();

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <div className={`${isMobile ? 'flex flex-col' : 'flex'} h-screen overflow-hidden`}>
            <Sidebar
                defaultOpen={defaultOpen}
                accentColor={accentColor}
                defaultSelected={routes.find(route => route.path === currentRoute)?.label || routes[0].label}
            />

            <main className={`flex-1 overflow-auto ${isMobile ? 'pt-16' : ''}`}>
                <CurrentView />
            </main>
        </div>
    );
};

export default AppLayout;