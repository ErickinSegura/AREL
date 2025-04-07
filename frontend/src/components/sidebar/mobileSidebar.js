import React from 'react';
import { Menu, X } from 'lucide-react';
import { MenuItem, ProjectDropdown, UserSection } from './sideBar';
import { useSidebar } from '../../hooks/useSidebar';
import { useProjects } from '../../hooks/useProjects';
import { useMenuItems } from '../../hooks/useMenuItems';

const MobileSidebar = ({ accentColor }) => {
    const {
        selectedItem,
        setSelectedItem,
        mobileMenuOpen,
        toggleMobileMenu
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
        <>
            <div className="fixed top-0 left-0 right-0 bg-white shadow-md z-20 h-16">
                <div className="flex items-center justify-between px-4 h-full">
                    <div className="flex items-center gap-x-4">
                        <button
                            onClick={toggleMobileMenu}
                            className="p-2 rounded-md hover:bg-gray-700 transition-colors focus:outline-none"
                            aria-label="Toggle menu"
                        >
                            {mobileMenuOpen ? <X size={24} className="text-gray-200" /> : <Menu size={24} className="text-gray-200" />}
                        </button>
                        <div
                            className="w-8 h-8 rounded-md flex-shrink-0 grid place-items-center"
                            style={{ backgroundColor: selectedProject?.color?.hexColor || '#C74634' }}
                        >
                            <span className="text-gray-50 text-xs">{selectedProject?.icon?.iconName === 'folder' ? 'F' : selectedProject?.icon?.iconName[0]}</span>
                        </div>
                        <div className="text-base font-medium text-gray-200 truncate">
                            {selectedProject?.projectName || 'Select Project'}
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile menu overlay with animation */}
            <div
                className={`fixed inset-0 bg-black z-30 transition-opacity duration-300 ${
                    mobileMenuOpen ? 'opacity-40' : 'opacity-0 pointer-events-none'
                }`}
                onClick={toggleMobileMenu}
            />

            {/* Slide-in menu from left with animation */}
            <div
                className={`fixed left-0 top-0 bottom-0 w-64 bg-gray-800 shadow-xl z-40 transform transition-transform duration-300 ease-in-out ${
                    mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
                }`}
            >
                {/* Project selector in mobile */}
                <ProjectDropdown
                    projects={projects}
                    selectedProject={selectedProject}
                    projectDropdownOpen={projectDropdownOpen}
                    toggleProjectDropdown={toggleProjectDropdown}
                    selectProject={selectProject}
                    isOpen={true}
                    isMobile={true}
                    loading={loading}
                />

                <div className="border-t border-gray-700 mx-4 transition-all my-4"/>

                <nav className="h-full flex flex-col">
                    <ul className="flex-1 py-2">
                        {menuItems.map((item, index) => (
                            <MenuItem
                                key={index}
                                item={item}
                                isSelected={selectedItem === item.label}
                                accentColor={accentColor}
                                onClick={() => {
                                    setSelectedItem(item.label);
                                    toggleMobileMenu();
                                }}
                                isCollapsed={false}
                            />
                        ))}
                    </ul>

                    {/* User Section */}
                    <UserSection
                        user={user}
                        handleLogout={handleLogout}
                        isOpen={true}
                        isMobile={true}
                    />
                </nav>
            </div>

            {/* Content padding for fixed header */}
            <div className="h-16" />
        </>
    );
};

export default MobileSidebar;