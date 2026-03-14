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
    <section className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Movies</h1>

      <div className="w-full max-w-xl mb-3 relative">
        <FiSearch
          size={18}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
        />
        <input
          placeholder="Search movies..."
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          className="w-full pl-11 pr-10 py-3 rounded-xl bg-white text-gray-900 border border-gray-200 shadow-sm focus:border-purple-500 focus:ring-2 focus:ring-purple-100 focus:outline-none text-sm"
        />
        {draft && (
          <button
            type="button"
            onClick={() => setDraft("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 transition"
            aria-label="Clear search"
          >
            <FiX size={18} />
          </button>
        )}
      </div>

      <p className="text-sm text-gray-500 mb-6">
        {search
          ? `Showing results for "${search}"`
          : "Browse all currently available movies"}
      </p>

      {loading ? (
        <Spinner />
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {movies.length ? (
            movies.map((m) => (
              <MovieCard key={m._id} movie={m} navigate={true} />
            ))
          ) : (
            <p className="text-gray-500 col-span-full text-center py-12">
              No movies found
            </p>
          )}
        </div>
      )}
    </section>
  );
}
