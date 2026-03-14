import { FiX } from "react-icons/fi";

export default function ContentModal({ isOpen, onClose, title, children }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative z-10 w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-2xl">
        <div className="sticky top-0 flex items-center justify-between px-8 py-6 border-b border-gray-100 bg-white rounded-t-2xl">
          <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
          <button
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center rounded-full text-gray-500 hover:bg-gray-100 transition"
            aria-label="Close modal"
          >
            <FiX size={24} />
          </button>
        </div>

        <div className="px-8 py-8">{children}</div>

        <div className="sticky bottom-0 flex justify-end gap-3 px-8 py-6 border-t border-gray-100 bg-white rounded-b-2xl">
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-lg bg-gray-900 text-white font-medium hover:bg-gray-800 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
