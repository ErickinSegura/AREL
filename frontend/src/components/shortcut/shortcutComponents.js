import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../lib/ui/Card';
import { Button } from "../../lib/ui/Button";
import { Modal, ModalHeader, ModalTitle, ModalContent, ModalFooter, ModalClose } from "../../lib/ui/Modal";
import { Input } from "../../lib/ui/Input";
import { SkeletonCircle, SkeletonText } from "../../lib/ui/Skeleton";
import { Link, ExternalLink, Plus, Loader2, Trash2, Edit2, Save, AlertTriangle, Globe } from 'lucide-react';
import {
    FiBookmark,
    FiCode,
    FiCodesandbox,
    FiFileText,
    FiFolder,
    FiStar
} from "react-icons/fi";

const getProjectIcon = (iconID) => {
    switch (iconID) {
        case 1: return <FiFolder size={24} />;
        case 2: return <FiCodesandbox size={24} />;
        case 3: return <FiCode size={24} />;
        case 4: return <FiFileText size={24} />;
        case 5: return <FiStar size={24} />;
        case 6: return <FiBookmark size={24} />;
        default: return <FiFolder size={24} />;
    }
};

export const NoProjectState = ({ title, message }) => (
    <div className="p-6 flex flex-col items-center justify-center h-full">
        <Card className="w-full max-w-md text-center">
            <CardHeader>
                <CardTitle className="text-2xl">
                    No Project <span className="text-oracleRed">{title}</span>
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex justify-center mb-6">
                    <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
                        <FiFolder size={32} />
                    </div>
                </div>
                <p className="text-gray-600 mb-6">
                    {message}
                </p>
            </CardContent>
        </Card>
    </div>
);

export const NoProjectShortcuts = () => (
    <div className="p-6 flex flex-col items-center justify-center h-full">
        <Card className="w-full max-w-md text-center">
            <CardHeader>
                <CardTitle className="text-2xl">
                    No Shortcuts <span className="text-oracleRed">Found</span>
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex justify-center mb-6">
                    <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
                        <FiFolder size={32} />
                    </div>
                </div>
                <p className="text-gray-600 mb-6">
                    You don't have any shortcuts yet. Click the button above to add one.
                </p>
            </CardContent>
        </Card>
    </div>
);

export const ShortcutsHeader = ({ selectedProject, loading, onAddShortcut }) => (
    <Card className="mb-6">
        <CardHeader>
            <div className={`flex items-center justify-between ${loading ? 'animate-pulse' : ''}`}>
                <CardTitle>
                    {loading ? (
                        <div className="flex items-center">
                            <SkeletonCircle size="md" />
                            <div className="ml-3 w-48">
                                <SkeletonText lines={1} />
                            </div>
                        </div>
                    ) : (
                        <div className="flex items-center">
                            <div
                                className="w-12 h-12 rounded-md grid place-items-center text-white"
                                style={{ backgroundColor: selectedProject?.color?.hexColor || '#808080' }}
                            >
                                {getProjectIcon(selectedProject?.icon)}
                            </div>
                            <h1 className="text-2xl font-bold px-2">
                                Project Shortcuts
                            </h1>
                        </div>
                    )}
                </CardTitle>

                {!loading && (
                    <div className="flex space-x-2">
                        <Button
                            variant="remarked"
                            onClick={onAddShortcut}
                            className="flex items-center gap-2"
                        >
                            <Plus size={16} />
                            Add Shortcut
                        </Button>
                    </div>
                )}
            </div>
        </CardHeader>
    </Card>
);

