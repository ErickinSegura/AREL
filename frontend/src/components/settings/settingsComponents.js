import React, { useRef, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '../../lib/ui/Card';
import { useProjectUsers } from '../../hooks/useProjectUsers';
import { Button } from '../../lib/ui/Button';
import { Input } from '../../lib/ui/Input';
import { Modal, ModalDescription, ModalHeader, ModalTitle, ModalContent, ModalFooter, ModalClose } from '../../lib/ui/Modal';
import {
    FiFolder,
    FiCodesandbox,
    FiCode,
    FiFileText,
    FiStar,
    FiBookmark,
    FiRefreshCw,
    FiAlertTriangle,
    FiChevronDown,
    FiLoader,
    FiTrash2,
    FiPlus,
    FiUser,
    FiUserPlus,
    FiSearch,
    FiCheck,
    FiUserX,
    FiUsers, FiTag
} from 'react-icons/fi';
import { FiCheck as Check } from 'react-icons/fi';
import { Skeleton, SkeletonText, SkeletonCircle } from '../../lib/ui/Skeleton';
import {useCategory} from "../../hooks/useCategory";

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

export const ErrorState = ({ error }) => (
    <div className="p-6 flex flex-col items-center justify-center h-full">
        <Card className="w-full max-w-md text-center">
            <CardHeader>
                <CardTitle className="text-2xl">
                    Error <span className="text-oracleRed">Loading Settings</span>
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex justify-center mb-6">
                    <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center text-red-500">
                        <FiAlertTriangle size={32} />
                    </div>
                </div>
                <div className="bg-red-50 p-4 rounded-lg mb-6">
                    <p className="text-red-600 font-medium">{error}</p>
                </div>
                <Button
                    variant="outline"
                    className="flex items-center gap-2"
                    onClick={() => window.location.reload()}
                >
                    <FiRefreshCw size={16} />
                    Retry
                </Button>
            </CardContent>
        </Card>
    </div>
);

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

export const ProjectHeader = ({ selectedProject, loading }) => (
    <Card className="mb-6">
        <CardHeader>
            <div className={`flex items-center ${loading ? 'animate-pulse' : ''}`}>
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
                                className="w-12 h-12 rounded-xl grid place-items-center text-white"
                                style={{ backgroundColor: selectedProject?.color?.hexColor || '#808080' }}
                            >
                                {getProjectIcon(selectedProject?.icon)}
                            </div>
                            <h1 className="text-2xl font-bold px-3">
                                {selectedProject?.projectName} <span className="text-oracleRed">Settings</span>
                            </h1>
                        </div>
                    )}
                </CardTitle>
            </div>
        </CardHeader>
    </Card>
);

