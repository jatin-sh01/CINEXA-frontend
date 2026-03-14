import { useState } from "react";
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
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="relative z-10 bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 p-8 animate-slide-up">
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition"
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
            <input
              type="text"
              placeholder="Full Name"
              value={form.name}
              onChange={set("name")}
              required
              className="w-full px-4 py-3 rounded-lg border border-gray-300 text-gray-800 placeholder:text-gray-400 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-300 transition text-sm"
            />
          )}
          <input
            type="email"
            placeholder="Email address"
            value={form.email}
            onChange={set("email")}
            required
            className="w-full px-4 py-3 rounded-lg border border-gray-300 text-gray-800 placeholder:text-gray-400 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-300 transition text-sm"
          />
          <input
            type="password"
            placeholder={
              mode === "register" ? "Password (min 6 chars)" : "Password"
            }
            value={form.password}
            onChange={set("password")}
            required
            minLength={6}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 text-gray-800 placeholder:text-gray-400 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-300 transition text-sm"
          />

          <button
            disabled={busy}
            className="w-full py-3 rounded-lg bg-gray-900 hover:bg-gray-800 text-white font-semibold text-sm disabled:opacity-50 transition"
          >
            {busy
              ? mode === "login"
                ? "Signing in\u2026"
                : "Creating\u2026"
              : "Continue"}
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
