import { Link } from "react-router-dom";
import { get } from "../api";
import useFetch from "../hooks/useFetch";
import Spinner from "../components/shared/Spinner";
import { formatCurrency, capitalize } from "../utils/format";
import { useMemo } from "react";
import {
  FiFilm,
  FiMapPin,
  FiClock,
  FiUsers,
  FiDollarSign,
  FiArrowRight,
} from "react-icons/fi";

export default function Dashboard() {
  const { data, loading, error } = useFetch(() => get("/api/booking"), []);
  const { data: moviesRes } = useFetch(() => get("/api/movies"), []);
  const { data: theatersRes } = useFetch(() => get("/api/theaters"), []);
  const bookings = data?.data || [];

  const movieMap = useMemo(() => {
    const m = {};
    (moviesRes?.data || []).forEach((mv) => {
      m[mv._id] = mv.name;
    });
    return m;
  }, [moviesRes]);

  const theaterMap = useMemo(() => {
    const m = {};
    (theatersRes?.data || []).forEach((t) => {
      m[t._id] = t.name;
    });
    return m;
  }, [theatersRes]);

  const statusColor = {
    processing: "bg-yellow-100 text-yellow-700 border border-yellow-200",
    successfull: "bg-green-100 text-green-700 border border-green-200",
    cancelled: "bg-red-100 text-red-700 border border-red-200",
    expired: "bg-gray-100 text-gray-700 border border-gray-200",
  };

  return (
    <div className="min-h-screen bg-white px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="mb-10">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-1">
              My Bookings
            </h1>
            <p className="text-gray-600 text-sm">
              Manage and track your cinema bookings
            </p>
          </div>
        </div>

        {loading ? (
          <Spinner />
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-xl p-8 text-center">
            <p className="text-red-700 font-medium">{error}</p>
          </div>
        ) : bookings.length === 0 ? (
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-12 text-center">
            <FiFilm className="text-gray-300 mx-auto mb-4" size={48} />
            <p className="text-gray-600 text-lg mb-4">
              No bookings yet. Start booking your favorite movies!
            </p>
            <Link
              to="/movies"
              className="inline-block bg-gray-900 text-white px-6 py-2 rounded-lg font-medium hover:bg-gray-800 transition-colors"
            >
              Browse Movies
            </Link>
          </div>
        ) : (
          <div className="grid gap-4">
            {bookings.map((b) => {
              const movieName =
                typeof b.movieId === "object"
                  ? b.movieId?.name
                  : movieMap[b.movieId] || "Movie";
              const theaterName =
                typeof b.theaterId === "object"
                  ? b.theaterId?.name
                  : theaterMap[b.theaterId] || "Theater";
              return (
                <Link
                  key={b._id}
                  to={`/booking/${b._id}`}
                  className="block bg-white border border-gray-200 rounded-xl p-5 hover:shadow-lg hover:border-gray-300 transition-all group"
                >
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <FiFilm
                            className="text-gray-400 shrink-0"
                            size={20}
                          />
                          <h3 className="text-gray-900 font-bold text-lg leading-tight">
                            {movieName}
                          </h3>
                        </div>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ml-2 ${statusColor[b.status] || ""}`}
                        >
                          {capitalize(b.status)}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
                        <div className="flex items-center gap-2 text-sm">
                          <FiMapPin
                            className="text-gray-400 shrink-0"
                            size={16}
                          />
                          <div>
                            <p className="text-gray-500 text-xs">Theater</p>
                            <p className="text-gray-900 font-medium truncate">
                              {theaterName}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 text-sm">
                          <FiClock
                            className="text-gray-400 shrink-0"
                            size={16}
                          />
                          <div>
                            <p className="text-gray-500 text-xs">Timing</p>
                            <p className="text-gray-900 font-medium">
                              {b.timing}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 text-sm">
                          <FiUsers
                            className="text-gray-400 shrink-0"
                            size={16}
                          />
                          <div>
                            <p className="text-gray-500 text-xs">Seats</p>
                            <p className="text-gray-900 font-medium">
                              {b.noOfSeats} {b.seat ? `(${b.seat})` : ""}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 text-sm">
                          <FiDollarSign
                            className="text-gray-400 shrink-0"
                            size={16}
                          />
                          <div>
                            <p className="text-gray-500 text-xs">Total Cost</p>
                            <p className="text-gray-900 font-bold">
                              {formatCurrency(b.totalCost)}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="hidden md:flex items-center justify-center text-gray-400 group-hover:text-gray-600 transition-colors">
                      <FiArrowRight size={20} />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
