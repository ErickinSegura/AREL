import API_LIST from '../API';

// Fetch all sprint items
export const fetchItems = async () => {
    try {
        const response = await fetch(API_LIST);

        if (!response.ok) {
            throw new Error('Something went wrong while fetching items');
        }

        const result = await response.json();

        // Add inProgress property to items if not already present
        return result.map(item => ({
            ...item,
            inProgress: item.inProgress === undefined ? false : item.inProgress
        }));
    } catch (error) {
        throw error;
    }
};

// Add a new item
export const addItem = async (text, status) => {
    try {
        const data = {
            description: text,
            done: status === 'finished',
            inProgress: status === 'inProgress'
        };

        const response = await fetch(API_LIST, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            throw new Error('Something went wrong while adding item');
        }

        const id = response.headers.get('location');

        return {
            id,
            description: text,
            done: status === 'finished',
            inProgress: status === 'inProgress',
            createdAt: new Date()
        };
    } catch (error) {
        throw error;
    }
};

// Delete an item
export const deleteItem = async (deleteId) => {
    try {
        const response = await fetch(`${API_LIST}/${deleteId}`, {
            method: 'DELETE',
        });

        if (!response.ok) {
            throw new Error('Something went wrong while deleting');
        }

        return deleteId;
    } catch (error) {
        throw error;
    }
};

// Update item status
export const updateItemStatus = async (id, description, inProgress, done) => {
    try {
        const data = {
            description,
            inProgress,
            done
        };

        const response = await fetch(`${API_LIST}/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            throw new Error('Something went wrong while updating');
        }

        return { id, inProgress, done };
    } catch (error) {
        throw error;
    }
};