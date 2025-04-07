import React, {useEffect} from 'react';
import { ChevronRight, LogOut } from 'lucide-react';
import { FiCodesandbox } from "react-icons/fi";

export const MenuItem = ({ item, isSelected, accentColor, onClick, isCollapsed = false }) => {
    return (
        <li className="relative mx-2 my-1">
            {isSelected && (
                <div
                    className="absolute inset-0 rounded-lg transition-all duration-300"
                    style={{ backgroundColor: accentColor }}>
                </div>
            )}

            <button
                onClick={onClick}
                className={`flex items-center w-full ${isCollapsed ? 'justify-center' : ''} h-12 rounded-lg transition-all duration-200 relative z-10 group ${isCollapsed ? '' : 'px-4'} hover:bg-gray-100`}
            >
        <span className={`transition-colors ${
            isSelected
                ? 'text-white'
                : 'text-black group-hover:text-gray-700'
        }`}>
          {item.icon}
        </span>

                {!isCollapsed && (
                    <>
            <span className={`ml-4 text-sm font-medium ${
                isSelected
                    ? 'text-white'
                    : 'text-black group-hover:text-gray-700'
            }`}>
              {item.label}
            </span>

                        {item.hasSubmenu && (
                            <ChevronRight
                                size={16}
                                className={`ml-auto ${
                                    isSelected
                                        ? 'text-white'
                                        : 'text-black group-hover:text-gray-700'
                                }`}
                            />
                        )}
                    </>
                )}
            </button>
        </li>
    );
};

