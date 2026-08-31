import { Link } from "react-router-dom";
import { FiMapPin, FiHash, FiFilm } from "react-icons/fi";

export default function TheaterCard({ theater }) {
  return (
    <Link
      to={`/theaters/${theater._id}`}
      className="group block bg-white rounded-2xl p-5 border border-gray-200/90 hover:border-gray-950 transition duration-150 shadow-xs active:scale-[0.99] flex flex-col justify-between"
    >
      <div>
        <div className="flex items-start gap-3 mb-3">
          <div className="p-2.5 bg-gray-100 rounded-xl text-gray-700 shrink-0">
            <FiFilm className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <h3 className="text-gray-900 font-bold text-base leading-snug">
              {theater.name}
            </h3>
            <p className="text-xs text-gray-500 mt-0.5">
              {theater.city || "City unavailable"}
            </p>
          </div>
        </div>

        {theater.description && (
          <p className="text-gray-600 text-xs mb-4 line-clamp-2 leading-relaxed">
            {theater.description}
          </p>
        )}
      </div>

      <div className="mt-4 pt-3.5 border-t border-gray-100">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>{theater.totalScreens || 1} Screen{theater.totalScreens !== 1 ? "s" : ""}</span>
          <span className="font-semibold text-gray-900 group-hover:translate-x-0.5 transition-transform">
            View Shows →
          </span>
        </div>
      </div>
    </Link>
  );
}
