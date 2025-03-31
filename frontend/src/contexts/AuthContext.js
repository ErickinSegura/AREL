import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const checkAuth = async () => {
            const token = localStorage.getItem('jwt_token');

            if (token) {
                try {
                    // Futuramente, vamos a validar el token con el servidor
                    // const response = await fetch('/auth/validate', {
                    //   headers: { 'Authorization': `Bearer ${token}` }
                    // });

                    // if (response.ok) {
                    //   const userData = await response.json();
                    //   setUser(userData);
                    //   setIsAuthenticated(true);
                    // } else {
                    //   localStorage.removeItem('jwt_token');
                    // }

                    // Simplificado por ahora:
                    setIsAuthenticated(true);
                } catch (error) {
                    console.error('Error validating token:', error);
                    localStorage.removeItem('jwt_token');
                }
            }

            setIsLoading(false);
        };

        checkAuth();
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

            setUser({
                email: data.user.email,
                firstName: data.user.firstName,
                lastName: data.user.lastName,
                fullName: `${data.user.firstName} ${data.user.lastName}`,
                telegramUsername: data.user.telegramUsername
            });

            setIsAuthenticated(true);

            return data;
        } catch (error) {
            console.error('Error login:', error);
            throw error;
        }
    };

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