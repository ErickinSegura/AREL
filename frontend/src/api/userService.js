import { fetchWithAuth } from './fetchAuth';

export const UserService = {
    async getUsersByLevel(levelIds) {
        const queryString = Array.isArray(levelIds)
            ? levelIds.map(id => `levelIds=${id}`).join('&')
            : `levelIds=${levelIds}`;

        const response = await fetchWithAuth(`/userlist/by-level?${queryString}`);
        return await response.json();
    },

    async getUsersByProject(projectID) {
        const response = await fetchWithAuth(`/userlist/${projectID}/users`);
        return await response.json()
    }
};