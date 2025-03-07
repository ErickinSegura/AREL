import React, { useState, useEffect } from 'react';

export const Sheet = ({
                   isOpen,
                   onClose,
                   side = 'right',
                   children,
                   title = '',
                   description = ''
               }) => {
    const [mounted, setMounted] = useState(false);

    // Mount component
    useEffect(() => {
        setMounted(true);
        return () => setMounted(false);
    }, []);

    // Early return if not mounted
    if (!mounted) return null;

    // Position based on side prop
    const sidePositionClasses = {
        top: 'top-0 left-0 right-0',
        right: 'top-0 right-0 bottom-0',
        bottom: 'bottom-0 left-0 right-0',
        left: 'top-0 left-0 bottom-0'
    };

    // Animation based on side prop
    const animationClasses = {
        top: isOpen ? 'translate-y-0' : '-translate-y-full',
        right: isOpen ? 'translate-x-0' : 'translate-x-full',
        bottom: isOpen ? 'translate-y-0' : 'translate-y-full',
        left: isOpen ? 'translate-x-0' : '-translate-x-full'
    };

    // Size based on side prop
    const sizeClasses = {
        top: 'h-96',
        right: 'w-80',
        bottom: 'h-96',
        left: 'w-80'
    };

    return (
        <>
            {/* Backdrop */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity"
                    onClick={onClose}
                />
            )}

            {/* Sheet */}
            <div
                className={`
          fixed ${sidePositionClasses[side]} ${sizeClasses[side]} 
          bg-white shadow-lg z-50 
          transform transition-transform duration-300 ease-in-out 
          ${animationClasses[side]}
        `}
            >
                {/* Header */}
                <div className="p-4 border-b">
                    {title && <h3 className="text-lg font-medium">{title}</h3>}
                    {description && <p className="text-sm text-gray-500">{description}</p>}
                </div>

                {/* Content */}
                <div className="p-4 overflow-y-auto h-full">
                    {children}
                </div>
            </div>
        </>
    );
};
