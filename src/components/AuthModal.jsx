import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useToast } from "./Toast";
import { FiX } from "react-icons/fi";
import ContentModal from "./shared/ContentModal";
import CinexaLogo from "./shared/CinexaLogo";
import { TERMS_CONTENT, PRIVACY_CONTENT } from "../lib/modalContent";

export default function AuthModal({ onClose }) {
  const { login, register } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [busy, setBusy] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const set = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      if (mode === "login") {
        await login(form.email, form.password);
        toast("Logged in successfully!", "success");
      } else {
        await register(form.name, form.email, form.password);
        toast("Account created!", "success");
      }
      onClose();
      navigate("/");
    } catch (err) {
      toast(
        err.message ||
          (mode === "login" ? "Login failed" : "Registration failed"),
        "error",
      );
    } finally {
      setBusy(false);
    }
  };

  const switchMode = () => {
    setMode((m) => (m === "login" ? "register" : "login"));
    setForm({ name: "", email: "", password: "" });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-xs animate-fade-in"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="relative z-10 bg-white rounded-2xl shadow-xl w-full max-w-md p-6 sm:p-8 animate-modal-pop">
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition duration-150 active:scale-95 cursor-pointer"
        >
          <FiX size={18} />
        </button>

        <div className="text-center mb-6">
          <div className="inline-block text-gray-900">
            <CinexaLogo className="h-7 w-auto" />
          </div>
        </div>

        <h2 className="text-xl font-bold text-gray-900 text-center">
          {mode === "login" ? "Sign in to your account" : "Create your account"}
        </h2>
        <p className="text-sm text-gray-500 text-center mt-1 mb-6">
          {mode === "login"
            ? "If you don't have an account yet, we'll create one for you"
            : "Join Cinexa for the best movie booking experience"}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === "register" && (
            <div>
              <label
                htmlFor="auth-modal-name"
                className="block text-xs font-medium text-gray-700 mb-1.5"
              >
                Full Name
              </label>
              <input
                id="auth-modal-name"
                name="name"
                type="text"
                autoComplete="name"
                placeholder="e.g. Jane Doe"
                value={form.name}
                onChange={set("name")}
                required
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 bg-white text-gray-900 placeholder:text-gray-400 text-sm focus:outline-none focus:border-gray-950 focus:ring-2 focus:ring-gray-950/10 transition"
              />
            </div>
          )}
          <div>
            <label
              htmlFor="auth-modal-email"
              className="block text-xs font-medium text-gray-700 mb-1.5"
            >
              Email Address
            </label>
            <input
              id="auth-modal-email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={set("email")}
              required
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 bg-white text-gray-900 placeholder:text-gray-400 text-sm focus:outline-none focus:border-gray-950 focus:ring-2 focus:ring-gray-950/10 transition"
            />
          </div>
          <div>
            <label
              htmlFor="auth-modal-password"
              className="block text-xs font-medium text-gray-700 mb-1.5"
            >
              Password
            </label>
            <input
              id="auth-modal-password"
              name="password"
              type="password"
              autoComplete={mode === "register" ? "new-password" : "current-password"}
              placeholder={
                mode === "register" ? "At least 6 characters" : "Enter your password"
              }
              value={form.password}
              onChange={set("password")}
              required
              minLength={6}
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 bg-white text-gray-900 placeholder:text-gray-400 text-sm focus:outline-none focus:border-gray-950 focus:ring-2 focus:ring-gray-950/10 transition"
            />
          </div>

          <button
            type="submit"
            disabled={busy}
            className="w-full py-3 rounded-xl bg-gray-950 hover:bg-gray-800 text-white font-medium text-sm shadow-sm active:scale-[0.98] transition duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-950 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100 cursor-pointer"
          >
            {busy
              ? mode === "login"
                ? "Signing in\u2026"
                : "Creating account\u2026"
              : mode === "login"
                ? "Sign In"
                : "Create Account"}
          </button>
        </form>

        <p className="text-xs text-gray-500 text-center mt-5">
          {mode === "login" ? (
            <>
              Don&apos;t have an account?{" "}
              <button
                onClick={switchMode}
                className="text-purple-600 hover:underline font-medium"
              >
                Register
              </button>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <button
                onClick={switchMode}
                className="text-purple-600 hover:underline font-medium"
              >
                Sign In
              </button>
            </>
          )}
        </p>

        <p className="text-[11px] text-gray-400 text-center mt-3">
          By continuing, you agree to our{" "}
          <button
            onClick={() => setShowTerms(true)}
            className="underline cursor-pointer hover:text-gray-600 transition"
          >
            Terms of Service
          </button>{" "}
          &middot;{" "}
          <button
            onClick={() => setShowPrivacy(true)}
            className="underline cursor-pointer hover:text-gray-600 transition"
          >
            Privacy Policy
          </button>
        </p>
      </div>

      <ContentModal
        isOpen={showTerms}
        onClose={() => setShowTerms(false)}
        title="Terms of Service"
      >
        {TERMS_CONTENT}
      </ContentModal>
      <ContentModal
        isOpen={showPrivacy}
        onClose={() => setShowPrivacy(false)}
        title="Privacy Policy"
      >
        {PRIVACY_CONTENT}
      </ContentModal>
    </div>
  );
}
