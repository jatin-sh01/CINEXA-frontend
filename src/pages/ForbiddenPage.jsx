import { Link } from "react-router-dom";
import { FiAlertTriangle } from "react-icons/fi";

export default function ForbiddenPage() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 text-center">
      <FiAlertTriangle size={64} className="text-red-500 mb-6" />
      <h1 className="text-4xl font-bold text-gray-900 mb-2">403 — Forbidden</h1>
      <p className="text-gray-600 mb-8 max-w-md">
        You don't have permission to access this page. If you believe this is an
        error, contact your administrator.
      </p>
      <Link
        to="/"
        className="inline-flex items-center justify-center px-6 py-3 bg-gray-950 text-white rounded-xl font-medium hover:bg-gray-800 active:scale-[0.98] transition duration-150 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-950 focus-visible:ring-offset-2"
      >
        Go to Home
      </Link>
    </div>
  );
}
