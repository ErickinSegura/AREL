export const fetchWithAuth = async (url, options = {}) => {
    const token = localStorage.getItem('jwt_token');

    console.log(url)

    const headers = {
        'Content-Type': 'application/json',
        ...options.headers
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch("http://localhost:8080"+url, {
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