import { Link } from "react-router-dom";
import {
  FiHome,
  FiSearch,
  FiArrowRight,
  FiMapPin,
  FiFilm,
} from "react-icons/fi";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50/50 flex flex-col items-center justify-center px-4 py-12">
      <div className="text-center mb-8">
        <div className="text-8xl md:text-9xl font-black text-gray-900 tracking-tighter mb-2">
          404
        </div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
          Page Not Found
        </h1>
        <p className="text-gray-600 text-base max-w-md">
          We couldn't find the page you're looking for. The movie or show might have been moved or removed.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-12">
        <Link
          to="/"
          className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gray-950 hover:bg-gray-800 text-white rounded-xl font-medium shadow-sm hover:shadow active:scale-[0.98] transition duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-950 focus-visible:ring-offset-2"
        >
          <FiHome size={18} />
          Go to Home
        </Link>
        <Link
          to="/movies"
          className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white border border-gray-200 text-gray-900 hover:bg-gray-50 rounded-xl font-medium shadow-sm active:scale-[0.98] transition duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-950 focus-visible:ring-offset-2"
        >
          <FiFilm size={18} />
          Browse Movies
        </Link>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full max-w-4xl mb-12">
        <Link
          to="/movies"
          className="group bg-white rounded-2xl border border-gray-200/90 p-5 hover:border-gray-950 hover:shadow-xs transition duration-150"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 bg-gray-100 rounded-xl text-gray-700">
              <FiFilm size={20} />
            </div>
            <h3 className="font-bold text-gray-900">
              Browse Movies
            </h3>
          </div>
          <p className="text-xs text-gray-600 mb-3">
            Find latest releases, showtimes, and book tickets
          </p>
          <div className="flex items-center gap-1 text-gray-900 font-semibold text-xs group-hover:gap-1.5 transition-all">
            Explore <FiArrowRight size={14} />
          </div>
        </Link>

        <Link
          to="/theaters"
          className="group bg-white rounded-2xl border border-gray-200/90 p-5 hover:border-gray-950 hover:shadow-xs transition duration-150"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 bg-gray-100 rounded-xl text-gray-700">
              <FiMapPin size={20} />
            </div>
            <h3 className="font-bold text-gray-900">
              Find Theaters
            </h3>
          </div>
          <p className="text-xs text-gray-600 mb-3">
            Discover partnered cinemas and screens in your city
          </p>
          <div className="flex items-center gap-1 text-gray-900 font-semibold text-xs group-hover:gap-1.5 transition-all">
            View Theaters <FiArrowRight size={14} />
          </div>
        </Link>

        <Link
          to="/movies"
          className="group bg-white rounded-2xl border border-gray-200/90 p-5 hover:border-gray-950 hover:shadow-xs transition duration-150"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 bg-gray-100 rounded-xl text-gray-700">
              <FiSearch size={20} />
            </div>
            <h3 className="font-bold text-gray-900">
              Search Lineup
            </h3>
          </div>
          <p className="text-xs text-gray-600 mb-3">
            Search by title, director, or cinematic genre
          </p>
          <div className="flex items-center gap-1 text-gray-900 font-semibold text-xs group-hover:gap-1.5 transition-all">
            Search <FiArrowRight size={14} />
          </div>
        </Link>
      </div>

      <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6 max-w-md text-center">
        <p className="text-blue-900 font-medium mb-2">
          Can't find what you're looking for?
        </p>
        <p className="text-blue-700 text-sm">
          Check the URL or use our navigation menu to find your favorite movies
          and theaters. If you believe this is an error, please contact support.
        </p>
      </div>
    </div>
  );
}
