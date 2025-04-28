import { fetchWithAuth } from './fetchAuth';

export const ShortcutService = {
    async fetchShortcuts() {
        try {
            const response = await fetchWithAuth('/shortcuts');
            return await response.json();
        } catch (error) {
            console.error("Error fetching shortcuts:", error);
            throw error;
        }
    },

    async fetchShortcutById(id) {
        try {
            const response = await fetchWithAuth(`/shortcuts/${id}`);
            return await response.json();
        } catch (error) {
            console.error(`Error fetching shortcut ${id}:`, error);
            throw error;
        }
    },

    async fetchShortcutsByProject(projectId) {
        try {
            const response = await fetchWithAuth(`/shortcuts/project/${projectId}`);
            return await response.json();
        } catch (error) {
            console.error(`Error fetching shortcuts for project ${projectId}:`, error);
            throw error;
        }
    },

    async createShortcut(shortcutData) {
        try {
            const response = await fetchWithAuth('/shortcuts', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(shortcutData)
            });
            return await response.json();
        } catch (error) {
            console.error("Error creating shortcut:", error);
            throw error;
        }
    },

    async updateShortcut(id, shortcutData) {
        try {
            const response = await fetchWithAuth(`/shortcuts/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(shortcutData)
            });
            return await response.json();
        } catch (error) {
            console.error(`Error updating shortcut ${id}:`, error);
            throw error;
        }
    },

    async deleteShortcut(id) {
        try {
            const response = await fetchWithAuth(`/shortcuts/${id}`, {
                method: 'DELETE'
            });
            return await response.json();
        } catch (error) {
            console.error(`Error deleting shortcut ${id}:`, error);
            throw error;
        }
    }
};