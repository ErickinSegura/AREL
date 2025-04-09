import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "../lib/ui/Button";
import { Input } from "../lib/ui/Input";
import { Toggle } from "../lib/ui/Toggle";

const Settings = () => {
  const [formData, setFormData] = useState({
    name: "Emiliano Luna",
    email: "emilunageo@oracle.com",
    password: "#UnacontraseñaGenial2025",
    twoFA: false,
    notifications: false,
  });

  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-1">Settings</h1>
      <p className="mb-6">Manage your account settings and preferences</p>

      <div className="flex items-center">
        <div className="flex-shrink-0">
          <img
            src="https://media.licdn.com/dms/image/v2/D5603AQG9dL2qWccd6A/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1723754261670?e=1748476800&v=beta&t=53HL_qHWPZlfaXrdUfAvDtFfTnbxz4R4KAuCdzeedTk"
            alt="Profile"
            className="w-32 h-32 rounded-full object-cover mr-6"
          />
        </div>

        <div className="flex-1 space-y-6">
          <div>
            <h2 className="font-semibold mb-2">Personal</h2>
            <hr />
            <div className="space-y-4">
              <Input
                label="Full name"
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
              />
              <Input
                label="Email"
                value={formData.email}
                onChange={(e) => handleChange("email", e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      <div>
        <h2 className="font-semibold mb-2">Security</h2>
        <hr className="mb-2" />
        <div className="mb-2">
        <label for="password">Password</label>
        </div>
        <div className="space-y-4">
          <div className="flex items-end gap-4">
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={(e) => handleChange("password", e.target.value)}
                className="w-full  border rounded-md px-3 pr-10 py-2 min-h-[44px] text-sm focus:outline-none focus:ring-2 focus:ring-oracleRed focus:border-oracleRed"
                placeholder="Password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-800"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            <Button variant="remarked" color="error">
              Change Password
            </Button>
          </div>

          <div className="flex flex-col gap-3">
            <Toggle
              label="Enable 2FA"
              checked={formData.twoFA}
              onChange={() => handleChange("twoFA", !formData.twoFA)}
            />
            <Toggle
              label="Enable Notifications"
              checked={formData.notifications}
              onChange={() =>
                handleChange("notifications", !formData.notifications)
              }
            />
          </div>
        </div>

        <div className="flex justify-center w-full pt-10">
          <Button variant="remarked" color="error">
            Save Information
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Settings;