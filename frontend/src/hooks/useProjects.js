import { useState, useEffect, createContext, useContext } from 'react';
import { ProjectService } from '../api/projectService';
import { useAuth } from '../contexts/AuthContext';

const ProjectContext = createContext();

export const ProjectProvider = ({ children }) => {
    const projectsData = useProjectsData();

    return (
        <ProjectContext.Provider value={projectsData}>
            {children}
        </ProjectContext.Provider>
    );
};

export const useProjects = () => {
    return useContext(ProjectContext);
};

const useProjectsData = () => {
    const [projects, setProjects] = useState([]);
    const [selectedProject, setSelectedProject] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { isAuthenticated, isLoading } = useAuth();

    const defaultColor = { hexColor: "#4e4e4e", id: 1 };
    const defaultIcon = 1;

    useEffect(() => {
        const fetchProjects = async () => {
            if (isLoading || !isAuthenticated) {
                return;
            }

            try {
                setLoading(true);
                const data = await ProjectService.getProjects();

                const adaptedProjects = data.map(project => {
                    // ✅ CORRECCIÓN: Mantener tanto hexColor como id
                    const colorValue = project.color
                        ? {
                            hexColor: `#${project.color.hexColor}`,
                            id: project.color.id
                        }
                        : defaultColor;

                    return {
                        id: project.id,
                        projectName: project.name || "Unnamed Project",
                        description: project.description || "No description available",
                        color: colorValue,
                        icon: project.icon || defaultIcon,
                        activeSprint: project.activeSprintId
                    };
                });

                setProjects(adaptedProjects);
            } catch (error) {
                console.error("Error fetching projects:", error);
                setError("Failed to load projects. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        fetchProjects();
    }, [isAuthenticated, isLoading]);

    const selectProject = (project) => {
        setSelectedProject(project);
    };

    const addProject = async (projectData) => {
        try {
            const formattedData = {
                name: projectData.name,
                description: projectData.description,
                color: { id: projectData.colorId },
                icon: projectData.iconId
            };

            const newProject = await ProjectService.createProject(formattedData);

            const adaptedNewProject = {
                id: newProject.id,
                projectName: newProject.name,
                description: newProject.description || "No description available",
                // ✅ CORRECCIÓN: Mantener tanto hexColor como id
                color: newProject.color ? {
                    hexColor: `#${newProject.color.hexColor}`,
                    id: newProject.color.id
                } : defaultColor,
                icon: newProject.icon || defaultIcon,
                activeSprint: newProject.activeSprintId
            };

            setProjects(prev => [...prev, adaptedNewProject]);
            return adaptedNewProject;
        } catch (error) {
            console.error("Error adding project:", error);
            setError("Failed to add project. Please try again later.");
            throw error;
        }
    };

    return {
        projects,
        selectedProject,
        setSelectedProject: selectProject,
        loading: loading || isLoading,
        error,
        addProject
    };
};