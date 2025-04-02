import React from 'react';

export const Input = ({
    label,
    value,
    onChange,
    type = 'text',
    placeholder = '',
    name,
    className = ''
}) => {
    return (
        <div className={`flex flex-col gap-1 ${className}`}>
            {label && (
                <label className="text-sm font-medium text-gray-700" htmlFor={name}>
                    {label}
                </label>
            )}
            <input
                type={type}
                id={name}
                name={name}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className="mr-4 px-4 py-2 border rounded-md bg-white text-sm focus:outline-none focus:ring-2 focus:ring-oracleRed"
            />
        </div>
    );
};
