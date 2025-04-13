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
                        email: userData.email,
                        firstName: userData.firstName,
                        lastName: userData.lastName,
                        fullName: `${userData.firstName} ${userData.lastName}`,
                        telegramUsername: userData.telegramUsername,
                        userLevel: userData.userLevel,
                        projectId: userData.projectId,
                        projectName: userData.projectName,
                        projectRole: userData.projectRole
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

    const logout = () => {
        localStorage.removeItem('jwt_token');
        setUser(null);
        setIsAuthenticated(false);
    };

    return (
        <AuthContext.Provider
            value={{
                isAuthenticated,
                isLoading,
                user,
                login,
                register,
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