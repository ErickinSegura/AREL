import React, {useState} from "react";
import { Card, CardHeader, CardTitle, CardContent } from "../../lib/ui/Card";
import {UserCircle, Eye, EyeOff, Mail, Pencil, AtSign} from "lucide-react";
import { Button } from "../../lib/ui/Button";
import { Input } from "../../lib/ui/Input";
import { Modal, ModalHeader, ModalTitle, ModalContent, ModalFooter, ModalClose } from "../../lib/ui/Modal";
import { AvatarRenderer } from "../../lib/AvatarRenderer";
import {useAvatarUpdate} from "../../hooks/useAvatarUpdate";

export const UserHeader = () => (
    <Card className="mb-6">
        <CardHeader>
            <div className={`flex items-center justify-between`}>
                <CardTitle>
                    <div className="flex items-center">
                        <div className="w-12 h-12 rounded-xl bg-oracleRed grid place-items-center text-white">
                            <UserCircle size={24} />
                        </div>
                        <h1 className="text-2xl font-bold px-3">Account <span className="text-oracleRed">Settings</span></h1>
                    </div>
                </CardTitle>
            </div>
        </CardHeader>
    </Card>
);

export const ProfileSection = ({ user, onUpdateAvatar }) => (
    <Card className="mb-6">
        <CardHeader>
            <CardTitle>
                <div className="font-bold">User <span className="text-oracleRed">Information</span></div>
            </CardTitle>
        </CardHeader>
        <CardContent>
            <div className="flex flex-col md:flex-row items-center md:items-center gap-6">
                <div className="relative mb-4 md:mb-0">
                    <div className="w-64 h-64 md:w-48 md:h-48 rounded-3xl overflow-hidden">
                        <AvatarRenderer config={user.avatar} size={128} className={"w-full h-full object-cover"} />
                    </div>
                    <button
                        onClick={onUpdateAvatar}
                        className="absolute bottom-2 right-4 bg-oracleRed text-white p-2 rounded-full hover:bg-red-700 transition-colors shadow-md"
                    >
                        <Pencil size={16} />
                    </button>
                </div>
                <div className="flex-1 w-full space-y-4 self-center">
                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-medium text-gray-700">
                            Full Name
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <UserCircle size={18} className="text-oracleRed" />
                            </div>
                            <div className="px-4 py-2 border rounded-md bg-white text-sm w-full pl-10">
                                {user.name}
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-medium text-gray-700">
                            Email
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Mail size={18} className="text-oracleRed" />
                            </div>
                            <div className="px-4 py-2 border rounded-md bg-white text-sm w-full pl-10">
                                {user.email}
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-medium text-gray-700">
                            Telegram
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <AtSign size={18} className="text-oracleRed" />
                            </div>
                            <div className="px-4 py-2 border rounded-md bg-white text-sm w-full pl-10">
                                {user.telegram}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </CardContent>
    </Card>
);

export const SecuritySection = ({ security, onChangePassword }) => (
    <Card className="mb-6">
        <CardHeader>
            <CardTitle className="flex items-center gap-2">
                <div className="font-bold">Account <span className="text-oracleRed">Security</span></div>
            </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
            <div>
                <label htmlFor="password" className="block text-sm font-medium mb-2">
                    Password
                </label>
                <div className="flex flex-col md:flex-row items-stretch md:items-end gap-4">
                    <div className="relative flex-1">
                        <input
                            id="password"
                            type={"password"}
                            value={"password"}
                            onChange={(e) => security.onChange("password", e.target.value)}
                            className="w-full border rounded-md px-3 pr-10 py-2 min-h-[44px] text-sm focus:outline-none focus:ring-2 focus:ring-oracleRed focus:border-oracleRed"
                            placeholder="Password"
                        />
                    </div>
                    <Button variant="remarked" color="error" onClick={onChangePassword} className="whitespace-nowrap">
                        Change Password
                    </Button>
                </div>
            </div>
        </CardContent>
    </Card>
);

