import React, { useState, useRef, useEffect } from 'react';
import { ChevronRight, Menu, X, LogOut, ChevronDown, Plus, Check, User } from 'lucide-react';
import {
    FiCloudLightning,
    FiHome,
    FiSettings,
    FiTable,
    FiLink,
    FiCodesandbox,
    FiUsers,
    FiFolder,
    FiLoader, FiCode, FiFileText, FiStar, FiBookmark, FiChevronDown,
} from "react-icons/fi";
import { useRoute } from '../../contexts/RouteContext';
import { useAuth } from '../../contexts/AuthContext';
import { useProjects } from '../../hooks/useProjects';
import { useSidebar } from '../../hooks/useSidebar';
import { routes } from '../../routes';
import { Modal, ModalHeader, ModalTitle, ModalContent, ModalClose } from '../../lib/ui/Modal';
import { Input } from '../../lib/ui/Input';
import { Button } from '../../lib/ui/Button';
import {createPortal} from "react-dom";
import {AvatarRenderer} from "../../lib/AvatarRenderer";

const ModalPortal = ({ children }) => {
    return typeof document !== 'undefined'
        ? createPortal(children, document.body)
        : null;
};

const DropdownPortal = ({ children, isOpen }) => {
    if (!isOpen || typeof document === 'undefined') return null;
    return createPortal(children, document.body);
};