export const SettingsForm = ({
                                 loading,
                                 saving,
                                 formData,
                                 handleChange,
                                 handleSubmit,
                                 resetForm,
                                 error
                             }) => {
    const colorMenuRef = useRef(null);
    const iconMenuRef = useRef(null);
    const [isColorMenuOpen, setIsColorMenuOpen] = useState(false);
    const [isIconMenuOpen, setIsIconMenuOpen] = useState(false);

    const iconOptions = [
        { id: 1, icon: <FiFolder size={24} />, label: 'Folder' },
        { id: 2, icon: <FiCodesandbox size={24} />, label: 'Code' },
        { id: 3, icon: <FiCode size={24} />, label: 'Code' },
        { id: 4, icon: <FiFileText size={24} />, label: 'Document' },
        { id: 5, icon: <FiStar size={24} />, label: 'Star' },
        { id: 6, icon: <FiBookmark size={24} />, label: 'Bookmark' },
    ];

    const colorOptions = [
        { id: 1, hex: '4984B8', name: 'Light Blue' },
        { id: 2, hex: '2E6F40', name: 'Green' },
        { id: 3, hex: 'E63946', name: 'Red' },
        { id: 4, hex: 'FFBE0B', name: 'Yellow' },
        { id: 5, hex: '8338EC', name: 'Purple' },
        { id: 6, hex: 'FF006E', name: 'Pink' },
        { id: 7, hex: '3A86FF', name: 'Blue' },
    ];

    const getSelectedIcon = () => {
        return iconOptions.find(icon => icon.id === formData.iconId) || iconOptions[0];
    };

    const getSelectedColor = () => {
        return colorOptions.find(color => color.id === formData.colorId) || colorOptions[0];
    };

    const updateFormField = (name, value) => {
        handleChange({ target: { name, value } });
    };

    return (
        <Card>
            <form onSubmit={handleSubmit}>
                <CardHeader>
                    <CardTitle>
                        {loading ? (
                            <SkeletonText className="w-48" />
                        ) : (
                            <div className="font-bold">Project <span className="text-oracleRed">Information</span></div>
                        )}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="space-y-4">
                            <div>
                                <SkeletonText className="w-32 mb-2" />
                                <Skeleton className="w-full h-10" />
                            </div>
                            <div>
                                <SkeletonText className="w-36 mb-2" />
                                <Skeleton className="w-full h-24" />
                            </div>
                            <div>
                                <SkeletonText className="w-40 mb-2" />
                                <Skeleton className="w-full h-12" />
                            </div>
                            <div>
                                <SkeletonText className="w-36 mb-2" />
                                <Skeleton className="w-full h-12" />
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {error && (
                                <div className="bg-red-50 p-4 rounded-lg mb-4">
                                    <p className="text-red-600 font-medium">{error}</p>
                                </div>
                            )}

                            <Input
                                label="Project Name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Enter project name"
                                required
                            />

                            <div className="flex flex-col gap-1">
                                <label className="text-sm font-medium text-gray-700">
                                    Description
                                </label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    placeholder="Enter project description"
                                    className="px-4 py-2 border rounded-xl bg-white text-sm focus:outline-none focus:ring-2 focus:ring-oracleRed"
                                    rows={3}
                                />
                            </div>

                            <div className="flex flex-col gap-4">
                                <div className="w-full">
                                    <label className="text-sm font-medium text-gray-700 block mb-2">
                                        Project Color
                                    </label>
                                    <div ref={colorMenuRef} className="relative">
                                        <button
                                            type="button"
                                            className="flex items-center justify-between w-full px-4 py-3 border rounded-xl bg-white hover:bg-gray-50 transition-colors"
                                            onClick={() => {
                                                setIsColorMenuOpen(!isColorMenuOpen);
                                                setIsIconMenuOpen(false);
                                            }}
                                            aria-expanded={isColorMenuOpen}
                                            aria-haspopup="true"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div
                                                    className="w-6 h-6 rounded-full shadow-sm"
                                                    style={{ backgroundColor: `#${getSelectedColor().hex}` }}
                                                    aria-hidden="true"
                                                ></div>
                                                <span className="text-sm font-medium">
                                                    {getSelectedColor().name}
                                                </span>
                                            </div>
                                            <FiChevronDown
                                                className={`transition-transform duration-200 ${isColorMenuOpen ? 'transform rotate-180' : ''}`}
                                            />
                                        </button>

                                        {isColorMenuOpen && (
                                            <div className="absolute z-10 mt-1 w-full bg-white border rounded-xl shadow-lg p-3 max-h-64 overflow-y-auto">
                                                <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">
                                                    {colorOptions.map((color) => (
                                                        <button
                                                            key={color.id}
                                                            type="button"
                                                            className={`w-full aspect-square rounded-full flex items-center justify-center p-1 transition-all hover:scale-110 ${
                                                                formData.colorId === color.id ? 'ring-2 ring-offset-2 ring-oracleRed' : ''
                                                            }`}
                                                            style={{ backgroundColor: `#${color.hex}` }}
                                                            onClick={() => {
                                                                updateFormField('colorId', color.id);
                                                                setIsColorMenuOpen(false);
                                                            }}
                                                            title={color.name}
                                                            aria-label={`Select ${color.name} color`}
                                                        >
                                                            {formData.colorId === color.id && (
                                                                <Check size={16} className="text-white" />
                                                            )}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="w-full">
                                    <label className="text-sm font-medium text-gray-700 block mb-2">
                                        Project Icon
                                    </label>
                                    <div ref={iconMenuRef} className="relative">
                                        <button
                                            type="button"
                                            className="flex items-center justify-between w-full px-4 py-3 border rounded-xl bg-white hover:bg-gray-50 transition-colors"
                                            onClick={() => {
                                                setIsIconMenuOpen(!isIconMenuOpen);
                                                setIsColorMenuOpen(false);
                                            }}
                                            aria-expanded={isIconMenuOpen}
                                            aria-haspopup="true"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="text-gray-700 bg-gray-100 p-2 rounded-xl">
                                                    {getSelectedIcon().icon}
                                                </div>
                                                <span className="text-sm font-medium">{getSelectedIcon().label}</span>
                                            </div>
                                            <FiChevronDown
                                                className={`transition-transform duration-200 ${isIconMenuOpen ? 'transform rotate-180' : ''}`}
                                            />
                                        </button>

                                        {isIconMenuOpen && (
                                            <div className="absolute z-10 mt-1 w-full bg-white border rounded-xl shadow-lg p-3 max-h-64 overflow-y-auto">
                                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                                    {iconOptions.map((option) => (
                                                        <button
                                                            key={option.id}
                                                            type="button"
                                                            className={`flex items-center gap-2 p-3 rounded-xl w-full transition-colors ${
                                                                formData.iconId === option.id
                                                                    ? 'bg-gray-100 ring-2 ring-oracleRed text-oracleRed'
                                                                    : 'hover:bg-gray-50'
                                                            }`}
                                                            onClick={() => {
                                                                updateFormField('iconId', option.id);
                                                                setIsIconMenuOpen(false);
                                                            }}
                                                            aria-label={`Select ${option.label} icon`}
                                                        >
                                                            <div className={`${formData.iconId === option.id ? 'text-oracleRed' : 'text-gray-700'}`}>
                                                                {option.icon}
                                                            </div>
                                                            <span className="text-sm">{option.label}</span>
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </CardContent>
                <CardFooter className="flex justify-end gap-3">
                    <Button
                        variant="default"
                        onClick={resetForm}
                        type="button"
                        disabled={loading || saving}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="remarked"
                        type="submit"
                        disabled={loading || saving || !formData.name}
                    >
                        {saving ? (
                            <div className="flex items-center gap-2">
                                <span className="animate-spin"><FiLoader size={16} /></span>
                                <span>Saving...</span>
                            </div>
                        ) : (
                            'Save Changes'
                        )}
                    </Button>
                </CardFooter>
            </form>
        </Card>
    );
};

export const DangerZoneCard = ({
                                   loading,
                                   onDeleteProject,
                                   deleteLoading,
                                   projectName = ""
                               }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [confirmText, setConfirmText] = useState("");

    const handleOpenModal = () => {
        setIsModalOpen(true);
        setConfirmText("");
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setConfirmText("");
    };

    const handleConfirmDelete = () => {
        if (confirmText === projectName) {
            onDeleteProject();
            handleCloseModal();
        }
    };

    const handleInputChange = (e) => {
        setConfirmText(e.target.value);
    };

    return (
        <>
            <Card className="border-red-200 mt-6">
                <CardHeader>
                    <CardTitle className="text-red-600">
                        {loading ? (
                            <SkeletonText className="w-36" />
                        ) : (
                            <>Danger Zone</>
                        )}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="space-y-4">
                            <SkeletonText className="w-full" lines={2} />
                            <Skeleton className="w-40 h-10" />
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <div className="p-4 bg-red-50 rounded-xl">
                                <h3 className="font-medium text-red-700 mb-2">Delete this project</h3>
                                <p className="text-red-600 text-sm mb-4">
                                    Once you delete a project, there is no going back. This action cannot be undone.
                                    All data associated with this project will be permanently deleted.
                                </p>
                                <Button
                                    variant="danger"
                                    className="border-red-300 text-red-600 hover:bg-red-50 flex items-center gap-2"
                                    onClick={handleOpenModal}
                                    disabled={deleteLoading}
                                    startIcon={deleteLoading ? <FiLoader className="animate-spin" /> : <FiTrash2 />}
                                >
                                    {deleteLoading ? "Deleting..." : "Delete Project"}
                                </Button>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>

            <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
                <ModalClose onClick={handleCloseModal} />
                <ModalHeader>
                    <ModalTitle className="text-red-600 flex items-center gap-2">
                        <FiAlertTriangle /> Confirm Project Deletion
                    </ModalTitle>
                    <ModalDescription>
                        This action cannot be undone. All data will be permanently deleted.
                    </ModalDescription>
                </ModalHeader>
                <ModalContent>
                    <div className="space-y-4">
                        <p className="text-sm text-gray-700">
                            To confirm deletion, please type the project name: <strong>{projectName}</strong>
                        </p>
                        <Input
                            value={confirmText}
                            onChange={handleInputChange}
                            placeholder="Enter project name"
                            className="mt-2"
                        />
                    </div>
                </ModalContent>
                <ModalFooter>
                    <Button
                        variant="default"
                        onClick={handleCloseModal}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="danger"
                        onClick={handleConfirmDelete}
                        disabled={confirmText !== projectName}
                        startIcon={deleteLoading ? <FiLoader className="animate-spin" /> : <FiTrash2 />}
                    >
                        {deleteLoading ? "Deleting..." : "Delete Project"}
                    </Button>
                </ModalFooter>
            </Modal>
        </>
    );
};


export const ProjectUsers = ({ projectId, loading = false }) => {
    const {
        filteredUsers,
        searchTerm,
        usersLoading,
        error,
        isAddUserModalOpen,
        availableUsers,
        selectedUsers,
        addingUsers,
        removingUserId,
        handleSearchChange,
        handleOpenAddUserModal,
        handleCloseAddUserModal,
        toggleUserSelection,
        handleAddUsers,
        handleRemoveUser,
        filterAvailableUsers
    } = useProjectUsers(projectId);

    const UserListSkeleton = () => (
        <div className="space-y-4">
            {[1, 2, 3, 4].map((item) => (
                <div key={item} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                    <div className="flex items-center space-x-3">
                        <SkeletonCircle size="md" />
                        <div>
                            <SkeletonText className="w-32" />
                            <SkeletonText className="w-48" />
                        </div>
                    </div>
                    <Skeleton className="w-24 h-8" />
                </div>
            ))}
        </div>
    );

    return (
        <>
            <Card className="mt-6">
                <CardHeader>
                    <div className={`flex items-center justify-between ${usersLoading ? 'animate-pulse' : ''}`}>
                        <CardTitle>
                            {usersLoading ? (
                                <div className="flex items-center">
                                    <SkeletonCircle size="md" />
                                    <div className="ml-3 w-48">
                                        <SkeletonText lines={1} />
                                    </div>
                                </div>
                            ) : (
                                <div className="flex items-center">
                                    <h1 className="text-2xl font-bold px-2">Project <span className="text-oracleRed">Users</span></h1>
                                </div>
                            )}
                        </CardTitle>

                        {!usersLoading && (
                            <div className="flex space-x-2">
                                <Button
                                    variant="remarked"
                                    className="flex items-center gap-2"
                                    onClick={handleOpenAddUserModal}
                                >
                                    <FiUserPlus size={16} />
                                    Add Users
                                </Button>
                            </div>
                        )}
                    </div>
                </CardHeader>
                <CardContent>
                    {loading || usersLoading ? (
                        <UserListSkeleton />
                    ) : (
                        <div className="space-y-4">
                            {error && (
                                <div className="bg-red-50 p-4 rounded-lg">
                                    <p className="text-red-600 font-medium">{error}</p>
                                </div>
                            )}

                            <div className="relative">
                                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                <Input
                                    placeholder="Search users by name or email"
                                    value={searchTerm}
                                    onChange={handleSearchChange}
                                    className="pl-10"
                                />
                            </div>

                            {filteredUsers.length === 0 ? (
                                <div className="text-center py-8">
                                    <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 mx-auto mb-4">
                                        <FiUsers size={32} />
                                    </div>
                                    <h3 className="text-lg font-medium text-gray-700 mb-1">No users found</h3>
                                    <p className="text-gray-500 text-sm">
                                        {searchTerm ? "Try a different search term" : "This project doesn't have any users assigned"}
                                    </p>
                                </div>
                            ) : (
                                <div className="space-y-2 mt-4">
                                    {filteredUsers.map(user => (
                                        <div
                                            key={user.id}
                                            className="flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors"
                                        >
                                            <div className="flex items-center space-x-3">
                                                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                                                    <FiUser size={20} />
                                                </div>
                                                <div>
                                                    <h3 className="font-medium">{user.firstName} {user.lastName}</h3>
                                                    <p className="text-sm text-gray-500">{user.email}</p>
                                                </div>
                                            </div>
                                            <Button
                                                className="text-red-500 hover:bg-red-50 hover:border-red-200"
                                                onClick={() => handleRemoveUser(user.id)}
                                                disabled={removingUserId === user.id}
                                            >
                                                {removingUserId === user.id ? (
                                                    <FiLoader className="animate-spin" size={16} />
                                                ) : (
                                                    <FiUserX size={16} />
                                                )}
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Add User Modal */}
            <Modal isOpen={isAddUserModalOpen} onClose={handleCloseAddUserModal}>
                <ModalClose onClick={handleCloseAddUserModal} />
                <ModalHeader>
                    <ModalTitle className="flex items-center gap-2">
                        <FiUserPlus /> Add Users to Project
                    </ModalTitle>
                    <ModalDescription>
                        Select users to add to this project
                    </ModalDescription>
                </ModalHeader>
                <ModalContent>
                    <div className="space-y-4">
                        <div className="relative">
                            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <Input
                                placeholder="Search users by name or email"
                                className="pl-10"
                                onChange={(e) => filterAvailableUsers(e.target.value)}
                            />
                        </div>

                        <div className="max-h-72 overflow-y-auto">
                            {availableUsers.length === 0 ? (
                                <div className="text-center py-8">
                                    <p className="text-gray-500">No available users found</p>
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    {availableUsers.map(user => (
                                        <div
                                            key={user.id}
                                            className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition-colors ${
                                                selectedUsers.includes(user.id)
                                                    ? 'bg-red-50 border border-red-200'
                                                    : 'bg-gray-50 border border-white hover:bg-gray-100'
                                            }`}
                                            onClick={() => toggleUserSelection(user.id)}
                                        >
                                            <div className="flex items-center space-x-3">
                                                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                                    selectedUsers.includes(user.id)
                                                        ? 'bg-red-100 text-oracleRed'
                                                        : 'bg-gray-200 text-gray-500'
                                                }`}>
                                                    <FiUser size={20} />
                                                </div>
                                                <div>
                                                    <h3 className="font-medium">{user.firstName} {user.lastName}</h3>
                                                    <p className="text-sm text-gray-500">{user.email}</p>
                                                </div>
                                            </div>
                                            <div className={`w-6 h-6 rounded-full border flex items-center justify-center ${
                                                selectedUsers.includes(user.id)
                                                    ? 'border-oracleRed bg-oracleRed text-white'
                                                    : 'border-gray-300'
                                            }`}>
                                                {selectedUsers.includes(user.id) && <FiCheck size={14} />}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </ModalContent>
                <ModalFooter>
                    <Button
                        variant="default"
                        onClick={handleCloseAddUserModal}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="remarked"
                        onClick={handleAddUsers}
                        disabled={selectedUsers.length === 0 || addingUsers}
                        className="flex items-center gap-2 w-40"
                    >
                        {addingUsers ? (
                            <>
                                <FiLoader className="animate-spin" size={16} />
                                <span>Adding...</span>
                            </>
                        ) : (
                            <>
                                <FiPlus size={16} />
                                <span className="w-4/5">Add {selectedUsers.length} {selectedUsers.length === 1 ? 'User' : 'Users'}</span>
                            </>
                        )}
                    </Button>
                </ModalFooter>
            </Modal>
        </>
    );
};

export const ProjectCategories = ({ loading = false }) => {
    const { categories, loading: categoriesLoading, error, addCategory, deleteCategory, updateCategory } = useCategory();
    const [isAddCategoryModalOpen, setIsAddCategoryModalOpen] = useState(false);
    const [formSubmitting, setFormSubmitting] = useState(false);
    const [newCategoryName, setNewCategoryName] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const handleOpenAddCategoryModal = () => {
        setIsAddCategoryModalOpen(true);
        setNewCategoryName("");
        setErrorMessage("");
    };

    const handleCloseAddCategoryModal = () => {
        setIsAddCategoryModalOpen(false);
    };

    const handleAddCategory = async (e) => {
        e?.preventDefault();
        if (!newCategoryName.trim()) return;

        setFormSubmitting(true);
        try {
            await addCategory({ name: newCategoryName });
            setNewCategoryName("");
            handleCloseAddCategoryModal();
        } catch (error) {
            console.error("Error adding category:", error);
            setErrorMessage(error?.message || "Failed to add category");
        } finally {
            setFormSubmitting(false);
        }
    };

    const handleDeleteCategory = async (categoryId) => {
        try {
            await deleteCategory(categoryId);
        } catch (error) {
            console.error("Error deleting category:", error);
            setErrorMessage(error?.message || "Failed to delete category");
        }
    };

    const handleUpdateCategory = async (categoryId, category) => {
        try {
            await updateCategory(categoryId, category);
        } catch (error) {
            console.error("Error updating category:", error);
            setErrorMessage(error?.message || "Failed to update category");
        }
    };

    return (
        <>
            <Card className="mt-6">
                <CardHeader>
                    <div className={`flex items-center justify-between ${categoriesLoading ? 'animate-pulse' : ''}`}>
                        <CardTitle>
                            {categoriesLoading ? (
                                <div className="flex items-center">
                                    <SkeletonCircle size="md" />
                                    <div className="ml-3 w-48">
                                        <SkeletonText lines={1} />
                                    </div>
                                </div>
                            ) : (
                                <div className="flex items-center">
                                    <h1 className="text-2xl font-bold px-2">Project <span className="text-oracleRed">Categories</span></h1>
                                </div>
                            )}
                        </CardTitle>

                        {!categoriesLoading && (
                            <div className="flex space-x-2">
                                <Button
                                    variant="remarked"
                                    className="flex items-center gap-2"
                                    onClick={handleOpenAddCategoryModal}
                                >
                                    <FiPlus size={16} />
                                    Add Category
                                </Button>
                            </div>
                        )}
                    </div>
                </CardHeader>
                <CardContent>
                    {loading || categoriesLoading ? (
                        <div className="space-y-4">
                            {[1, 2, 3, 4].map((item) => (
                                <div key={item} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                                    <div className="flex items-center space-x-3">
                                        <SkeletonCircle size="md" />
                                        <div>
                                            <SkeletonText className="w-32" />
                                            <SkeletonText className="w-48" />
                                        </div>
                                    </div>
                                    <Skeleton className="w-24 h-8" />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {error && (
                                <div className="bg-red-50 p-4 rounded-lg">
                                    <p className="text-red-600 font-medium">
                                        {typeof error === 'object' ? (error.message || "An error occurred while loading categories") : error}
                                    </p>
                                </div>
                            )}

                            {categories.length === 0 ? (
                                <div className="text-center py-8">
                                    <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 mx-auto mb-4">
                                        <FiTag size={32} />
                                    </div>
                                    <h3 className="text-lg font-medium text-gray-700 mb-1">No categories found</h3>
                                    <p className="text-gray-500 text-sm mb-4">This project doesn't have any categories assigned</p>
                                </div>
                            ) : (
                                categories.map(category => (
                                    <CategoryItem
                                        key={category.id}
                                        category={category}
                                        onDelete={handleDeleteCategory}
                                        onUpdate={handleUpdateCategory}
                                    />
                                ))
                            )}
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Add Category Modal */}
            <Modal isOpen={isAddCategoryModalOpen} onClose={handleCloseAddCategoryModal}>
                <ModalClose onClick={handleCloseAddCategoryModal} />
                <ModalHeader>
                    <ModalTitle className="flex items-center gap-2">
                        <FiPlus /> Add Category
                    </ModalTitle>
                    <ModalDescription>
                        Create a new category for this project
                    </ModalDescription>
                </ModalHeader>

                <form onSubmit={handleAddCategory}>
                    <ModalContent>
                        <div className="space-y-4">
                            {errorMessage && (
                                <div className="bg-red-50 p-3 rounded-lg">
                                    <p className="text-red-600 text-sm">{errorMessage}</p>
                                </div>
                            )}
                            <Input
                                type="text"
                                placeholder="Category Name"
                                value={newCategoryName}
                                onChange={(e) => setNewCategoryName(e.target.value)}
                                required
                            />
                        </div>
                    </ModalContent>

                    <ModalFooter>
                        <Button
                            variant="remarked"
                            type="submit"
                            disabled={formSubmitting || !newCategoryName.trim()}
                            className="flex items-center gap-2 w-40"
                        >
                            {formSubmitting ? (
                                <>
                                    <FiLoader className="animate-spin" size={16} />
                                    <span>Adding...</span>
                                </>
                            ) : (
                                <>
                                    <FiPlus size={16} />
                                    <span>Add Category</span>
                                </>
                            )}
                        </Button>
                    </ModalFooter>
                </form>
            </Modal>
        </>
    );
};

export const CategoryItem = ({ category, onDelete, onUpdate }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [categoryName, setCategoryName] = useState(category.name);
    const [isLoading, setIsLoading] = useState(false);

    const handleUpdate = async () => {
        if (!categoryName.trim()) return;

        setIsLoading(true);
        try {
            await onUpdate(category.id, { name: categoryName });
            setIsEditing(false);
        } catch (error) {
            console.error("Error updating category:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCancel = () => {
        setCategoryName(category.name);
        setIsEditing(false);
    };

    return (
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
            {isEditing ? (
                <div className="flex items-center space-x-3">
                    <Input
                        type="text"
                        value={categoryName}
                        onChange={(e) => setCategoryName(e.target.value)}
                        className="w-1/2"
                    />
                </div>
            ) : (
                <div className="flex items-center space-x-3">
                    <div
                        className="w-10 h-10 rounded-full"
                        style={{ backgroundColor: "#C74634" }}
                    ></div>
                    <span>{category.name}</span>
                </div>
            )}
            <div className="flex items-center space-x-2">
                {isEditing ? (
                    <>
                        <Button
                            variant="default"
                            onClick={handleUpdate}
                            disabled={isLoading || !categoryName.trim()}
                        >
                            {isLoading ? <FiLoader className="animate-spin" size={16} /> : "Save"}
                        </Button>
                        <Button
                            variant="default"
                            onClick={handleCancel}
                            disabled={isLoading}
                        >
                            Cancel
                        </Button>
                    </>
                ) : (
                    <>
                        <Button
                            variant="default"
                            onClick={() => setIsEditing(true)}
                        >
                            Edit
                        </Button>
                        <Button
                            variant="danger"
                            onClick={() => onDelete(category.id)}
                        >
                            Delete
                        </Button>
                    </>
                )}
            </div>
        </div>
    );
};