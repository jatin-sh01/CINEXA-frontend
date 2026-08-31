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
    <div className="min-h-screen bg-gray-50/50">
      <div className="relative h-56 md:h-72 overflow-hidden bg-gray-900">
        {movie.poster && (
          <div
            className="absolute inset-0 bg-cover bg-center blur-lg opacity-25 scale-105"
            style={{ backgroundImage: `url(${movie.poster})` }}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-gray-50/50 via-gray-900/40 to-transparent" />
      </div>

      <div className="max-w-6xl mx-auto px-4 -mt-36 md:-mt-44 relative z-10">
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <div className="md:col-span-1">
            <div className="rounded-2xl overflow-hidden shadow-md border border-gray-200 bg-white">
              {movie.poster ? (
                <img
                  src={movie.poster}
                  alt={movie.name}
                  className="w-full h-auto object-cover"
                />
              ) : (
                <div className="w-full aspect-2/3 bg-gray-100 flex items-center justify-center text-gray-400 text-base font-medium">
                  No Poster Available
                </div>
              )}
            </div>
          </div>

          <div className="md:col-span-2 space-y-6">
            <div className="space-y-3">
              <div className="flex items-center gap-2.5 flex-wrap">
                {movie.releaseStatus && (
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                      movie.releaseStatus === "RELEASED"
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                        : movie.releaseStatus === "COMING_SOON"
                          ? "bg-blue-50 text-blue-700 border border-blue-200"
                          : "bg-gray-100 text-gray-700 border border-gray-200"
                    }`}
                  >
                    {movie.releaseStatus?.replace("_", " ")}
                  </span>
                )}
                {movie.certificate && (
                  <span className="px-2.5 py-0.5 rounded-md text-xs font-semibold bg-gray-100 text-gray-800 border border-gray-200">
                    {movie.certificate}
                  </span>
                )}
              </div>

              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">
                {movie.name}
              </h1>
            </div>

            <div className="bg-white border border-gray-200/90 rounded-2xl p-4 sm:p-5 shadow-xs">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {movie.language && (
                  <div>
                    <span className="block text-xs text-gray-500 font-medium">Language</span>
                    <span className="text-sm font-semibold text-gray-900">{movie.language}</span>
                  </div>
                )}
                {movie.releaseDate && (
                  <div>
                    <span className="block text-xs text-gray-500 font-medium">Release Date</span>
                    <span className="text-sm font-semibold text-gray-900">{formatDate(movie.releaseDate)}</span>
                  </div>
                )}
                {movie.director && (
                  <div>
                    <span className="block text-xs text-gray-500 font-medium">Director</span>
                    <span className="text-sm font-semibold text-gray-900">{movie.director}</span>
                  </div>
                )}
                {movie.genres?.length > 0 && (
                  <div>
                    <span className="block text-xs text-gray-500 font-medium">Genre</span>
                    <span className="text-sm font-semibold text-gray-900">{movie.genres.join(", ")}</span>
                  </div>
                )}
              </div>
            </div>

            {movie.description && (
              <div className="space-y-2">
                <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">
                  Synopsis
                </h3>
                <p className="text-gray-700 leading-relaxed text-sm">
                  {movie.description}
                </p>
              </div>
            )}

            {movie.cast?.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">
                  Cast
                </h3>
                <div className="flex flex-wrap gap-2">
                  {movie.cast.map((actor, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-white text-gray-800 text-xs rounded-lg border border-gray-200 shadow-xs font-medium"
                    >
                      {actor}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {movie.trailerUrl && (
              <div className="pt-2">
                <a
                  href={movie.trailerUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-gray-950 hover:bg-gray-800 text-white px-6 py-3 rounded-xl text-sm font-medium shadow-sm hover:shadow active:scale-[0.98] transition duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-950 focus-visible:ring-offset-2"
                >
                  <FiPlay size={16} />
                  Watch Trailer
                </a>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200/90 p-6 sm:p-8 mb-12 shadow-xs">
          <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <FiPlay className="text-gray-900" size={22} />
            Available Shows
          </h2>
          <ShowList movieId={id} />
        </div>
      </div>
    </div>
  );
}
