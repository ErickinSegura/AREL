import React from 'react';

export const LoadingSpinner = ({
                                   message = "Loading...",
                                   size = "medium",
                                   variant = "default",
                                   centered = false
                               }) => {
    const sizeConfig = {
        small: "h-4 w-4 border-2",
        medium: "h-8 w-8 border-3",
        large: "h-12 w-12 border-4"
    };

    const variantConfig = {
        default: "border-gray-300 border-t-gray-600",
        primary: "border-blue-200 border-t-blue-600",
        secondary: "border-purple-200 border-t-purple-600",
        danger: "border-red-200 border-t-red-600",
        custom: "border-gray-200 border-t-red-600"
    };

    const containerClass = centered
        ? "flex flex-col items-center justify-center min-h-64"
        : "flex flex-col items-center";

    return (
        <div className={containerClass}>
            <div className="relative flex items-center justify-center">
                <div
                    className={`rounded-full animate-spin ${sizeConfig[size]} ${variantConfig[variant]}`}
                    role="status"
                    aria-label="loading"
                    style={{
                        borderTopColor: variant === 'custom' ? '#C74634' : undefined,
                        animationDuration: '0.8s'
                    }}
                />
            </div>
            {message && (
                <p className="mt-4 text-sm text-gray-500 animate-pulse">{message}</p>
            )}
        </div>
    );
};

export const PageLoading = ({ message = "Loading sprint board..." }) => (
    <div className="flex flex-col items-center justify-center my-12 py-12">
        <div className="relative">
            <LoadingSpinner
                message={message}
                size="large"
                variant="custom"
                centered
            />
        </div>
    </div>
);

export const ErrorMessage = ({ message }) => (
    <div className="bg-red-100 p-4 rounded-lg mb-4">
        <p className="text-red-700">Error: {message}</p>
    </div>
);