import { useEffect, useMemo, useState } from "react";
import { get } from "../../api";
import useFetch from "../../hooks/useFetch";
import Spinner from "../shared/Spinner";
import { formatCurrency, formatTime } from "../../utils/format";
import { Link } from "react-router-dom";
import {
  FiMapPin,
  FiClock,
  FiTag,
  FiChevronRight,
  FiFilm,
  FiCalendar,
} from "react-icons/fi";

const toTimingDate = (value, fallbackDateValue) => {
  const direct = new Date(value);
  if (!Number.isNaN(direct.getTime())) return direct;

  const raw = String(value || "").trim();
  if (!raw) return null;

  const fallbackBase = fallbackDateValue ? new Date(fallbackDateValue) : new Date();
  const base = Number.isNaN(fallbackBase.getTime()) ? new Date() : fallbackBase;

  const twelveHourMatch = raw.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (twelveHourMatch) {
    let hours = Number(twelveHourMatch[1]);
    const minutes = Number(twelveHourMatch[2]);
    const period = twelveHourMatch[3].toUpperCase();

    if (period === "PM" && hours < 12) hours += 12;
    if (period === "AM" && hours === 12) hours = 0;

    const normalized = new Date(base);
    normalized.setHours(hours, minutes, 0, 0);
    return normalized;
  }

  const twentyFourHourMatch = raw.match(/^(\d{1,2}):(\d{2})$/);
  if (twentyFourHourMatch) {
    const hours = Number(twentyFourHourMatch[1]);
    const minutes = Number(twentyFourHourMatch[2]);
    if (hours >= 0 && hours < 24 && minutes >= 0 && minutes < 60) {
      const normalized = new Date(base);
      normalized.setHours(hours, minutes, 0, 0);
      return normalized;
    }
  }

  return null;
};

const getDateKey = (date) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
};

const dateLabel = (dateKey) => {
  const parsed = new Date(`${dateKey}T00:00:00`);
  return {
    day: parsed.toLocaleDateString("en-IN", { weekday: "short" }),
    date: parsed.toLocaleDateString("en-IN", { day: "2-digit" }),
    month: parsed.toLocaleDateString("en-IN", { month: "short" }),
  };
};

