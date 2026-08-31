import { useParams, useNavigate } from "react-router-dom";
import { get } from "../api";
import useFetch from "../hooks/useFetch";
import Spinner from "../components/shared/Spinner";
import ShowList from "../components/shows/ShowList";
import TheaterMoviesList from "../components/theaters/TheaterMoviesList";
import { FiMapPin, FiFilm, FiClock } from "react-icons/fi";

export default function TheaterDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data, loading, error } = useFetch(
    () => get(`/api/theaters/${id}`),
    [id],
  );
  const theater = data?.data;

  if (loading) return <Spinner />;
  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-b from-gray-50 to-white px-4">
        <div className="bg-red-50 border border-red-200 rounded-xl p-8 text-center">
          <p className="text-red-700 font-semibold text-lg">{error}</p>
        </div>
      </div>
    );
  if (!theater)
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-b from-gray-50 to-white px-4">
        <div className="bg-gray-100 border border-gray-300 rounded-xl p-8 text-center">
          <p className="text-gray-700 font-semibold text-lg">
            Theater not found
          </p>
        </div>
      </div>
    );

  const handleMovieClick = (movieId) => {
    navigate(`/movies/${movieId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50/50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl border border-gray-200/90 p-6 sm:p-8 shadow-xs mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900 mb-6">
            {theater.name}
          </h1>

          <div className="grid md:grid-cols-3 gap-6 mb-6">
            <div className="flex items-start gap-3">
              <div className="p-2.5 bg-gray-100 rounded-xl text-gray-700 shrink-0">
                <FiMapPin size={20} />
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium mb-1">
                  Location
                </p>
                <p className="text-sm font-semibold text-gray-900">
                  {theater.address}, {theater.city}
                </p>
                {theater.pincode && (
                  <p className="text-xs text-gray-500 mt-0.5">{theater.pincode}</p>
                )}
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2.5 bg-gray-100 rounded-xl text-gray-700 shrink-0">
                <FiFilm size={20} />
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium mb-1">
                  Screens
                </p>
                <p className="text-sm font-semibold text-gray-900">
                  {theater.totalScreens} Screen{theater.totalScreens !== 1 ? "s" : ""}
                </p>
              </div>
            </div>

            {theater.description && (
              <div className="flex items-start gap-3">
                <div className="p-2.5 bg-gray-100 rounded-xl text-gray-700 shrink-0">
                  <FiClock size={20} />
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-medium mb-1">
                    About
                  </p>
                  <p className="text-sm text-gray-700 line-clamp-2">
                    {theater.description}
                  </p>
                </div>
              </div>
            )}
          </div>

          {theater.description && (
            <div className="pt-5 border-t border-gray-100">
              <p className="text-sm text-gray-600 leading-relaxed">
                {theater.description}
              </p>
            </div>
          )}
        </div>

        <div className="mb-10">
          <TheaterMoviesList theaterId={id} onMovieClick={handleMovieClick} />
        </div>

        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-gray-900 mb-5 flex items-center gap-2">
            <FiClock className="text-gray-700" size={22} />
            Available Shows
          </h2>
          <ShowList theaterId={id} />
        </div>
      </div>
    </div>
  );
}
