import {fetchWithAuth} from './fetchAuth';

export const BacklogService = {
    async getTasksByProject(projectId) {
        try {
            const response = await fetchWithAuth(`/task/${projectId}/tasks`);
            return await response.json();
        } catch (error) {
            console.error('Error fetching tasks by project:', error);
            throw error;
        }
    },

    async getTasksBySprintAndProject(projectId, sprintId) {
        try {
            const response = await fetchWithAuth(`/task/${projectId}/sprints/${sprintId}/tasks`);
            return await response.json();
        } catch (error) {
            console.error('Error fetching tasks by sprint and project:', error);
            throw error;
        }
    },

    async getTaskById(taskId) {
        try {
            const response = await fetchWithAuth(`/task/${taskId}`);
            return await response.json();
        } catch (error) {
            console.error('Error fetching task details:', error);
            throw error;
        }
    },

    async createTask(task) {
        try {
            const response = await fetchWithAuth('/task', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(task)
            });
            const locationHeader = response.headers.get('location');
            return { success: response.ok, taskId: locationHeader };
        } catch (error) {
            console.error('Error creating task:', error);
            throw error;
        }
    },

    async updateTask(taskId, taskData) {
        try {
            const response = await fetchWithAuth(`/task/${taskId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(taskData)
            });
            return await response.json();
        } catch (error) {
            console.error('Error updating task:', error);
            throw error;
        }
    },

    async deleteTask(taskId) {
        try {
            const response = await fetchWithAuth(`/task/${taskId}`, {
                method: 'DELETE'
            });
            return await response.json();
        } catch (error) {
            console.error('Error deleting task:', error);
            throw error;
        }
    }
};