import React from 'react';
import DesktopSidebar from '../components/sidebar/desktopSidebar';
import MobileSidebar from '../components/sidebar/mobileSidebar';
import { useSidebar } from '../hooks/useSidebar';

const Sidebar = ({
                     defaultOpen = false,
                     accentColor = "#C74634",
                     defaultSelected = "Overview"
                 }) => {
    const { isMobile } = useSidebar(defaultOpen, defaultSelected);

    return isMobile ? (
        <MobileSidebar accentColor={accentColor} />
    ) : (
        <DesktopSidebar accentColor={accentColor} />
    );
};

export default Sidebar;