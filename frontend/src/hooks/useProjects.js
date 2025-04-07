import { useState, useEffect } from 'react';
import { ProjectService } from '../api/projectService';

export const useProjects = () => {
    const [projects, setProjects] = useState([]);
    const [selectedProject, setSelectedProject] = useState(null);
    const [projectDropdownOpen, setProjectDropdownOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const defaultColor = { hexColor: "#808080" };
    const defaultIcon = { iconName: "folder" };

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                setLoading(true);
                const data = await ProjectService.getProjects();

                const adaptedProjects = data.map(project => ({
                    id: project.id,
                    projectName: project.name || "Unnamed Project",
                    description: project.description || "No description available",
                    color: project.color || defaultColor,
                    icon: project.icon || defaultIcon,
                    activeSprint: project.activeSprintId
                }));

                setProjects(adaptedProjects);
                if (adaptedProjects.length > 0) {
                    setSelectedProject(adaptedProjects[0]);
                }
            } catch (error) {
                console.error("Error fetching projects:", error);
                setError("Failed to load projects. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        fetchProjects();
    }, []);

    const toggleProjectDropdown = (e) => {
        e.stopPropagation();
        setProjectDropdownOpen(!projectDropdownOpen);
    };

    const selectProject = (project) => {
        setSelectedProject(project);
        setProjectDropdownOpen(false);
        // Dispatch an event or use context to notify other components of the project change
        window.dispatchEvent(new CustomEvent('projectChanged', { detail: project }));
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (projectDropdownOpen && !event.target.closest('.project-dropdown')) {
                setProjectDropdownOpen(false);
            }
        };

        document.addEventListener('click', handleClickOutside);
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, [projectDropdownOpen]);

    return {
        projects,
        selectedProject,
        projectDropdownOpen,
        loading,
        error,
        toggleProjectDropdown,
        selectProject
    };
};