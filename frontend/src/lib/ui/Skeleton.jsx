import React from 'react';

export const Skeleton = ({ className, ...props }) => {
    return (
        <div
            className={`animate-pulse bg-gray-200 rounded ${className}`}
            {...props}
        />
    );
};

export const SkeletonText = ({ lines = 1, className = '' }) => {
    return (
        <div className={`space-y-2 w-full ${className}`}>
            {Array(lines)
                .fill(0)
                .map((_, i) => (
                    <Skeleton
                        key={i}
                        className={`h-4 ${i === lines - 1 && lines !== 1 ? 'w-4/5' : 'w-full'}`}
                    />
                ))}
        </div>
    );
};

export const SkeletonCard = ({ header = true, lines = 3 }) => {
    return (
        <div className="border rounded-lg p-4 w-full">
            {header && (
                <div className="flex items-center justify-between mb-4">
                    <Skeleton className="h-6 w-1/3" />
                    <Skeleton className="h-4 w-16" />
                </div>
            )}
            <SkeletonText lines={lines} />
        </div>
    );
};

export const SkeletonCircle = ({ size = 'md' }) => {
    const sizeClasses = {
        sm: 'h-8 w-8',
        md: 'h-12 w-12',
        lg: 'h-16 w-16',
        xl: 'h-20 w-20',
        '2xl': 'h-24 w-24',
        '3xl': 'h-32 w-32',
    };

    return <Skeleton className={`rounded-full ${sizeClasses[size] || sizeClasses.md}`} />;
};

export const SkeletonAvatar = ({ size = 'md' }) => {
    return <SkeletonCircle size={size} />;
};