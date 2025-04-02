import API_LIST from '../API';
import { fetchWithAuth } from './fetchAuth';

export const fetchItems = async () => {
    try {
        const response = await fetchWithAuth(API_LIST);
        const result = await response.json();

        return result.map(item => ({
            ...item,
            inProgress: item.inProgress === undefined ? false : item.inProgress
        }));
    } catch (error) {
        console.error('Error fetching items:', error);
        throw error;
    }
};

export const addItem = async (text, status) => {
    try {
        const data = {
            description: text,
            done: status === 'finished',
            inProgress: status === 'inProgress'
        };

        const response = await fetchWithAuth(API_LIST, {
            method: 'POST',
            body: JSON.stringify(data),
        });

        const id = response.headers.get('location');

        return {
            id,
            description: text,
            done: status === 'finished',
            inProgress: status === 'inProgress',
            createdAt: new Date()
        };
    } catch (error) {
        console.error('Error adding item:', error);
        throw error;
    }
};

export const deleteItem = async (deleteId) => {
    try {
        await fetchWithAuth(`${API_LIST}/${deleteId}`, {
            method: 'DELETE',
        });

        return deleteId;
    } catch (error) {
        console.error('Error deleting item:', error);
        throw error;
    }
};

export const updateItemStatus = async (id, description, inProgress, done) => {
    try {
        const data = {
            description,
            inProgress,
            done
        };

        await fetchWithAuth(`${API_LIST}/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data)
        });

        return { id, inProgress, done };
    } catch (error) {
        console.error('Error updating item:', error);
        throw error;
    }
};
