import { useState } from "react";
import {
  FiUser,
  FiLock,
  FiAlertTriangle,
  FiCheck,
  FiBell,
} from "react-icons/fi";
import { useAuth } from "../../contexts/AuthContext";
import PageHeader from "../../components/admin/PageHeader";
import { useToast } from "../../components/Toast";

export default function AdminSettings() {
  const { user } = useAuth();
  const toast = useToast();
  const [settings, setSettings] = useState({
    emailNotifications: true,
    systemAlerts: true,
    weeklyReport: true,
    twoFactorAuth: false,
  });
  const [isSaving, setIsSaving] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleSettingChange = (key) => {
    setSettings((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleSaveSettings = async () => {
    try {
      setIsSaving(true);

      await new Promise((resolve) => setTimeout(resolve, 500));
      toast("success", "Settings saved successfully");
    } finally {
      setIsSaving(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast("error", "Passwords do not match");
      return;
    }
    try {
      setIsSaving(true);

      await new Promise((resolve) => setTimeout(resolve, 500));
      toast("success", "Password changed successfully");
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto bg-gray-50 min-h-screen">
      <PageHeader
        title="Settings"
        description="Manage your admin account and preferences."
      />

      <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm mb-6">
        <div className="flex items-center gap-4 pb-6 border-b border-gray-200">
          <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
            {user?.name?.charAt(0)?.toUpperCase() || "A"}
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {user?.name || "Admin"}
            </h2>
            <p className="text-gray-600">{user?.email}</p>
            <p className="text-sm text-gray-500 mt-1">Administrator</p>
          </div>
        </div>

        <div className="pt-6 space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Full Name
            </label>
            <input
              type="text"
              value={user?.name || ""}
              disabled
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 bg-gray-50 text-gray-700 disabled:opacity-50"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Email Address
            </label>
            <input
              type="email"
              value={user?.email || ""}
              disabled
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 bg-gray-50 text-gray-700 disabled:opacity-50"
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm mb-6">
        <div className="flex items-center gap-2 mb-6 pb-4 border-b border-gray-200">
          <FiLock className="text-purple-600" size={20} />
          <h3 className="text-lg font-bold text-gray-900">Security</h3>
        </div>

        <form onSubmit={handlePasswordChange} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Current Password
            </label>
            <input
              type="password"
              value={passwordForm.currentPassword}
              onChange={(e) =>
                setPasswordForm((prev) => ({
                  ...prev,
                  currentPassword: e.target.value,
                }))
              }
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-gray-900 focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
              placeholder="••••••••"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              New Password
            </label>
            <input
              type="password"
              value={passwordForm.newPassword}
              onChange={(e) =>
                setPasswordForm((prev) => ({
                  ...prev,
                  newPassword: e.target.value,
                }))
              }
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-gray-900 focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
              placeholder="••••••••"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Confirm Password
            </label>
            <input
              type="password"
              value={passwordForm.confirmPassword}
              onChange={(e) =>
                setPasswordForm((prev) => ({
                  ...prev,
                  confirmPassword: e.target.value,
                }))
              }
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-gray-900 focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
              placeholder="••••••••"
            />
          </div>
          <button
            type="submit"
            disabled={
              isSaving ||
              !passwordForm.currentPassword ||
              !passwordForm.newPassword ||
              !passwordForm.confirmPassword
            }
            className="px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaving ? "Updating..." : "Update Password"}
          </button>
        </form>
      </div>

      <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm mb-6">
        <div className="flex items-center gap-2 mb-6 pb-4 border-b border-gray-200">
          <FiBell className="text-purple-600" size={20} />
          <h3 className="text-lg font-bold text-gray-900">Notifications</h3>
        </div>

        <div className="space-y-4">
          {[
            {
              key: "emailNotifications",
              label: "Email Notifications",
              description: "Receive updates via email",
            },
            {
              key: "systemAlerts",
              label: "System Alerts",
              description: "Get notified about system issues",
            },
            {
              key: "weeklyReport",
              label: "Weekly Report",
              description: "Receive weekly analytics report",
            },
            {
              key: "twoFactorAuth",
              label: "Two-Factor Authentication",
              description: "Enable 2FA for extra security",
            },
          ].map((item) => (
            <div
              key={item.key}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200"
            >
              <div>
                <p className="font-medium text-gray-900">{item.label}</p>
                <p className="text-sm text-gray-600">{item.description}</p>
              </div>
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings[item.key]}
                  onChange={() => handleSettingChange(item.key)}
                  className="sr-only"
                />
                <div
                  className={`w-10 h-6 rounded-full transition ${
                    settings[item.key] ? "bg-purple-600" : "bg-gray-300"
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full bg-white transition transform ${
                      settings[item.key] ? "translate-x-5" : "translate-x-1"
                    } mt-1`}
                  />
                </div>
              </label>
            </div>
          ))}
        </div>

        <button
          onClick={handleSaveSettings}
          disabled={isSaving}
          className="mt-6 px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          <FiCheck size={16} />
          {isSaving ? "Saving..." : "Save Preferences"}
        </button>
      </div>
    </div>
  );
}
