import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../lib/ui/Card';
import { Button } from "../../lib/ui/Button";
import { Modal, ModalHeader, ModalTitle, ModalContent, ModalFooter, ModalClose } from "../../lib/ui/Modal";
import { Input } from "../../lib/ui/Input";
import { SkeletonCircle, SkeletonText } from "../../lib/ui/Skeleton";
import {Link, ExternalLink, Plus, Loader2, Trash2, Edit2, Save, AlertTriangle, Globe, Book, Clipboard, InfoIcon} from 'lucide-react';
import {
    FiBookmark,
    FiCode,
    FiCodesandbox,
    FiFileText,
    FiFolder,
    FiStar
} from "react-icons/fi";

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

const getDomainFromUrl = (url) => {
    try {
        const urlObj = new URL(url.startsWith('http') ? url : `https://${url}`);
        return urlObj.hostname;
    } catch (error) {
        return url;
    }
};

export const ShortcutCard = ({ shortcut, onSelectShortcut }) => {

    const displayUrl = getDomainFromUrl(shortcut.url || '');

    return (
        <Card
            className="hover:shadow-md transition-all cursor-pointer"
            onClick={() => onSelectShortcut(shortcut.id)}
        >
            <CardContent className="pt-4 pb-4">
                <div className="flex flex-row justify-between items-center gap-2">
                    <div className="flex items-center min-w-0 flex-1">
                        <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gray-100 flex items-center justify-center text-oracleRed flex-shrink-0">
                            <Globe size={16} className="md:w-5 md:h-5" />
                        </div>
                        <div className="ml-2 md:ml-3 overflow-hidden">
                            <h3 className="font-medium text-sm md:text-base lg:text-lg truncate">
                                {shortcut.name || displayUrl}
                            </h3>
                            <p className="text-xs md:text-sm text-gray-500 truncate max-w-full">
                                {shortcut.url}
                            </p>
                        </div>
                    </div>
                    <Button
                        className="flex-shrink-0 ml-2"
                        onClick={(e) => {
                            e.stopPropagation();
                            window.open(shortcut.url, '_blank');
                        }}
                    >
                        <ExternalLink size={14} className="md:w-4 md:h-4" />
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
    const [showConfirmDelete, setShowConfirmDelete] = useState(false);
    const displayUrl = getDomainFromUrl(shortcut?.url || '');

    useEffect(() => {
        if (shortcut) {
            setFormData({
                url: shortcut.url || '',
                project: shortcut.projectId || null
            });
            setEditMode(false);
            setShowConfirmDelete(false);
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

    const copyToClipboard = () => {
        navigator.clipboard.writeText(shortcut.url);
    };

    const openUrl = () => {
        window.open(shortcut.url, '_blank');
    };

    // Estado de carga
    if (loading || !shortcut) {
        return (
            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalHeader>
                    <ModalTitle>Detalles del Acceso Directo</ModalTitle>
                    <ModalClose onClick={onClose} />
                </ModalHeader>
                <ModalContent>
                    <div className="space-y-6 py-4">
                        <SkeletonText className="h-6 w-3/4" />
                        <SkeletonText className="h-5 w-full" />
                        <SkeletonText className="h-5 w-2/3" />
                    </div>
                </ModalContent>
            </Modal>
        );
    }

    return (
        <Modal isOpen={isOpen} onClose={onClose} className="max-w-lg">
            <ModalHeader>
                <ModalTitle className="text-xl font-semibold">
                    {editMode ? 'Edit URL' : 'URL Details'}
                </ModalTitle>
                <ModalClose onClick={onClose} />
            </ModalHeader>

            <ModalContent className="p-6">
                {editMode ? (
                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Name
                            </label>
                            <Input
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Enter name"
                                className={`w-full ${!isValidUrl ? 'border-red-400 focus:ring-red-400' : ''}`}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                URL
                            </label>
                            <Input
                                name="url"
                                value={formData.url}
                                onChange={handleChange}
                                placeholder="https://ejemplo.com"
                                className={`w-full ${!isValidUrl ? 'border-red-400 focus:ring-red-400' : ''}`}
                            />
                            {!isValidUrl && (
                                <p className="text-red-500 text-sm mt-1">Please, enter a valid URL</p>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {/* Información del acceso directo */}
                        <div className="flex flex-col space-y-4">
                            <div>
                                <h3 className="text-sm font-medium text-gray-500">Name</h3>
                                <p className="mt-1 text-lg font-medium">{shortcut.name || displayUrl}</p>
                            </div>

                            <div>
                                <h3 className="text-sm font-medium text-gray-500">URL</h3>
                                <div className="mt-1 flex items-center">
                                    <div className="bg-gray-100 rounded-xl p-3 flex-grow overflow-hidden">
                                        <p className="text-gray-800 font-mono text-sm truncate">{shortcut.url}</p>
                                    </div>
                                    <button
                                        onClick={copyToClipboard}
                                        className="ml-2 p-2 text-gray-500 hover:text-gray-700 rounded-xl hover:bg-gray-100"
                                        title="Copiar URL"
                                    >
                                        <Clipboard className="h-5 w-5" />
                                    </button>
                                </div>
                            </div>

                            <div className="pt-4">
                                <Button
                                    onClick={openUrl}
                                    variant="outline"
                                    className="w-full flex items-center justify-center"
                                >
                                    <ExternalLink size={16} className="mr-2" />
                                    Open in new tab
                                </Button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Panel de confirmación de eliminación */}
                {showConfirmDelete && !editMode && (
                    <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-xl">
                        <h4 className="font-medium text-red-800">¿Eliminar este acceso directo?</h4>
                        <p className="mt-1 text-sm text-red-600">Esta acción no se puede deshacer.</p>

                        <div className="mt-4 flex space-x-3">
                            <Button
                                onClick={() => setShowConfirmDelete(false)}
                                className="border-red-300 text-red-700 hover:bg-red-50"
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={() => onDelete(shortcut.id)}
                                disabled={deleteLoading}
                                className="bg-red-600 text-white hover:bg-red-700"
                            >
                                {deleteLoading ? (
                                    <>
                                        <Loader2 size={14} className="mr-2 animate-spin" />
                                        Deleting...
                                    </>
                                ) : (
                                    <>
                                        <Trash2 size={14} className="mr-2" />
                                        Confirm Delete
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>
                )}
            </ModalContent>

            <ModalFooter>
                {editMode ? (
                    <div className="flex justify-end space-x-3 w-full">
                        <Button onClick={() => setEditMode(false)} variant="outline">
                            Cancel
                        </Button>
                        <Button
                            onClick={handleSubmit}
                            variant="remarked"
                            disabled={!isValidUrl}
                            className="bg-oracleRed"
                        >
                            <Save size={16} className="mr-2" />
                            Save Changes
                        </Button>
                    </div>
                ) : (
                    <div className="flex justify-end space-x-3 w-full">
                        <Button
                            onClick={() => setShowConfirmDelete(true)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            disabled={deleteLoading || showConfirmDelete}
                        >
                            <Trash2 size={16} className="mr-2" />
                            Delete
                        </Button>
                        <Button
                            onClick={() => setEditMode(true)}
                            className="bg-oracleRed text-white hover:bg-red-700"
                        >
                            <Edit2 size={16} className="mr-2" />
                            Edit
                        </Button>
                    </div>
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

    const handleNameChange = (e) => {
        const { value } = e.target;
        onChange({
            target: {
                name: 'name',
                value
            }
        });
    }

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
                        <div className="text-red-500 text-sm flex items-center p-3 bg-red-50 rounded-xl">
                            <AlertTriangle size={16} className="mr-2 flex-shrink-0" />
                            <span>{validationError}</span>
                        </div>
                    )}

                    <div>
                        <label className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                            <Book size={14} className="mr-2" />
                            Name
                        </label>
                        <input
                            name="name"
                            type="text"
                            value={formData.name}
                            onChange={handleNameChange}
                            placeholder=""
                            className={`mt-1 w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 ${
                                !isValidUrl ? 'border-red-400 focus:ring-red-400' : 'focus:ring-oracleRed'
                            }`}
                        />
                    </div>

                    <div>
                        <label className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                            <Link size={14} className="mr-2" />
                            URL
                        </label>
                        <input
                            name="url"
                            type="text"
                            value={formData.url}
                            onChange={handleUrlChange}
                            placeholder="https://example.com"
                            className={`mt-1 w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 ${
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