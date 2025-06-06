import { useState, useEffect, useCallback } from 'react';
import { SprintsService } from '../api/sprintsService';
import { BacklogService } from '../api/backlogService';
import { useProjects } from './useProjects';

export const useSprints = (isBacklog = true) => {
    const { selectedProject } = useProjects();
    const [sprints, setSprints] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [createSprintModalOpen, setCreateSprintModalOpen] = useState(false);
    const [validationError, setValidationError] = useState(null);

    const [sprintFormData, setSprintFormData] = useState({
        project: null,
        startDate: new Date().toISOString().split('T')[0],
        endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        sprintNumber: 1
    });

    const [selectedTasks, setSelectedTasks] = useState([]);
    const [availableTasks, setAvailableTasks] = useState([]);

    useEffect(() => {
        if (selectedProject) {
            setSprintFormData(prev => ({
                ...prev,
                project: selectedProject.id
            }));
        }
    }, [selectedProject]);

    const resetSprintForm = useCallback(() => {
        setSprintFormData(prev => ({
            ...prev,
            project: selectedProject?.id || null,
            startDate: new Date().toISOString().split('T')[0],
            endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            sprintNumber: sprints.length > 0 ? Math.max(...sprints.map(s => s.sprintNumber)) + 1 : 1
        }));
        setSelectedTasks([]);
        setValidationError(null);
    }, [sprints, selectedProject]);

    const handleSprintFormChange = (e) => {
        const { name, value } = e.target;
        setSprintFormData(prev => ({
            ...prev,
            [name]: name === 'sprintNumber' ? Number(value) : value
        }));
    };

    const fetchSprints = useCallback(async () => {
        if (!selectedProject) return;

        try {
            setLoading(true);
            setError(null);
            const fetchedSprints = await SprintsService.getSprintsByProject(selectedProject.id);
            setSprints(fetchedSprints);
        } catch (err) {
            console.error("Error fetching sprints:", err);
            setError("Failed to load sprints.");
        } finally {
            setLoading(false);
        }
    }, [selectedProject]);

    useEffect(() => {
        if (selectedProject) {
            setSprints([]);
            setAvailableTasks([]);
            setSelectedTasks([]);

            setSprintFormData(prev => ({
                ...prev,
                project: selectedProject.id,
                sprintNumber: sprints.length > 0 ? Math.max(...sprints.map(s => s.sprintNumber)) + 1 : 1
            }));

            fetchSprints();
        }
    }, [selectedProject, fetchSprints]);

    const toggleTaskSelection = (taskId, tasksSource = availableTasks) => {
        setSelectedTasks(prevSelectedTasks => {
            const isSelected = prevSelectedTasks.some(task => task.id === taskId);
            if (isSelected) {
                return prevSelectedTasks.filter(task => task.id !== taskId);
            } else {
                const taskToAdd = tasksSource.find(task => task.id === taskId);
                if (!taskToAdd) {
                    console.error(`Task with id ${taskId} not found in tasks source`);
                    return prevSelectedTasks;
                }
                return [...prevSelectedTasks, {
                    ...taskToAdd,
                    estimatedHours: taskToAdd.estimatedHours || 0,
                    assignedTo: taskToAdd.assignedTo || null
                }];
            }
        });
    };

    const updateTaskDetails = (taskId, field, value) => {
        setSelectedTasks(prevSelectedTasks =>
            prevSelectedTasks.map(task =>
                task.id === taskId
                    ? { ...task, [field]: field === 'estimatedHours' ? Number(value) : value }
                    : task
            )
        );
    };

    const validateSprintForm = () => {
        if (!sprintFormData.startDate) {
            setValidationError("Start date is required");
            return false;
        }
        if (!sprintFormData.endDate) {
            setValidationError("End date is required");
            return false;
        }
        if (new Date(sprintFormData.startDate) > new Date(sprintFormData.endDate)) {
            setValidationError("End date must be after start date");
            return false;
        }
        setValidationError(null);
        return true;
    };

    const handleCreateSprint = async () => {
        if (!validateSprintForm()) {
            return false;
        }

        try {
            setLoading(true);
            setError(null);

            const sprintData = {
                ...sprintFormData,
                startDate: new Date(sprintFormData.startDate).toISOString(),
                endDate: new Date(sprintFormData.endDate).toISOString()
            };

            const result = await SprintsService.createSprint(sprintData);

            if (result.success) {
                const sprintId = parseInt(result.sprintId.split('/').pop());

                const taskUpdatePromises = selectedTasks.map(task =>
                    BacklogService.updateTask(task.id, {
                        sprint: sprintId,
                        assignedTo: task.assignedTo
                    })
                );

                await Promise.all(taskUpdatePromises);

                resetSprintForm();
                await fetchSprints();
                setCreateSprintModalOpen(false);
                return true;
            } else {
                setValidationError(result.message || "Failed to create sprint. Please try again.");
                return false;
            }
        } catch (err) {
            console.error("Error creating sprint:", err);
            setError("Failed to create sprint. Please try again.");
            return false;
        } finally {
            setLoading(false);
        }
    };

    const createSprint = async (sprintData) => {
        try {
            setLoading(true);
            setError(null);

            const result = await SprintsService.createSprint({
                ...sprintData,
                project: selectedProject.id
            });

            if (result.success) {
                return result;
            } else {
                throw new Error(result.message || "Failed to create sprint");
            }
        } catch (err) {
            console.error("Error creating sprint:", err);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const updateSprint = async (sprintId, sprintData) => {
        try {
            setLoading(true);
            setError(null);

            const result = await SprintsService.updateSprint(sprintId, sprintData);
            return result;
        } catch (err) {
            console.error("Error updating sprint:", err);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const deleteSprint = async (sprintId) => {
        try {
            setLoading(true);
            setError(null);

            const result = await SprintsService.deleteSprint(sprintId);
            return result;
        } catch (err) {
            console.error("Error deleting sprint:", err);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return {
        sprints,
        loading,
        error,
        createSprintModalOpen,
        setCreateSprintModalOpen,
        sprintFormData,
        handleSprintFormChange,
        selectedTasks,
        availableTasks,
        toggleTaskSelection,
        updateTaskDetails,
        handleCreateSprint,
        validationError,
        resetSprintForm,
        refreshSprints: fetchSprints,
        createSprint,
        updateSprint,
        deleteSprint
    };
};