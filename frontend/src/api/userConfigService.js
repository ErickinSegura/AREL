import {fetchWithAuth} from "./fetchAuth";

export const UserConfigService = {
    async updateUserAvatar(id, avatarData) {
        try {
            const response = await fetchWithAuth(`/userlist/${id}/avatar`, {
                method: 'PATCH',
                body: JSON.stringify(avatarData),
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => null);
                throw new Error(errorData?.message || `Error ${response.status}: ${response.statusText}`);
            }

            return await response.json();
        } catch (error) {
            console.error("Error al actualizar el avatar:", error);
            throw error;
        }
    },
}