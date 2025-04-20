import React, { useEffect } from "react";

const Modal = ({ isOpen, onClose, className, ...props }) => {
    useEffect(() => {
        const handleEsc = (event) => {
            if (event.key === "Escape") {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener("keydown", handleEsc);
        }

        return () => {
            document.removeEventListener("keydown", handleEsc);
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div
                className="fixed inset-0 bg-black/50"
                onClick={onClose}
            />
            <div
                className={`relative bg-white z-50 max-w-lg w-full rounded-2xl border bg-card text-card-foreground shadow-lg ${className}`}
                {...props}
            />
        </div>
    );
};

const ModalHeader = ({ className, ...props }) => {
    return <div className={`flex flex-col space-y-1.5 p-6 ${className}`} {...props} />;
};

const ModalTitle = ({ className, ...props }) => {
    return (
        <h3
            className={`text-2xl font-semibold leading-none tracking-tight ${className}`}
            {...props}
        >
            {props.children}
        </h3>
    );
};

const ModalDescription = ({ className, ...props }) => {
    return <p className={`text-sm text-muted-foreground ${className}`} {...props} />;
};

const ModalContent = ({ className, ...props }) => {
    return <div className={`p-6 pt-0 ${className}`} {...props} />;
};

const ModalFooter = ({ className, ...props }) => {
    return <div className={`flex items-center justify-end gap-4 p-6 pt-0 ${className}`} {...props} />;
};

const ModalClose = ({ className, ...props }) => {
    return (
        <button
            className={`absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${className}`}
            {...props}
        >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            >
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
            <span className="sr-only">Cerrar</span>
        </button>
    );
};

export { Modal, ModalHeader, ModalTitle, ModalDescription, ModalContent, ModalFooter, ModalClose };