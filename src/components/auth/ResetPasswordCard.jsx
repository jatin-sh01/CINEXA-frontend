import { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useToast } from "../Toast";

export default function ResetPasswordCard() {
  const { resetPassword } = useAuth();
  const toast = useToast();
  const [form, setForm] = useState({ email: "", newPassword: "" });
  const [busy, setBusy] = useState(false);

  const set = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      await resetPassword(form.email, form.newPassword);
      toast("Password reset successful!", "success");
      setForm({ email: "", newPassword: "" });
    } catch (err) {
      toast(err.message || "Reset failed", "error");
    } finally {
      setBusy(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-gray-900 rounded-2xl shadow-xl p-8 w-full max-w-md space-y-5 mx-auto mt-12">
      <h2 className="text-xl font-bold text-white text-center">Reset Password</h2>
      <input type="email" placeholder="Email" value={form.email} onChange={set("email")} required className="w-full px-4 py-3 rounded-lg bg-gray-800 text-white border border-gray-700 focus:border-purple-500 focus:outline-none" />
      <input type="password" placeholder="New Password (min 6 chars)" value={form.newPassword} onChange={set("newPassword")} required minLength={6} className="w-full px-4 py-3 rounded-lg bg-gray-800 text-white border border-gray-700 focus:border-purple-500 focus:outline-none" />
      <button disabled={busy} className="w-full py-3 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-semibold disabled:opacity-50">
        {busy ? "Resetting\u2026" : "Reset Password"}
      </button>
    </form>
  );
}