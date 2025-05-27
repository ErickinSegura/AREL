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
                          rightIcon
                      }) => {
    return (
        <div className={`flex flex-col gap-1 ${className}`}>
            {label && (
                <label className="text-sm font-medium text-gray-700" htmlFor={name}>
                    {label}
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
                    className={`
                        px-4 py-2 border rounded-xl bg-white text-sm focus:outline-none focus:ring-2 focus:ring-oracleRed w-full
                        ${leftIcon ? 'pl-10' : ''}
                        ${rightIcon ? 'pr-10' : ''}
                    `}
                />
                {rightIcon && (
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        {rightIcon}
                    </div>
                )}
            </div>
        </div>
    );
};