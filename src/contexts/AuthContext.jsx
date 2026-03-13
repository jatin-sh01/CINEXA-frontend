import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import {
  setToken as apiSetToken,
  clearToken as apiClearToken,
  post,
} from "../api";
import { setAuthToken, clearAuthToken } from "../services/apiClient";
import { saveToken, loadToken, removeToken } from "../utils/storage";

const AuthContext = createContext(null);

function decodePayload(token) {
  try {
    const base64 = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
    return JSON.parse(atob(base64));
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  function clearAuthState() {
    apiClearToken();
    clearAuthToken();
    removeToken();
    setUser(null);
  }

  const hydrateFromToken = useCallback((token) => {
    if (!token) {
      setUser(null);
      return;
    }
    apiSetToken(token);
    setAuthToken(token);
    const payload = decodePayload(token);
    if (!payload) {
      clearAuthState();
      return;
    }
    const expMs = (payload.exp || 0) * 1000;
    if (Date.now() >= expMs) {
      clearAuthState();
      return;
    }
    setUser({ id: payload.sub, email: payload.email, role: payload.role });
  }, []);

  useEffect(() => {
    const token = loadToken();
    if (token) hydrateFromToken(token);
    setLoading(false);
  }, [hydrateFromToken]);

  async function login(email, password) {
    const res = await post("/api/users/login", { email, password });
    const token = res.accessToken;
    saveToken(token);
    hydrateFromToken(token);
    return res;
  }

  async function register(name, email, password) {
    const res = await post("/api/users/register", { name, email, password });
    const token = res.accessToken;
    saveToken(token);
    hydrateFromToken(token);
    return res;
  }

  async function resetPassword(email, newPassword) {
    return post("/api/users/reset-password", { email, newPassword });
  }

  function logout() {
    clearAuthState();
  }

  const isAdmin = user?.role === "ADMIN";
  const isClient = user?.role === "CLIENT";
  const isCustomer = user?.role === "CUSTOMER";

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        resetPassword,
        logout,
        isAdmin,
        isClient,
        isCustomer,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

export default AuthContext;
