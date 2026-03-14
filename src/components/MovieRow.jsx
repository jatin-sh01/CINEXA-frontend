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
            className="absolute -left-md top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-neutral-0 shadow-card flex items-center justify-center text-neutral-700 opacity-0 group-hover/row:opacity-100 transition hover:bg-neutral-100 focus-ring"
          >
            <FiChevronLeft size={18} />
          </button>
          <button
            onClick={() => scroll("right")}
            aria-label={`Scroll ${title} right`}
            className="absolute -right-md top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-neutral-0 shadow-card flex items-center justify-center text-neutral-700 opacity-0 group-hover/row:opacity-100 transition hover:bg-neutral-100 focus-ring"
          >
            <FiChevronRight size={18} />
          </button>

          <div
            ref={scrollRef}
            className="flex gap-md lg:gap-lg overflow-x-auto scrollbar-hide scroll-smooth pb-sm"
          >
            {movies.map((movie) => (
              <div key={movie.id} className="shrink-0 w-37.5 sm:w-42.5">
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
