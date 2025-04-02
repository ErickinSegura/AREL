import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

export const useRegisterForm = () => {
    const [user, setUser] = useState({
        name: '',
        last_name: '',
        username: '',
        email: '',
        password: '',
        confirm_password: ''
    });
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [attempts, setAttempts] = useState(0);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const { register } = useAuth();

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

    const togglePasswordVisibility = () => {
        setShowPassword(prev => !prev);
    };

    const toggleConfirmPasswordVisibility = () => {
        setShowConfirmPassword(prev => !prev);
    };

    const validateForm = () => {
        const newErrors = {};

        if (!user.name) {
            newErrors.name = 'Name is required';
        }

        if (!user.last_name) {
            newErrors.last_name = 'Last name is required';
        }

        if (!user.username) {
            newErrors.username = 'Telegram username is required';
        }

        if (!user.email) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(user.email)) {
            newErrors.email = 'Invalid email address';
        }

        if (!user.password) {
            newErrors.password = 'Password is required';
        } else if (user.password.length < 8) {
            newErrors.password = 'Password must be at least 8 characters';
        }

        if (!user.confirm_password) {
            newErrors.confirm_password = 'Please confirm your password';
        } else if (user.password !== user.confirm_password) {
            newErrors.confirm_password = 'Passwords do not match';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        setIsSubmitting(true);

        try {
            await register(
                user.name,           // firstName
                user.last_name,      // lastName
                user.email,          // email
                user.username,       // telegramUsername
                user.password        // password
            );
            setUser({
                name: '',
                last_name: '',
                username: '',
                email: '',
                password: '',
                confirm_password: ''
            });
        } catch (err) {
            setAttempts(prev => prev + 1);
            setErrors({
                ...errors,
                general: err.message || 'Failed to register'
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
        showConfirmPassword,
        handleChange,
        handleSubmit,
        togglePasswordVisibility,
        toggleConfirmPasswordVisibility
    };
};