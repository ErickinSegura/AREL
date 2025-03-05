import React, { useState, useRef, useEffect } from 'react';
import { ChevronRight, Home, ListChecks, Clock, Calendar, Link, Settings } from 'lucide-react';

const Sidebar = ({
                     defaultOpen = false,
                     accentColor = "#e74c3c",
                     defaultSelected = "Overview"
                 }) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);
    const [selectedItem, setSelectedItem] = useState(defaultSelected);
    const sidebarRef = useRef(null);
    const timerRef = useRef(null);

    const menuItems = [
        { icon: <Home size={20} />, label: 'Overview', hasSubmenu: true },
        { icon: <ListChecks size={20} />, label: 'Backlog', hasSubmenu: true },
        { icon: <Clock size={20} />, label: 'Sprints', hasSubmenu: true },
        { icon: <Calendar size={20} />, label: 'Calendar', hasSubmenu: true },
        { icon: <Link size={20} />, label: 'Shortcuts', hasSubmenu: true },
        { icon: <Settings size={20} />, label: 'Settings', hasSubmenu: true },
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
                            <div className="w-8 h-8 bg-red-500 rounded-md flex-shrink-0 grid place-items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-white" viewBox="0 0 24 24">
                                    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                                </svg>
                            </div>

                            <div className={`overflow-hidden transition-all duration-300 ${isOpen ? 'opacity-100 w-auto' : 'opacity-0 w-0'}`}>
                                <div className="text-base font-medium text-black truncate">Project Name</div>
                                <div className="text-sm text-gray-500 truncate">Team Name</div>
                            </div>
                        </div>
                    </div>

                </div>

                {/* Menu Items */}
                <div className="border-t border-gray-700 mx-4 transition-all my-4"/>
                <nav className="flex-1">
                    <ul>
                        {menuItems.map((item, index) => (
                            <li key={index} className="relative">
                                <button
                                    onClick={() => setSelectedItem(item.label)}
                                    className="flex items-center w-full h-12 hover:bg-gray-800 transition-colors duration-200 group"
                                >
                                    {selectedItem === item.label && (
                                        <div
                                            className="absolute inset-0 rounded-md bg-opacity-10"
                                            style={{ backgroundColor: accentColor }}
                                        />
                                    )}

                                    <div className="w-16 flex-shrink-0 grid place-items-center ">
                                        <span className={`transition-colors ${selectedItem === item.label ? 'text-white' : 'text-black'}`}>
                                            {item.icon}
                                        </span>
                                    </div>

                                    <div className={`flex-1 flex items-center overflow-hidden transition-all duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 w-0'}`}>
                                        <span className={`text-sm ${selectedItem === item.label ? 'text-white' : 'text-black'}`}>
                                            {item.label}
                                        </span>
                                        {item.hasSubmenu && (
                                            <ChevronRight size={16} className="ml-auto mr-4 min-w-4" />
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