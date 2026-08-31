import { useRef, memo, useCallback } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

import MovieCard from "./MovieCard";

const MovieRow = memo(function MovieRow({
  title,
  movies = [],
  layout = "carousel",
  onCardClick,
  onViewAll,
}) {
  const scrollRef = useRef(null);

  const scroll = useCallback((dir) => {
    if (!scrollRef.current) return;
    const amount = scrollRef.current.offsetWidth * 0.7;
    scrollRef.current.scrollBy({
      left: dir === "left" ? -amount : amount,
      behavior: "smooth",
    });
  }, []);

  if (!movies.length) return null;

  const isGrid = layout === "grid";

  return (
    <section className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 py-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl md:text-2xl font-bold text-gray-900">{title}</h2>
        {onViewAll && (
          <button
            onClick={onViewAll}
            className="text-sm text-purple-600 hover:text-purple-500 font-medium transition"
          >
            View all
          </button>
        )}
      </div>

      {isGrid ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-5 md:gap-6 lg:gap-8 px-2">
          {movies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} onClick={onCardClick} />
          ))}
        </div>
      ) : (
        <div className="relative group/row">
          <button
            onClick={() => scroll("left")}
            aria-label={`Scroll ${title} left`}
            className="absolute -left-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-white shadow-md border border-gray-200 flex items-center justify-center text-gray-700 opacity-0 group-hover/row:opacity-100 transition hover:bg-gray-50 focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900"
          >
            <FiChevronLeft size={18} />
          </button>
          <button
            onClick={() => scroll("right")}
            aria-label={`Scroll ${title} right`}
            className="absolute -right-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-white shadow-md border border-gray-200 flex items-center justify-center text-gray-700 opacity-0 group-hover/row:opacity-100 transition hover:bg-gray-50 focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900"
          >
            <FiChevronRight size={18} />
          </button>

          <div
            ref={scrollRef}
            className="flex gap-4 lg:gap-6 overflow-x-auto scrollbar-hide scroll-smooth pb-2"
          >
            {movies.map((movie) => (
              <div key={movie.id} className="shrink-0 w-36 sm:w-44">
                <MovieCard movie={movie} onClick={onCardClick} />
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
});

export default MovieRow;
