import React, { useState, useRef, useEffect } from 'react';
import { ChevronRight } from 'lucide-react';
import { FiCloudLightning, FiHome, FiSettings, FiTable, FiCalendar, FiLink, FiCodesandbox } from "react-icons/fi";
import { useRoute } from '../../contexts/RouteContext';
import { routes } from '../../routes';

const Sidebar = ({
                     defaultOpen = false,
                     accentColor = "#C74634",
                     defaultSelected = "Overview"
                 }) => {
    const { setCurrentRoute } = useRoute();
    const [isOpen, setIsOpen] = useState(defaultOpen);
    const [selectedItem, setSelectedItem] = useState(defaultSelected);
    const sidebarRef = useRef(null);
    const timerRef = useRef(null);

    const menuItems = [
        { icon: <FiHome size={20} />, label: 'Overview', hasSubmenu: true },
        { icon: <FiTable size={20} />, label: 'Backlog', hasSubmenu: true },
        { icon: <FiCloudLightning size={20} />, label: 'Sprints', hasSubmenu: true },
        { icon: <FiCalendar size={20} />, label: 'Calendar', hasSubmenu: true },
        { icon: <FiLink size={20} />, label: 'Shortcuts', hasSubmenu: true },
        { icon: <FiSettings size={20} />, label: 'Settings', hasSubmenu: true },
    ];

    const handleMouseEnter = () => {
        clearTimeout(timerRef.current);
        timerRef.current = setTimeout(() => {
            setIsOpen(true);
        }, 200);
    };

    const handleMouseLeave = () => {
        clearTimeout(timerRef.current);
        timerRef.current = setTimeout(() => {
            setIsOpen(false);
        }, 200);
    };

    useEffect(() => {
        return () => clearTimeout(timerRef.current);
    }, []);

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 768) setIsOpen(false);
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        const route = routes.find(r => r.label === selectedItem);
        if (route) {
            setCurrentRoute(route.path);
        }
    }, [selectedItem, setCurrentRoute]);

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
                        <div className="flex items-center gap-x-4">
                            <div className="w-8 h-8 bg-red-800 rounded-md flex-shrink-0 grid place-items-center">
                                <FiCodesandbox className="text-gray-50"/>
                            </div>

                            <div className={`overflow-hidden transition-all duration-300 ${isOpen ? 'opacity-100 w-auto' : 'opacity-0 w-0'}`}>
                                <div className="text-base font-medium text-black truncate">Project Name</div>
                                <div className="text-sm text-gray-500 truncate">Team Name</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="border-t border-gray-700 mx-4 transition-all my-4"/>
                <nav className="flex-1">
                    <ul>
                        {menuItems.map((item, index) => (
                            <li key={index} className="relative">
                                {selectedItem === item.label && (
                                    <div
                                        className={'absolute inset-1.5 rounded-lg transition-all duration-300 '}
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

                {/* User Section */}
                <div className={`border-t border-gray-700 mx-4 transition-all my-4`}>
                    <div className="flex items-center h-16">
                        <img
                            src="https://external-preview.redd.it/TwU07Lr9HX8Ayouj-4fyQfJBp3XuCyG7I9Q0n8KhF7M.jpg?auto=webp&s=3ab8215d552fd36f052da9aec8aaeaf43e0e2926"
                            alt="User"
                            className="w-8 h-8 rounded-md"
                        />
                        <div className={`ml-3 overflow-hidden transition-all duration-300 ${isOpen ? 'opacity-100 w-auto' : 'opacity-0 w-0'}`}>
                            <div className="text-sm font-medium text-black truncate">Username</div>
                            <div className="text-xs text-gray-600 truncate">user@oracle.com</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;