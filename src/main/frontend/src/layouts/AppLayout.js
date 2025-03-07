import React from 'react';
import Sidebar from '../components/sidebar/sideBar';
import { useRoute } from '../contexts/RouteContext';
import { routes } from '../routes';

const AppLayout = ({ defaultOpen = false, accentColor = "#e74c3c" }) => {
    const { currentRoute } = useRoute();

    const CurrentView = routes.find(route => route.path === currentRoute)?.component || routes[0].component;

    return (
        <div className="flex h-screen overflow-hidden">
            <Sidebar
                defaultOpen={defaultOpen}
                accentColor={accentColor}
                defaultSelected={routes.find(route => route.path === currentRoute)?.label || routes[0].label}
            />

            <main className="flex-1 overflow-auto">
                <CurrentView />
            </main>
        </div>
    );
};

export default AppLayout;