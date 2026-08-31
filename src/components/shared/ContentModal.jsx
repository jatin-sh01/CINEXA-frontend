import { useEffect } from "react";
import { FiX } from "react-icons/fi";

export default function ContentModal({ isOpen, onClose, title, children }) {
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-xs animate-fade-in"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="relative z-10 w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-xl animate-modal-pop">
        <div className="sticky top-0 flex items-center justify-between px-6 sm:px-8 py-5 border-b border-gray-100 bg-white/95 backdrop-blur-xs rounded-t-2xl z-10">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">{title}</h2>
          <button
            onClick={onClose}
            className="w-9 h-9 flex items-center justify-center rounded-full text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition duration-150 active:scale-95 cursor-pointer"
            aria-label="Close modal"
          >
            <FiX size={20} />
          </button>
        </div>

        <div className="px-6 sm:px-8 py-6">{children}</div>

        <div className="sticky bottom-0 flex justify-end gap-3 px-6 sm:px-8 py-4 border-t border-gray-100 bg-white/95 backdrop-blur-xs rounded-b-2xl">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-gray-950 text-white text-sm font-medium hover:bg-gray-800 transition duration-150 active:scale-[0.98] cursor-pointer shadow-xs"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
