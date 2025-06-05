import React, { useState } from "react";
import { Button } from "../lib/ui/Button";
import {
    UserHeader,
    ProfileSection,
    SecuritySection,
    PasswordChangeModal,
    AvatarUpdateModal
} from "../components/userSettings/userSettingsComponents";
import { useAuth } from "../contexts/AuthContext";

const UserSettings = () => {
    const { user, changePassword } = useAuth();

    const [showPassword, setShowPassword] = useState(false);
    const [passwordModalOpen, setPasswordModalOpen] = useState(false);
    const [avatarModalOpen, setAvatarModalOpen] = useState(false);
    const [passwordChangeLoading, setPasswordChangeLoading] = useState(false);
    const [passwordChangeError, setPasswordChangeError] = useState('');
    const [passwordChangeSuccess, setPasswordChangeSuccess] = useState(false);

    const handleChangePassword = async (newPassword, currentPassword) => {
        setPasswordChangeLoading(true);
        setPasswordChangeError('');
        setPasswordChangeSuccess(false);

        try {
            await changePassword(currentPassword, newPassword);
            setPasswordChangeSuccess(true);
            setPasswordModalOpen(false);

            // Mostrar mensaje de éxito (opcional)
            setTimeout(() => {
                setPasswordChangeSuccess(false);
            }, 3000);

        } catch (error) {
            setPasswordChangeError(error.message);
        } finally {
            setPasswordChangeLoading(false);
        }
    };

    const handleAvatarUpdate = (newAvatarConfig) => {
        // Aquí podrías actualizar el estado del usuario si es necesario
        // o simplemente cerrar el modal ya que useAvatarUpdate maneja la actualización
        console.log('Avatar updated:', newAvatarConfig);
    };

    // Mostrar loading si el usuario no está cargado
    if (!user) {
        return (
            <div className="container mx-auto px-4 py-6">
                <div className="flex items-center justify-center h-64">
                    <div className="text-lg text-gray-600">Loading...</div>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-6">
            <UserHeader />

            {passwordChangeSuccess && (
                <div className="mb-6 px-4 py-3 bg-green-50 border border-green-200 rounded-md text-green-700">
                    <div className="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                            <path d="M9 12l2 2 4-4"></path>
                            <circle cx="12" cy="12" r="10"></circle>
                        </svg>
                        Password changed successfully!
                    </div>
                </div>
            )}

            <div className="grid gap-6">
                <ProfileSection
                    user={{
                        name: user.fullName,
                        email: user.email,
                        telegram: user.telegramUsername,
                        avatar: user.avatar
                    }}
                    onUpdateAvatar={() => setAvatarModalOpen(true)}
                />

                <SecuritySection
                    security={{
                        showPassword: showPassword,
                        setShowPassword: setShowPassword,
                    }}
                    onChangePassword={() => {
                        setPasswordChangeError('');
                        setPasswordModalOpen(true);
                    }}
                />
            </div>

            {/* Modals */}
            <PasswordChangeModal
                isOpen={passwordModalOpen}
                onClose={() => {
                    setPasswordModalOpen(false);
                    setPasswordChangeError('');
                }}
                onSubmit={handleChangePassword}
                isLoading={passwordChangeLoading}
                error={passwordChangeError}
            />

            <AvatarUpdateModal
                isOpen={avatarModalOpen}
                onClose={() => setAvatarModalOpen(false)}
                onSubmit={handleAvatarUpdate}
                initialConfig={user.avatar}
                userId={user.id}
            />
        </div>
    );
};

export default UserSettings;