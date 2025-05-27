import { useState, useEffect, useCallback } from 'react';
import { ShortcutService } from '../api/shortcutService';
import {useProjects} from "./useProjects";

export const useShortcuts = () => {
    const { selectedProject } = useProjects();
    const [shortcuts, setShortcuts] = useState([]);
    const [selectedShortcut, setSelectedShortcut] = useState(null);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [formData, setFormData] = useState({
        project: null,
        url: '',
        name: ''
    });
    const [validationError, setValidationError] = useState(null);

    const loadShortcuts = useCallback(async () => {
        try {
            setLoading(true);
            if (selectedProject && selectedProject.id) {
                const data = await ShortcutService.fetchShortcutsByProject(selectedProject.id);
                setShortcuts(data);
            } else {
                setShortcuts([]);
            }
        } catch (error) {
            console.error('Error loading shortcuts:', error);
        } finally {
            setLoading(false);
        }
    }, [selectedProject]);

    useEffect(() => {
        if (!selectedProject) {
            setLoading(false);
            return;
        }
        loadShortcuts();
    }, [loadShortcuts]);

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'project' ? parseInt(value) : value
        }));
    };

    const handleCreateShortcut = async () => {
        if (!formData.url) {
            setValidationError('URL is required.');
            return false;
        }

        try {
            const urlPattern = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/;
            if (!urlPattern.test(formData.url)) {
                setValidationError('Please enter a valid URL.');
                return false;
            }

            const urlWithProtocol = formData.url.startsWith('http') ?
                formData.url : `https://${formData.url}`;

            const shortcutToCreate = {
                ...formData,
                url: urlWithProtocol,
                name: formData.name || formData.url,
                project: parseInt(selectedProject.id) || formData.project
            };

            setLoading(true);
            await ShortcutService.createShortcut(shortcutToCreate);
            await loadShortcuts();
            resetForm();
            setIsCreateModalOpen(false);
            return true;
        } catch (error) {
            setValidationError('Failed to create shortcut. Please try again.');
            console.error('Error creating shortcut:', error);
            return false;
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateShortcut = async (id, data) => {
        try {
            setLoading(true);
            await ShortcutService.updateShortcut(id, data);
            await loadShortcuts();
            setIsDetailsModalOpen(false);
            return true;
        } catch (error) {
            console.error('Error updating shortcut:', error);
            return false;
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteShortcut = async (id) => {
        try {
            setDeleteLoading(true);
            await ShortcutService.deleteShortcut(id);
            await loadShortcuts();
            setIsDetailsModalOpen(false);
            return true;
        } catch (error) {
            console.error('Error deleting shortcut:', error);
            return false;
        } finally {
            setDeleteLoading(false);
        }
    };

    const handleSelectShortcut = async (id) => {
        try {
            const shortcut = await ShortcutService.fetchShortcutById(id);
            setSelectedShortcut(shortcut);
            setIsDetailsModalOpen(true);
        } catch (error) {
            console.error('Error fetching shortcut details:', error);
        }
    };

    const resetForm = () => {
        setFormData({
            url: '',
            project: parseInt(selectedProject.id) || null
        });
        setValidationError(null);
    };

    return {
        selectedProject,
        shortcuts,
        selectedShortcut,
        loading,
        deleteLoading,
        isCreateModalOpen,
        isDetailsModalOpen,
        formData,
        validationError,
        setIsCreateModalOpen,
        setIsDetailsModalOpen,
        handleFormChange,
        handleCreateShortcut,
        handleUpdateShortcut,
        handleDeleteShortcut,
        handleSelectShortcut,
        resetForm
    };
};