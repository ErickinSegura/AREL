import React from 'react';
import { CardHeader, CardTitle } from '../../lib/ui/Card';
import { Button } from '../../lib/ui/Button';

const AuthHeader = ({
                            title,
                            subtitle
                     }) => {
    return (
        <CardHeader className="p-0">
            <CardTitle className="text-2xl sm:text-3xl font-bold mb-2 text-oracleRed">
                {title}
            </CardTitle>
            <p className="text-gray-600 mb-6 sm:mb-8">
                {subtitle}
            </p>
        </CardHeader>
    );
};

const FormError = ({ message }) => {
    if (!message) return null;

    return (
        <div className="mb-6 bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-lg" role="alert">
            <p>{message}</p>
        </div>
    );
};

const FormField = ({
                       id,
                       label,
                       type = 'text',
                       placeholder,
                       value,
                       onChange,
                       error,
                       disabled = false,
                       icon
                   }) => {
    return (
        <div>
            <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
                {label}
            </label>
            <div className="relative">
                {icon && (
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        {icon}
                    </div>
                )}
                <input
                    type={type}
                    name={id}
                    id={id}
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                    disabled={disabled}
                    className={`${icon ? 'pl-10' : 'pl-3'} w-full px-3 py-2 border rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-oracleRed focus:border-transparent bg-white
            ${error ? 'border-red-500' : 'border-gray-300'}`}
                />
            </div>
            {error && (
                <p className="mt-1 text-sm text-red-600">
                    {error}
                </p>
            )}
        </div>
    );
};

const AuthButton = ({ text, loadingText, isSubmitting, attempts, maxAttempts = 5 }) => {
    return (
        <Button
            variant="remarked"
            size="medium"
            fullWidth
            disabled={isSubmitting || attempts >= maxAttempts}
            className={`py-3 rounded-xl shadow-sm text-sm font-medium`}
        >
            {isSubmitting ? (
                <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    {loadingText}
                </>
            ) : attempts >= maxAttempts ? 'Too many attempts' : text}
        </Button>
    );
};

const IconEmail = () => (
    <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
    </svg>
);

const IconPassword = () => (
    <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
    </svg>
);

export { AuthHeader, FormError, FormField, AuthButton, IconEmail, IconPassword };
