import {fetchWithAuth} from './fetchAuth';

export const OverviewService = {


    async getUserPerformanceByID(projectId, userId) {
        try {
            const url = projectId
                ? `/overview/user-performance/${projectId}/${userId}`
                : '/overview/user-performance';

            const response = await fetchWithAuth(url);
            return await response.json();
        } catch (error) {
            console.error('Error fetching user performances:', error);
            throw error;
        }
    },

    async getOverviewData(projectId) {
        try {
            const url = projectId
                ? `/overview/overview-data/${projectId}`
                : '/overview/overview-data';

            const response = await fetchWithAuth(url);
            return await response.json();
        } catch (error) {
            console.error('Error fetching overview data:', error);
            throw error;
        }
    }
};