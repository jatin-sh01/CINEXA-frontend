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
    navigate(`/shows?movieId=${movieId}&theaterId=${id}`);
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-white to-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm hover:shadow-md transition mb-10">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {theater.name}
          </h1>

          <div className="grid md:grid-cols-3 gap-6 mb-6">
            <div className="flex items-start gap-3">
              <FiMapPin className="text-purple-600 shrink-0 mt-1" size={24} />
              <div>
                <p className="text-sm text-gray-600 font-medium mb-1">
                  Location
                </p>
                <p className="text-gray-900 font-semibold">
                  {theater.address}, {theater.city}
                </p>
                {theater.pincode && (
                  <p className="text-gray-600 text-sm">{theater.pincode}</p>
                )}
              </div>
            </div>

            <div className="flex items-start gap-3">
              <FiFilm className="text-blue-600 shrink-0 mt-1" size={24} />
              <div>
                <p className="text-sm text-gray-600 font-medium mb-1">
                  Screens
                </p>
                <p className="text-gray-900 font-semibold text-lg">
                  {theater.totalScreens}
                </p>
              </div>
            </div>

            {theater.description && (
              <div className="flex items-start gap-3">
                <FiClock className="text-orange-600 shrink-0 mt-1" size={24} />
                <div>
                  <p className="text-sm text-gray-600 font-medium mb-1">
                    About
                  </p>
                  <p className="text-gray-700 text-sm line-clamp-2">
                    {theater.description}
                  </p>
                </div>
              </div>
            )}
          </div>

          {theater.description && (
            <div className="pt-6 border-t border-gray-200">
              <p className="text-gray-700 leading-relaxed">
                {theater.description}
              </p>
            </div>
          )}
        </div>

        <div className="mb-10">
          <TheaterMoviesList theaterId={id} onMovieClick={handleMovieClick} />
        </div>

        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <FiClock className="text-purple-600" size={32} />
            Available Shows
          </h2>
          <ShowList theaterId={id} />
        </div>
      </div>
    </div>
  );
}
