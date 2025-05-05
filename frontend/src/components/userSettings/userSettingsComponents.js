import React from "react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "../../lib/ui/Card";
import { SkeletonCircle, SkeletonText } from "../../lib/ui/Skeleton";
import { UserCircle, Eye, EyeOff, Camera, Mail, Lock, Bell, Shield } from "lucide-react";
import { Button } from "../../lib/ui/Button";
import { Input } from "../../lib/ui/Input";
import { Toggle } from "../../lib/ui/Toggle";
import { Modal, ModalHeader, ModalTitle, ModalContent, ModalFooter, ModalClose } from "../../lib/ui/Modal";

// Header component for the user settings page
export const UserHeader = ({ loading, user }) => (
    <Card className="mb-6">
        <CardHeader>
            <div className={`flex items-center justify-between ${loading ? "animate-pulse" : ""}`}>
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
                            <div className="w-12 h-12 rounded-md bg-oracleRed grid place-items-center text-white">
                                <UserCircle size={24} />
                            </div>
                            <h1 className="text-2xl font-bold px-2">Mi cuenta</h1>
                        </div>
                    )}
                </CardTitle>
            </div>
        </CardHeader>
    </Card>
);

// Profile section with avatar and basic information
export const ProfileSection = ({ user, onUpdateAvatar }) => (
    <Card className="mb-6">
        <CardHeader>
            <CardTitle>Perfil</CardTitle>
        </CardHeader>
        <CardContent>
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                <div className="relative">
                    <div className="w-32 h-32 rounded-full overflow-hidden">
                        <img
                            src={user.avatar || "https://media.licdn.com/dms/image/v2/D5603AQG9dL2qWccd6A/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1723754261670?e=1748476800&v=beta&t=53HL_qHWPZlfaXrdUfAvDtFfTnbxz4R4KAuCdzeedTk"}
                            alt="Profile"
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <button
                        onClick={onUpdateAvatar}
                        className="absolute bottom-0 right-0 bg-oracleRed text-white p-2 rounded-full hover:bg-red-700 transition-colors"
                    >
                        <Camera size={16} />
                    </button>
                </div>
                <div className="flex-1 w-full space-y-4">
                    <Input
                        label="Nombre completo"
                        value={user.name}
                        onChange={(e) => user.onChange("name", e.target.value)}
                        icon={<UserCircle size={18} />}
                    />
                    <Input
                        label="Correo electrónico"
                        value={user.email}
                        onChange={(e) => user.onChange("email", e.target.value)}
                        icon={<Mail size={18} />}
                    />
                </div>
            </div>
        </CardContent>
    </Card>
);

// Security section with password and 2FA
export const SecuritySection = ({ security, onChangePassword }) => (
    <Card className="mb-6">
        <CardHeader>
            <CardTitle className="flex items-center gap-2">
                <Shield size={20} />
                Seguridad
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
                            type={security.showPassword ? "text" : "password"}
                            value={security.password}
                            onChange={(e) => security.onChange("password", e.target.value)}
                            className="w-full border rounded-md px-3 pr-10 py-2 min-h-[44px] text-sm focus:outline-none focus:ring-2 focus:ring-oracleRed focus:border-oracleRed"
                            placeholder="Contraseña"
                        />
                        <button
                            type="button"
                            onClick={() => security.setShowPassword(!security.showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-800"
                        >
                            {security.showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                    </div>
                    <Button variant="remarked" color="error" onClick={onChangePassword} className="whitespace-nowrap">
                        Cambiar Contraseña
                    </Button>
                </div>
            </div>

            <div className="flex flex-col gap-4">
                <Toggle
                    label="Activar autenticación de dos factores"
                    checked={security.twoFA}
                    onChange={() => security.onChange("twoFA", !security.twoFA)}
                />
            </div>
        </CardContent>
    </Card>
);

// Notifications section
export const NotificationsSection = ({ notifications }) => (
    <Card className="mb-6">
        <CardHeader>
            <CardTitle className="flex items-center gap-2">
                <Bell size={20} />
                Notificaciones
            </CardTitle>
        </CardHeader>
        <CardContent>
            <div className="space-y-4">
                <Toggle
                    label="Recibir notificaciones por correo"
                    checked={notifications.email}
                    onChange={() => notifications.onChange("emailNotifications", !notifications.email)}
                />
                <Toggle
                    label="Recibir notificaciones push"
                    checked={notifications.push}
                    onChange={() => notifications.onChange("pushNotifications", !notifications.push)}
                />
                <Toggle
                    label="Recibir actualizaciones del sistema"
                    checked={notifications.system}
                    onChange={() => notifications.onChange("systemNotifications", !notifications.system)}
                />
            </div>
        </CardContent>
    </Card>
);

// Change password modal
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
            // Show error
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

// Avatar update modal
export const AvatarUpdateModal = ({ isOpen, onClose, onSubmit }) => {
    const [preview, setPreview] = React.useState(null);
    const fileInputRef = React.useRef(null);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = () => {
        onSubmit(preview);
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalClose onClick={onClose} />
            <ModalHeader>
                <ModalTitle>Actualizar foto de perfil</ModalTitle>
            </ModalHeader>
            <ModalContent className="space-y-4">
                <div className="flex flex-col items-center">
                    <div className="w-40 h-40 rounded-full overflow-hidden bg-gray-100 mb-4">
                        {preview ? (
                            <img src={preview} alt="Avatar preview" className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                                <UserCircle size={80} />
                            </div>
                        )}
                    </div>
                    <input
                        type="file"
                        ref={fileInputRef}
                        accept="image/*"
                        className="hidden"
                        onChange={handleFileChange}
                    />
                    <Button
                        variant="outline"
                        onClick={() => fileInputRef.current.click()}
                        className="mb-2"
                    >
                        Seleccionar imagen
                    </Button>
                    <p className="text-sm text-gray-500">
                        Formato recomendado: JPG, PNG. Tamaño máximo: 5MB
                    </p>
                </div>
            </ModalContent>
            <ModalFooter>
                <Button variant="outline" onClick={onClose}>
                    Cancelar
                </Button>
                <Button variant="remarked" color="error" onClick={handleSubmit} disabled={!preview}>
                    Guardar
                </Button>
            </ModalFooter>
        </Modal>
    );
};