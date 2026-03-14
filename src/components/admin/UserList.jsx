import { useState } from "react";
import { apiClient } from "../../services/apiClient";
import { useToast } from "../Toast";
import UserRoleEditor from "./UserRoleEditor";
import { FiUser, FiMail } from "react-icons/fi";

export default function UserList() {
  const toast = useToast();
  const [email, setEmail] = useState("");
  const [user, setUser] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!email.trim()) {
      setError("Email is required");
      return;
    }
    setBusy(true);
    setUser(null);
    setError(null);
    try {
      const res = await apiClient.get("/api/users/user", { email: email.trim() });
      const foundUser = res?.data || null;

      if (!foundUser || !foundUser.email) {
        setError("User not found");
        toast("User not found", "error");
      } else {
        setUser(foundUser);
      }
    } catch (err) {
      const errorMsg = err.message || "Failed to search user";
      setError(errorMsg);
      toast(errorMsg, "error");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Search Users</h2>
        <form onSubmit={handleSearch} className="flex gap-3">
          <div className="flex-1">
            <input 
              type="email" 
              placeholder="Enter user email address..." 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              className="w-full px-4 py-2.5 rounded-lg bg-gray-50 text-gray-900 border border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-100 focus:outline-none text-sm transition" 
            />
          </div>
          <button 
            disabled={busy} 
            className="px-5 py-2.5 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-semibold disabled:opacity-50 text-sm transition duration-200"
          >
            {busy ? "Searching..." : "Search"}
          </button>
        </form>
      </div>
      {error && !user && (
        <div className="p-4 rounded-lg bg-red-50 border border-red-200">
          <p className="text-red-900 font-medium text-sm">{error}</p>
        </div>
      )}

      {user && (
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm space-y-4">
          <div className="space-y-4">
            <div className="flex items-start gap-3 pb-4 border-b border-gray-200">
              <FiUser className="text-gray-400 mt-1" size={20} />
              <div>
                <p className="text-sm text-gray-600">Name</p>
                <p className="text-gray-900 font-medium">{user.name || "—"}</p>
              </div>
            </div>
            <div className="flex items-start gap-3 pb-4 border-b border-gray-200">
              <FiMail className="text-gray-400 mt-1" size={20} />
              <div>
                <p className="text-sm text-gray-600">Email</p>
                <p className="text-gray-900 font-medium">{user.email}</p>
              </div>
            </div>
          </div>
          <UserRoleEditor user={user} onSaved={() => handleSearch({ preventDefault: () => {} })} />
        </div>
      )}
    </div>
  );
}