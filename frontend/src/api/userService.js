import { fetchWithAuth } from './fetchAuth';

export const UserService = {
    async getUsersByLevel(levelIds) {
        const queryString = Array.isArray(levelIds)
            ? levelIds.map(id => `levelIds=${id}`).join('&')
            : `levelIds=${levelIds}`;

        const response = await fetchWithAuth(`/userlist/by-level?${queryString}`);
        return await response.json();
    },

    async getAvailableUsers(levelIds) {
        const queryString = Array.isArray(levelIds)
            ? levelIds.map(id => `levelIds=${id}`).join('&')
            : `levelIds=${levelIds}`;

        const response = await fetchWithAuth(`/userlist/available?${queryString}`);
        return await response.json();
    },

    async getUsersByProject(projectID) {
        const response = await fetchWithAuth(`/userlist/${projectID}/users`);
        return await response.json();
    },

    async assignUserToProject(userId, projectId, role) {
        const response = await fetchWithAuth('/userproject', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                userId,
                projectId,
                role
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Error al asignar usuario al proyecto');
        }

        return await response.json();
    },

    async getProjectsByUser(userId) {
        const response = await fetchWithAuth(`/user/${userId}/projects`);

        if (!response.ok) {
            throw new Error('Error al obtener proyectos del usuario');
        }

        return await response.json();
    },

    async updateUserProjectRole(userProjectId, role) {
        const response = await fetchWithAuth(`/userproject/${userProjectId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                role
            })
        });

        if (response.status === 404) {
            return null;
        }

        if (!response.ok) {
            throw new Error('Error al actualizar rol del usuario');
        }

        return await response.json();
    },

    async removeUserFromProject(userProjectId) {
        const response = await fetchWithAuth(`/userproject/${userProjectId}`, {
            method: 'DELETE'
        });

        if (response.status === 404) {
            throw new Error('UserProject no encontrado');
        }

        if (!response.ok) {
            throw new Error('Error al remover usuario del proyecto');
        }

        return await response.text();
    }
};