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
    },

    async updateProjectSettings(projectData) {
        try {
            const response = await fetchWithAuth(`/project/${projectData.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(projectData)
            });

            if (!response.ok) {
                throw new Error(`Error ${response.status}: ${response.statusText}`);
            }

            return await response.json();
        }
        catch (error) {
            console.error('Error updating project settings:', error);
            throw error;
        }
    },

    async deleteProject(projectId) {
        try {
            const response = await fetchWithAuth(`/project/${projectId}`, {
                method: 'DELETE'
            });

            if (!response.ok) {
                throw new Error(`Error ${response.status}: ${response.statusText}`);
            }

            return true;
        } catch (error) {
            console.error('Error deleting project:', error);
            throw error;
        }
    },
};