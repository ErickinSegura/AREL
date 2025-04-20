import { useState, useEffect, useCallback } from 'react';
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
    const [filterOptions, setFilterOptions] = useState({
        type: null,
        priority: null,
        state: null,
        assignee: null,
        category: null
    });

    const fetchBacklogTasks = useCallback(async () => {
        if (!selectedProject) return;

        try {
            setLoading(true);
            setError(null);
            const tasks = await BacklogService.getTasksByProject(selectedProject.id);
            setBacklogTasks(tasks);
        } catch (err) {
            console.error("Error fetching backlog tasks:", err);
            setError("Failed to load backlog tasks.");
        } finally {
            setLoading(false);
        }
    }, [selectedProject]);

    const fetchSprintTasks = useCallback(async (sprintId) => {
        if (!selectedProject || !sprintId) return;

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
    }, [selectedProject]);

    useEffect(() => {
        fetchBacklogTasks();
    }, [fetchBacklogTasks]);

    useEffect(() => {
        if (selectedSprint) {
            fetchSprintTasks(selectedSprint);
        } else {
            setSprintTasks([]);
        }
    }, [selectedSprint, fetchSprintTasks]);

    const handleTaskSelect = async (taskId) => {
        try {
            const task = await BacklogService.getTaskById(taskId);
            setSelectedTask(task);
            setTaskModalOpen(true);
        } catch (err) {
            console.error("Error fetching task details:", err);
            setError("Failed to load task details.");
        }
    };

    const handleTaskCreate = async (taskData) => {
        try {
            setLoading(true);
            const result = await BacklogService.createTask(taskData);
            if (result.success) {
                fetchBacklogTasks();
                if (selectedSprint && taskData.sprint === selectedSprint) {
                    fetchSprintTasks(selectedSprint);
                }
                return true;
            }
            return false;
        } catch (err) {
            console.error("Error creating task:", err);
            setError("Failed to create task.");
            return false;
        } finally {
            setLoading(false);
        }
    };

    const handleTaskUpdate = async (taskId, taskData) => {
        try {
            setLoading(true);
            await BacklogService.updateTask(taskId, taskData);
            fetchBacklogTasks();
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
        handleTaskSelect,
        handleTaskCreate,
        handleTaskUpdate,
        handleTaskDelete,
        filterOptions,
        setFilterOptions,
        refreshBacklog: fetchBacklogTasks
    };
};