import { useState } from "react";
import { apiClient } from "../../services/apiClient";
import { useToast } from "../Toast";
import { FiCheckCircle } from "react-icons/fi";

const ROLES = ["CUSTOMER", "ADMIN", "CLIENT"];
const STATUSES = ["APPROVED", "PENDING", "REJECTED"];

export default function UserRoleEditor({ user, onSaved }) {
  const toast = useToast();
  const [role, setRole] = useState(user.userRole || "CUSTOMER");
  const [status, setStatus] = useState(user.userStatus || "PENDING");
  const [busy, setBusy] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSave = async () => {
    setBusy(true);
    setSuccess(false);
    try {
      await apiClient.patch(`/api/users/${user._id}/role`, {
        userRole: role,
        userStatus: status,
      });
      toast("User updated successfully", "success");
      setSuccess(true);
      setTimeout(() => setSuccess(false), 2000);
      onSaved?.();
    } catch (err) {
      toast(err.message || "Failed to update user", "error");
    } finally {
      setBusy(false);
    }
  };

  const selectCls =
    "px-3 py-2 rounded-lg bg-gray-50 text-gray-900 border border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-100 focus:outline-none text-sm transition";

  return (
    <div className="space-y-4 pt-4 border-t border-gray-200">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Role
          </label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className={selectCls}
          >
            {ROLES.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Status
          </label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className={selectCls}
          >
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div>
          {success && (
            <div className="flex items-center gap-2 text-green-700">
              <FiCheckCircle size={18} />
              <span className="text-sm font-medium">Updated successfully</span>
            </div>
          )}
        </div>
        <button
          onClick={handleSave}
          disabled={busy}
          className="px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold disabled:opacity-50 transition duration-200"
        >
          {busy ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </div>
  );
}
