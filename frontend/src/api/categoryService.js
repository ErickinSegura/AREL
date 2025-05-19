import { fetchWithAuth } from './fetchAuth';

export const CategoryService = {
    async getCategoriesbyProjectId(projectId) {
        try {
            const response = await fetchWithAuth(`/category/project/${projectId}`);
            return await response.json();
        } catch (error) {
            console.error("Error fetching logs:", error);
            throw error;
        }
    },

    async addCategory(category) {
        try {
            const response = await fetchWithAuth('/category', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(category)
            });
            const locationHeader = response.headers.get('location');
            return { success: response.ok, categoryId: locationHeader };
        } catch (error) {
            console.error('Error creating category:', error);
            throw error;
        }
    },

    async updateCategory(categoryId, categoryData) {
        try {
            const url = `/category/${categoryId}`;
            console.log(`Sending PUT request to ${url} with data:`, categoryData);

            const response = await fetchWithAuth(url, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(categoryData)
            });

            return { success: response.ok };
        } catch (error) {
            console.error('Error updating category:', error);
            throw error;
        }
    },

    async deleteCategory(categoryId) {
        try {
            const response = await fetchWithAuth(`/category/${categoryId}`, {
                method: 'DELETE',
            });
            return { success: response.ok };
        } catch (error) {
            console.error('Error deleting category:', error);
            throw error;
        }
    },

}