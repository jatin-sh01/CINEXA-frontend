import { Link } from "react-router-dom";
import { formatCurrency, formatTime } from "../../utils/format";

export default function ShowCard({ show }) {
  const movieName = show.movieId?.name || "Unknown Movie";
  const theaterName = show.theaterId?.name || "Unknown Theater";

  return (
    <Link to={`/shows/${show._id}`} className="block bg-gray-900 rounded-xl p-4 hover:ring-2 hover:ring-purple-500 transition-all">
      <h3 className="text-white font-semibold">{movieName}</h3>
      <p className="text-gray-400 text-sm mt-1">{theaterName}</p>
      <div className="flex flex-wrap gap-3 mt-3 text-xs text-gray-400">
        <span>Timing: {formatTime(show.timing)}</span>
        <span>Seats: {show.noOfSeats}</span>
        <span>{formatCurrency(show.price)}</span>
        {show.format && <span>{show.format}</span>}
      </div>
    </Link>
  );
}