import { useState, useEffect, createContext, useContext } from 'react';
import { ProjectService } from '../api/projectService';

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

    const defaultColor = { hexColor: "#4e4e4e" };
    const defaultIcon = { iconName: "folder" };

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                setLoading(true);
                const data = await ProjectService.getProjects();

                const adaptedProjects = data.map(project => {
                    const colorValue = project.color
                        ? { hexColor: `#${project.color.hexColor}` }
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
                if (adaptedProjects.length > 0 && !selectedProject) {
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

    const selectProject = (project) => {
        setSelectedProject(project);
    };

    return {
        projects,
        selectedProject,
        setSelectedProject: selectProject,
        loading,
        error
    };
};