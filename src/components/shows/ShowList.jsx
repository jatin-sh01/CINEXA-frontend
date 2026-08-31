import { useEffect, useMemo, useState } from "react";
import { get } from "../../api";
import useFetch from "../../hooks/useFetch";
import Spinner from "../shared/Spinner";
import { formatCurrency, formatTime } from "../../utils/format";
import { Link } from "react-router-dom";
import {
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

  const fallbackBase = fallbackDateValue
    ? new Date(fallbackDateValue)
    : new Date();
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

  const { data, loading, error } = useFetch(
    () => get("/api/show", params),
    [theaterId, movieId],
  );
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
  if (error)
    return (
      <p className="text-red-600 font-semibold text-center py-8 bg-red-50 rounded-lg p-4">
        {error}
      </p>
    );
  if (!shows.length)
    return (
      <p className="text-gray-600 text-center py-12 text-lg">
        No shows available
      </p>
    );

  if (movieId) {
    const undatedCount = parsedShows.filter((show) => !show._timingDate).length;

    return (
      <div className="space-y-6">
        <div className="rounded-2xl border border-gray-200/90 bg-gray-50/70 p-4">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-gray-500 mb-3">
            <FiCalendar size={14} className="text-gray-700" />
            Choose Date
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {dateOptions.map((dateKey) => {
              const label = dateLabel(dateKey);
              const active = selectedDate === dateKey;
              return (
                <button
                  key={dateKey}
                  type="button"
                  onClick={() => setSelectedDate(dateKey)}
                  className={`min-w-20 sm:min-w-22 rounded-xl border px-3 py-2 text-left transition duration-150 active:scale-[0.98] cursor-pointer ${
                    active
                      ? "border-gray-950 bg-gray-950 text-white shadow-sm"
                      : "border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  <p className={`text-[11px] font-semibold uppercase tracking-wider ${active ? "text-gray-300" : "text-gray-500"}`}>
                    {label.day}
                  </p>
                  <p className="text-lg font-bold leading-tight">
                    {label.date}
                  </p>
                  <p className={`text-xs ${active ? "text-gray-300" : "text-gray-500"}`}>{label.month}</p>
                </button>
              );
            })}
          </div>
          {undatedCount > 0 && (
            <p className="mt-3 text-xs text-amber-700">
              {undatedCount} show(s) have invalid timing format and are hidden
              from date-wise view.
            </p>
          )}
        </div>

        <div className="space-y-4">
          {groupedByTheaterForMovie.map((group) => (
            <div
              key={group.theaterId}
              className="rounded-2xl border border-gray-200/90 bg-white p-5 shadow-xs"
            >
              <div className="flex items-center justify-between gap-3 mb-4">
                <div>
                  <h3 className="text-base font-bold text-gray-900">
                    {group.theaterName}
                  </h3>
                  <p className="text-xs text-gray-500">
                    {group.theaterCity || "City unavailable"}
                  </p>
                </div>
                <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-700 border border-gray-200">
                  {group.shows.length} slot{group.shows.length !== 1 ? "s" : ""}
                </span>
              </div>

              <div className="flex flex-wrap gap-2.5">
                {group.shows.map((show) => (
                  <Link
                    key={show._id}
                    to={`/shows/${show._id}`}
                    className="group min-w-28 rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 hover:border-gray-950 hover:bg-gray-50 transition active:scale-[0.98] shadow-2xs"
                  >
                    <p className="text-sm font-bold text-gray-900">
                      {show._timingDate ? formatTime(show.timing) : show.timing}
                    </p>
                    <p className="text-xs text-gray-500">
                      {show.format || "Standard"}
                    </p>
                    <p className="text-xs font-semibold text-gray-900 mt-1">
                      {formatCurrency(show.price)}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          ))}

          {!groupedByTheaterForMovie.length && (
            <p className="text-gray-500 text-center py-8 text-sm">
              No shows available for this date.
            </p>
          )}
        </div>
      </div>
    );
  }

  if (theaterId) {
    return (
      <div className="space-y-6">
        {groupedByMovieForTheater.map((group) => (
          <div
            key={group.movieId}
            className="rounded-2xl border border-gray-200/90 bg-white p-5 sm:p-6 shadow-xs"
          >
            <h3 className="text-base font-bold text-gray-900 mb-4 inline-flex items-center gap-2">
              <FiFilm className="text-gray-700" size={18} />
              {group.movieName}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {group.shows.map((show) => (
                <Link
                  key={show._id}
                  to={`/shows/${show._id}`}
                  className="group rounded-xl border border-gray-200 bg-white p-3.5 hover:border-gray-950 hover:bg-gray-50 transition active:scale-[0.98] shadow-2xs"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="inline-flex items-center gap-2 text-gray-900 font-semibold text-sm">
                      <FiClock className="text-gray-500" size={16} />
                      {show._timingDate ? formatTime(show.timing) : show.timing}
                    </div>
                    <span className="text-xs font-bold text-gray-900">
                      {formatCurrency(show.price)}
                    </span>
                  </div>
                  <div className="mt-2 text-xs text-gray-500 inline-flex items-center gap-1.5">
                    <FiTag className="text-gray-400" size={14} />
                    <span>{show.format || "Standard"}</span>
                    <span>•</span>
                    <span>{show.noOfSeats} seats</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ))}

        {!groupedByMovieForTheater.length && (
          <p className="text-gray-500 text-center py-8 text-sm">
            No shows scheduled for this theater.
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {parsedShows.map((show) => (
        <Link
          key={show._id}
          to={`/shows/${show._id}`}
          className="group block bg-white rounded-2xl border border-gray-200/90 p-5 hover:border-gray-950 hover:shadow-xs transition duration-150"
        >
          <div className="flex items-center justify-between gap-2 mb-3">
            <div className="text-sm font-bold text-gray-900 flex items-center gap-1.5">
              <FiFilm size={15} className="text-gray-700" />
              <span>{show.movieId?.name || "Unknown Movie"}</span>
            </div>
            <span className="text-xs font-semibold text-gray-900">
              {formatCurrency(show.price)}
            </span>
          </div>

          <div className="flex items-center gap-2 mb-2 text-gray-700 text-sm">
            <FiClock size={16} className="text-gray-500 shrink-0" />
            <span className="font-semibold text-gray-900">
              {show._timingDate ? formatTime(show.timing) : show.timing}
            </span>
            <span className="text-xs text-gray-400">•</span>
            <span className="text-xs text-gray-500">{show.format || "Standard"}</span>
          </div>

          <div className="flex items-center gap-2 text-xs text-gray-500 mb-4">
            <FiTag size={14} className="text-gray-400" />
            <span>{show.noOfSeats} seats available</span>
          </div>

          <div className="w-full bg-gray-950 hover:bg-gray-800 text-white py-2.5 rounded-xl text-xs font-medium flex items-center justify-center gap-1.5 transition duration-150 active:scale-[0.98] shadow-2xs">
            Book Tickets
            <FiChevronRight size={15} />
          </div>
        </Link>
      ))}
    </div>
  );
}
