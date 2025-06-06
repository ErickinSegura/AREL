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
    FiUserPlus,
    FiSearch,
    FiCheck,
    FiUserX,
    FiUsers,
    FiTag,
    FiEdit3, FiCalendar
} from 'react-icons/fi';
import { FiCheck as Check } from 'react-icons/fi';
import { Skeleton, SkeletonText, SkeletonCircle } from '../../lib/ui/Skeleton';
import {useCategory} from "../../hooks/useCategory";
import {AvatarRenderer} from "../../lib/AvatarRenderer";
import {useSprints} from "../../hooks/useSprints";

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
        // Manejar tanto formData.colorId como formData.color.id
        const colorId = formData.colorId || (formData.color && formData.color.id);
        return colorOptions.find(color => color.id === colorId) || colorOptions[0];
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
                                                    {colorOptions.map((color) => {
                                                        const currentColorId = formData.colorId || (formData.color && formData.color.id);
                                                        return (
                                                            <button
                                                                key={color.id}
                                                                type="button"
                                                                className={`w-full aspect-square rounded-full flex items-center justify-center p-1 transition-all hover:scale-110 ${
                                                                    currentColorId === color.id ? 'ring-2 ring-offset-2 ring-oracleRed' : ''
                                                                }`}
                                                                style={{ backgroundColor: `#${color.hex}` }}
                                                                onClick={() => {
                                                                    updateFormField('colorId', color.id);
                                                                    setIsColorMenuOpen(false);
                                                                }}
                                                                title={color.name}
                                                                aria-label={`Select ${color.name} color`}
                                                            >
                                                                {currentColorId === color.id && (
                                                                    <Check size={16} className="text-white" />
                                                                )}
                                                            </button>
                                                        );
                                                    })}
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
        loadingAvailableUsers,
        isDeleteModalOpen,
        userToDelete,
        userRoles,
        isEditRoleModalOpen,
        userToEditRole,
        newRole,
        updatingRole,
        handleSearchChange,
        handleOpenAddUserModal,
        handleCloseAddUserModal,
        toggleUserSelection,
        handleAddUsers,
        handleOpenDeleteModal,
        handleCloseDeleteModal,
        handleConfirmRemoveUser,
        filterAvailableUsers,
        handleUserRoleChange,
        handleOpenEditRoleModal,
        handleCloseEditRoleModal,
        handleUpdateUserRole,
        setNewRole
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

                            {filteredUsers.length < 1 ? (
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
                                                    <div className="w-16 aspect-square rounded-xl overflow-hidden">
                                                        <AvatarRenderer config={user.avatar} />
                                                    </div>
                                                </div>
                                                <div>
                                                    <h3 className="font-medium">{user.firstName} {user.lastName}</h3>
                                                    <div className="flex items-center gap-2">
                                                        <p className="text-sm text-gray-500">{user.role}</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Button
                                                    onClick={() => handleOpenEditRoleModal(user)}
                                                    disabled={removingUserId === user.id}
                                                >
                                                    {removingUserId === user.id ? (
                                                        <FiLoader className="animate-spin" size={16} />
                                                    ) : (
                                                        <FiEdit3 size={16} />
                                                    )}
                                                </Button>
                                                <Button
                                                    className="text-red-500 hover:bg-red-50 hover:border-red-200"
                                                    onClick={() => handleOpenDeleteModal(user)}
                                                    disabled={removingUserId === user.id}
                                                >
                                                    {removingUserId === user.id ? (
                                                        <FiLoader className="animate-spin" size={16} />
                                                    ) : (
                                                        <FiUserX size={16} />
                                                    )}
                                                </Button>
                                            </div>
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
                            {loadingAvailableUsers ? (
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
                                            <Skeleton className="w-6 h-6 rounded-full" />
                                        </div>
                                    ))}
                                </div>
                            ) : availableUsers.length === 0 ? (
                                <div className="text-center py-8">
                                    <p className="text-gray-500">No available users found</p>
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    {availableUsers.map(user => (
                                        <div key={user.id} className="space-y-2">
                                            <div
                                                className={`flex items-center justify-between p-3 rounded-xl transition-colors ${
                                                    selectedUsers.includes(user.id)
                                                        ? 'bg-red-50 border border-red-200'
                                                        : 'bg-gray-50 border border-white hover:bg-gray-100'
                                                }`}
                                            >
                                                <div
                                                    className="flex items-center space-x-3 flex-1 cursor-pointer"
                                                    onClick={() => toggleUserSelection(user.id)}
                                                >
                                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                                        selectedUsers.includes(user.id)
                                                            ? 'bg-red-100 text-oracleRed'
                                                            : 'bg-gray-200 text-gray-500'
                                                    }`}>
                                                        <div className="w-16 aspect-square rounded-xl overflow-hidden">
                                                            <AvatarRenderer config={user.avatar} />
                                                        </div>
                                                    </div>
                                                    <div className="flex-1">
                                                        <h3 className="font-medium">{user.firstName} {user.lastName}</h3>
                                                        <p className="text-sm text-gray-500">{user.email}</p>
                                                        {selectedUsers.includes(user.id) && (
                                                            <div
                                                                className="mt-3 flex items-center gap-2"
                                                                onClick={(e) => e.stopPropagation()}
                                                                onMouseDown={(e) => e.stopPropagation()}
                                                            >
                                                                <Input
                                                                    placeholder="Enter user role (e.g., member, admin, viewer)"
                                                                    value={userRoles[user.id] || ''}
                                                                    onChange={(e) => handleUserRoleChange(user.id, e.target.value)}
                                                                    className="text-sm"
                                                                />
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className={`w-6 h-6 rounded-full border flex items-center justify-center cursor-pointer ${
                                                    selectedUsers.includes(user.id)
                                                        ? 'border-oracleRed bg-oracleRed text-white'
                                                        : 'border-gray-300'
                                                }`}
                                                     onClick={() => toggleUserSelection(user.id)}
                                                >
                                                    {selectedUsers.includes(user.id) && <FiCheck size={14} />}
                                                </div>
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
                        disabled={selectedUsers.length === 0 || addingUsers || loadingAvailableUsers}
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

            {/* Edit Role Modal */}
            <Modal isOpen={isEditRoleModalOpen} onClose={handleCloseEditRoleModal}>
                <ModalClose onClick={handleCloseEditRoleModal} />
                <ModalHeader>
                    <ModalTitle className="flex items-center gap-2">
                        <FiEdit3 /> Edit User Role
                    </ModalTitle>
                    <ModalDescription>
                        Update the role for this user in the project
                    </ModalDescription>
                </ModalHeader>
                <ModalContent>
                    <div className="space-y-4">
                        {userToEditRole && (
                            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl">
                                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                                    <div className="w-16 aspect-square rounded-xl overflow-hidden">
                                        <AvatarRenderer config={userToEditRole.avatar} />
                                    </div>
                                </div>
                                <div>
                                    <h3 className="font-medium">{userToEditRole.firstName} {userToEditRole.lastName}</h3>
                                    <p className="text-sm text-gray-500">{userToEditRole.email}</p>
                                    <p className="text-xs text-gray-400">Current role: {userToEditRole.role}</p>
                                </div>
                            </div>
                        )}

                        <div>
                            <label htmlFor="newRole" className="block text-sm font-medium text-gray-700 mb-2">
                                New Role
                            </label>
                            <Input
                                id="newRole"
                                placeholder="Enter new role (e.g., admin, member, viewer, lead)"
                                value={newRole}
                                onChange={(e) => setNewRole(e.target.value)}
                                className="w-full"
                            />
                        </div>
                    </div>
                </ModalContent>
                <ModalFooter>
                    <Button
                        variant="default"
                        onClick={handleCloseEditRoleModal}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="remarked"
                        onClick={handleUpdateUserRole}
                        disabled={!newRole.trim() || updatingRole}
                        className="flex items-center gap-2"
                    >
                        {updatingRole ? (
                            <>
                                <FiLoader className="animate-spin" size={16} />
                                <span>Updating...</span>
                            </>
                        ) : (
                            <>
                                <FiEdit3 size={16} />
                                <span>Update Role</span>
                            </>
                        )}
                    </Button>
                </ModalFooter>
            </Modal>

            {/* Delete Confirmation Modal */}
            <Modal isOpen={isDeleteModalOpen} onClose={handleCloseDeleteModal}>
                <ModalClose onClick={handleCloseDeleteModal} />
                <ModalHeader>
                    <ModalTitle className="flex items-center gap-2 text-red-600">
                        <FiAlertTriangle /> Confirm User Removal
                    </ModalTitle>
                    <ModalDescription>
                        This action cannot be undone
                    </ModalDescription>
                </ModalHeader>
                <ModalContent>
                    <div>
                        {userToDelete && (
                            <p className="text-gray-700">
                                Are you sure you want to remove <strong>{userToDelete.firstName} {userToDelete.lastName}</strong> from this project?
                            </p>
                        )}
                    </div>
                </ModalContent>
                <ModalFooter>
                    <Button
                        variant="default"
                        onClick={handleCloseDeleteModal}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="destructive"
                        onClick={handleConfirmRemoveUser}
                        disabled={removingUserId === userToDelete?.id}
                        className="flex items-center gap-2"
                    >
                        {removingUserId === userToDelete?.id ? (
                            <>
                                <FiLoader className="animate-spin" size={16} />
                                <span>Removing...</span>
                            </>
                        ) : (
                            <>
                                <FiUserX size={16} />
                                <span>Remove User</span>
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
                            <FiEdit3 size={16} />
                        </Button>
                        <Button
                            variant="danger"
                            onClick={() => onDelete(category.id)}
                        >
                            <FiTrash2 size={16} />
                        </Button>
                    </>
                )}
            </div>
        </div>
    );
};

export const ProjectSprints = ({ loading = false }) => {
    const {
        sprints,
        loading: sprintsLoading,
        error,
        deleteSprint,
        updateSprint,
        refreshSprints
    } = useSprints(true);

    const [errorMessage, setErrorMessage] = useState("");

    const handleDeleteSprint = async (sprintId) => {
        try {
            await deleteSprint(sprintId);
            await refreshSprints();
        } catch (error) {
            console.error("Error deleting sprint:", error);
            setErrorMessage(error?.message || "Failed to delete sprint");
        }
    };

    const handleUpdateSprint = async (sprintId, sprint) => {
        try {
            await updateSprint(sprintId, sprint);
            await refreshSprints();
        } catch (error) {
            console.error("Error updating sprint:", error);
            setErrorMessage(error?.message || "Failed to update sprint");
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    return (
        <>
            <Card className="mt-6 flex flex-col h-[600px] sm:h-[700px] lg:h-[800px]">
                <CardHeader className="flex-shrink-0">
                    <div className={`flex items-center justify-between ${sprintsLoading ? 'animate-pulse' : ''}`}>
                        <CardTitle>
                            {sprintsLoading ? (
                                <div className="flex items-center">
                                    <SkeletonCircle size="md" />
                                    <div className="ml-3 w-48">
                                        <SkeletonText lines={1} />
                                    </div>
                                </div>
                            ) : (
                                <div className="flex items-center">
                                    <h1 className="text-xl sm:text-2xl font-bold px-2">
                                        Project <span className="text-oracleRed">Sprints</span>
                                    </h1>
                                </div>
                            )}
                        </CardTitle>
                    </div>
                </CardHeader>

                <CardContent className="flex-1 min-h-0 p-0">
                    {loading || sprintsLoading ? (
                        <div className="space-y-4 h-full overflow-y-auto">
                            {[1, 2, 3, 4, 5, 6].map((item) => (
                                <div key={item} className="flex items-center justify-between p-3 sm:p-4 bg-gray-50 rounded-xl">
                                    <div className="flex items-center space-x-3">
                                        <SkeletonCircle size="md" />
                                        <div>
                                            <SkeletonText className="w-24 sm:w-32" />
                                            <SkeletonText className="w-32 sm:w-48" />
                                        </div>
                                    </div>
                                    <Skeleton className="w-16 sm:w-24 h-8" />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="h-full flex flex-col">
                            {/* Mensajes de error - fijos en la parte superior */}
                            {(error || errorMessage) && (
                                <div className="flex-shrink-0 mx-4 sm:mx-6 mt-4 bg-red-50 rounded-lg">
                                    <p className="text-red-600 font-medium text-sm sm:text-base">
                                        {errorMessage || (typeof error === 'object' ? (error.message || "An error occurred while loading sprints") : error)}
                                    </p>
                                </div>
                            )}

                            {/* Contenido scrolleable */}
                            <div className="flex-1 overflow-y-auto pb-4 sm:pb-6">
                                {sprints.length === 0 ? (
                                    <div className="flex items-center justify-center h-full min-h-[300px]">
                                        <div className="text-center">
                                            <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 mx-auto mb-4">
                                                <FiCalendar size={24} className="sm:w-8 sm:h-8" />
                                            </div>
                                            <h3 className="text-base sm:text-lg font-medium text-gray-700 mb-1">No sprints found</h3>
                                            <p className="text-gray-500 text-xs sm:text-sm mb-4 px-4">
                                                This project doesn't have any sprints created yet
                                            </p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="space-y-3 sm:space-y-4 pt-4">
                                        {sprints.map(sprint => (
                                            <SprintItem
                                                key={sprint.ID}
                                                sprint={sprint}
                                                onDelete={handleDeleteSprint}
                                                onUpdate={handleUpdateSprint}
                                                formatDate={formatDate}
                                            />
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
        </>
    );
};

export const SprintItem = ({ sprint, onDelete, onUpdate, formatDate }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [sprintData, setSprintData] = useState({
        sprintNumber: sprint.sprintNumber,
        startDate: new Date(sprint.startDate).toISOString().split('T')[0],
        endDate: new Date(sprint.endDate).toISOString().split('T')[0]
    });

    console.log(sprint)

    const handleUpdate = async () => {
        if (!sprintData.sprintNumber || sprintData.sprintNumber < 1) return;
        if (new Date(sprintData.startDate) >= new Date(sprintData.endDate)) return;

        setIsLoading(true);
        try {
            const updatedSprint = {
                ...sprint,
                sprintNumber: sprintData.sprintNumber,
                startDate: new Date(sprintData.startDate).toISOString(),
                endDate: new Date(sprintData.endDate).toISOString()
            };
            await onUpdate(sprint.id, updatedSprint);
            setIsEditing(false);
        } catch (error) {
            console.error("Error updating sprint:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCancel = () => {
        setSprintData({
            sprintNumber: sprint.sprintNumber,
            startDate: new Date(sprint.startDate).toISOString().split('T')[0],
            endDate: new Date(sprint.endDate).toISOString().split('T')[0]
        });
        setIsEditing(false);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setSprintData(prev => ({
            ...prev,
            [name]: name === 'sprintNumber' ? Number(value) : value
        }));
    };

    return (
        <div className="p-3 sm:p-4 bg-gray-50 rounded-xl">
            {isEditing ? (
                <div className="space-y-4">
                    {/* Campos en columnas para pantallas grandes, apilados en móviles */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">Sprint #</label>
                            <Input
                                type="number"
                                name="sprintNumber"
                                value={sprintData.sprintNumber}
                                onChange={handleChange}
                                min="1"
                                className="w-full"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">Start Date</label>
                            <Input
                                type="date"
                                name="startDate"
                                value={sprintData.startDate}
                                onChange={handleChange}
                                className="w-full"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">End Date</label>
                            <Input
                                type="date"
                                name="endDate"
                                value={sprintData.endDate}
                                onChange={handleChange}
                                className="w-full"
                            />
                        </div>
                    </div>

                    {/* Botones de acción */}
                    <div className="flex flex-col sm:flex-row gap-2 sm:justify-end">
                        <Button
                            variant="default"
                            onClick={handleUpdate}
                            disabled={isLoading || !sprintData.sprintNumber || sprintData.sprintNumber < 1}
                            className="w-full sm:w-auto order-2 sm:order-1"
                        >
                            {isLoading ? <FiLoader className="animate-spin" size={16} /> : "Save"}
                        </Button>
                        <Button
                            variant="default"
                            onClick={handleCancel}
                            disabled={isLoading}
                            className="w-full sm:w-auto order-1 sm:order-2"
                        >
                            Cancel
                        </Button>
                    </div>
                </div>
            ) : (
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    {/* Información del sprint */}
                    <div className="flex items-center space-x-3">
                        <div
                            className="w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-white font-bold text-sm sm:text-base flex-shrink-0"
                            style={{ backgroundColor: "#C74634" }}
                        >
                            {sprint.sprintNumber}
                        </div>
                        <div className="min-w-0 flex-1">
                            <div className="font-medium text-sm sm:text-base truncate">
                                Sprint {sprint.sprintNumber}
                            </div>
                            <div className="text-xs sm:text-sm text-gray-500 truncate">
                                {formatDate(sprint.startDate)} - {formatDate(sprint.endDate)}
                            </div>
                        </div>
                    </div>

                    {/* Botones de acción */}
                    <div className="flex items-center space-x-2 sm:flex-shrink-0">
                        <Button
                            variant="default"
                            onClick={() => setIsEditing(true)}
                            className="flex-1 sm:flex-none"
                        >
                            <FiEdit3 size={16} />
                            <span className="ml-2 sm:hidden">Edit</span>
                        </Button>
                        <Button
                            variant="danger"
                            onClick={() => onDelete(sprint.id)}
                            className="flex-1 sm:flex-none"
                        >
                            <FiTrash2 size={16} />
                            <span className="ml-2 sm:hidden">Delete</span>
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
};