// Modifica tu componente para usar el portal en los dropdowns:
const AddProjectModal = ({ isOpen, onClose }) => {
    const { addProject } = useProjects();
    const [projectName, setProjectName] = useState('');
    const [description, setDescription] = useState('');
    const [colorId, setColorId] = useState(1);
    const [iconId, setIconId] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const colorMenuRef = useRef(null);
    const iconMenuRef = useRef(null);
    const [isColorMenuOpen, setIsColorMenuOpen] = useState(false);
    const [isIconMenuOpen, setIsIconMenuOpen] = useState(false);

    // Para posicionar los dropdowns correctamente
    const [colorButtonRect, setColorButtonRect] = useState(null);
    const [iconButtonRect, setIconButtonRect] = useState(null);

    const iconOptions = [
        { id: 1, icon: <FiFolder size={24} />, label: 'Folder' },
        { id: 2, icon: <FiCodesandbox size={24} />, label: 'Codesandbox' },
        { id: 3, icon: <FiCode size={24} />, label: 'Code' },
        { id: 4, icon: <FiFileText size={24} />, label: 'Document' },
        { id: 5, icon: <FiStar size={24} />, label: 'Star' },
        { id: 6, icon: <FiBookmark size={24} />, label: 'Bookmark' },
    ];

    const colorOptions = [
        { id: 1, hex: '4984B8', name: 'Light Blue' },
        { id: 2, hex: '2E6F40', name: 'Green' },
        { id: 3, hex: 'E63946', name: 'Red' },
        { id: 4, hex: 'FFBE0B', name: 'Yellow' },
        { id: 5, hex: '8338EC', name: 'Purple' },
        { id: 6, hex: 'FF006E', name: 'Pink' },
        { id: 7, hex: '3A86FF', name: 'Blue' },
    ];

    useEffect(() => {
        const handleOutsideClick = (event) => {
            if (colorMenuRef.current && !colorMenuRef.current.contains(event.target)) {
                setIsColorMenuOpen(false);
            }
            if (iconMenuRef.current && !iconMenuRef.current.contains(event.target)) {
                setIsIconMenuOpen(false);
            }
        };

        document.addEventListener('mousedown', handleOutsideClick);
        return () => {
            document.removeEventListener('mousedown', handleOutsideClick);
        };
    }, []);

    const getSelectedIcon = () => {
        return iconOptions.find(icon => icon.id === iconId) || iconOptions[0];
    };

    const getSelectedColor = () => {
        return colorOptions.find(color => color.id === colorId) || colorOptions[0];
    };

    const resetForm = () => {
        setProjectName('');
        setDescription('');
        setColorId(1);
        setIconId(1);
        setIsColorMenuOpen(false);
        setIsIconMenuOpen(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const projectData = {
                name: projectName,
                description: description,
                colorId: colorId,
                iconId: iconId
            };

            await addProject(projectData);
            resetForm();
            onClose();
        } catch (error) {
            console.error("Error adding project:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleColorMenuToggle = () => {
        if (colorMenuRef.current) {
            const rect = colorMenuRef.current.getBoundingClientRect();
            setColorButtonRect(rect);
        }
        setIsColorMenuOpen(!isColorMenuOpen);
        setIsIconMenuOpen(false);
    };

    const handleIconMenuToggle = () => {
        if (iconMenuRef.current) {
            const rect = iconMenuRef.current.getBoundingClientRect();
            setIconButtonRect(rect);
        }
        setIsIconMenuOpen(!isIconMenuOpen);
        setIsColorMenuOpen(false);
    };

    return (
        <ModalPortal>
            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalHeader>
                    <ModalTitle>Add New Project</ModalTitle>
                    <ModalClose onClick={onClose} />
                </ModalHeader>
                <ModalContent>
                    <form onSubmit={handleSubmit}>
                        <div className="space-y-4">
                            <Input
                                label="Project Name"
                                name="projectName"
                                value={projectName}
                                onChange={(e) => setProjectName(e.target.value)}
                                placeholder="Enter project name"
                                required
                            />

                            <div className="flex flex-col gap-1">
                                <label className="text-sm font-medium text-gray-700">
                                    Description
                                </label>
                                <textarea
                                    name="description"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder="Enter project description"
                                    className="px-4 py-2 border rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-oracleRed"
                                    rows={3}
                                />
                            </div>

                            <div className="flex flex-col gap-4">
                                {/* Color Selector */}
                                <div className="w-full">
                                    <label className="text-sm font-medium text-gray-700 block mb-2">
                                        Project Color
                                    </label>
                                    <div ref={colorMenuRef} className="relative">
                                        <button
                                            type="button"
                                            className="flex items-center justify-between w-full px-4 py-3 border rounded-lg bg-white hover:bg-gray-50 transition-colors"
                                            onClick={handleColorMenuToggle}
                                            aria-expanded={isColorMenuOpen}
                                            aria-haspopup="true"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div
                                                    className="w-6 h-6 rounded-full shadow-sm"
                                                    style={{ backgroundColor: `#${getSelectedColor().hex}` }}
                                                    aria-hidden="true"
                                                ></div>
                                                <span className="text-sm font-medium">
                                                    {getSelectedColor().name}
                                                </span>
                                            </div>
                                            <FiChevronDown
                                                className={`transition-transform duration-200 ${isColorMenuOpen ? 'transform rotate-180' : ''}`}
                                            />
                                        </button>
                                    </div>
                                </div>

                                {/* Icon Selector */}
                                <div className="w-full">
                                    <label className="text-sm font-medium text-gray-700 block mb-2">
                                        Project Icon
                                    </label>
                                    <div ref={iconMenuRef} className="relative">
                                        <button
                                            type="button"
                                            className="flex items-center justify-between w-full px-4 py-3 border rounded-lg bg-white hover:bg-gray-50 transition-colors"
                                            onClick={handleIconMenuToggle}
                                            aria-expanded={isIconMenuOpen}
                                            aria-haspopup="true"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="text-gray-700 bg-gray-100 p-2 rounded-lg">
                                                    {getSelectedIcon().icon}
                                                </div>
                                                <span className="text-sm font-medium">{getSelectedIcon().label}</span>
                                            </div>
                                            <FiChevronDown
                                                className={`transition-transform duration-200 ${isIconMenuOpen ? 'transform rotate-180' : ''}`}
                                            />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-6 flex justify-end gap-3">
                            <Button
                                variant="default"
                                onClick={onClose}
                                type="button"
                            >
                                Cancel
                            </Button>
                            <Button
                                variant="remarked"
                                type="submit"
                                disabled={isSubmitting || !projectName}
                            >
                                {isSubmitting ? (
                                    <div className="flex items-center gap-2">
                                        <span className="animate-spin"><FiLoader size={16} /></span>
                                        <span>Adding...</span>
                                    </div>
                                ) : (
                                    'Add Project'
                                )}
                            </Button>
                        </div>
                    </form>
                </ModalContent>
            </Modal>

            {/* Color Dropdown Portal */}
            <DropdownPortal isOpen={isColorMenuOpen}>
                <div
                    className="fixed z-50 bg-white border rounded-lg shadow-lg p-3 max-h-64 overflow-y-auto"
                    style={{
                        top: colorButtonRect ? colorButtonRect.bottom + window.scrollY + 4 : 0,
                        left: colorButtonRect ? colorButtonRect.left + window.scrollX : 0,
                        width: colorButtonRect ? colorButtonRect.width : 'auto',
                    }}
                >
                    <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">
                        {colorOptions.map((color) => (
                            <button
                                key={color.id}
                                type="button"
                                className={`w-full aspect-square rounded-full flex items-center justify-center p-1 transition-all hover:scale-110 ${
                                    colorId === color.id ? 'ring-2 ring-offset-2 ring-oracleRed' : ''
                                }`}
                                style={{ backgroundColor: `#${color.hex}` }}
                                onClick={() => {
                                    setColorId(color.id);
                                    setIsColorMenuOpen(false);
                                }}
                                title={color.name}
                                aria-label={`Select ${color.name} color`}
                            >
                                {colorId === color.id && (
                                    <Check size={16} className="text-white" />
                                )}
                            </button>
                        ))}
                    </div>
                </div>
            </DropdownPortal>

            {/* Icon Dropdown Portal */}
            <DropdownPortal isOpen={isIconMenuOpen}>
                <div
                    className="fixed z-50 bg-white border rounded-lg shadow-lg p-3 max-h-64 overflow-y-auto"
                    style={{
                        top: iconButtonRect ? iconButtonRect.bottom + window.scrollY + 4 : 0,
                        left: iconButtonRect ? iconButtonRect.left + window.scrollX : 0,
                        width: iconButtonRect ? iconButtonRect.width : 'auto',
                    }}
                >
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {iconOptions.map((option) => (
                            <button
                                key={option.id}
                                type="button"
                                className={`flex items-center gap-2 p-3 rounded-lg w-full transition-colors ${
                                    iconId === option.id
                                        ? 'bg-gray-100 ring-2 ring-oracleRed text-oracleRed'
                                        : 'hover:bg-gray-50'
                                }`}
                                onClick={() => {
                                    setIconId(option.id);
                                    setIsIconMenuOpen(false);
                                }}
                                aria-label={`Select ${option.label} icon`}
                            >
                                <div className={`${iconId === option.id ? 'text-oracleRed' : 'text-gray-700'}`}>
                                    {option.icon}
                                </div>
                                <span className="text-sm">{option.label}</span>
                            </button>
                        ))}
                    </div>
                </div>
            </DropdownPortal>
        </ModalPortal>
    );
};

const ProjectSelector = ({ isOpen, isMobile, projectDropdownOpen, toggleProjectDropdown, contextSelectedProject, projects, selectProject }) => {
    const projectDropdownRef = useRef(null);
    const { user } = useAuth();
    const { loading: projectsLoading } = useProjects();
    const userRole = user?.userLevel || 2;
    const [isAddProjectModalOpen, setIsAddProjectModalOpen] = useState(false);
    const [userProjects, setUserProjects] = useState([]);
    const [loadingUserProjects, setLoadingUserProjects] = useState(false);

    const userProject = user?.projectId && projects
        ? projects.find(project => project.id === user.projectId)
        : null;

    useEffect(() => {
        const fetchUserProjects = async () => {
            if (userRole === 1 && user?.id) {
                setLoadingUserProjects(true);
                try {

                    const { UserService } = await import('../../api/userService');
                    const userProjectsData = await UserService.getProjectsByUser(user.id);
                    setUserProjects(userProjectsData);
                } catch (error) {
                    console.error('Error fetching user projects:', error);
                    setUserProjects([]);
                } finally {
                    setLoadingUserProjects(false);
                }
            }
        };

        fetchUserProjects();
    }, [user?.id, userRole]);

    const getAvailableProjects = () => {
        if (!projects) return [];

        switch (userRole) {
            case 1:
                const userProjectIds = userProjects.map(up => up.projectId);
                return projects.filter(project => userProjectIds.includes(project.id));

            case 2:
                return [];

            case 3:
                return projects;

            default:
                return [];
        }
    };

    const availableProjects = getAvailableProjects();

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (projectDropdownRef.current && !projectDropdownRef.current.contains(event.target)) {
                toggleProjectDropdown(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [toggleProjectDropdown]);

    const getProjectIcon = (iconID) => {
        switch (iconID) {
            case 1: return <FiFolder />;
            case 2: return <FiCodesandbox />;
            case 3: return <FiCode />;
            case 4: return <FiFileText />;
            case 5: return <FiStar />;
            case 6: return <FiBookmark />;
            default: return <FiCodesandbox />;
        }
    };

    if (projectsLoading || (userRole === 1 && loadingUserProjects)) {
        return (
            <div className="w-full">
                <div className={`flex items-center ${
                    !isMobile && !isOpen ? 'justify-center' : ''
                } w-full ${isMobile ? 'py-2' : 'py-1.5'} rounded-lg transition-all duration-300`}>
                    <div
                        className="w-8 h-8 rounded-lg flex-shrink-0 grid place-items-center transition-all duration-300 text-white bg-gray-300"
                    >
                        <FiLoader className="animate-spin" />
                    </div>

                    <div className={`flex-1 overflow-hidden transition-all duration-300 ease-in-out ${
                        !isOpen && !isMobile ? 'w-0 opacity-0' : 'w-full opacity-100 ml-2'
                    }`}>
                        <div className="text-base font-medium text-gray-400 truncate">
                            <span className="truncate w-full">Loading Projects...</span>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    const noProjectContainerClass = `flex items-center ${
        !isMobile && !isOpen ? 'justify-center' : ''
    } w-full ${isMobile ? 'py-2' : 'py-1.5'} rounded-lg transition-all duration-300`;

    if (userRole === 2) {
        if (!userProject) {
            return (
                <div className="w-full">
                    <div className={noProjectContainerClass}>
                        <div
                            className="w-8 h-8 rounded-lg flex-shrink-0 grid place-items-center transition-all duration-300 text-white bg-gray-400"
                        >
                            <FiFolder />
                        </div>

                        <div className={`flex-1 overflow-hidden transition-all duration-300 ease-in-out ${
                            !isOpen && !isMobile ? 'w-0 opacity-0' : 'w-full opacity-100 ml-2'
                        }`}>
                            <div className="text-base font-medium text-gray-500 truncate">
                                <span className="truncate w-full">No project assigned</span>
                            </div>
                        </div>
                    </div>
                </div>
            );
        }

        return (
            <div className="w-full">
                <div
                    className={`flex items-center ${
                        !isMobile && !isOpen ? 'justify-center' : ''
                    } w-full ${isMobile ? 'py-2' : 'py-1.5'} rounded-lg transition-all duration-300`}
                >
                    <div
                        className="w-8 h-8 rounded-lg flex-shrink-0 grid place-items-center transition-all duration-300 text-white"
                        style={{ backgroundColor: userProject.color?.hexColor || '#4e4e4e' }}
                    >
                        {getProjectIcon(userProject.icon? userProject.icon : 1)}
                    </div>

                    <div className={`flex-1 overflow-hidden transition-all duration-300 ease-in-out ${
                        !isOpen && !isMobile ? 'w-0 opacity-0' : 'w-full opacity-100 ml-2'
                    }`}>
                        <div className="text-base font-medium text-black truncate">
                            <span className="truncate w-full">{userProject.projectName}</span>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (!availableProjects || availableProjects.length === 0) {
        return (
            <div className="w-full">
                <div className={noProjectContainerClass}>
                    <div
                        className="w-8 h-8 rounded-lg flex-shrink-0 grid place-items-center transition-all duration-300 text-white bg-gray-400"
                    >
                        <FiFolder />
                    </div>

                    <div className={`flex-1 overflow-hidden transition-all duration-300 ease-in-out ${
                        !isOpen && !isMobile ? 'w-0 opacity-0' : 'w-full opacity-100 ml-2'
                    }`}>
                        <div className="text-base font-medium text-gray-500 truncate">
                            <span className="truncate w-full">
                                {userRole === 1 ? 'No projects assigned' : 'No hay proyectos disponibles'}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Add Project Modal */}
                <AddProjectModal
                    isOpen={isAddProjectModalOpen}
                    onClose={() => setIsAddProjectModalOpen(false)}
                />

                {/* Add Project Button - Solo para rango 3 (admin) */}
                {userRole === 3 && (
                    <button
                        onClick={() => setIsAddProjectModalOpen(true)}
                        className={`flex items-center ${
                            !isMobile && !isOpen ? 'justify-center' : ''
                        } w-full mt-2 py-2 rounded-lg hover:bg-gray-200 transition-all duration-300`}
                    >
                        <div className="w-8 h-8 rounded-lg flex-shrink-0 grid place-items-center text-oracleRed">
                            <Plus size={20}/>
                        </div>
                        <div className={`flex-1 font-medium transition-all duration-300 ease-in-out ${
                            !isOpen && !isMobile ? 'w-0 opacity-0' : 'w-full opacity-100 ml-2'
                        }`}>
                            Add New Project
                        </div>
                    </button>
                )}
            </div>
        );
    }

    if (availableProjects.length === 1) {
        const singleProject = availableProjects[0];
        return (
            <div className="w-full">
                <div
                    className={`flex items-center ${
                        !isMobile && !isOpen ? 'justify-center' : ''
                    } w-full ${isMobile ? 'py-2' : 'py-1.5'} rounded-lg transition-all duration-300`}
                >
                    <div
                        className="w-8 h-8 rounded-lg flex-shrink-0 grid place-items-center transition-all duration-300 text-white"
                        style={{ backgroundColor: singleProject.color?.hexColor || '#4e4e4e' }}
                    >
                        {getProjectIcon(singleProject.icon? singleProject.icon : 1)}
                    </div>

                    <div className={`flex-1 overflow-hidden transition-all duration-300 ease-in-out ${
                        !isOpen && !isMobile ? 'w-0 opacity-0' : 'w-full opacity-100 ml-2'
                    }`}>
                        <div className="text-base font-medium text-black truncate">
                            <span className="truncate w-full">{singleProject.projectName}</span>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div ref={projectDropdownRef} className="relative w-full">
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    toggleProjectDropdown(!projectDropdownOpen);
                }}
                className={`flex items-center ${
                    !isMobile && !isOpen ? 'justify-center' : ''
                } w-full ${isMobile ? 'py-2' : 'py-1.5'} hover:bg-gray-200 rounded-lg transition-all duration-300`}
            >
                <div
                    className="w-8 h-8 rounded-lg flex-shrink-0 grid place-items-center transition-all duration-300 text-white"
                    style={{ backgroundColor: contextSelectedProject?.color?.hexColor || '#4e4e4e' }}
                >
                    {contextSelectedProject
                        ? getProjectIcon(contextSelectedProject.icon? contextSelectedProject.icon : 1)
                        : <FiFolder />
                    }
                </div>

                <div className={`flex-1 overflow-hidden transition-all duration-300 ease-in-out ${
                    !isOpen && !isMobile ? 'w-0 opacity-0' : 'w-full opacity-100 ml-2'
                }`}>
                    <div className="text-base font-medium text-black truncate flex justify-around items-center">
                        <span className="truncate w-5/6">
                            {contextSelectedProject?.projectName || "Select a project"}
                        </span>
                        <ChevronDown size={16} className="ml-1 flex-shrink-0" />
                    </div>
                </div>
            </button>

            {(projectDropdownOpen) && (
                <div className={`absolute left-0 right-0 top-full mt-1 bg-white rounded-lg shadow-lg z-50 py-1 max-h-60 overflow-y-auto w-full`}>
                    <div className="text-xs text-gray-500 px-3 py-1">Projects</div>
                    {availableProjects.map((project) => (
                        <button
                            key={project.id}
                            onClick={() => selectProject(project)}
                            className={`flex items-center gap-x-3 px-3 py-2 w-full text-left hover:bg-gray-100 ${
                                contextSelectedProject?.id === project.id ? 'bg-gray-100' : ''
                            }`}
                        >
                            <div
                                className="w-6 h-6 rounded-lg flex-shrink-0 grid place-items-center text-white"
                                style={{ backgroundColor: project.color?.hexColor || '#808080' }}
                            >
                                {getProjectIcon(project.icon ? project.icon : 1)}
                            </div>
                            <span className="text-sm truncate">{project.projectName}</span>
                        </button>
                    ))}

                    {/* Add Project Button - Solo para rango 3 (admin) */}
                    {userRole === 3 && (
                        <>
                            <div className="border-t border-gray-200 my-1"></div>
                            <button
                                onClick={() => {
                                    toggleProjectDropdown(false);
                                    setIsAddProjectModalOpen(true);
                                }}
                                className="flex items-center gap-x-3 px-3 py-2 w-full text-left hover:bg-gray-100"
                            >
                                <div className="w-6 h-6 rounded flex-shrink-0 grid place-items-center text-oracleRed">
                                    <Plus size={18} />
                                </div>
                                <span className="text-sm font-medium">Add New Project</span>
                            </button>
                        </>
                    )}
                </div>
            )}

            <AddProjectModal
                isOpen={isAddProjectModalOpen}
                onClose={() => setIsAddProjectModalOpen(false)}
            />
        </div>
    );
};

const UserButtonWithDropdown = ({ user, handleLogout, isOpen, isMobile = false, setSelectedItem }) => {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);
    const { setCurrentRoute } = useRoute();

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        if (!isOpen) {
            setDropdownOpen(false);
        }
    }, [isOpen]);

    const goToUserSettings = () => {
        setCurrentRoute('/usersettings');
        setDropdownOpen(false);
        setSelectedItem(null);
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                className="flex items-center h-16"
                onClick={() => setDropdownOpen(!dropdownOpen)}
            >
                <div className="w-8 h-8 rounded-lg overflow-hidden flex-shrink-0">
                    <AvatarRenderer config={user.avatar} className="w-full h-full" />
                </div>
                <div className={`ml-3 ${
                    isMobile
                        ? 'flex-1 min-w-0'
                        : `transition-all duration-300 ${isOpen ? 'opacity-100 max-w-48' : 'opacity-0 max-w-0 ml-0'}`
                }`}>
                    <div className="text-sm font-medium text-black truncate text-left">
                        {user ? `${user.firstName} ${user.lastName}` : 'Usuario'}
                    </div>
                    <div className="text-xs text-gray-600 truncate text-left">
                        {user ? user.email : 'user@example.com'}
                    </div>
                </div>
            </button>

            {/* Improved Dropdown Menu */}
            {dropdownOpen && (
                <div className="absolute bottom-full mb-2 right-0 w-56 bg-white rounded-xl shadow-lg overflow-hidden z-50 border border-gray-200">
                    {/* User Info Header */}
                    <div className="p-4 border-b border-gray-100">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg overflow-hidden flex items-center justify-center">
                                <AvatarRenderer config={user.avatar} className="w-full h-full" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="text-sm font-medium text-gray-900 truncate">
                                    {user ? `${user.firstName} ${user.lastName}` : 'shadon'}
                                </div>
                                <div className="text-xs text-gray-500 truncate">
                                    {user ? user.email : 'm@example.com'}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Menu Items */}
                    <div className="py-2">
                        {/* Account */}
                        <button
                            className="w-full flex items-center gap-3 py-2.5 px-4 text-sm text-gray-700 hover:bg-gray-50 transition-colors group"
                            onClick={goToUserSettings}
                        >
                            <div className="w-5 h-5 flex items-center justify-center">
                                <User size={16} className="text-oracleRed" />
                            </div>
                            <span>Account</span>
                        </button>

                        {/* Separator */}
                        <div className="h-px bg-gray-100 my-2 mx-4"></div>

                        {/* Log out */}
                        <button
                            className="w-full flex items-center gap-3 py-2.5 px-4 text-sm text-gray-700 hover:bg-gray-50 transition-colors group"
                            onClick={() => {
                                setCurrentRoute(null);
                                handleLogout();
                                setDropdownOpen(false);
                            }}
                        >
                            <div className="w-5 h-5 flex items-center justify-center">
                                <LogOut size={16} className="text-oracleRed" />
                            </div>
                            <span>Log out</span>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

const MobileSidebar = ({ mobileMenuOpen, toggleMobileMenu, menuItems, selectedItem, setSelectedItem, accentColor, user, handleLogout, projectSelectorProps }) => {
    return (
        <>
            <div className="fixed top-0 left-0 right-0 bg-white shadow-md z-20 h-16">
                <div className="flex items-center justify-between px-4 h-full">
                    {/* Botón a la izquierda */}
                    <div>
                        <button
                            onClick={toggleMobileMenu}
                            className="p-2 rounded-lg hover:bg-gray-100 transition-colors focus:outline-none"
                            aria-label="Toggle menu"
                        >
                            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>

                    {/* Logo y texto RIFT centrados */}
                    <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center">
                        <img
                            src="/assets/logo.png"
                            alt="Logo"
                            className="h-16"
                        />
                        <span
                            className="font-bold text-xl"
                            style={{ fontFamily: "'Chakra Petch', sans-serif" }}
                        >
            RIFT
        </span>
                    </div>

                    {/* Espacio a la derecha para mantener el balance */}
                    <div className="w-14"></div>
                </div>
            </div>

            <div
                className={`fixed inset-0 bg-black z-30 transition-opacity duration-300 ${
                    mobileMenuOpen ? 'opacity-40' : 'opacity-0 pointer-events-none'
                }`}
                onClick={toggleMobileMenu}
            />

            <div
                className={`fixed left-0 top-0 bottom-0 w-64 bg-white shadow-xl z-40 transform transition-transform duration-300 ease-in-out ${
                    mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
                }`}
            >
                <div className="px-4 py-4 h-14 border-b border-gray-200 flex items-center">
                    <div className="flex-1 min-w-0">
                        <ProjectSelector {...projectSelectorProps} isMobile={true} />
                    </div>
                    <button
                        onClick={toggleMobileMenu}
                        className="ml-2 p-1 rounded-lg hover:bg-gray-100 transition-colors focus:outline-none flex-shrink-0"
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
                                        className="absolute inset-0 rounded-xl transition-all duration-300"
                                        style={{ backgroundColor: accentColor }}>
                                    </div>
                                )}

                                <button
                                    onClick={() => {
                                        setSelectedItem(item.label);
                                        toggleMobileMenu();
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

                    <div className="border-t border-gray-700 mx-4 mt-auto py-4 mb-14">
                        <UserButtonWithDropdown user={user} handleLogout={handleLogout} isMobile={true} isOpen={true} />
                    </div>
                </nav>
            </div>

            <div className="h-16" />
        </>
    );
};

const DesktopSidebar = ({ sidebarRef, isOpen, handleMouseEnter, handleMouseLeave, menuItems, selectedItem, setSelectedItem, accentColor, user, handleLogout, projectSelectorProps }) => {
    return (
        <div
            ref={sidebarRef}
            className={`h-screen bg-gray-100 transition-all duration-300 ease-out flex flex-col fixed md:relative z-10
${isOpen ? 'w-64' : 'w-16'} items-center`}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <div className="flex flex-col h-full w-full">
                {/* Icono en la parte superior con texto RIFT */}
                <div className={`px-4 pt-4 pb-4`}>
                    <div className={`flex items-center ${!isOpen ? 'justify-center' : ''} w-full transition-all duration-300`}>
                        {/* El icono siempre en la misma posición */}
                        <div className="w-8 h-8 flex-shrink-0 grid place-items-center">
                            <img
                                src="/assets/logo.png"
                                alt="Icono"
                                className="h-8 w-8"
                            />
                        </div>

                        {/* Texto RIFT con la fuente Chakra Petch */}
                        <div className={`flex-1 overflow-hidden transition-all duration-300 ease-in-out ${
                            !isOpen ? 'w-0 opacity-0' : 'w-full opacity-100 ml-2'
                        }`}>
                            <div
                                className="text-base font-bold text-black text-center"
                                style={{ fontFamily: "'Chakra Petch', sans-serif" }}
                            >
                                RIFT
                            </div>
                        </div>

                        {/* Espacio para mantener el balance */}
                        <div className="w-8"></div>
                    </div>
                </div>

                <div className={`px-4 pb-4 transition-all duration-300`}>
                    <div className={`relative transition-all duration-300 flex items-center ${
                        !isOpen ? 'justify-center' : ''
                    }`}>
                        <ProjectSelector {...projectSelectorProps} />
                    </div>
                </div>

                <div className="border-t border-gray-700 mx-4 transition-all my-4"/>
                <nav className="flex-1 w-full">
                    <ul>
                        {menuItems.map((item, index) => (
                            <li key={index} className="relative">
                                {selectedItem === item.label && (
                                    <div
                                        className="absolute inset-1.5 rounded-xl"
                                        style={{ backgroundColor: accentColor }}>
                                    </div>
                                )}

                                <button
                                    onClick={() => setSelectedItem(item.label)}
                                    className={`flex items-center w-full h-12 rounded-lg transition-colors duration-200 relative z-10 group`}
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

                <div className="border-t border-gray-700 mx-4 transition-all mt-4 mb-2">
                    <UserButtonWithDropdown user={user} handleLogout={handleLogout} isOpen={isOpen} setSelectedItem={setSelectedItem} />
                </div>
            </div>
        </div>
    );
};

const Sidebar = ({
                     defaultOpen = false,
                     accentColor = "#C74634",
                     defaultSelected = "Overview"
                 }) => {
    const { setCurrentRoute } = useRoute();
    const { user, logout } = useAuth();
    const { projects, selectedProject: contextSelectedProject, setSelectedProject } = useProjects();
    const { isOpen, isMobile, mobileMenuOpen, sidebarRef, handleMouseEnter, handleMouseLeave, toggleMobileMenu } = useSidebar(defaultOpen);
    const [selectedItem, setSelectedItem] = useState(defaultSelected);
    const [projectDropdownOpen, setProjectDropdownOpen] = useState(false);

    useEffect(() => {
        if (projects && projects.length > 0 && !contextSelectedProject) {
            if (user?.userLevel === 2 && user?.projectId) {
                const userProject = projects.find(project => project.id === user.projectId);
                if (userProject) {
                    setSelectedProject(userProject);
                }
            }
        }
    }, [projects, contextSelectedProject, setSelectedProject, user]);

    useEffect(() => {
        if (!isOpen) {
            setProjectDropdownOpen(false);
        }
    }, [isOpen]);

    useEffect(() => {
        const route = routes.find(r => r.label === selectedItem);
        if (route) {
            setCurrentRoute(route.path);
        }
    }, [selectedItem, setCurrentRoute]);

    const getMenuItemsByRole = () => {
        const commonItems = [
            { icon: <FiHome size={20} />, label: 'Overview', hasSubmenu: false },
        ];

        const roleSpecificItems = {
            1: [
                { icon: <FiTable size={20} />, label: 'Backlog', hasSubmenu: false },
                { icon: <FiCloudLightning size={20} />, label: 'Sprints', hasSubmenu: false },
                { icon: <FiLink size={20} />, label: 'Shortcuts', hasSubmenu: false },
                { icon: <FiSettings size={20} />, label: 'Settings', hasSubmenu: false }
            ],
            2: [
                { icon: <FiTable size={20} />, label: 'Backlog', hasSubmenu: false },
                { icon: <FiCloudLightning size={20} />, label: 'Sprints', hasSubmenu: false },
                { icon: <FiLink size={20} />, label: 'Shortcuts', hasSubmenu: false },
            ],
            3: [
                { icon: <FiTable size={20} />, label: 'Backlog', hasSubmenu: false },
                { icon: <FiCloudLightning size={20} />, label: 'Sprints', hasSubmenu: false },
                { icon: <FiLink size={20} />, label: 'Shortcuts', hasSubmenu: false },
                { icon: <FiSettings size={20} />, label: 'Settings', hasSubmenu: false },
                { icon: <FiUsers size={20} />, label: 'Users', hasSubmenu: false }
            ]
        };

        const userRole = user?.userLevel || 2;

        return [
            ...commonItems,
            ...(roleSpecificItems[userRole] || []),
        ];
    };

    const handleLogout = () => {
        setSelectedItem(null);
        logout();
    };

    const toggleProjectDropdown = (value) => {
        setProjectDropdownOpen(typeof value === 'boolean' ? value : !projectDropdownOpen);
    };

    const selectProject = (project) => {
        setSelectedProject(project);
        setProjectDropdownOpen(false);
    };

    const menuItems = getMenuItemsByRole();

    const projectSelectorProps = {
        isOpen,
        isMobile,
        projectDropdownOpen,
        toggleProjectDropdown,
        contextSelectedProject,
        projects,
        selectProject
    };

    if (isMobile) {
        return (
            <MobileSidebar
                mobileMenuOpen={mobileMenuOpen}
                toggleMobileMenu={toggleMobileMenu}
                menuItems={menuItems}
                selectedItem={selectedItem}
                setSelectedItem={setSelectedItem}
                accentColor={accentColor}
                user={user}
                handleLogout={handleLogout}
                projectSelectorProps={projectSelectorProps}
            />
        );
    }

    return (
        <DesktopSidebar
            sidebarRef={sidebarRef}
            isOpen={isOpen}
            handleMouseEnter={handleMouseEnter}
            handleMouseLeave={handleMouseLeave}
            menuItems={menuItems}
            selectedItem={selectedItem}
            setSelectedItem={setSelectedItem}
            accentColor={accentColor}
            user={user}
            handleLogout={handleLogout}
            projectSelectorProps={projectSelectorProps}
        />
    );
};

export default Sidebar;