import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useToast } from "../Toast";
import { primaryButton, inputField, cardForm } from "../../lib/uiPatterns";


export default function AuthForm({ mode = "login", onSuccess }) {
  const { login, register } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [busy, setBusy] = useState(false);

  const isLogin = mode === "login";
  const isRegister = mode === "register";

  const set = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      if (isLogin) {
        await login(form.email, form.password);
        toast("Logged in successfully!", "success");
      } else if (isRegister) {
        await register(form.name, form.email, form.password);
        toast("Account created!", "success");
      }

      
      if (onSuccess) {
        onSuccess();
      } else {
        navigate("/");
      }
    } catch (err) {
      const errorMsg = err.message || (isLogin ? "Login failed" : "Registration failed");
      toast(errorMsg, "error");
    } finally {
      setBusy(false);
    }
  };

  const headingText = isLogin ? "Sign In" : "Create Account";
  const buttonText = isLogin
    ? busy
      ? "Signing in\u2026"
      : "Sign In"
    : busy
      ? "Creating\u2026"
      : "Register";
  const linkText = isLogin ? "No account?" : "Already have an account?";
  const linkHref = isLogin ? "/register" : "/login";
  const linkTarget = isLogin ? "Register" : "Sign In";

  return (
    <form
      onSubmit={handleSubmit}
      className={cardForm}
    >
      <h1 className="text-2xl font-bold text-white text-center">{headingText}</h1>

      
      {isRegister && (
        <input
          type="text"
          placeholder="Full Name"
          value={form.name}
          onChange={set("name")}
          required
          className={inputField}
        />
      )}

      
      <input
        type="email"
        placeholder="Email"
        value={form.email}
        onChange={set("email")}
        required
        className={inputField}
      />

      
      <input
        type="password"
        placeholder={isRegister ? "Password (min 6 chars)" : "Password"}
        value={form.password}
        onChange={set("password")}
        required
        minLength={6}
        className={inputField}
      />

      
      <button
        disabled={busy}
        className={`${primaryButton} w-full disabled:opacity-50 disabled:cursor-not-allowed`}
      >
        {buttonText}
      </button>

      
      <p className="text-gray-400 text-sm text-center">
        {linkText}{" "}
        <Link to={linkHref} className="text-purple-400 hover:underline font-medium">
          {linkTarget}
        </Link>
      </p>
    </form>
  );
}
