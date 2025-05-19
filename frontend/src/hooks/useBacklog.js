import { useState, useEffect, useCallback, useRef } from 'react';
import { BacklogService } from '../api/backlogService';
import { useProjects } from './useProjects';

export const useBacklog = () => {
    const { selectedProject } = useProjects();
    const [backlogTasks, setBacklogTasks] = useState([]);
    const [sprintTasks, setSprintTasks] = useState([]);
    const [selectedSprint, setSelectedSprint] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedTask, setSelectedTask] = useState(null);
    const [taskModalOpen, setTaskModalOpen] = useState(false);
    const [createTaskModalOpen, setCreateTaskModalOpen] = useState(false);
    const [validationError, setValidationError] = useState(null);
    const [taskDetailLoading, setTaskDetailLoading] = useState(false);
    const [filterOptions, setFilterOptions] = useState({
        type: null,
        priority: null,
        state: null,
        assignee: null,
        category: null
    });

    // Remove the hasLoadedInitialData ref as it's preventing reloading when project changes
    const previousProjectId = useRef(null);

    const [taskFormData, setTaskFormData] = useState({
        title: '',
        description: '',
        estimatedHours: 1,
        projectId: selectedProject?.id || null,
        type: 4,
        priority: 2,
        state: 1,
        assignedTo: null,
        category: 1,
        sprint: null
    });

    // Update the task form when project changes
    useEffect(() => {
        if (selectedProject) {
            setTaskFormData(prev => ({
                ...prev,
                projectId: selectedProject.id
            }));
        }
    }, [selectedProject]);

    const resetTaskForm = () => {
        setTaskFormData({
            title: '',
            description: '',
            estimatedHours: 1,
            projectId: selectedProject?.id || null,
            type: 4,
            priority: 2,
            state: 1,
            assignedTo: null,
            category: 1,
            sprint: null
        });
        setValidationError(null);
    };

    const handleTaskFormChange = (e) => {
        const { name, value } = e.target;

        if (name === 'assignedTo') {
            setTaskFormData(prev => ({
                ...prev,
                [name]: value === '' ? null : Number(value)
            }));
            return;
        }

        setTaskFormData(prev => ({
            ...prev,
            [name]: name === 'estimatedHours' || name === 'priority' || name === 'state' || name === 'type' || name === 'category'
                ? Number(value)
                : value
        }));
    };

    const validateTaskForm = () => {
        if (!taskFormData.title) {
            setValidationError("Title is required");
            return false;
        }
        setValidationError(null);
        return true;
    };

    const fetchBacklogTasks = useCallback(async () => {
        if (!selectedProject?.id) return;

        try {
            setLoading(true);
            setError(null);
            console.log("Fetching backlog tasks for project:", selectedProject.id);
            const tasks = await BacklogService.getTasksByProject(selectedProject.id);
            setBacklogTasks(tasks);
        } catch (err) {
            console.error("Error fetching backlog tasks:", err);
            setError("Failed to load backlog tasks.");
        } finally {
            setLoading(false);
        }
    }, [selectedProject?.id]);

    const fetchSprintTasks = useCallback(async (sprintId) => {
        if (!selectedProject?.id || !sprintId) return;
        try {
            setLoading(true);
            setError(null);
            const tasks = await BacklogService.getTasksBySprintAndProject(selectedProject.id, sprintId);
            setSprintTasks(tasks);
        } catch (err) {
            console.error("Error fetching sprint tasks:", err);
            setError("Failed to load sprint tasks.");
        } finally {
            setLoading(false);
        }
    }, [selectedProject?.id]);

    useEffect(() => {
        setSelectedSprint(null);

        setBacklogTasks([]);
        setSprintTasks([]);

        if (selectedProject?.id) {
            fetchBacklogTasks();

            previousProjectId.current = selectedProject.id;
        }
    }, [selectedProject?.id, fetchBacklogTasks]);

    useEffect(() => {
        if (selectedSprint && selectedProject?.id) {
            fetchSprintTasks(selectedSprint);
        } else if (selectedProject?.id) {
            setSprintTasks([]);
        }
    }, [selectedSprint, fetchSprintTasks, selectedProject?.id]);

    const handleTaskSelect = async (taskId) => {
        setTaskModalOpen(true);
        setSelectedTask(null);
        console.log("Fetching task details for task:", taskId);
        try {
            setTaskDetailLoading(true);
            const task = await BacklogService.getTaskById(taskId);
            setSelectedTask(task);
        } catch (err) {
            console.error("Error fetching task details:", err);
            setError("Failed to load task details.");
        } finally {
            setTaskDetailLoading(false);
        }
    };

    const handleTaskCreate = async () => {
        if (!validateTaskForm()) {
            return false;
        }

        try {
            setLoading(true);
            const taskData = {
                ...taskFormData,
                estimatedHours: Number(taskFormData.estimatedHours),
                priority: Number(taskFormData.priority),
                state: Number(taskFormData.state),
                type: Number(taskFormData.type),
                category: Number(taskFormData.category),
                assignedTo: taskFormData.assignedTo === '' ? null : taskFormData.assignedTo
            };

            const result = await BacklogService.createTask(taskData);
            if (result.success) {
                resetTaskForm();
                setCreateTaskModalOpen(false);
                fetchBacklogTasks();
                if (selectedSprint && taskData.sprint === selectedSprint) {
                    fetchSprintTasks(selectedSprint);
                }
                return true;
            }
            return false;
        } catch (err) {
            console.error("Error creating task:", err);
            setValidationError("Failed to create task. Please try again.");
            return false;
        } finally {
            setLoading(false);
        }
    };

    const handleTaskUpdate = async (taskId, taskData, isBacklog = false) => {
        console.log("Updating task:", taskId, taskData);
        try {
            setLoading(true);
            await BacklogService.updateTask(taskId, taskData);
            if (!isBacklog) {
                fetchBacklogTasks();
            }

            if (selectedSprint) {
                fetchSprintTasks(selectedSprint);
            }
            return true;
        } catch (err) {
            console.error("Error updating task:", err);
            setError("Failed to update task.");
            return false;
        } finally {
            setLoading(false);
        }
    };

    const handleTaskDelete = async (taskId) => {
        try {
            setLoading(true);
            const result = await BacklogService.deleteTask(taskId);
            if (result) {
                fetchBacklogTasks();
                if (selectedSprint) {
                    fetchSprintTasks(selectedSprint);
                }
                return true;
            }
            return false;
        } catch (err) {
            console.error("Error deleting task:", err);
            setError("Failed to delete task.");
            return false;
        } finally {
            setLoading(false);
        }
    };

    const filteredBacklogTasks = backlogTasks.filter(task => {
        let matches = true;

        if (filterOptions.type && task.type !== filterOptions.type) {
            matches = false;
        }
        if (filterOptions.priority && task.priority !== filterOptions.priority) {
            matches = false;
        }
        if (filterOptions.state && task.state !== filterOptions.state) {
            matches = false;
        }
        if (filterOptions.assignee && task.assignedTo !== filterOptions.assignee) {
            matches = false;
        }
        if (filterOptions.category && task.category !== filterOptions.category) {
            matches = false;
        }

        return matches;
    });

    const filteredSprintTasks = sprintTasks.filter(task => {
        let matches = true;

        if (filterOptions.type && task.type !== filterOptions.type) {
            matches = false;
        }
        if (filterOptions.priority && task.priority !== filterOptions.priority) {
            matches = false;
        }
        if (filterOptions.state && task.state !== filterOptions.state) {
            matches = false;
        }
        if (filterOptions.assignee && task.assignedTo !== filterOptions.assignee) {
            matches = false;
        }
        if (filterOptions.category && task.category !== filterOptions.category) {
            matches = false;
        }

        return matches;
    });

    return {
        backlogTasks: filteredBacklogTasks,
        sprintTasks: filteredSprintTasks,
        loading,
        error,
        selectedSprint,
        setSelectedSprint,
        selectedTask,
        setSelectedTask,
        taskModalOpen,
        setTaskModalOpen,
        createTaskModalOpen,
        setCreateTaskModalOpen,
        taskDetailLoading,
        handleTaskSelect,
        handleTaskCreate,
        handleTaskUpdate,
        handleTaskDelete,
        filterOptions,
        setFilterOptions,
        refreshBacklog: fetchBacklogTasks,
        taskFormData,
        handleTaskFormChange,
        validationError,
        resetTaskForm
    };
};