export const PasswordChangeModal = ({ isOpen, onClose, onSubmit, isLoading, error }) => {
    const [passwords, setPasswords] = React.useState({
        current: "",
        new: "",
        confirm: ""
    });
    const [showPasswords, setShowPasswords] = React.useState({
        current: false,
        new: false,
        confirm: false
    });
    const [validationError, setValidationError] = React.useState('');

    const handleChange = (field, value) => {
        setPasswords(prev => ({ ...prev, [field]: value }));
        if (validationError) {
            setValidationError('');
        }
    };

    const togglePasswordVisibility = (field) => {
        setShowPasswords(prev => ({ ...prev, [field]: !prev[field] }));
    };

    const validatePasswords = () => {
        if (!passwords.current.trim()) {
            setValidationError('Current password is required');
            return false;
        }
        if (!passwords.new.trim()) {
            setValidationError('New password is required');
            return false;
        }
        if (passwords.new.length < 6) {
            setValidationError('New password must be at least 6 characters long');
            return false;
        }
        if (passwords.new !== passwords.confirm) {
            setValidationError('New passwords do not match');
            return false;
        }
        if (passwords.current === passwords.new) {
            setValidationError('New password must be different from current password');
            return false;
        }
        return true;
    };

    const handleSubmit = async () => {
        setValidationError('');

        if (!validatePasswords()) {
            return;
        }

        try {
            await onSubmit(passwords.new, passwords.current);
            setPasswords({ current: "", new: "", confirm: "" });
        } catch (error) {
        }
    };

    const handleClose = () => {
        setPasswords({ current: "", new: "", confirm: "" });
        setValidationError('');
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={handleClose}>
            <ModalClose onClick={handleClose} />
            <ModalHeader>
                <ModalTitle>Change Password</ModalTitle>
            </ModalHeader>
            <ModalContent className="space-y-4">
                {(error || validationError) && (
                    <div className="px-3 py-2 bg-red-50 border border-red-200 rounded-md text-red-600 text-sm">
                        <div className="flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 flex-shrink-0">
                                <circle cx="12" cy="12" r="10"></circle>
                                <line x1="12" y1="8" x2="12" y2="12"></line>
                                <line x1="12" y1="16" x2="12.01" y2="16"></line>
                            </svg>
                            {error || validationError}
                        </div>
                    </div>
                )}

                <div className="relative">
                    <Input
                        label="Current password"
                        type={showPasswords.current ? "text" : "password"}
                        value={passwords.current}
                        onChange={(e) => handleChange("current", e.target.value)}
                        disabled={isLoading}
                    />
                    <button
                        type="button"
                        onClick={() => togglePasswordVisibility("current")}
                        className="absolute right-3 top-[70%] -translate-y-1/2 text-gray-500 hover:text-gray-800 disabled:opacity-50"
                        disabled={isLoading}
                    >
                        {showPasswords.current ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                </div>
                <div className="relative">
                    <Input
                        label="New password"
                        type={showPasswords.new ? "text" : "password"}
                        value={passwords.new}
                        onChange={(e) => handleChange("new", e.target.value)}
                        disabled={isLoading}
                    />
                    <button
                        type="button"
                        onClick={() => togglePasswordVisibility("new")}
                        className="absolute right-3 top-[70%] -translate-y-1/2 text-gray-500 hover:text-gray-800 disabled:opacity-50"
                        disabled={isLoading}
                    >
                        {showPasswords.new ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                </div>
                <div className="relative">
                    <Input
                        label="Confirm new password"
                        type={showPasswords.confirm ? "text" : "password"}
                        value={passwords.confirm}
                        onChange={(e) => handleChange("confirm", e.target.value)}
                        disabled={isLoading}
                    />
                    <button
                        type="button"
                        onClick={() => togglePasswordVisibility("confirm")}
                        className="absolute right-3 top-[70%] -translate-y-1/2 text-gray-500 hover:text-gray-800 disabled:opacity-50"
                        disabled={isLoading}
                    >
                        {showPasswords.confirm ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                </div>
            </ModalContent>
            <ModalFooter>
                <Button
                    variant="outline"
                    onClick={handleClose}
                    disabled={isLoading}
                >
                    Cancel
                </Button>
                <Button
                    variant="remarked"
                    color="error"
                    onClick={handleSubmit}
                    disabled={isLoading}
                >
                    {isLoading ? 'Updating...' : 'Update Password'}
                </Button>
            </ModalFooter>
        </Modal>
    );
};

const avatarOptions = {
    backgrounds: [
        { id: 'bg1', name: 'Blue', color: '#1A93FE' },
        { id: 'bg2', name: 'Green', color: '#1AFE5E' },
        { id: 'bg3', name: 'Red', color: '#FE1A40' },
        { id: 'bg4', name: 'Pink', color: '#FD1AFE' },
        { id: 'bg5', name: 'Yellow', color: '#FFB319' }
    ],
    skins: [
        { id: 'skin1', name: 'Blue', color: '#4D92BC' },
        { id: 'skin2', name: 'Red', color: '#BB4D63' },
        { id: 'skin3', name: 'Purple', color: '#BA4DB8' },
        { id: 'skin4', name: 'Yellow', color: '#DC9B2A' },
        { id: 'skin5', name: 'Green', color: '#3EDB2A' },
        { id: 'skin6', name: 'Pink', color: '#FF0CC9' },
        { id: 'skin7', name: 'Orange', color: '#D87231' },
        { id: 'skin8', name: 'Gray', color: '#848484' }
    ],
    eyes: [
        { id: 'eyes1', name: 'Thinker', style: 'thinker' },
        { id: 'eyes2', name: 'Neutral', style: 'neutral' },
        { id: 'eyes3', name: 'Baggy', style: 'baggy' },
        { id: 'eyes4', name: 'Happy', style: 'happy' },
        { id: 'eyes5', name: 'Closed', style: 'closed' }
    ],
    eyeColors: [
        { id: 'eyeColor1', name: 'Green', color: '#345f33' },
        { id: 'eyeColor2', name: 'Blue', color: '#545fc8' },
        { id: 'eyeColor3', name: 'Black', color: '#000' },
        { id: 'eyeColor4', name: 'Brown', color: '#392424' },
        { id: 'eyeColor5', name: 'Red', color: '#c70a0a' },
        { id: 'eyeColor6', name: 'Yellow', color: '#ffc900' },
    ],
    spineColors: [
        { id: 'spineColor1', name: 'Blue', color: '#044DBA' },
        { id: 'spineColor2', name: 'Red', color: '#E2042F' },
        { id: 'spineColor3', name: 'Pink', color: '#F48BFF' },
        { id: 'spineColor4', name: 'Orange', color: '#FF7100' },
        { id: 'spineColor5', name: 'Yellow', color: '#FFDF00' },
        { id: 'spineColor6', name: 'Green', color: '#1DC800' },
        { id: 'spineColor7', name: 'White', color: '#FFF' },
        { id: 'spineColor8', name: 'Black', color: '#181818' }
    ],
    mouths: [
        { id: 'mouth1', name: 'Smile', style: 'smile' },
        { id: 'mouth2', name: 'Neutral', style: 'neutral' },
        { id: 'mouth3', name: 'Surprised', style: 'surprised' },
        { id: 'mouth4', name: 'wave', style: 'wave' },
        { id: 'mouth5', name: 'wave', style: 'wave' }
    ],
    accessories: [
        { id: 'acc1', name: 'None', style: 'none' },
        { id: 'acc2', name: 'Sunglasses', style: 'round-glasses' },
        { id: 'acc3', name: 'Glasses', style: 'sunglasses' },
        { id: 'acc4', name: 'Moustache', style: 'square-glasses' },
        { id: 'acc5', name: 'Cowboy Hat', style: 'hat' },
        { id: 'acc6', name: 'Elegant Hat', style: 'hat' }
    ],
    bellyColor: [
        { id: 'bellyColor1', name: 'Pink', color: '#FEA5FB' },
        { id: 'bellyColor2', name: 'Beige', color: '#E7E0D3' },
        { id: 'bellyColor3', name: 'Mint', color: '#BADBD6' },
        { id: 'bellyColor4', name: 'Orange', color: '#d59d7b' },
        { id: 'bellyColor5', name: 'Blue', color: '#6D8BD6' }
    ]
};

export const AvatarUpdateModal = ({ isOpen, onClose, onSubmit, initialConfig, userId }) => {
    const [avatarConfig, setAvatarConfig] = useState(initialConfig || {
        background: "bg1",
        skin: "skin1",
        eyes: "eyes1",
        eyeColor: "eyeColor1",
        spines: "hair1",
        spineColor: "spineColor1",
        mouth: "mouth1",
        accessories: "acc1",
        bellyColor: "bellyColor1"
    });

    const {
        isLoading,
        error,
        handleAvatarSubmit
    } = useAvatarUpdate(userId, avatarConfig);

    const [activeCategory, setActiveCategory] = useState('skins');

    const updateAvatarProperty = (property, value) => {
        setAvatarConfig({
            ...avatarConfig,
            [property]: value
        });
    };

    const handleCategoryChange = (category) => {
        setActiveCategory(category);
    };

    const handleSubmit = async () => {
        try {
            await handleAvatarSubmit(avatarConfig, userId);

            if (onSubmit) {
                onSubmit(avatarConfig);
            }

            onClose();
        } catch (error) {
            console.error("Error al guardar el avatar:", error);
        }
    };

    const categories = [
        { id: 'backgrounds', name: 'Background' },
        { id: 'skins', name: 'Skin' },
        { id: 'eyes', name: 'Eyes' },
        { id: 'eyeColors', name: 'Eyes Color' },
        { id: 'spineColors', name: 'Spines Color' },
        { id: 'mouths', name: 'Mouth' },
        { id: 'accessories', name: 'Accessories' },
        { id: 'bellyColor', name: 'Belly Color' }
    ];

    const propertyMap = {
        backgrounds: 'background',
        skins: 'skin',
        eyes: 'eyes',
        eyeColors: 'eyeColor',
        spineColors: 'spineColor',
        mouths: 'mouth',
        accessories: 'accessories',
        bellyColor: 'bellyColor'
    };

    const renderCategoryButtons = () => {
        return (
            <div className="flex flex-wrap gap-2 mb-4">
                {categories.map((category) => (
                    <Button
                        key={category.id}
                        className={`px-3 py-1 text-xs sm:text-sm rounded-full transition-colors duration-200 ${
                            activeCategory === category.id
                                ? 'bg-oracleRed text-white'
                                : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
                        }`}
                        onClick={() => handleCategoryChange(category.id)}
                    >
                        {category.name}
                    </Button>
                ))}
            </div>
        );
    };

    const renderCategoryOptions = () => {
        const property = propertyMap[activeCategory];
        const options = avatarOptions[activeCategory] || [];

        return (
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-4 gap-2 mt-4 h-48 overflow-y-auto">
                {options.map((option) => {
                    const isSelected = avatarConfig[property] === option.id;

                    const getPreviewImagePath = () => {
                        if (activeCategory === 'eyes') {
                            return `/assets/avatar/preview/eyes/${option.id}_${avatarConfig.eyeColor}.png`;
                        } else if (['backgrounds', 'skins', 'eyeColors', 'spineColors', 'bellyColor'].includes(activeCategory)) {
                            return null;
                        } else {
                            return `/assets/avatar/preview/${activeCategory}/${option.id}.png`;
                        }
                    };

                    let preview;
                    if (['backgrounds', 'skins', 'eyeColors', 'spineColors', 'bellyColor'].includes(activeCategory)) {
                        preview = (
                            <div
                                className="w-12 h-12 rounded-full mx-auto shadow-inner"
                                style={{ backgroundColor: option.color }}
                            />
                        );
                    } else {
                        const previewPath = getPreviewImagePath();
                        if (previewPath) {
                            preview = (
                                <div className="w-12 h-12 mx-auto overflow-hidden">
                                    <img
                                        src={previewPath}
                                        alt={option.name}
                                        className="w-full h-full object-contain"
                                        style={{ imageRendering: 'pixelated' }}
                                    />
                                </div>
                            );
                        } else {
                            preview = (
                                <div className="w-12 h-12 flex items-center justify-center bg-gray-100 rounded-full mx-auto">
                                    {option.name.charAt(0).toUpperCase()}
                                </div>
                            );
                        }
                    }

                    return (
                        <div
                            key={option.id}
                            className={`p-2 cursor-pointer rounded-lg text-center ${
                                isSelected
                                    ? 'border-2 border-oracleRed'
                                    : 'hover:bg-gray-100 border-2 border-transparent'
                            }`}
                            onClick={() => updateAvatarProperty(property, option.id)}
                        >
                            {preview}
                            <div className="text-xs mt-1 truncate">{option.name}</div>
                        </div>
                    );
                })}
            </div>
        );
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} className="w-full max-w-lg md:max-w-xl">
            <ModalClose onClick={onClose} />

            <ModalHeader>
                <ModalTitle>Personalize Avatar</ModalTitle>
            </ModalHeader>

            <ModalContent>
                <div className="flex flex-col sm:flex-row items-center sm:items-center gap-6">
                    <div className="flex flex-col items-center justify-center">
                        <div className="w-44 h-44 rounded-3xl overflow-hidden bg-gray-50 border shadow-md flex items-center justify-center relative">
                            <AvatarRenderer config={avatarConfig} size={128} />
                        </div>
                    </div>


                    {/* Categorías y opciones */}
                    <div className="flex-1 w-full">
                        {/* Pestañas de categorías */}
                        <div className="overflow-x-auto pb-2 -mx-2 px-2">
                            {renderCategoryButtons()}
                        </div>

                        {/* Opciones de la categoría */}
                        {renderCategoryOptions()}
                    </div>
                </div>

                {/* Mensaje de error si existe */}
                {error && (
                    <div className="mt-4 px-3 py-2 bg-red-50 border border-red-200 rounded-md text-red-600 text-sm">
                        <p className="flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                                <circle cx="12" cy="12" r="10"></circle>
                                <line x1="12" y1="8" x2="12" y2="12"></line>
                                <line x1="12" y1="16" x2="12.01" y2="16"></line>
                            </svg>
                            {error}
                        </p>
                    </div>
                )}
            </ModalContent>

            <ModalFooter>
                <Button
                    variant="default"
                    onClick={onClose}
                >
                    Cancel
                </Button>
                <Button
                    variant="remarked"
                    onClick={handleSubmit}
                    disabled={isLoading}
                >
                    {isLoading ? 'Saving...' : 'Save Avatar'}
                </Button>
            </ModalFooter>
        </Modal>
    );
};