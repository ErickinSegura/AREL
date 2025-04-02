import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

export const useLoginForm = () => {
    const [user, setUser] = useState({
        email: '',
        password: ''
    });
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [attempts, setAttempts] = useState(0);
    const { login } = useAuth();
    const [showPassword, setShowPassword] = useState(false);


    const togglePasswordVisibility = () => {
        setShowPassword(prev => !prev);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUser(prev => ({
            ...prev,
            [name]: value
        }));

        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: null
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!user.email) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(user.email)) {
            newErrors.email = 'Invalid email address';
        }

        if (!user.password) {
            newErrors.password = 'Password is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        setIsSubmitting(true);

        try {
            await login(user.email, user.password);
        } catch (err) {
            setAttempts(prev => prev + 1);
            setErrors({
                ...errors,
                general: err.message || 'Failed to login'
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return {
        user,
        errors,
        isSubmitting,
        attempts,
        showPassword,
        togglePasswordVisibility,
        handleChange,
        handleSubmit
    };
};

