import React, { useState } from "react";
import { Button } from "../lib/ui/Button";
import {
  UserHeader,
  ProfileSection,
  SecuritySection,
  PasswordChangeModal,
  AvatarUpdateModal
} from "../components/userSettings/userSettingsComponents";
import {useAuth} from "../contexts/AuthContext";

const UserSettings = () => {
  const { user } = useAuth()

  const [showPassword, setShowPassword] = useState(false);
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);
  const [avatarModalOpen, setAvatarModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);



  const handleSaveChanges = () => {
    setIsSaving(true);

    setTimeout(() => {
      setIsSaving(false);
      alert("Cambios guardados correctamente");
    }, 800);
  };

  return (
      <div className="container mx-auto px-4 py-6">
        <UserHeader/>

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

          {/* Security Section */}
          <SecuritySection
              security={{
                showPassword: showPassword,
                setShowPassword: setShowPassword,
              }}
              onChangePassword={() => setPasswordModalOpen(true)}
          />


          {/* Save Changes Button */}
          <div className="flex justify-center">
            <Button
                variant="remarked"
                color="error"
                onClick={handleSaveChanges}
                disabled={isSaving}
                className="px-8"
            >
              {isSaving ? "Guardando..." : "Guardar cambios"}
            </Button>
          </div>
        </div>

        {/* Modals */}
        <PasswordChangeModal
            isOpen={passwordModalOpen}
            onClose={() => setPasswordModalOpen(false)}
        />

        <AvatarUpdateModal
            isOpen={avatarModalOpen}
            onClose={() => setAvatarModalOpen(false)}
            userId={user.id}
        />
      </div>
  );
};

export default UserSettings;