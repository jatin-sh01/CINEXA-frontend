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
    <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-2xl shadow-sm p-8 w-full max-w-md space-y-4 mx-auto">
      <h2 className="text-xl font-bold text-gray-900 text-center mb-2">Reset Password</h2>
      <div>
        <label
          htmlFor="reset-email"
          className="block text-xs font-medium text-gray-700 mb-1.5"
        >
          Email Address
        </label>
        <input
          id="reset-email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          value={form.email}
          onChange={set("email")}
          required
          className="w-full px-3.5 py-2.5 rounded-xl bg-white text-gray-900 border border-gray-300 placeholder:text-gray-400 focus:border-gray-950 focus:outline-none focus:ring-2 focus:ring-gray-950/10 text-sm transition"
        />
      </div>
      <div>
        <label
          htmlFor="reset-password"
          className="block text-xs font-medium text-gray-700 mb-1.5"
        >
          New Password
        </label>
        <input
          id="reset-password"
          name="newPassword"
          type="password"
          autoComplete="new-password"
          placeholder="At least 6 characters"
          value={form.newPassword}
          onChange={set("newPassword")}
          required
          minLength={6}
          className="w-full px-3.5 py-2.5 rounded-xl bg-white text-gray-900 border border-gray-300 placeholder:text-gray-400 focus:border-gray-950 focus:outline-none focus:ring-2 focus:ring-gray-950/10 text-sm transition"
        />
      </div>
      <button
        type="submit"
        disabled={busy}
        className="w-full py-3 rounded-xl bg-gray-950 hover:bg-gray-800 text-white font-medium text-sm shadow-sm active:scale-[0.98] transition duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-950 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100 cursor-pointer"
      >
        {busy ? "Resetting\u2026" : "Reset Password"}
      </button>
    </form>
  );
}