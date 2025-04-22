import { fetchWithAuth } from './fetchAuth';

export const ProjectService = {
    async getProjects() {
        try {
            const response = await fetchWithAuth("/project");
            const result = await response.json();

            return result.map(item => ({
                ...item
            }));
        } catch (error) {
            console.error('Error fetching items:', error);
            throw error;
        }
    },

    async createProject(projectData) {
        try {
            const response = await fetchWithAuth("/project", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(projectData)
            });

            if (!response.ok) {
                throw new Error(`Error ${response.status}: ${response.statusText}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Error creating project:', error);
            throw error;
        }
    }
};