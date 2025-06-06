import {fetchWithAuth} from "./fetchAuth";

export const SprintsService = {
    async getSprintsByProject(projectId) {
        try {
            const response = await fetchWithAuth(`/sprint/${projectId}`);
            return await response.json();
        } catch (error) {
            console.error('Error fetching sprints by project:', error);
            throw error;
        }
    },

    async createSprint(sprint) {
        try {
            const response = await fetchWithAuth('/sprint', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(sprint)
            });
            const locationHeader = response.headers.get('location');
            return { success: response.ok, sprintId: locationHeader };
        } catch (error) {
            console.error('Error creating sprint:', error);
            throw error;
        }
    },

    async updateSprint(sprintId, sprint) {
        try {
            const response = await fetchWithAuth(`/sprint/${sprintId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(sprint)
            });

            if (!response.ok) {
                throw new Error('Failed to update sprint');
            }

            return await response.json();
        } catch (error) {
            console.error('Error updating sprint:', error);
            throw error;
        }
    },

    async deleteSprint(sprintId) {
        try {
            const response = await fetchWithAuth(`/sprint/${sprintId}`, {
                method: 'DELETE'
            });

            if (!response.ok) {
                throw new Error('Failed to delete sprint');
            }

            return await response.json();
        } catch (error) {
            console.error('Error deleting sprint:', error);
            throw error;
        }
    }
}