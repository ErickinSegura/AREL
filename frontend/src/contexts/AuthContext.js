import React, {createContext, useContext, useEffect, useState} from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [user, setUser] = useState(null);

    const checkAuth = async () => {
        const token = localStorage.getItem('jwt_token');

        if (token) {
            try {
                const response = await fetch('/auth/me', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                if (response.ok) {
                    const userData = await response.json();
                    setUser({
                        id: userData.id,
                        email: userData.email,
                        firstName: userData.firstName,
                        lastName: userData.lastName,
                        fullName: `${userData.firstName} ${userData.lastName}`,
                        telegramUsername: userData.telegramUsername,
                        userLevel: userData.userLevel,
                        projectId: userData.projectId,
                        projectName: userData.projectName,
                        projectRole: userData.projectRole,
                        avatar: userData.avatar ? JSON.parse(userData.avatar) : null
                    });
                    setIsAuthenticated(true);
                    return true;
                } else {
                    localStorage.removeItem('jwt_token');
                    setIsAuthenticated(false);
                    return false;
                }
            } catch (error) {
                console.error('Error validating token:', error);
                localStorage.removeItem('jwt_token');
                setIsAuthenticated(false);
                return false;
            }
        } else {
            setIsAuthenticated(false);
            return false;
        }
    };

    useEffect(() => {
        const initializeAuth = async () => {
            await checkAuth();
            setIsLoading(false);
        };

        initializeAuth();
    }, []);

    const login = async (email, password) => {
        try {
            const response = await fetch('/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            if (!response.ok) {
                throw new Error('Wrong email or password');
            }

            const data = await response.json();
            localStorage.setItem('jwt_token', data.token);

            const authSuccess = await checkAuth();

            if (!authSuccess) {
                throw new Error('Error validating credentials');
            }

            return data;
        } catch (error) {
            console.error('Error login:', error);
            throw error;
        }
    };

    const register = async (firstName, lastName, email, telegramUsername, password) => {
        try {
            const response = await fetch('/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ firstName, lastName, email, telegramUsername, password }),
            });

            if (!response.ok) {
                throw new Error('Error registering');
            }

            return await response.json();
        } catch (error) {
            console.error('Error registering:', error);
            throw error;
        }
    }

    const changePassword = async (currentPassword, newPassword) => {
        const token = localStorage.getItem('jwt_token');

        if (!token) {
            throw new Error('User not authenticated');
        }

        try {
            const response = await fetch('/auth/change_password', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    currentPassword,
                    newPassword,
                    confirmPassword: newPassword
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                const errorMessage = data.error || 'Error changing password';
                throw new Error(errorMessage);
            }

            return data;
        } catch (error) {
            console.error('Error changing password:', error);
            throw error;
        }
    };

    const logout = () => {
        localStorage.removeItem('jwt_token');
        setUser(null);
        setIsAuthenticated(false);
    };

    // Función para actualizar el usuario desde componentes externos
    const updateUser = (userData) => {
        setUser(prevUser => ({
            ...prevUser,
            ...userData
        }));
    };

    return (
        <AuthContext.Provider
            value={{
                isAuthenticated,
                isLoading,
                user,
                setUser,
                updateUser,
                login,
                register,
                changePassword,
                logout
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used inside an AuthProvider');
    }
    return context;
};