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
};
