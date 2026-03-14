import { Link } from "react-router-dom";
import { FiMapPin, FiHash, FiFilm } from "react-icons/fi";

export default function TheaterCard({ theater }) {
  return (
    <Link
      to={`/theaters/${theater._id}`}
      className="group block bg-white rounded-2xl p-6 hover:shadow-xl border border-gray-100 hover:border-gray-300 transition-all duration-300 shadow-sm hover:shadow-gray-200"
    >
      <div className="flex items-start gap-3 mb-3">
        <div className="p-2.5 bg-gray-100 rounded-lg group-hover:bg-gray-200 transition-colors">
          <FiFilm className="w-5 h-5 text-gray-700" />
        </div>
        <div className="flex-1">
          <h3 className="text-gray-900 font-bold text-lg leading-tight">
            {theater.name}
          </h3>
        </div>
      </div>

      {theater.description && (
        <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed">
          {theater.description}
        </p>
      )}

      <div className="h-px bg-gray-200 mb-4 group-hover:bg-gray-300 transition-colors" />

      <div className="grid grid-cols-3 gap-3">
        <div className="flex items-center gap-2">
          <FiMapPin className="w-4 h-4 text-gray-700 shrink-0" />
          <div className="min-w-0">
            <p className="text-xs text-gray-500">Location</p>
            <p className="text-sm font-medium text-gray-900 truncate">
              {theater.city || "—"}
            </p>
          </div>
        </div>

        {theater.pincode && (
          <div className="flex items-center gap-2">
            <FiHash className="w-4 h-4 text-gray-700 shrink-0" />
            <div className="min-w-0">
              <p className="text-xs text-gray-500">PIN</p>
              <p className="text-sm font-medium text-gray-900">
                {theater.pincode}
              </p>
            </div>
          </div>
        )}

        <div className="flex items-center gap-2">
          <FiFilm className="w-4 h-4 text-gray-700 shrink-0" />
          <div className="min-w-0">
            <p className="text-xs text-gray-500">Screens</p>
            <p className="text-sm font-medium text-gray-900">
              {theater.totalScreens || 1}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-200 group-hover:border-gray-300 transition-colors">
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-500 group-hover:text-gray-700 transition-colors">
            View theater details
          </span>
          <span className="text-gray-700 opacity-0 group-hover:opacity-100 transition-opacity">
            →
          </span>
        </div>
      </div>
    </Link>
  );
}