export const ProjectDropdown = ({
                                    projects,
                                    selectedProject,
                                    projectDropdownOpen,
                                    toggleProjectDropdown,
                                    selectProject,
                                    isOpen,
                                    isMobile,
                                    loading
                                }) => {
    // Close dropdown when sidebar collapses
    useEffect(() => {
        if (!isOpen && projectDropdownOpen && !isMobile) {
            // We need to create a new event to simulate clicking outside
            // since we don't have direct access to setProjectDropdownOpen
            const clickEvent = new MouseEvent('click', {
                bubbles: true,
                cancelable: true,
                view: window
            });
            document.dispatchEvent(clickEvent);
        }
    }, [isOpen, projectDropdownOpen, isMobile]);

    if (loading) {
        return (
            <div className={`${isMobile ? 'p-4 border-b border-gray-200' : 'px-4'} relative project-dropdown`}>
                <div className="flex items-center">
                    <div className="w-8 h-8 rounded-md flex-shrink-0 grid place-items-center bg-gray-600 animate-pulse"></div>
                    {(isOpen || isMobile) && (
                        <div className="ml-3 w-20 h-5 bg-gray-600 rounded animate-pulse"></div>
                    )}
                </div>
            </div>
        );
    }

    return (
        <div className={`${isMobile ? 'p-4 border-b border-gray-200' : 'px-4'} relative project-dropdown`}>
            {isMobile && <div className="text-sm font-medium text-gray-400 mb-2">Select Project</div>}

            <button
                onClick={toggleProjectDropdown}
                className={`flex items-center justify-between w-full p-2 rounded-md transition-colors ${
                    isMobile ? 'bg-gray-700 hover:bg-gray-600' : 'hover:bg-gray-700'
                }`}
            >
                <div className="flex items-center">
                    <div
                        className="w-8 h-8 rounded-md flex-shrink-0 grid place-items-center"
                        style={{ backgroundColor: selectedProject?.color?.hexColor || '#C74634' }}
                    >
                        <FiCodesandbox className="text-gray-50 text-xs" />
                    </div>

                    {(isOpen || isMobile) && (
                        <div className={`ml-3 ${!isMobile ? 'transition-all duration-300' : ''} ${isOpen || isMobile ? 'opacity-100 w-auto' : 'opacity-0 w-0'}`}>
                            <div className="text-sm font-medium text-gray-200 truncate">
                                {selectedProject?.projectName || 'Select Project'}
                            </div>
                        </div>
                    )}
                </div>

                {(isOpen || isMobile) && (
                    <ChevronRight
                        size={16}
                        className={`transition-transform text-gray-400 ${projectDropdownOpen ? 'rotate-90' : ''}`}
                    />
                )}
            </button>

            {projectDropdownOpen && isOpen && (
                <div className="absolute left-full top-0 mt-2 -ml-2 bg-gray-800 border border-gray-700 rounded-md shadow-lg z-20 w-64">
                    <div className="p-2 border-b border-gray-700">
                        <div className="text-sm font-medium text-gray-300 mb-1">Teams</div>
                    </div>
                    <div className="max-h-64 overflow-y-auto py-1">
                        {projects.map((project, index) => (
                            <button
                                key={project.id}
                                onClick={() => selectProject(project)}
                                className={`flex items-center w-full p-2 hover:bg-gray-700 transition-colors text-left ${
                                    selectedProject?.id === project.id ? 'bg-gray-700' : ''
                                }`}
                            >
                                <div
                                    className="w-6 h-6 rounded-md flex-shrink-0 grid place-items-center"
                                    style={{ backgroundColor: project.color?.hexColor || '#C74634' }}
                                >
                                    <FiCodesandbox className="text-gray-50 text-xs" />
                                </div>
                                <span className="ml-3 text-sm text-gray-200">{project.projectName}</span>
                                <span className="ml-auto text-xs text-gray-400">#{index + 1}</span>
                            </button>
                        ))}
                    </div>
                    <div className="p-2 border-t border-gray-700">
                        <button className="flex items-center w-full p-2 hover:bg-gray-700 transition-colors rounded">
                            <div className="w-6 h-6 rounded-md flex-shrink-0 grid place-items-center bg-gray-700">
                                <span className="text-gray-300 text-lg">+</span>
                            </div>
                            <span className="ml-3 text-sm text-gray-400">Add team</span>
                        </button>
                    </div>
                </div>
            )}

            {/* Mobile dropdown appears below instead of to the side */}
            {projectDropdownOpen && isMobile && (
                <div className="absolute left-0 right-0 mt-1 bg-gray-800 border border-gray-700 rounded-md shadow-lg z-20">
                    <div className="p-2 border-b border-gray-700">
                        <div className="text-sm font-medium text-gray-300">Teams</div>
                    </div>
                    <div className="max-h-60 overflow-y-auto">
                        {projects.map((project, index) => (
                            <button
                                key={project.id}
                                onClick={() => selectProject(project)}
                                className={`flex items-center w-full p-2 hover:bg-gray-700 transition-colors ${
                                    selectedProject?.id === project.id ? 'bg-gray-700' : ''
                                }`}
                            >
                                <div
                                    className="w-6 h-6 rounded-md flex-shrink-0 grid place-items-center"
                                    style={{ backgroundColor: project.color?.hexColor || '#C74634' }}
                                >
                                    <FiCodesandbox className="text-gray-50 text-xs" />
                                </div>
                                <span className="ml-3 text-sm text-gray-200">{project.projectName}</span>
                                <span className="ml-auto text-xs text-gray-400">#{index + 1}</span>
                            </button>
                        ))}
                    </div>
                    <div className="p-2 border-t border-gray-700">
                        <button className="flex items-center w-full p-2 hover:bg-gray-700 transition-colors rounded">
                            <div className="w-6 h-6 rounded-md flex-shrink-0 grid place-items-center bg-gray-700">
                                <span className="text-gray-300 text-lg">+</span>
                            </div>
                            <span className="ml-3 text-sm text-gray-400">Add team</span>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export const UserSection = ({ user, handleLogout, isOpen = true, isMobile = false }) => {
    return (
        <div className="border-t border-gray-200 mx-4 transition-all mt-4 mb-2">
            <div className="flex items-center h-16">
                <img
                    src="https://external-preview.redd.it/TwU07Lr9HX8Ayouj-4fyQfJBp3XuCyG7I9Q0n8KhF7M.jpg?auto=webp&s=3ab8215d552fd36f052da9aec8aaeaf43e0e2926"
                    alt="User"
                    className="w-8 h-8 rounded-md"
                />
                {(isOpen || isMobile) && (
                    <div className={`ml-3 ${!isMobile ? 'overflow-hidden transition-all duration-300' : ''} ${isOpen || isMobile ? 'opacity-100 w-auto' : 'opacity-0 w-0'}`}>
                        <div className="text-sm font-medium text-black truncate">
                            {user ? `${user.firstName} ${user.lastName}` : 'Usuario'}
                        </div>
                        <div className="text-xs text-gray-600 truncate">
                            {user ? user.email : 'user@example.com'}
                        </div>
                    </div>
                )}
            </div>

            {/* Logout button for full sidebar or mobile */}
            {(isOpen || isMobile) && (
                <button
                    onClick={handleLogout}
                    className="flex items-center w-full py-2 px-3 mb-6 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                    <LogOut size={18} className="mr-2" />
                    <span>Cerrar sesión</span>
                </button>
            )}

            {/* Icon-only logout for collapsed sidebar */}
            {!isOpen && !isMobile && (
                <button
                    onClick={handleLogout}
                    className="flex justify-center w-full py-2 mb-6 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Cerrar sesión"
                >
                    <LogOut size={20} />
                </button>
            )}
        </div>
    );
};
