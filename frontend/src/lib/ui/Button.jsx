import React from "react";

export const Button = ({
                                 children,
                                 onClick,
                                 variant = 'default',
                                 size = 'medium',
                                 fullWidth = false,
                                 disabled = false,
                                 startIcon = null,
                                 className = ''
                             }) => {
    const variantStyles = {
        default: 'hover:bg-gray-50 text-gray-800',
        remarked: 'bg-oracleRed hover:bg-red-800 text-gray-50',
        danger: 'bg-white border border-red-500 hover:bg-red-50 text-red-600'
    };

    const sizeStyles = {
        small: 'py-1 px-3 text-sm',
        medium: 'py-2 px-4',
        large: 'py-3 px-6 text-lg'
    };

    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={`
        ${variantStyles[variant]} 
        ${sizeStyles[size]}
        ${fullWidth ? 'w-full' : ''}
        font-medium transition-all duration-200 
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        flex items-center justify-center
        ${className}
        rounded-xl border bg-card text-card-foreground shadow-sm
      `}
        >
            {startIcon && <span className="mr-2">{startIcon}</span>}
            {children}
        </button>
    );
};