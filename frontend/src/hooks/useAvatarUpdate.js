import { useState } from 'react';
import { UserConfigService } from '../api/userConfigService';
import { useAuth } from '../contexts/AuthContext';

export const useAvatarUpdate = (userId, initialAvatarConfig) => {
    const { user, updateUser } = useAuth(); 
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [avatarConfig, setAvatarConfig] = useState(initialAvatarConfig || {
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
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const formatAvatarConfig = (config) => {
        return {
            avatar: JSON.stringify(config)
        };
    };

    const updateAvatar = async (newConfig, userId) => {
        try {
            setIsLoading(true);
            setError(null);

            const avatarData = formatAvatarConfig(newConfig);

            if (!userId) {
                throw new Error("ID de usuario no proporcionado");
            }

            const updatedUser = await UserConfigService.updateUserAvatar(userId, avatarData);

            setAvatarConfig(newConfig);

            if (user && updateUser) {
                updateUser({
                    avatar: newConfig
                });
            }

            setIsLoading(false);
            console.log('Avatar actualizado:', newConfig);
            return updatedUser;
        } catch (err) {
            console.error("Error completo:", err);
            setError(err.message || "Error al actualizar el avatar");
            setIsLoading(false);
            throw err;
        }
    };

    const handleAvatarSubmit = async (newConfig, userId) => {
        try {
            return await updateAvatar(newConfig, userId);
        } catch (err) {
            console.error("Error en handleAvatarSubmit:", err);
            return null;
        }
    };

    return {
        isModalOpen,
        setIsModalOpen,
        avatarConfig,
        setAvatarConfig,
        isLoading,
        error,
        updateAvatar,
        handleAvatarSubmit
    };
};