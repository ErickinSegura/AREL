import { fetchWithAuth } from './fetchAuth';

export const LogsService = {
    async getLogsbyProjectId(projectId) {
        try {
            const response = await fetchWithAuth(`/logs/${projectId}`);
            return await response.json();
        } catch (error) {
            console.error("Error fetching logs:", error);
            throw error;
        }
    }
}