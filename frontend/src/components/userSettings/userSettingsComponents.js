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
                        <div className="w-12 h-12 rounded-md bg-oracleRed grid place-items-center text-white">
                            <UserCircle size={24} />
                        </div>
                        <h1 className="text-2xl font-bold px-2">Account Settings</h1>
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
                        <img
                            src={"https://media.licdn.com/dms/image/v2/D5603AQG9dL2qWccd6A/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1723754261670?e=1748476800&v=beta&t=53HL_qHWPZlfaXrdUfAvDtFfTnbxz4R4KAuCdzeedTk"}
                            alt="Profile"
                            className="w-full h-full object-cover"
                        />
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
                    Contraseña
                </label>
                <div className="flex flex-col md:flex-row items-stretch md:items-end gap-4">
                    <div className="relative flex-1">
                        <input
                            id="password"
                            type={"password"}
                            value={"passworddelusuario"}
                            onChange={(e) => security.onChange("password", e.target.value)}
                            className="w-full border rounded-md px-3 pr-10 py-2 min-h-[44px] text-sm focus:outline-none focus:ring-2 focus:ring-oracleRed focus:border-oracleRed"
                            placeholder="Password"
                        />
                    </div>
                    <Button variant="remarked" color="error" onClick={onChangePassword} className="whitespace-nowrap">
                        Cambiar Contraseña
                    </Button>
                </div>
            </div>
        </CardContent>
    </Card>
);

export const PasswordChangeModal = ({ isOpen, onClose, onSubmit }) => {
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

    const handleChange = (field, value) => {
        setPasswords(prev => ({ ...prev, [field]: value }));
    };

    const togglePasswordVisibility = (field) => {
        setShowPasswords(prev => ({ ...prev, [field]: !prev[field] }));
    };

    const handleSubmit = () => {
        if (passwords.new !== passwords.confirm) {
            return;
        }
        onSubmit(passwords);
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalClose onClick={onClose} />
            <ModalHeader>
                <ModalTitle>Cambiar Contraseña</ModalTitle>
            </ModalHeader>
            <ModalContent className="space-y-4">
                <div className="relative">
                    <Input
                        label="Contraseña actual"
                        type={showPasswords.current ? "text" : "password"}
                        value={passwords.current}
                        onChange={(e) => handleChange("current", e.target.value)}
                    />
                    <button
                        type="button"
                        onClick={() => togglePasswordVisibility("current")}
                        className="absolute right-3 top-[60%] -translate-y-1/2 text-gray-500 hover:text-gray-800"
                    >
                        {showPasswords.current ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                </div>
                <div className="relative">
                    <Input
                        label="Nueva contraseña"
                        type={showPasswords.new ? "text" : "password"}
                        value={passwords.new}
                        onChange={(e) => handleChange("new", e.target.value)}
                    />
                    <button
                        type="button"
                        onClick={() => togglePasswordVisibility("new")}
                        className="absolute right-3 top-[60%] -translate-y-1/2 text-gray-500 hover:text-gray-800"
                    >
                        {showPasswords.new ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                </div>
                <div className="relative">
                    <Input
                        label="Confirmar nueva contraseña"
                        type={showPasswords.confirm ? "text" : "password"}
                        value={passwords.confirm}
                        onChange={(e) => handleChange("confirm", e.target.value)}
                    />
                    <button
                        type="button"
                        onClick={() => togglePasswordVisibility("confirm")}
                        className="absolute right-3 top-[60%] -translate-y-1/2 text-gray-500 hover:text-gray-800"
                    >
                        {showPasswords.confirm ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                </div>
            </ModalContent>
            <ModalFooter>
                <Button variant="outline" onClick={onClose}>
                    Cancelar
                </Button>
                <Button variant="remarked" color="error" onClick={handleSubmit}>
                    Actualizar contraseña
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
        { id: 'skin5', name: 'Green', color: '#3EDB2A' }
    ],
    eyes: [
        { id: 'eyes1', name: 'Thinker', style: 'thinker' },
        { id: 'eyes2', name: 'Neutral', style: 'neutral' },
        { id: 'eyes3', name: 'Baggy', style: 'baggy' },
        { id: 'eyes4', name: 'Happy', style: 'happy' }
    ],
    eyeColors: [
        { id: 'eyeColor1', name: 'Green', color: '#345f33' },
        { id: 'eyeColor2', name: 'Blue', color: '#545fc8' },
        { id: 'eyeColor3', name: 'Black', color: '#000' },
        { id: 'eyeColor4', name: 'Brown', color: '#392424' },
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
        { id: 'mouth4', name: 'wave', style: 'wave' }
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
        updateAvatar,
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

    if (!isOpen) return null;

    const renderCategoryOptions = () => {
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

        const property = propertyMap[activeCategory];
        const options = avatarOptions[activeCategory] || [];

        return (
            <div className="grid grid-cols-4 gap-2 mt-4">
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
                                className="w-12 h-12 rounded-full mx-auto"
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
                            // Fallback para opciones sin imagen
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
                            className={`p-2 cursor-pointer rounded-lg text-center ${isSelected ? 'bg-blue-100 border border-blue-500' : 'hover:bg-gray-100'}`}
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

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-lg overflow-hidden">
                {/* Encabezado */}
                <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                    <h3 className="text-lg font-medium">Personalizar Avatar</h3>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-500"
                    >
                        <span className="sr-only">Cerrar</span>
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Contenido */}
                <div className="px-6 py-4">
                    <div className="flex items-start">
                        {/* Vista previa del avatar */}
                        <div className="w-1/3 flex justify-center">
                            <div className="w-32 h-32 rounded-3xl overflow-hidden">
                                <AvatarRenderer config={avatarConfig} size={128} />
                            </div>
                        </div>

                        {/* Categorías de personalización */}
                        <div className="w-2/3 pl-4">
                            <div className="flex flex-wrap gap-2 mb-4">
                                {categories.map((category) => (
                                    <button
                                        key={category.id}
                                        className={`px-3 py-1 text-sm rounded-full ${
                                            activeCategory === category.id
                                                ? 'bg-blue-500 text-white'
                                                : 'bg-gray-200 hover:bg-gray-300'
                                        }`}
                                        onClick={() => handleCategoryChange(category.id)}
                                    >
                                        {category.name}
                                    </button>
                                ))}
                            </div>

                            {/* Opciones de la categoría seleccionada */}
                            {renderCategoryOptions()}
                        </div>
                    </div>
                </div>

                {/* Pie de modal con botones */}
                <div className="px-6 py-4 border-t border-gray-200 flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 mr-2"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={handleSubmit}
                        className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                        disabled={isLoading}
                    >
                        {isLoading ? 'Guardando...' : 'Guardar'}
                    </button>
                </div>

                {/* Mostrar mensaje de error si existe */}
                {error && (
                    <div className="px-6 pb-4 text-red-500 text-sm">
                        {error}
                    </div>
                )}
            </div>
        </div>
    );
};