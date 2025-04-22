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

    useEffect(() => {
        setMounted(true);
        return () => setMounted(false);
    }, []);

    if (!mounted) return null;

    const sidePositionClasses = {
        top: 'inset-x-0 top-0 rounded-b-2xl',
        right: 'inset-y-0 right-0 rounded-l-2xl',
        bottom: 'inset-x-0 bottom-0 rounded-t-2xl',
        left: 'inset-y-0 left-0 rounded-r-2xl'
    };

    const animationClasses = {
        top: isOpen ? 'translate-y-0' : '-translate-y-full',
        right: isOpen ? 'translate-x-0' : 'translate-x-full',
        bottom: isOpen ? 'translate-y-0' : 'translate-y-full',
        left: isOpen ? 'translate-x-0' : '-translate-x-full'
    };

    const sizeClasses = {
        top: 'h-96',
        right: 'w-80',
        bottom: 'h-96',
        left: 'w-80'
    };

    return (
        <>
            {/* Overlay */}
            <div
                className={`fixed inset-0 bg-black transition-opacity duration-300 z-40 ${
                    isOpen ? 'bg-opacity-50' : 'bg-opacity-0 pointer-events-none'
                }`}
                onClick={onClose}
            />

            {/* Sheet */}
            <div
                className={`
          fixed ${sidePositionClasses[side]} ${sizeClasses[side]} 
          bg-white shadow-lg z-50 overflow-hidden
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
                <div className="p-4 overflow-y-auto flex-grow">
                    {children}
                </div>
            </div>
        </>
    );
};