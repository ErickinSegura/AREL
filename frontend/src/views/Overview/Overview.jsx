import React from 'react';
import { useAuth } from "../../contexts/AuthContext";
import AdminOverview from './AdminOverview';
import DeveloperOverview from './DeveloperOverview';

const OverviewController = () => {
    const { user } = useAuth();
    const userRole = user?.userLevel || 2;


    if (userRole === 1 || userRole === 3) {
        return <AdminOverview />;
    } else {
        return <DeveloperOverview />;
    }
};

export default OverviewController;