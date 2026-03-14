import { useParams, Link } from "react-router-dom";
import { get } from "../api";
import useFetch from "../hooks/useFetch";
import ShowList from "../components/shows/ShowList";
import Spinner from "../components/shared/Spinner";
import { formatDate } from "../utils/format";
import {
  FiCalendar,
  FiUser,
  FiFilm,
  FiGlobe,
  FiStar,
  FiPlay,
} from "react-icons/fi";

export default function MovieDetails() {
  const { id } = useParams();
  const { data, loading, error } = useFetch(
    () => get(`/api/movies/${id}`),
    [id],
  );
  const movie = data?.data;

  if (loading) return <Spinner />;
  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-b from-gray-50 to-white">
        <div className="p-8 rounded-2xl bg-red-50 border border-red-200 text-center shadow-lg">
          <p className="text-red-900 font-semibold text-lg">{error}</p>
        </div>
      </div>
    );
  if (!movie)
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-b from-gray-50 to-white">
        <div className="p-8 rounded-2xl bg-gray-100 border border-gray-200 text-center shadow-lg">
          <p className="text-gray-700 font-semibold text-lg">Movie not found</p>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-linear-to-b from-white via-gray-50 to-gray-100">
      <div className="relative h-56 md:h-72 overflow-hidden bg-gray-200">
        {movie.poster && (
          <div
            className="absolute inset-0 bg-cover bg-center blur-md opacity-30"
            style={{ backgroundImage: `url(${movie.poster})` }}
          />
        )}
        <div className="absolute inset-0 bg-linear-to-b from-white/60 via-white/40 to-gray-100" />
      </div>

      <div className="max-w-6xl mx-auto px-4 -mt-40 relative z-10">
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="md:col-span-1">
            <div className="rounded-xl overflow-hidden shadow-lg border border-gray-200 hover:shadow-xl transition h-fit">
              {movie.poster ? (
                <img
                  src={movie.poster}
                  alt={movie.name}
                  className="w-full h-auto object-cover max-w-xs"
                />
              ) : (
                <div className="w-full aspect-2/3 bg-linear-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center text-gray-400 text-xl font-semibold">
                  No Poster
                </div>
              )}
            </div>
          </div>

          <div className="md:col-span-2 space-y-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                {movie.name}
              </h1>

              <div className="flex items-center gap-2 flex-wrap">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    movie.releaseStatus === "RELEASED"
                      ? "bg-green-100 text-green-700 border border-green-300"
                      : movie.releaseStatus === "COMING_SOON"
                        ? "bg-blue-100 text-blue-700 border border-blue-300"
                        : "bg-red-100 text-red-700 border border-red-300"
                  }`}
                >
                  {movie.releaseStatus?.replace("_", " ")}
                </span>
                {movie.certificate && (
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-purple-100 text-purple-700 border border-purple-300">
                    {movie.certificate}
                  </span>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {movie.language && (
                <div className="bg-white p-3 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition">
                  <div className="flex items-center gap-2 text-gray-600 text-xs mb-1">
                    <FiGlobe size={16} className="text-purple-600" />
                    <span>Language</span>
                  </div>
                  <p className="text-gray-900 font-semibold text-sm">
                    {movie.language}
                  </p>
                </div>
              )}

              {movie.releaseDate && (
                <div className="bg-white p-3 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition">
                  <div className="flex items-center gap-2 text-gray-600 text-xs mb-1">
                    <FiCalendar size={16} className="text-blue-600" />
                    <span>Release Date</span>
                  </div>
                  <p className="text-gray-900 font-semibold text-sm">
                    {formatDate(movie.releaseDate)}
                  </p>
                </div>
              )}

              {movie.director && (
                <div className="bg-white p-3 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition">
                  <div className="flex items-center gap-2 text-gray-600 text-xs mb-1">
                    <FiUser size={16} className="text-orange-600" />
                    <span>Director</span>
                  </div>
                  <p className="text-gray-900 font-semibold text-sm">
                    {movie.director}
                  </p>
                </div>
              )}

              {movie.genres?.length > 0 && (
                <div className="bg-white p-3 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition">
                  <div className="flex items-center gap-2 text-gray-600 text-xs mb-1">
                    <FiFilm size={16} className="text-pink-600" />
                    <span>Genre</span>
                  </div>
                  <p className="text-gray-900 font-semibold text-sm">
                    {movie.genres.join(", ")}
                  </p>
                </div>
              )}
            </div>

            {movie.description && (
              <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition">
                <h3 className="text-base font-semibold text-gray-900 mb-2">
                  Synopsis
                </h3>
                <p className="text-gray-700 leading-relaxed text-sm">
                  {movie.description}
                </p>
              </div>
            )}

            {movie.cast?.length > 0 && (
              <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition">
                <h3 className="text-base font-semibold text-gray-900 mb-2">
                  Cast
                </h3>
                <div className="flex flex-wrap gap-2">
                  {movie.cast.map((actor, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-gray-100 text-gray-800 text-xs rounded-md hover:bg-gray-200 transition border border-gray-300"
                    >
                      {actor}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {movie.trailerUrl && (
              <a
                href={movie.trailerUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-linear-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white px-6 py-3 rounded-lg text-sm font-bold shadow-lg hover:shadow-xl transition transform hover:scale-105"
              >
                <FiPlay size={18} />
                Watch Trailer
              </a>
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-10 shadow-lg hover:shadow-xl transition">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <FiPlay className="text-purple-600" size={28} />
            Available Shows
          </h2>
          <ShowList movieId={id} />
        </div>
      </div>
    </div>
  );
}
