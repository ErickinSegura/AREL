import React from 'react';
import { MenuItem, ProjectDropdown, UserSection } from './sideBar';
import { useSidebar } from '../../hooks/useSidebar';
import { useProjects } from '../../hooks/useProjects';
import { useMenuItems } from '../../hooks/useMenuItems';

const DesktopSidebar = ({ accentColor }) => {
    const {
        isOpen,
        selectedItem,
        setSelectedItem,
        sidebarRef,
        handleMouseEnter,
        handleMouseLeave
    } = useSidebar();

    const {
        projects,
        selectedProject,
        projectDropdownOpen,
        loading,
        toggleProjectDropdown,
        selectProject
    } = useProjects();

    const {
        menuItems,
        handleLogout,
        user
    } = useMenuItems();

    return (
        <div
            ref={sidebarRef}
            className={`h-screen bg-white transition-all duration-300 ease-out flex flex-col fixed md:relative z-10
                ${isOpen ? 'w-64' : 'w-16'}`}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            {/* Project Section */}
            <div className="flex flex-col h-full">
                {/* Project Dropdown for Desktop */}
                <ProjectDropdown
                    projects={projects}
                    selectedProject={selectedProject}
                    projectDropdownOpen={projectDropdownOpen}
                    toggleProjectDropdown={toggleProjectDropdown}
                    selectProject={selectProject}
                    isOpen={isOpen}
                    isMobile={false}
                    loading={loading}
                />

                <div className="border-t border-gray-700 mx-4 transition-all my-4"/>

                <nav className="flex-1">
                    <ul>
                        {menuItems.map((item, index) => (
                            <MenuItem
                                key={index}
                                item={item}
                                isSelected={selectedItem === item.label}
                                accentColor={accentColor}
                                onClick={() => setSelectedItem(item.label)}
                                isCollapsed={!isOpen}
                            />
                        ))}
                    </ul>
                </nav>

                {/* User Section */}
                <UserSection
                    user={user}
                    handleLogout={handleLogout}
                    isOpen={isOpen}
                    isMobile={false}
                />
            </div>
        </div>
    );
};

export default DesktopSidebar;