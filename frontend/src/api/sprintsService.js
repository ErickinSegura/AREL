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

    async getActiveSprints(sprintId) {
        try {
            const response = await fetchWithAuth(`/sprint/${sprintId}/active`);
            return await response.json();
        } catch (error) {
            console.error('Error fetching sprint details:', error);
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

    async updateSprint(sprintId, sprintData) {
        try {
            const url = `/sprint/${sprintId}`;
            console.log(`Sending PUT request to ${url} with data:`, sprintData);

            // No use fetchWithAuth directly for update
            const token = localStorage.getItem('jwt_token');
            const headers = {
                'Content-Type': 'application/json'
            };

            const response = await fetch(url, {
                method: 'PUT',
                headers: {
                    ...headers,
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(sprintData)
            });

            return { success: response.ok };
        } catch (error) {
            console.error('Error updating sprint:', error);
            throw error;
        }
    }
}