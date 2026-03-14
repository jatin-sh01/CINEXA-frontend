import { Link } from "react-router-dom";
import { FiHome, FiSearch, FiArrowRight, FiMapPin, FiFilm } from "react-icons/fi";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-linear-to-b from-white to-gray-50 flex flex-col items-center justify-center px-4 py-12">
      
      <div className="text-center mb-8">
        <div className="text-8xl md:text-9xl font-bold text-transparent bg-clip-text bg-linear-to-r from-purple-600 to-blue-600 mb-4">
          404
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
          Oops! Page Not Found
        </h1>
        <p className="text-gray-600 text-lg max-w-md">
          We couldn't find the page you're looking for. The movie might have been removed or the link is broken.
        </p>
      </div>

      
      <div className="flex flex-col sm:flex-row gap-4 mb-12">
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-6 py-3 bg-linear-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white rounded-lg font-semibold transition-all duration-300 hover:shadow-lg"
        >
          <FiHome size={20} />
          Go to Home
        </Link>
        <Link
          to="/movies"
          className="inline-flex items-center gap-2 px-6 py-3 border-2 border-purple-600 text-purple-600 hover:bg-purple-50 rounded-lg font-semibold transition-all duration-300"
        >
          <FiFilm size={20} />
          Browse Movies
        </Link>
      </div>

      
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full max-w-4xl mb-12">
        
        <Link
          to="/movies"
          className="group bg-white rounded-xl border-2 border-gray-200 p-5 hover:border-purple-400 hover:shadow-lg transition-all duration-300"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition">
              <FiFilm className="text-blue-600" size={24} />
            </div>
            <h3 className="font-bold text-gray-900 group-hover:text-purple-600 transition">
              Browse Movies
            </h3>
          </div>
          <p className="text-sm text-gray-600 mb-3">Find the latest movies and book tickets now</p>
          <div className="flex items-center gap-1 text-purple-600 font-semibold text-sm group-hover:gap-2 transition-all">
            Explore <FiArrowRight size={16} />
          </div>
        </Link>

        
        <Link
          to="/theaters"
          className="group bg-white rounded-xl border-2 border-gray-200 p-5 hover:border-purple-400 hover:shadow-lg transition-all duration-300"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-purple-100 rounded-lg group-hover:bg-purple-200 transition">
              <FiMapPin className="text-purple-600" size={24} />
            </div>
            <h3 className="font-bold text-gray-900 group-hover:text-purple-600 transition">
              Find Theaters
            </h3>
          </div>
          <p className="text-sm text-gray-600 mb-3">Discover theaters in your city</p>
          <div className="flex items-center gap-1 text-purple-600 font-semibold text-sm group-hover:gap-2 transition-all">
            Search <FiArrowRight size={16} />
          </div>
        </Link>

        
        <Link
          to="/movies"
          className="group bg-white rounded-xl border-2 border-gray-200 p-5 hover:border-purple-400 hover:shadow-lg transition-all duration-300"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-orange-100 rounded-lg group-hover:bg-orange-200 transition">
              <FiSearch className="text-orange-600" size={24} />
            </div>
            <h3 className="font-bold text-gray-900 group-hover:text-purple-600 transition">
              Search Movies
            </h3>
          </div>
          <p className="text-sm text-gray-600 mb-3">Use our search to find what you're looking for</p>
          <div className="flex items-center gap-1 text-purple-600 font-semibold text-sm group-hover:gap-2 transition-all">
            Search <FiArrowRight size={16} />
          </div>
        </Link>
      </div>

      
      <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6 max-w-md text-center">
        <p className="text-blue-900 font-medium mb-2">
          Can't find what you're looking for?
        </p>
        <p className="text-blue-700 text-sm">
          Check the URL or use our navigation menu to find your favorite movies and theaters. If you believe this is an error, please contact support.
        </p>
      </div>
    </div>
  );
}
