import {fetchWithAuth} from './fetchAuth';

export const OverviewService = {
    async getSprintOverviews(projectId) {
        try {
            const url = projectId
                ? `/overview/sprint-overviews/${projectId}`
                : '/overview/sprint-overviews';

            const response = await fetchWithAuth(url);
            return await response.json();
        } catch (error) {
            console.error('Error fetching sprint overviews:', error);
            throw error;
        }
    },

    async getUserPerformances(projectId) {
        try {
            const url = projectId
                ? `/overview/user-performances/${projectId}`
                : '/overview/user-performances';

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