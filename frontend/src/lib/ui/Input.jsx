import React from 'react';

export const Input = ({
                          label,
                          value,
                          onChange,
                          type = 'text',
                          placeholder = '',
                          name,
                          className = '',
                          leftIcon,
                          rightIcon,
                          disabled = false,
                          required = false,
                          error = null,
                          ...props
                      }) => {
    return (
        <div className={`flex flex-col gap-1 ${className}`}>
            {label && (
                <label className="text-sm font-medium text-gray-700" htmlFor={name}>
                    {label}
                    {required && <span className="text-red-500 ml-1">*</span>}
                </label>
            )}
            <div className="relative">
                {leftIcon && (
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        {leftIcon}
                    </div>
                )}
                <input
                    type={type}
                    id={name}
                    name={name}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    disabled={disabled}
                    required={required}
                    className={`
                        px-4 py-3 border rounded-xl bg-white text-sm focus:outline-none focus:ring-2 w-full transition-colors
                        ${leftIcon ? 'pl-10' : ''}
                        ${rightIcon ? 'pr-10' : ''}
                        ${error
                        ? 'border-red-400 focus:ring-red-400'
                        : 'border-gray-300 focus:ring-oracleRed focus:border-oracleRed'
                    }
                        ${disabled ? 'bg-gray-50 text-gray-500 cursor-not-allowed' : 'hover:border-gray-400'}
                    `}
                    {...props}
                />
                {rightIcon && (
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                        {rightIcon}
                    </div>
                )}
            </div>
            {error && (
                <p className="text-sm text-red-600 mt-1">{error}</p>
            )}
        </div>
    );
};