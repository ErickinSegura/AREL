import React, { useState } from "react";
import { Button } from "../lib/ui/Button";
import {
  UserHeader,
  ProfileSection,
  SecuritySection,
  NotificationsSection,
  PasswordChangeModal,
  AvatarUpdateModal
} from "../components/userSettings/userSettingsComponents";

const UserSettings = () => {
  // User state
  const [formData, setFormData] = useState({
    name: "Emiliano Luna",
    email: "emilunageo@oracle.com",
    password: "#UnacontraseñaGenial2025",
    avatar: "https://media.licdn.com/dms/image/v2/D5603AQG9dL2qWccd6A/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1723754261670?e=1748476800&v=beta&t=53HL_qHWPZlfaXrdUfAvDtFfTnbxz4R4KAuCdzeedTk",
    twoFA: false,
    emailNotifications: true,
    pushNotifications: false,
    systemNotifications: true,
  });

  // UI state
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);
  const [avatarModalOpen, setAvatarModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Handle form data change
  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Handle password change
  const handlePasswordChange = (passwords) => {
    // Here you would typically call an API to update the password
    console.log("Changing password:", passwords);
    // For demo purposes, we'll update the state
    setFormData((prev) => ({ ...prev, password: passwords.new }));
  };

  // Handle avatar update
  const handleAvatarUpdate = (newAvatar) => {
    // Here you would typically upload the image and get a URL back
    setFormData((prev) => ({ ...prev, avatar: newAvatar }));
  };

  // Handle save all changes
  const handleSaveChanges = () => {
    setIsSaving(true);

    // Simulate API call
    setTimeout(() => {
      setIsSaving(false);
      // Here you would typically show a success message
      alert("Cambios guardados correctamente");
    }, 800);
  };

  return (
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <UserHeader loading={isLoading} user={{ name: formData.name }} />

        <div className="grid gap-6">
          {/* Profile Section */}
          <ProfileSection
              user={{
                name: formData.name,
                email: formData.email,
                avatar: formData.avatar,
                onChange: handleChange
              }}
              onUpdateAvatar={() => setAvatarModalOpen(true)}
          />

          {/* Security Section */}
          <SecuritySection
              security={{
                password: formData.password,
                showPassword: showPassword,
                setShowPassword: setShowPassword,
                twoFA: formData.twoFA,
                onChange: handleChange
              }}
              onChangePassword={() => setPasswordModalOpen(true)}
          />

          {/* Notifications Section */}
          <NotificationsSection
              notifications={{
                email: formData.emailNotifications,
                push: formData.pushNotifications,
                system: formData.systemNotifications,
                onChange: handleChange
              }}
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
            onSubmit={handlePasswordChange}
        />

        <AvatarUpdateModal
            isOpen={avatarModalOpen}
            onClose={() => setAvatarModalOpen(false)}
            onSubmit={handleAvatarUpdate}
        />
      </div>
  );
};

export default UserSettings;