export const ShortcutCard = ({ shortcut, onSelectShortcut }) => {
    const getDomainFromUrl = (url) => {
        try {
            const urlObj = new URL(url.startsWith('http') ? url : `https://${url}`);
            return urlObj.hostname;
        } catch (error) {
            return url;
        }
    };

    const displayUrl = getDomainFromUrl(shortcut.url || '');

    return (
        <Card
            className="hover:shadow-md transition-all cursor-pointer"
            onClick={() => onSelectShortcut(shortcut.id)}
        >
            <CardContent className="p-3 sm:p-4">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                    <div className="flex items-center w-full">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gray-100 flex items-center justify-center text-oracleRed flex-shrink-0">
                            <Globe size={16} className="sm:w-5 sm:h-5" />
                        </div>
                        <div className="ml-2 sm:ml-3 overflow-hidden">
                            <h3 className="font-medium text-base sm:text-lg truncate">{displayUrl}</h3>
                            <p className="text-xs sm:text-sm text-gray-500 truncate">{shortcut.url}</p>
                        </div>
                    </div>
                    <Button
                        className="ml-auto sm:ml-0 flex-shrink-0"
                        onClick={(e) => {
                            e.stopPropagation();
                            window.open(shortcut.url, '_blank');
                        }}
                    >
                        <ExternalLink size={14} className="sm:w-4 sm:h-4" />
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
};

export const ShortcutDetailModal = ({
                                        isOpen,
                                        onClose,
                                        shortcut,
                                        onUpdate,
                                        onDelete,
                                        loading,
                                        deleteLoading
                                    }) => {
    const [editMode, setEditMode] = useState(false);
    const [formData, setFormData] = useState({
        url: shortcut?.url || '',
        project: shortcut?.projectId || null
    });
    const [isValidUrl, setIsValidUrl] = useState(true);

    useEffect(() => {
        if (shortcut) {
            setFormData({
                url: shortcut.url || '',
                project: shortcut.projectId || null
            });
        }
    }, [shortcut]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'project' ? parseInt(value) : value
        }));

        if (name === 'url') {
            const urlPattern = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/;
            setIsValidUrl(urlPattern.test(value));
        }
    };

    const handleSubmit = () => {
        if (!isValidUrl) return;

        const urlWithProtocol = formData.url.startsWith('http') ?
            formData.url : `https://${formData.url}`;

        onUpdate(shortcut.id, {
            ...formData,
            url: urlWithProtocol
        });
        setEditMode(false);
    };

    if (loading || !shortcut) {
        return (
            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalHeader>
                    <ModalTitle>Shortcut Details</ModalTitle>
                    <ModalClose onClick={onClose} />
                </ModalHeader>
                <ModalContent>
                    <SkeletonText lines={5} />
                </ModalContent>
            </Modal>
        );
    }

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalHeader>
                <ModalTitle>{editMode ? 'Edit Shortcut' : 'Shortcut Details'}</ModalTitle>
                <ModalClose onClick={onClose} />
            </ModalHeader>
            <ModalContent>
                {editMode ? (
                    <div className="space-y-4">
                        <Input
                            label="URL"
                            name="url"
                            value={formData.url}
                            onChange={handleChange}
                            className={`w-full ${!isValidUrl ? 'border-red-400' : ''}`}
                        />
                        {!isValidUrl && (
                            <p className="text-red-500 text-sm mt-1">Please enter a valid URL</p>
                        )}
                    </div>
                ) : (
                    <div className="space-y-6">
                        <div className="flex justify-between items-start">
                            <h3 className="font-bold text-xl truncate max-w-md">{shortcut.url}</h3>
                        </div>
                    </div>
                )}
            </ModalContent>
            <ModalFooter>
                {editMode ? (
                    <>
                        <Button onClick={() => setEditMode(false)} variant="default">
                            Cancel
                        </Button>
                        <Button
                            onClick={handleSubmit}
                            variant="remarked"
                            disabled={!isValidUrl}
                        >
                            <Save size={16} className="mr-2" />
                            Save Changes
                        </Button>
                    </>
                ) : (
                    <>
                        <Button
                            onClick={() => onDelete(shortcut.id)}
                            variant="danger"
                            disabled={deleteLoading}
                        >
                            {deleteLoading ? (
                                <>
                                    <Loader2 size={16} className="mr-2 animate-spin" />
                                    Deleting...
                                </>
                            ) : (
                                <>
                                    <Trash2 size={16} className="mr-2" />
                                    Delete
                                </>
                            )}
                        </Button>
                        <Button onClick={() => setEditMode(true)} variant="default">
                            <Edit2 size={16} className="mr-2" />
                            Edit
                        </Button>
                    </>
                )}
            </ModalFooter>
        </Modal>
    );
};

export const CreateShortcutModal = ({
                                        isOpen,
                                        onClose,
                                        formData,
                                        validationError,
                                        loading,
                                        onChange,
                                        onSubmit
                                    }) => {
    const [isValidUrl, setIsValidUrl] = useState(true);

    const handleUrlChange = (e) => {
        const { value } = e.target;
        const urlPattern = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/;
        setIsValidUrl(urlPattern.test(value));
        onChange(e);
    };

    const handleSubmit = () => {
        if (!isValidUrl) return;
        onSubmit();
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            className="max-w-md w-full"
        >
            <ModalHeader>
                <ModalTitle>Add New Shortcut</ModalTitle>
                <ModalClose onClick={onClose} />
            </ModalHeader>
            <ModalContent>
                <div className="space-y-6">
                    {validationError && (
                        <div className="text-red-500 text-sm flex items-center p-3 bg-red-50 rounded-md">
                            <AlertTriangle size={16} className="mr-2 flex-shrink-0" />
                            <span>{validationError}</span>
                        </div>
                    )}

                    <div>
                        <label className="text-sm font-medium text-gray-700 block mb-2 flex items-center">
                            <Link size={14} className="mr-2" />
                            URL
                        </label>
                        <input
                            name="url"
                            type="text"
                            value={formData.url}
                            onChange={handleUrlChange}
                            placeholder="https://example.com"
                            className={`mt-1 w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                                !isValidUrl ? 'border-red-400 focus:ring-red-400' : 'focus:ring-oracleRed'
                            }`}
                        />
                        {!isValidUrl && formData.url && (
                            <p className="mt-1 text-sm text-red-600">Please enter a valid URL</p>
                        )}
                        <p className="mt-1 text-xs text-gray-500">
                            Enter the full URL including https:// or http://
                        </p>
                    </div>
                </div>
            </ModalContent>

            <ModalFooter>
                <Button
                    onClick={onClose}
                    variant="default"
                >
                    Cancel
                </Button>
                <Button
                    onClick={handleSubmit}
                    variant="remarked"
                    disabled={!formData.url || !isValidUrl || loading}
                >
                    {loading ? (
                        <>
                            <Loader2 size={16} className="mr-2 animate-spin" />
                            Adding...
                        </>
                    ) : (
                        <>
                            <Save size={16} className="mr-2" />
                            Add Shortcut
                        </>
                    )}
                </Button>
            </ModalFooter>
        </Modal>
    );
};