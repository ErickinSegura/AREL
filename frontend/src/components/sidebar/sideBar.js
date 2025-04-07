import React, { useState, useRef, useEffect } from 'react';
import { ChevronRight, Menu, X, LogOut, ChevronDown } from 'lucide-react';
import { FiCloudLightning, FiHome, FiSettings, FiTable, FiCalendar, FiLink, FiCodesandbox, FiUsers, FiActivity, FiBarChart2, FiTrendingUp, FiLock, FiFolder } from "react-icons/fi";
import { useRoute } from '../../contexts/RouteContext';
import { useAuth } from '../../contexts/AuthContext';
import { useProjects } from '../../hooks/useProjects';
import { routes } from '../../routes';

const Sidebar = ({
                     defaultOpen = false,
                     accentColor = "#C74634",
                     defaultSelected = "Overview"
                 }) => {
    const { setCurrentRoute } = useRoute();
    const { user, logout } = useAuth();
    const { projects, selectedProject: contextSelectedProject, setSelectedProject } = useProjects();
    const [isOpen, setIsOpen] = useState(defaultOpen);
    const [selectedItem, setSelectedItem] = useState(defaultSelected);
    const [isMobile, setIsMobile] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [projectDropdownOpen, setProjectDropdownOpen] = useState(false);
    const sidebarRef = useRef(null);
    const timerRef = useRef(null);
    const projectDropdownRef = useRef(null);

    // Use the selectedProject from context rather than keeping local state
    useEffect(() => {
        if (projects && projects.length > 0 && !contextSelectedProject) {
            setSelectedProject(projects[0]);
        }
    }, [projects, contextSelectedProject, setSelectedProject]);

    // Cerrar el dropdown cuando la sidebar se colapsa
    useEffect(() => {
        if (!isOpen) {
            setProjectDropdownOpen(false);
        }
    }, [isOpen]);

    const getMenuItemsByRole = () => {
        const commonItems = [
            { icon: <FiHome size={20} />, label: 'Overview', hasSubmenu: true },
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

        const userRole = user?.userLevel || 2;

        return [
            ...commonItems,
            ...(roleSpecificItems[userRole] || []),
            ...additionalItems
        ];
    };

    const menuItems = getMenuItemsByRole();

    const handleMouseEnter = () => {
        if (!isMobile) {
            clearTimeout(timerRef.current);
            timerRef.current = setTimeout(() => {
                setIsOpen(true);
            }, 200);
        }
    };

    const handleMouseLeave = () => {
        if (!isMobile) {
            clearTimeout(timerRef.current);
            timerRef.current = setTimeout(() => {
                setIsOpen(false);
            }, 200);
        }
    };

    const handleLogout = () => {
        logout();
    };

    const toggleProjectDropdown = (e) => {
        e.stopPropagation();
        setProjectDropdownOpen(!projectDropdownOpen);
    };

    const selectProject = (project) => {
        // Use context function to update the global selected project
        setSelectedProject(project);
        setProjectDropdownOpen(false);
    };

    // Cerrar el dropdown cuando se hace clic fuera de él
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (projectDropdownRef.current && !projectDropdownRef.current.contains(event.target)) {
                setProjectDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            clearTimeout(timerRef.current);
        };
    }, []);

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 768) {
                setIsMobile(true);
                setIsOpen(false);
            } else {
                setIsMobile(false);
                setMobileMenuOpen(false);
            }
        };

        // Initial check
        handleResize();

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        const route = routes.find(r => r.label === selectedItem);
        if (route) {
            setCurrentRoute(route.path);
        }
    }, [selectedItem, setCurrentRoute]);

    useEffect(() => {
        // Disable body scroll when mobile menu is open
        if (mobileMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }

        return () => {
            document.body.style.overflow = '';
        };
    }, [mobileMenuOpen]);

    const toggleMobileMenu = () => {
        setMobileMenuOpen(!mobileMenuOpen);
    };

    // Obtener un icono basado en el nombre del icono del proyecto
    const getProjectIcon = (iconName) => {
        switch (iconName) {
            case 'folder': return <FiFolder />;
            case 'codesandbox': return <FiCodesandbox />;
            // Añadir más casos para otros iconos
            default: return <FiCodesandbox />;
        }
    };

    // Componente para renderizar el selector de proyectos
    const ProjectSelector = ({ isMobile = false }) => {
        if (!contextSelectedProject) return null;

        return (
            <div ref={projectDropdownRef} className="relative w-full">
                <button
                    onClick={toggleProjectDropdown}
                    className={`flex items-center gap-x-2 w-full ${isMobile ? 'py-2' : ''} hover:bg-gray-200 rounded-md transition-colors px-2`}
                >
                    <div
                        className="w-8 h-8 rounded-md flex-shrink-0 grid place-items-center"
                        style={{ backgroundColor: contextSelectedProject.color?.hexColor || '#ff0000' }}
                    >
                        {getProjectIcon(contextSelectedProject.icon?.iconName)}
                    </div>


                    <div className={`flex-1 overflow-hidden transition-all duration-300 ${!isMobile && !isOpen ? 'opacity-0 w-0' : 'opacity-100'}`}>
                        <div className="text-base font-medium text-black truncate flex items-center">
                            <span className="truncate max-w-32">{contextSelectedProject.projectName}</span>
                            <ChevronDown size={16} className="ml-1 flex-shrink-0" />
                        </div>
                    </div>
                </button>

                {/* Dropdown de proyectos */}
                {projectDropdownOpen && (
                    <div className={`absolute ${isMobile ? 'left-0' : isOpen ? 'left-0 right-0' : 'left-14'} top-full mt-1 bg-white rounded-md shadow-lg z-50 py-1 max-h-60 overflow-y-auto w-64`}>
                        <div className="text-xs text-gray-500 px-3 py-1 uppercase">Proyectos</div>
                        {projects && projects.map((project) => (
                            <button
                                key={project.id}
                                onClick={() => selectProject(project)}
                                className={`flex items-center gap-x-3 px-3 py-2 w-full text-left hover:bg-gray-100 ${
                                    contextSelectedProject.id === project.id ? 'bg-gray-100' : ''
                                }`}
                            >
                                <div
                                    className="w-6 h-6 rounded flex-shrink-0 grid place-items-center"
                                    style={{ backgroundColor: project.color?.hexColor || '#808080' }}
                                >
                                    {getProjectIcon(project.icon?.iconName)}
                                </div>
                                <span className="text-sm truncate">{project.projectName}</span>
                            </button>
                        ))}
                    </div>
                )}
            </div>
        );
    };

    // Mobile top navigation bar
    if (isMobile) {
        return (
            <>
                <div className="fixed top-0 left-0 right-0 bg-white shadow-md z-20 h-16">
                    <div className="flex items-center justify-between px-4 h-full">
                        <div className="flex items-center gap-x-4">
                            <button
                                onClick={toggleMobileMenu}
                                className="p-2 rounded-md hover:bg-gray-100 transition-colors focus:outline-none"
                                aria-label="Toggle menu"
                            >
                                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                            </button>
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
                    className={`fixed left-0 top-0 bottom-0 w-64 bg-white shadow-xl z-40 transform transition-transform duration-300 ease-in-out ${
                        mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
                    }`}
                >
                    <div className="px-4 py-4 h-14 border-b border-gray-200 flex items-center">
                        <div className="flex-1 min-w-0">
                            <ProjectSelector isMobile={true} />
                        </div>
                        <button
                            onClick={toggleMobileMenu}
                            className="ml-2 p-1 rounded-md hover:bg-gray-100 transition-colors focus:outline-none flex-shrink-0"
                            aria-label="Close menu"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    <nav className="h-full flex flex-col">
                        <ul className="flex-1 py-2">
                            {menuItems.map((item, index) => (
                                <li
                                    key={index}
                                    className="relative mx-2 my-1"
                                >
                                    {selectedItem === item.label && (
                                        <div
                                            className="absolute inset-0 rounded-lg transition-all duration-300"
                                            style={{ backgroundColor: accentColor }}>
                                        </div>
                                    )}

                                    <button
                                        onClick={() => {
                                            setSelectedItem(item.label);
                                            setMobileMenuOpen(false);
                                        }}
                                        className="flex items-center w-full h-12 rounded-lg transition-all duration-200 relative z-10 group px-4 hover:bg-gray-100"
                                    >
                                        <span className={`transition-colors ${
                                            selectedItem === item.label
                                                ? 'text-white'
                                                : 'text-black group-hover:text-gray-700'
                                        }`}>
                                            {item.icon}
                                        </span>

                                        <span className={`ml-4 text-sm font-medium ${
                                            selectedItem === item.label
                                                ? 'text-white'
                                                : 'text-black group-hover:text-gray-700'
                                        }`}>
                                            {item.label}
                                        </span>

                                        {item.hasSubmenu && (
                                            <ChevronRight
                                                size={16}
                                                className={`ml-auto ${
                                                    selectedItem === item.label
                                                        ? 'text-white'
                                                        : 'text-black group-hover:text-gray-700'
                                                }`}
                                            />
                                        )}
                                    </button>
                                </li>
                            ))}
                        </ul>

                        {/* User Section */}
                        <div className="border-t border-gray-200 mx-4 mt-4 mb-2">
                            <div className="flex items-center h-16">
                                <img
                                    src="https://external-preview.redd.it/TwU07Lr9HX8Ayouj-4fyQfJBp3XuCyG7I9Q0n8KhF7M.jpg?auto=webp&s=3ab8215d552fd36f052da9aec8aaeaf43e0e2926"
                                    alt="User"
                                    className="w-8 h-8 rounded-md"
                                />
                                <div className="ml-3 flex-1 min-w-0">
                                    <div className="text-sm font-medium text-black truncate">
                                        {user ? `${user.firstName} ${user.lastName}` : 'Usuario'}
                                    </div>
                                    <div className="text-xs text-gray-600 truncate">
                                        {user ? user.email : 'user@example.com'}
                                    </div>
                                </div>
                            </div>
                            {/* Botón de logout para móvil */}
                            <button
                                onClick={handleLogout}
                                className="flex items-center w-full py-2 px-3 mb-8 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            >
                                <LogOut size={18} className="mr-2" />
                                <span>Cerrar sesión</span>
                            </button>
                        </div>
                    </nav>
                </div>

                {/* Content padding for fixed header */}
                <div className="h-16" />
            </>
        );
    }

    // Desktop sidebar
    return (
        <div
            ref={sidebarRef}
            className={`h-screen bg-gray-100 transition-all duration-300 ease-out flex flex-col fixed md:relative z-10
                ${isOpen ? 'w-64' : 'w-16'}`}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            {/* Project Section */}
            <div className="flex flex-col h-full">
                <div className={`px-4 py-4 transition-all duration-300 h-16`}>
                    <div className={`relative h-12 transition-all duration-300 ${isOpen ? '' : 'justify-center'}`}>
                        {isOpen ? (
                            <ProjectSelector />
                        ) : (
                            <div className="flex items-center gap-x-4">
                                <div
                                    className="w-8 h-8 rounded-md flex-shrink-0 grid place-items-center"
                                    style={{ backgroundColor: contextSelectedProject?.color?.hexColor || '#ff0000' }}
                                >
                                    {getProjectIcon(contextSelectedProject?.icon?.iconName)}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div className="border-t border-gray-700 mx-4 transition-all my-4"/>
                <nav className="flex-1">
                    <ul>
                        {menuItems.map((item, index) => (
                            <li key={index} className="relative">
                                {selectedItem === item.label && (
                                    <div
                                        className="absolute inset-1.5 rounded-lg"
                                        style={{ backgroundColor: accentColor }}>
                                    </div>
                                )}

                                <button
                                    onClick={() => setSelectedItem(item.label)}
                                    className={`flex items-center w-full h-12 rounded-md transition-colors duration-200 relative z-10 group`}
                                >
                                    <div className="w-16 flex-shrink-0 grid place-items-center">
                                        <span className={`transition-colors ${
                                            selectedItem === item.label
                                                ? 'text-white'
                                                : 'text-black group-hover:text-gray-500'
                                        }`}>
                                            {item.icon}
                                        </span>
                                    </div>

                                    <div className={`flex-1 flex items-center overflow-hidden transition-all duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 w-0'}`}>
                                        <span className={`text-sm ${
                                            selectedItem === item.label
                                                ? 'text-white'
                                                : 'text-black group-hover:text-gray-500'
                                        }`}>
                                            {item.label}
                                        </span>

                                        {item.hasSubmenu && (
                                            <ChevronRight
                                                size={16}
                                                className={`ml-auto mr-4 min-w-4 ${
                                                    selectedItem === item.label
                                                        ? 'text-white'
                                                        : 'text-black group-hover:text-gray-500'
                                                }`}
                                            />
                                        )}
                                    </div>
                                </button>
                            </li>
                        ))}
                    </ul>
                </nav>

                {/* User Section con botón de logout */}
                <div className="border-t border-gray-700 mx-4 transition-all mt-4 mb-2">
                    <div className="flex items-center h-16">
                        <img
                            src="https://external-preview.redd.it/TwU07Lr9HX8Ayouj-4fyQfJBp3XuCyG7I9Q0n8KhF7M.jpg?auto=webp&s=3ab8215d552fd36f052da9aec8aaeaf43e0e2926"
                            alt="User"
                            className="w-8 h-8 rounded-md"
                        />
                        <div className={`ml-3 overflow-hidden transition-all duration-300 ${isOpen ? 'opacity-100 w-auto' : 'opacity-0 w-0'}`}>
                            <div className="text-sm font-medium text-black truncate">
                                {user ? `${user.firstName} ${user.lastName}` : 'Usuario'}
                            </div>
                            <div className="text-xs text-gray-600 truncate">
                                {user ? user.email : 'user@example.com'}
                            </div>
                        </div>
                    </div>

                    {/* Botón de logout para escritorio */}
                    {isOpen && (
                        <button
                            onClick={handleLogout}
                            className="flex items-center w-full py-2 px-3 mb-6 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                            <LogOut size={18} className="mr-2" />
                            <span>Cerrar sesión</span>
                        </button>
                    )}

                    {/* Ícono de logout cuando la barra está colapsada */}
                    {!isOpen && (
                        <button
                            onClick={handleLogout}
                            className="flex justify-center w-full py-2 mb-6 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Cerrar sesión"
                        >
                            <LogOut size={20} />
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Sidebar;