import API_LIST from '../API';

const fetchWithAuth = async (url, options = {}) => {
    const token = localStorage.getItem('jwt_token');

    const headers = {
        'Content-Type': 'application/json',
        ...options.headers
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(url, {
        ...options,
        headers
    });

    if (response.status === 401) {
        localStorage.removeItem('jwt_token');
        window.location.href = '/login';
        throw new Error('Session expired. Please login again.');
    }

    if (!response.ok) {
        throw new Error(`Error: ${response.status} - ${response.statusText}`);
    }

    return response;
};

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
