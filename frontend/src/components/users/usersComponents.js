import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription } from "../../lib/ui/Card";
import { Button } from "../../lib/ui/Button";
import { Modal, ModalHeader, ModalTitle, ModalDescription, ModalContent, ModalFooter, ModalClose } from "../../lib/ui/Modal";
import {AlertTriangle, Trash2, Loader, PlusCircle, UserCircle} from 'lucide-react';
import { Eye, EyeOff } from 'lucide-react';
import { Input } from "../../lib/ui/Input";
import {useRegisterForm} from "../../hooks/useRegisterForm";
import { IconEmail, IconPassword} from "../auth/authComponents";
import {SkeletonCircle, SkeletonText} from "../../lib/ui/Skeleton";
import {FiLoader} from "react-icons/fi";
import {AvatarRenderer} from "../../lib/AvatarRenderer";

export const UsersHeader = ({ loading, onAddUser }) => (
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
                                className="w-12 h-12 rounded-xl bg-oracleRed grid place-items-center text-white"
                            >
                                <UserCircle size={24} />
                            </div>
                            <h1 className="text-2xl font-bold px-3  ">Team Members</h1>
                        </div>
                    )}
                </CardTitle>

                {!loading && (
                    <div className="flex space-x-2">
                        <Button
                            variant="remarked"
                            onClick={onAddUser}
                            className="flex items-center gap-2"
                        >
                            <PlusCircle size={16} />
                            Add User
                        </Button>
                    </div>
                )}
            </div>
        </CardHeader>
    </Card>
);

