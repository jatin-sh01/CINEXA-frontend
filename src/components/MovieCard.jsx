import { memo, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";
import { formatDate } from "../utils/format";
import { badgeSuccess, badgeWarning, badgeError } from "../lib/uiPatterns";

const MovieCard = memo(function MovieCard({
  movie,
  size = "md",
  navigate: useNavigateProp = false,
  onClick,
  useLink = false,
}) {
  const navigate = useNavigate();

  const id = movie._id || movie.id;
  const title = movie.name || movie.title;
  const posterUrl = movie.poster || movie.posterUrl;
  const language = movie.language || "";
  const releaseDate = movie.releaseDate || "";
  const releaseStatus = movie.releaseStatus || "";
  const certificate = movie.certificate || "";
  const badges = movie.badges || [];

  const handleClick = useCallback(() => {
    if (onClick) return onClick(id);
    if (useNavigateProp && id) navigate(`/movies/${id}`);
  }, [id, onClick, navigate, useNavigateProp]);

  const handleKeyDown = useCallback(
    (e) => {
      if ((e.key === "Enter" || e.key === " ") && !useLink) {
        e.preventDefault();
        handleClick();
      }
    },
    [handleClick, useLink],
  );

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "RELEASED":
        return badgeSuccess;
      case "COMING_SOON":
        return badgeWarning;
      case "BLOCKED":
      default:
        return badgeError;
    }
  };

  const getTitleClass = () => {
    switch (size) {
      case "sm":
        return "text-xs font-semibold truncate";
      case "lg":
        return "text-base font-bold truncate";
      default:
        return "text-sm font-semibold truncate";
    }
  };

  const PosterSection = () => (
    <div className="aspect-2/3 rounded-2xl overflow-hidden bg-gray-100 shadow-xs group-hover:shadow-md transition-shadow duration-200">
      {posterUrl ? (
        <img
          src={posterUrl}
          alt={`${title} poster`}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-[1.025] transition-transform duration-200 ease-out"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
          No Poster
        </div>
      )}
    </div>
  );

  const InfoSection = () => (
    <div className="mt-2.5 px-0.5">
      <h3 className={getTitleClass()}>{title}</h3>

      <p className="text-xs text-gray-500 mt-1 truncate">
        {certificate && <span>{certificate}</span>}
        {certificate && language && <span className="mx-1">•</span>}
        {language && <span>{language}</span>}
        {!certificate && !language && releaseDate && formatDate(releaseDate)}
      </p>

      {badges && badges.length > 0 ? (
        <div className="flex gap-1 mt-2 flex-wrap">
          {badges.map((badge) => (
            <span
              key={badge}
              className={`${badgeSuccess} text-[10px] px-2 py-0.5`}
            >
              {badge}
            </span>
          ))}
        </div>
      ) : releaseStatus ? (
        <span
          className={`${getStatusBadgeClass(releaseStatus)} text-[10px] px-2 py-0.5 mt-2 inline-block`}
        >
          {releaseStatus.replace("_", " ")}
        </span>
      ) : null}
    </div>
  );

  if (useLink && id) {
    return (
      <Link
        to={`/movies/${id}`}
        className="group block rounded-2xl active:scale-[0.98] transition-transform duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-950 focus-visible:ring-offset-2"
      >
        <PosterSection />
        <InfoSection />
      </Link>
    );
  }

  return (
    <div
      className="group block cursor-pointer rounded-2xl active:scale-[0.98] transition-transform duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-950 focus-visible:ring-offset-2"
      role="button"
      tabIndex={0}
      aria-label={`View ${title}`}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
    >
      <PosterSection />
      <InfoSection />
    </div>
  );
});

export default MovieCard;
