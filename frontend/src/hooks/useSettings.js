import { useState, useEffect } from 'react';
import { ProjectService } from '../api/projectService';
import { useProjects } from './useProjects';

export const useSettings = () => {
    const { selectedProject, setSelectedProject } = useProjects();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [error, setError] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        colorId: 1,
        iconId: 1
    });

    useEffect(() => {
        if (!selectedProject) {
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            setError(null);

            setFormData({
                name: selectedProject.projectName,
                description: selectedProject.description || '',
                colorId: selectedProject.color?.id || 1,
                iconId: selectedProject.icon || 1
            });
        } catch (err) {
            console.error("Error initializing settings form:", err);
            setError("Failed to load project settings.");
        } finally {
            setLoading(false);
        }
    }, [selectedProject]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!selectedProject) return;

        try {
            setSaving(true);
            setError(null);

            const updatedProjectData = {
                id: selectedProject.id,
                name: formData.name,
                description: formData.description,
                color: { id: formData.colorId },
                icon: formData.iconId
            };

            const response = await ProjectService.updateProjectSettings(updatedProjectData);

            const updatedProject = {
                ...selectedProject,
                projectName: response.name,
                description: response.description,
                color: response.color ? { hexColor: `#${response.color.hexColor}` } : { hexColor: "#4e4e4e" },
                icon: response.icon || 1
            };

            setSelectedProject(updatedProject);
            return updatedProject;
        } catch (err) {
            console.error("Error updating project settings:", err);
            setError("Failed to update project settings.");
            throw err;
        } finally {
            setSaving(false);
        }
    };

    const resetForm = () => {
        if (!selectedProject) return;

        setFormData({
            name: selectedProject.projectName,
            description: selectedProject.description || '',
            colorId: selectedProject.color?.id || 1,
            iconId: selectedProject.icon || 1
        });
    };

    const handleDeleteProject = async () => {
        try {
            setDeleteLoading(true);
            await ProjectService.deleteProject(selectedProject.id);
            setSelectedProject(null);

        } catch (err) {
            console.error("Error deleting project:", err);
            setError("Failed to delete project.");
        } finally {
            setDeleteLoading(false);
        }
    };

    return {
        selectedProject,
        loading,
        saving,
        deleteLoading,
        error,
        formData,
        handleChange,
        handleSubmit,
        resetForm,
        handleDeleteProject
    };
};