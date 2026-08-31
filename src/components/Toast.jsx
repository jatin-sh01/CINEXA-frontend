/* eslint-disable react-refresh/only-export-components */
import { useState, createContext, useContext, useCallback, useEffect } from "react";

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = "info", duration = 3000) => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type, duration }]);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={addToast}>
      {children}
      <div className="fixed bottom-6 right-6 z-100 flex flex-col gap-2 pointer-events-none">
        {toasts.map((t) => (
          <ToastItem
            key={t.id}
            toast={t}
            onDismiss={() => removeToast(t.id)}
          />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

function ToastItem({ toast, onDismiss }) {
  const [isExiting, setIsExiting] = useState(false);

  const handleDismiss = useCallback(() => {
    setIsExiting(true);
    setTimeout(() => {
      onDismiss();
    }, 140);
  }, [onDismiss]);

  useEffect(() => {
    const timer = setTimeout(() => {
      handleDismiss();
    }, toast.duration || 3000);
    return () => clearTimeout(timer);
  }, [toast.duration, handleDismiss]);

  const bg =
    toast.type === "error"
      ? "bg-red-600"
      : toast.type === "success"
        ? "bg-emerald-600"
        : "bg-gray-900";

  return (
    <div
      className={`${bg} text-white px-4 py-3 rounded-xl shadow-lg pointer-events-auto flex items-center gap-3 min-w-64 max-w-sm transition-all duration-150 ${
        isExiting ? "animate-slide-down-out opacity-0" : "animate-slide-up opacity-100"
      }`}
    >
      <span className="flex-1 text-sm font-medium leading-snug">{toast.message}</span>
      <button
        type="button"
        onClick={handleDismiss}
        aria-label="Dismiss notification"
        className="text-white/70 hover:text-white text-lg leading-none p-1 rounded-md transition hover:bg-white/10 active:scale-95 cursor-pointer"
      >
        &times;
      </button>
    </div>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}
