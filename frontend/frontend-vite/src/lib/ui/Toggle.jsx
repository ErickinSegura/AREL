import React from 'react';

export const Toggle = ({ label, checked, onChange }) => {
    return (
        <label className="flex items-center cursor-pointer">
            <span className="text-sm font-medium text-gray-700 mr-4">{label}</span>
            <div className="relative inline-block w-11 h-6">
                <input
                    type="checkbox"
                    checked={checked}
                    onChange={onChange}
                    className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-oracleRed rounded-full peer peer-checked:bg-oracleRed transition-all" />
                <div className="absolute left-0.5 top-0.5 w-5 h-5 bg-white rounded-full shadow-md transform peer-checked:translate-x-full transition-transform" />
            </div>
        </label>
    );
};
