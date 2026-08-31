import { useEffect, useState } from "react";
import { get } from "../api";
import useFetch from "../hooks/useFetch";
import MovieCard from "../components/MovieCard";
import Spinner from "../components/shared/Spinner";
import { FiSearch, FiX } from "react-icons/fi";

export default function MoviesList() {
  const [search, setSearch] = useState("");
  const [draft, setDraft] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => setSearch(draft.trim()), 250);
    return () => clearTimeout(timer);
  }, [draft]);

  const { data, loading, error } = useFetch(
    () => get("/api/movies", { name: search || undefined }),
    [search],
  );
  const movies = data?.data || [];

  return (
    <section className="max-w-7xl mx-auto px-4 py-8 sm:py-10">
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900 mb-1">
          Movies
        </h1>
        <p className="text-sm text-gray-500">
          {search
            ? `Showing results for "${search}"`
            : "Browse all currently available releases and upcoming movies"}
        </p>
      </div>

      <div className="w-full max-w-xl mb-6 relative">
        <FiSearch
          size={16}
          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
        />
        <input
          placeholder="Search movies by title, genre, language..."
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          className="w-full pl-9 pr-10 py-2.5 rounded-full bg-gray-50 text-gray-900 placeholder:text-gray-400 border border-gray-200 shadow-2xs focus:border-gray-950 focus:ring-2 focus:ring-gray-950/10 focus:outline-none text-sm transition"
        />
        {draft && (
          <button
            type="button"
            onClick={() => setDraft("")}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 transition p-1 rounded-full active:scale-95 cursor-pointer"
            aria-label="Clear search"
          >
            <FiX size={16} />
          </button>
        )}
      </div>

      {loading ? (
        <Spinner />
      ) : error ? (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center">
          <p className="text-red-700 font-medium text-sm">{error}</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {movies.length ? (
            movies.map((m) => (
              <MovieCard key={m._id} movie={m} navigate={true} />
            ))
          ) : (
            <div className="col-span-full bg-white border border-gray-200/90 rounded-2xl p-10 sm:p-12 text-center shadow-xs">
              <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 mx-auto mb-3">
                <FiFilm size={22} />
              </div>
              <h3 className="text-base font-semibold text-gray-900 mb-1">
                No movies found
              </h3>
              <p className="text-xs text-gray-500 max-w-sm mx-auto">
                We couldn't find matches for &ldquo;{search}&rdquo;. Try checking the spelling or searching another title.
              </p>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