export default function ShowList({ theaterId, movieId }) {
  const params = {};
  if (theaterId) params.theaterId = theaterId;
  if (movieId) params.movieId = movieId;

  const { data, loading, error } = useFetch(() => get("/api/show", params), [theaterId, movieId]);
  const shows = useMemo(() => {
    return Array.isArray(data?.data) ? data.data : [];
  }, [data]);
  const [selectedDate, setSelectedDate] = useState("");

  const parsedShows = useMemo(() => {
    return [...shows]
      .map((show) => ({
        ...show,
        _timingDate: toTimingDate(show.timing, show.createdAt),
      }))
      .sort((a, b) => {
        const at = a._timingDate?.getTime() || Number.MAX_SAFE_INTEGER;
        const bt = b._timingDate?.getTime() || Number.MAX_SAFE_INTEGER;
        return at - bt;
      });
  }, [shows]);

  const dateOptions = useMemo(() => {
    const keys = parsedShows
      .filter((show) => show._timingDate)
      .map((show) => getDateKey(show._timingDate));

    return [...new Set(keys)];
  }, [parsedShows]);

  useEffect(() => {
    if (!movieId) return;
    if (!dateOptions.length) {
      setSelectedDate("");
      return;
    }

    if (!selectedDate || !dateOptions.includes(selectedDate)) {
      setSelectedDate(dateOptions[0]);
    }
  }, [movieId, dateOptions, selectedDate]);

  const showsForSelectedDate = useMemo(() => {
    if (!movieId) return parsedShows;
    if (!selectedDate) return parsedShows;
    return parsedShows.filter((show) => {
      if (!show._timingDate) return false;
      return getDateKey(show._timingDate) === selectedDate;
    });
  }, [movieId, parsedShows, selectedDate]);

  const groupedByTheaterForMovie = useMemo(() => {
    if (!movieId) return [];

    const grouped = {};
    showsForSelectedDate.forEach((show) => {
      const theater = show.theaterId || {};
      const theaterIdKey = theater._id || theater.id || "unknown";
      if (!grouped[theaterIdKey]) {
        grouped[theaterIdKey] = {
          theaterId: theaterIdKey,
          theaterName: theater.name || "Unknown Theater",
          theaterCity: theater.city || "",
          shows: [],
        };
      }
      grouped[theaterIdKey].shows.push(show);
    });

    return Object.values(grouped);
  }, [movieId, showsForSelectedDate]);

  const groupedByMovieForTheater = useMemo(() => {
    if (!theaterId) return [];

    const grouped = {};
    parsedShows.forEach((show) => {
      const movie = show.movieId || {};
      const movieIdKey = movie._id || movie.id || "unknown";
      if (!grouped[movieIdKey]) {
        grouped[movieIdKey] = {
          movieId: movieIdKey,
          movieName: movie.name || "Unknown Movie",
          shows: [],
        };
      }
      grouped[movieIdKey].shows.push(show);
    });

    return Object.values(grouped);
  }, [theaterId, parsedShows]);

  if (loading) return <Spinner />;
  if (error) return <p className="text-red-600 font-semibold text-center py-8 bg-red-50 rounded-lg p-4">{error}</p>;
  if (!shows.length) return <p className="text-gray-600 text-center py-12 text-lg">No shows available</p>;

  if (movieId) {
    const undatedCount = parsedShows.filter((show) => !show._timingDate).length;

    return (
      <div className="space-y-6">
        <div className="rounded-xl border border-blue-100 bg-linear-to-r from-blue-50 to-slate-50 p-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-blue-700 mb-3">
            <FiCalendar size={16} />
            Choose Date
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {dateOptions.map((dateKey) => {
              const label = dateLabel(dateKey);
              const active = selectedDate === dateKey;
              return (
                <button
                  key={dateKey}
                  type="button"
                  onClick={() => setSelectedDate(dateKey)}
                  className={`min-w-22 rounded-xl border px-3 py-2 text-left transition ${
                    active
                      ? "border-purple-500 bg-purple-600 text-white shadow-sm"
                      : "border-gray-200 bg-white text-gray-700 hover:border-purple-300 hover:bg-purple-50"
                  }`}
                >
                  <p className="text-xs font-semibold uppercase tracking-wide">{label.day}</p>
                  <p className="text-lg font-bold leading-tight">{label.date}</p>
                  <p className="text-xs font-medium">{label.month}</p>
                </button>
              );
            })}
          </div>
          {undatedCount > 0 && (
            <p className="mt-3 text-xs text-amber-700">
              {undatedCount} show(s) have invalid timing format and are hidden from date-wise view.
            </p>
          )}
        </div>

        <div className="space-y-4">
          {groupedByTheaterForMovie.map((group) => (
            <div key={group.theaterId} className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
              <div className="flex items-center justify-between gap-3 mb-4">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">{group.theaterName}</h3>
                  <p className="text-sm text-gray-600">{group.theaterCity || "City unavailable"}</p>
                </div>
                <span className="rounded-full bg-purple-50 px-3 py-1 text-xs font-semibold text-purple-700 border border-purple-100">
                  {group.shows.length} slot{group.shows.length !== 1 ? "s" : ""}
                </span>
              </div>

              <div className="flex flex-wrap gap-2">
                {group.shows.map((show) => (
                  <Link
                    key={show._id}
                    to={`/shows/${show._id}`}
                    className="group min-w-30 rounded-lg border border-gray-300 bg-white px-3 py-2 hover:border-purple-400 hover:bg-purple-50 transition"
                  >
                    <p className="text-sm font-bold text-gray-900">{show._timingDate ? formatTime(show.timing) : show.timing}</p>
                    <p className="text-xs text-gray-600">{show.format || "Standard"}</p>
                    <p className="text-xs font-semibold text-purple-700 mt-1">{formatCurrency(show.price)}</p>
                  </Link>
                ))}
              </div>
            </div>
          ))}

          {!groupedByTheaterForMovie.length && (
            <p className="text-gray-600 text-center py-8">No shows available for this date.</p>
          )}
        </div>
      </div>
    );
  }

  if (theaterId) {
    return (
      <div className="space-y-8">
        {groupedByMovieForTheater.map((group) => (
          <div key={group.movieId} className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <h3 className="text-xl font-bold text-gray-900 mb-4 inline-flex items-center gap-2">
              <FiFilm className="text-purple-600" />
              {group.movieName}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {group.shows.map((show) => (
                <Link
                  key={show._id}
                  to={`/shows/${show._id}`}
                  className="group rounded-lg border border-gray-200 p-3 hover:border-purple-400 hover:bg-purple-50 transition"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="inline-flex items-center gap-2 text-gray-800 font-semibold">
                      <FiClock className="text-purple-600" />
                      {show._timingDate ? formatTime(show.timing) : show.timing}
                    </div>
                    <span className="text-sm font-bold text-purple-700">{formatCurrency(show.price)}</span>
                  </div>
                  <div className="mt-2 text-xs text-gray-600 inline-flex items-center gap-2">
                    <FiTag className="text-orange-600" />
                    {show.format || "Standard"} • {show.noOfSeats} seats
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {parsedShows.map((show) => (
        <Link
          key={show._id}
          to={`/shows/${show._id}`}
          className="group block bg-white rounded-xl border border-gray-200 overflow-hidden hover:border-purple-400 hover:shadow-lg transition-all duration-300"
        >
          <div className="bg-linear-to-r from-purple-500 to-blue-500 h-1.5" />

          <div className="p-4">
            <div className="text-sm font-bold text-blue-600 mb-2 flex items-center gap-1">
              <FiFilm size={16} />
              {show.movieId?.name || "Unknown"}
            </div>

            <div className="flex items-center gap-2 mb-3">
              <FiClock className="text-purple-600 shrink-0" size={18} />
              <div className="text-lg font-bold text-gray-900">
                {show._timingDate ? formatTime(show.timing) : show.timing}
              </div>
            </div>

            <div className="flex items-start justify-between gap-3 mb-3 pb-3 border-b border-gray-100">
              <div>
                <div className="text-xs text-gray-500 font-semibold mb-1">Format</div>
                <div className="inline-block bg-orange-100 text-orange-700 px-2.5 py-1 rounded-lg text-sm font-bold">
                  {show.format || "Standard"}
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs text-gray-500 font-semibold mb-1">Price</div>
                <div className="text-xl font-bold text-purple-600">{formatCurrency(show.price)}</div>
              </div>
            </div>

            <div className="flex items-center gap-2 mb-4">
              <FiTag className="text-orange-600" size={16} />
              <span className="text-sm text-gray-700">
                <span className="font-bold">{show.noOfSeats}</span> seats available
              </span>
            </div>

            <button className="w-full bg-linear-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white py-2.5 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-all duration-300 group-hover:shadow-lg">
              Book Tickets
              <FiChevronRight size={16} />
            </button>
          </div>
        </Link>
      ))}
    </div>
  );
}