const UserCard = ({ user, onDetailsClick }) => {
    return (
        <Card
            key={user.id}
            className="hover:shadow-lg transition-shadow cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1"
            onClick={() => onDetailsClick(user)}
        >
            <CardHeader>
                <div className="flex justify-between items-center gap-4">
                    <div className="w-16 aspect-square rounded-md overflow-hidden">
                        <AvatarRenderer config={user.avatar} />
                    </div>
                    <div className="flex-1 min-w-0">
                        <CardTitle className="truncate">{user.firstName} {user.lastName}</CardTitle> {/* Evita desbordamiento */}
                        <CardDescription className="truncate text-sm">{user.email}</CardDescription> {/* Texto más pequeño y evita desbordamiento */}
                    </div>
                    <span className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${
                        user.userLevel.id === 1 ? 'bg-blue-50 text-blue-700' :
                            user.userLevel.id === 2 ? 'bg-green-50 text-green-700' :
                                'bg-purple-50 text-purple-700'
                    }`}>
                        {user.userLevel.label}
                    </span>
                </div>
            </CardHeader>
        </Card>
    );
};

const UserDetailsModal = ({ user, isOpen, onClose, onRemoveClick, deleteLoading = false }) => {
    const [showDangerZone, setShowDangerZone] = useState(false);
    const [confirmText, setConfirmText] = useState("");

    if (!user) return null;

    const handleToggleDangerZone = () => {
        setShowDangerZone(!showDangerZone);
        setConfirmText("");
    };

    const handleConfirmDelete = () => {
        if (confirmText === user.email) {
            onRemoveClick(user.id);
            setShowDangerZone(false);
            setConfirmText("");
        }
    };

    const handleInputChange = (e) => {
        setConfirmText(e.target.value);
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            className="max-w-md w-full"
        >
            <ModalClose onClick={onClose} />
            <ModalHeader>
                <ModalTitle>{user.firstName} {user.lastName}</ModalTitle>
                <ModalDescription>{user.email}</ModalDescription>
            </ModalHeader>

            <ModalContent>
                <div className="space-y-6">
                    <div>
                        <div className="w-32 h-32 rounded-md overflow-hidden">
                            <AvatarRenderer config={user.avatar} className="w-full h-full" />
                        </div>
                        <h4 className="text-lg font-medium mb-2">User Information</h4>
                        <div className="space-y-2">
                            <div className="flex justify-between">
                                <span className="text-gray-500">Username</span>
                                <span>{user.username}</span>
                            </div>
                            {user.telegramUsername && (
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Telegram</span>
                                    <span>@{user.telegramUsername}</span>
                                </div>
                            )}
                            <div className="flex justify-between">
                                <span className="text-gray-500">Role</span>
                                <span>{user.userLevel.label}</span>
                            </div>
                        </div>
                    </div>

                    {/* Danger Zone Section */}
                    <div className="border-t pt-4">
                        <h4 className="text-lg font-medium text-red-600 mb-2">Danger Zone</h4>
                        {!showDangerZone ? (
                            <div className="p-4 bg-red-50 rounded-md">
                                <h3 className="font-medium text-red-700 mb-2">Delete this user</h3>
                                <p className="text-red-600 text-sm mb-4">
                                    Once you delete a user, there is no going back. This action cannot be undone.
                                    All data associated with this user will be permanently deleted.
                                </p>
                                <Button
                                    variant="danger"
                                    className="border-red-300 text-red-600 hover:bg-red-50 flex items-center gap-2"
                                    onClick={handleToggleDangerZone}
                                    disabled={deleteLoading}
                                >
                                    {deleteLoading ? (
                                        <>
                                            <Loader className="animate-spin" size={16} /> Deleting...
                                        </>
                                    ) : (
                                        <>
                                            <Trash2 size={16} /> Delete User
                                        </>
                                    )}
                                </Button>
                            </div>
                        ) : (
                            <div className="p-4 bg-red-50 rounded-md">
                                <div className="flex items-center gap-2 text-red-600 mb-3">
                                    <AlertTriangle size={18} />
                                    <h3 className="font-medium">Confirm User Deletion</h3>
                                </div>
                                <p className="text-red-600 text-sm mb-4">
                                    This action cannot be undone. All user data will be permanently deleted.
                                </p>
                                <div className="space-y-4">
                                    <p className="text-sm text-gray-700">
                                        To confirm deletion, please type the user's email: <strong>{user.email}</strong>
                                    </p>
                                    <Input
                                        value={confirmText}
                                        onChange={handleInputChange}
                                        placeholder="Enter user email"
                                        className="mt-2"
                                    />
                                    <div className="flex gap-2 justify-end">
                                        <Button
                                            variant="default"
                                            onClick={handleToggleDangerZone}
                                        >
                                            Cancel
                                        </Button>
                                        <Button
                                            variant="danger"
                                            onClick={handleConfirmDelete}
                                            disabled={confirmText !== user.email || deleteLoading}
                                        >
                                            {deleteLoading ? (
                                                <>
                                                    <Loader className="animate-spin" size={16} /> Deleting...
                                                </>
                                            ) : (
                                                <>
                                                    <Trash2 size={16} /> Delete User
                                                </>
                                            )}
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </ModalContent>

            <ModalFooter>
                <Button variant="remarked" onClick={onClose}>
                    Close
                </Button>
            </ModalFooter>
        </Modal>
    );
};

const RegisterModal = ({ isOpen, onClose }) => {
    const {
        user,
        errors,
        isSubmitting,
        showPassword,
        showConfirmPassword,
        handleChange,
        handleSubmit,
        togglePasswordVisibility,
        toggleConfirmPasswordVisibility
    } = useRegisterForm();

    const onSubmitForm = async (e) => {
        e.preventDefault();
        try {
            await handleSubmit(e);
            onClose(true);
        } catch (error) {
            console.error('Registration failed:', error);
        }
    };

    return (
            <Modal isOpen={isOpen} onClose={() => onClose(false)}>
                <ModalHeader>
                    <ModalTitle>Register an user</ModalTitle>
                    <ModalClose onClick={() => onClose(false)} />
                </ModalHeader>
                <ModalContent>
                    <div className="mb-4">
                        <p className="text-gray-600 text-sm">You need user's data to proceed</p>
                    </div>

                    {errors.general && (
                        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-md text-sm">
                            {errors.general}
                        </div>
                    )}

                    <form onSubmit={onSubmitForm}>
                        <div className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="w-full">
                                    <label className="text-sm font-medium text-gray-700 block mb-2">
                                        Name
                                    </label>
                                    <input
                                        id="name"
                                        name="name"
                                        type="text"
                                        placeholder="Name"
                                        value={user.name}
                                        onChange={handleChange}
                                        disabled={isSubmitting}
                                        required
                                        className={`px-4 py-3 border rounded-md bg-white text-sm w-full focus:outline-none focus:ring-2 ${
                                            errors.name ? 'border-red-400 focus:ring-red-400' : 'focus:ring-oracleRed'
                                        }`}
                                    />
                                    {errors.name && (
                                        <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                                    )}
                                </div>

                                <div className="w-full">
                                    <label className="text-sm font-medium text-gray-700 block mb-2">
                                        Last Name
                                    </label>
                                    <input
                                        id="last_name"
                                        name="last_name"
                                        type="text"
                                        placeholder="Last Name"
                                        value={user.last_name}
                                        onChange={handleChange}
                                        disabled={isSubmitting}
                                        required
                                        className={`px-4 py-3 border rounded-md bg-white text-sm w-full focus:outline-none focus:ring-2 ${
                                            errors.last_name ? 'border-red-400 focus:ring-red-400' : 'focus:ring-oracleRed'
                                        }`}
                                    />
                                    {errors.last_name && (
                                        <p className="mt-1 text-sm text-red-600">{errors.last_name}</p>
                                    )}
                                </div>

                                <div className="w-full">
                                    <label className="text-sm font-medium text-gray-700 block mb-2">
                                        Telegram Username
                                    </label>
                                    <div className="relative">
                                        <input
                                            id="username"
                                            name="username"
                                            type="text"
                                            placeholder="username"
                                            value={user.username}
                                            onChange={handleChange}
                                            disabled={isSubmitting}
                                            required
                                            className={`px-4 py-3 border rounded-md bg-white text-sm w-full focus:outline-none focus:ring-2 ${
                                                errors.username ? 'border-red-400 focus:ring-red-400' : 'focus:ring-oracleRed'
                                            }`}
                                        />
                                        {errors.username && (
                                            <p className="mt-1 text-sm text-red-600">{errors.username}</p>
                                        )}
                                    </div>
                                </div>

                                <div className="w-full">
                                    <label className="text-sm font-medium text-gray-700 block mb-2">
                                        Email Address
                                    </label>
                                    <div className="relative">
                                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                                            <IconEmail />
                                        </div>
                                        <input
                                            id="email"
                                            name="email"
                                            type="email"
                                            placeholder="me@arel.com"
                                            value={user.email}
                                            onChange={handleChange}
                                            disabled={isSubmitting}
                                            required
                                            className={`pl-10 pr-4 py-3 border rounded-md bg-white text-sm w-full focus:outline-none focus:ring-2 ${
                                                errors.email ? 'border-red-400 focus:ring-red-400' : 'focus:ring-oracleRed'
                                            }`}
                                        />
                                        {errors.email && (
                                            <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                                        )}
                                    </div>
                                </div>

                                <div className="w-full">
                                    <label className="text-sm font-medium text-gray-700 block mb-2">
                                        Password
                                    </label>
                                    <div className="relative">
                                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                                            <IconPassword />
                                        </div>
                                        <input
                                            id="password"
                                            name="password"
                                            type={showPassword ? "text" : "password"}
                                            placeholder="••••••••"
                                            value={user.password}
                                            onChange={handleChange}
                                            disabled={isSubmitting}
                                            required
                                            className={`pl-10 pr-12 py-3 border rounded-md bg-white text-sm w-full focus:outline-none focus:ring-2 ${
                                                errors.password ? 'border-red-400 focus:ring-red-400' : 'focus:ring-oracleRed'
                                            }`}
                                        />
                                        <button
                                            type="button"
                                            onClick={togglePasswordVisibility}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none transition-colors"
                                        >
                                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                        </button>
                                        {errors.password && (
                                            <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                                        )}
                                    </div>
                                </div>

                                <div className="w-full">
                                    <label className="text-sm font-medium text-gray-700 block mb-2">
                                        Confirm Password
                                    </label>
                                    <div className="relative">
                                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                                            <IconPassword />
                                        </div>
                                        <input
                                            id="confirm_password"
                                            name="confirm_password"
                                            type={showConfirmPassword ? "text" : "password"}
                                            placeholder="••••••••"
                                            value={user.confirm_password}
                                            onChange={handleChange}
                                            disabled={isSubmitting}
                                            required
                                            className={`pl-10 pr-12 py-3 border rounded-md bg-white text-sm w-full focus:outline-none focus:ring-2 ${
                                                errors.confirm_password ? 'border-red-400 focus:ring-red-400' : 'focus:ring-oracleRed'
                                            }`}
                                        />
                                        <button
                                            type="button"
                                            onClick={toggleConfirmPasswordVisibility}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none transition-colors"
                                        >
                                            {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                        </button>
                                        {errors.confirm_password && (
                                            <p className="mt-1 text-sm text-red-600">{errors.confirm_password}</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-6 flex justify-end gap-3">
                            <Button
                                variant="default"
                                type="button"
                                onClick={() => onClose(false)}
                                disabled={isSubmitting}
                            >
                                Cancel
                            </Button>
                            <Button
                                variant="remarked"
                                type="submit"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? (
                                    <div className="flex items-center gap-2">
                                        <span className="animate-spin"><FiLoader size={16} /></span>
                                        <span>Registering...</span>
                                    </div>
                                ) : (
                                    'Register the new user'
                                )}
                            </Button>
                        </div>
                    </form>
                </ModalContent>
            </Modal>
    );
};

export { UserCard, UserDetailsModal, RegisterModal };