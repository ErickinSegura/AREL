import React from 'react';
import { FiCloudLightning, FiHome, FiSettings, FiTable, FiCalendar, FiLink, FiUsers, FiActivity, FiBarChart2 } from "react-icons/fi";
import { useAuth } from '../contexts/AuthContext';

export const useMenuItems = () => {
    const { user, logout } = useAuth();

    const getMenuItemsByRole = () => {
        const commonItems = [
            { icon: <FiHome size={20} />, label: 'Overview', hasSubmenu: false },
        ];

        const roleSpecificItems = {
            // Manager (userLevel: 1)
            1: [
                { icon: <FiTable size={20} />, label: 'Backlog', hasSubmenu: true },
                { icon: <FiCloudLightning size={20} />, label: 'Sprints', hasSubmenu: true },
                { icon: <FiBarChart2 size={20} />, label: 'Reports', hasSubmenu: true },
                { icon: <FiUsers size={20} />, label: 'Team', hasSubmenu: true },
            ],
            // Developer (userLevel: 2)
            2: [
                { icon: <FiTable size={20} />, label: 'Backlog', hasSubmenu: false },
                { icon: <FiCloudLightning size={20} />, label: 'Sprints', hasSubmenu: false },
                { icon: <FiActivity size={20} />, label: 'My Tasks', hasSubmenu: false },
            ],
            // Administrator (userLevel: 3)
            3: [
                { icon: <FiUsers size={20} />, label: 'Users', hasSubmenu: true },
                { icon: <FiCloudLightning size={20} />, label: 'Sprints', hasSubmenu: false },
            ]
        };

        const additionalItems = [
            { icon: <FiCalendar size={20} />, label: 'Calendar', hasSubmenu: false },
            { icon: <FiLink size={20} />, label: 'Shortcuts', hasSubmenu: false },
            { icon: <FiSettings size={20} />, label: 'Settings', hasSubmenu: false },
        ];

        const userRole = user?.userLevel || 2; // Default to Developer if user role not available

        return [
            ...commonItems,
            ...(roleSpecificItems[userRole] || []),
            ...additionalItems
        ];
    };

    const getRoleName = (userLevel) => {
        switch (userLevel) {
            case 1: return 'Manager';
            case 2: return 'Developer';
            case 3: return 'Administrator';
            default: return 'User';
        }
    };

    const handleLogout = () => {
        logout();
    };

    return {
        menuItems: getMenuItemsByRole(),
        getRoleName,
        handleLogout,
        user
    };
};