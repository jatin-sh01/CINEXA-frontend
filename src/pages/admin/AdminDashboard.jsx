import { useEffect, useMemo, useState } from "react";
import { NavLink } from "react-router-dom";
import {
  FiActivity,
  FiBarChart2,
  FiCalendar,
  FiDollarSign,
  FiFilm,
  FiMapPin,
  FiTrendingUp,
  FiUsers,
} from "react-icons/fi";
import adminApi from "../../services/adminApi";
import StatCard from "../../components/admin/StatCard";

function getCollection(data) {
  if (Array.isArray(data)) return data;
  return data?.data || [];
}

function toDate(value) {
  if (!value) return null;
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? null : d;
}

function bookingAmount(booking) {
  return Number(
    booking?.price ||
      booking?.totalAmount ||
      booking?.amount ||
      booking?.payment?.amount ||
      0,
  );
}

function bookingDate(booking) {
  return (
    toDate(booking?.createdAt) ||
    toDate(booking?.bookedAt) ||
    toDate(booking?.updatedAt) ||
    toDate(booking?.showDate) ||
    null
  );
}

function bookingMovie(booking) {
  return (
    booking?.movie?.title ||
    booking?.movieTitle ||
    booking?.show?.movie?.title ||
    booking?.show?.movieTitle ||
    booking?.movieName ||
    null
  );
}

function bookingTheater(booking) {
  const theater =
    booking?.theater ||
    booking?.show?.theater ||
    booking?.show?.theatre ||
    null;
  return {
    name:
      theater?.name ||
      booking?.theaterName ||
      booking?.show?.theaterName ||
      booking?.show?.theatreName ||
      null,
    capacity: Number(
      theater?.capacity || theater?.seats || theater?.totalSeats || 0,
    ),
  };
}

function formatDayKey(date) {
  return date.toISOString().slice(0, 10);
}

function buildLast7DaysSeries(bookings, mode) {
  const today = new Date();
  const dayBuckets = [];

  for (let i = 6; i >= 0; i -= 1) {
    const day = new Date(today);
    day.setHours(0, 0, 0, 0);
    day.setDate(today.getDate() - i);
    dayBuckets.push({
      key: formatDayKey(day),
      label: day.toLocaleDateString("en-US", { weekday: "short" }),
      value: 0,
    });
  }

  const bucketMap = Object.fromEntries(dayBuckets.map((b) => [b.key, b]));

  bookings.forEach((booking) => {
    const date = bookingDate(booking);
    if (!date) return;

    const key = formatDayKey(
      new Date(date.getFullYear(), date.getMonth(), date.getDate()),
    );
    const bucket = bucketMap[key];
    if (!bucket) return;

    if (mode === "revenue") {
      bucket.value += bookingAmount(booking);
      return;
    }

    bucket.value += 1;
  });

  return dayBuckets;
}

function periodDeltaLabel(items, days, datePicker, suffix) {
  const now = new Date();
  const periodStart = new Date(now);
  periodStart.setDate(now.getDate() - days);
  const previousStart = new Date(periodStart);
  previousStart.setDate(periodStart.getDate() - days);

  const current = items.filter((item) => {
    const date = datePicker(item);
    return date && date >= periodStart;
  }).length;

  const previous = items.filter((item) => {
    const date = datePicker(item);
    return date && date >= previousStart && date < periodStart;
  }).length;

  const diff = current - previous;
  const sign = diff > 0 ? "+" : "";
  return `${sign}${diff} ${suffix}`;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    movies: 0,
    theaters: 0,
    shows: 0,
    users: 0,
    bookings: 0,
    revenue: 0,
  });
  const [moviesList, setMoviesList] = useState([]);
  const [theatersList, setTheatersList] = useState([]);
  const [showsList, setShowsList] = useState([]);
  const [usersList, setUsersList] = useState([]);
  const [bookingsList, setBookingsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);

        const results = await Promise.allSettled([
          adminApi.getMovies(),
          adminApi.getTheaters(),
          adminApi.getShows(),
          adminApi.getUsers(),
          adminApi.getBookings(),
        ]);

        const movies =
          results[0].status === "fulfilled"
            ? getCollection(results[0].value)
            : [];
        const theaters =
          results[1].status === "fulfilled"
            ? getCollection(results[1].value)
            : [];
        const shows =
          results[2].status === "fulfilled"
            ? getCollection(results[2].value)
            : [];
        const users =
          results[3].status === "fulfilled"
            ? getCollection(results[3].value)
            : [];
        const bookings =
          results[4].status === "fulfilled"
            ? getCollection(results[4].value)
            : [];

        const revenue = bookings.reduce(
          (total, booking) => total + bookingAmount(booking),
          0,
        );

        setMoviesList(movies);
        setTheatersList(theaters);
        setShowsList(shows);
        setUsersList(users);
        setBookingsList(bookings);

        setStats({
          movies: movies.length,
          theaters: theaters.length,
          shows: shows.length,
          users: users.length,
          bookings: bookings.length,
          revenue,
        });
      } catch (err) {
        setError(err?.message || "Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const bookingsSeries = useMemo(
    () => buildLast7DaysSeries(bookingsList, "count"),
    [bookingsList],
  );

  const revenueSeries = useMemo(
    () => buildLast7DaysSeries(bookingsList, "revenue"),
    [bookingsList],
  );

  const topMovies = useMemo(() => {
    const map = new Map();

    bookingsList.forEach((booking) => {
      const title = bookingMovie(booking);
      if (!title) return;

      const item = map.get(title) || { title, bookings: 0, revenue: 0 };
      item.bookings += 1;
      item.revenue += bookingAmount(booking);
      map.set(title, item);
    });

    return Array.from(map.values())
      .sort((a, b) => b.bookings - a.bookings)
      .slice(0, 5);
  }, [bookingsList]);

  const theaterOccupancy = useMemo(() => {
    const byTheater = new Map();

    bookingsList.forEach((booking) => {
      const theater = bookingTheater(booking);
      if (!theater.name) return;

      const existing = byTheater.get(theater.name) || {
        name: theater.name,
        bookings: 0,
        capacity: theater.capacity || 0,
      };

      existing.bookings += 1;
      existing.capacity = existing.capacity || theater.capacity || 0;
      byTheater.set(theater.name, existing);
    });

    const maxBookings = Math.max(
      ...Array.from(byTheater.values()).map((v) => v.bookings),
      1,
    );

    return Array.from(byTheater.values())
      .map((item) => {
        const percent = item.capacity
          ? Math.min(100, Math.round((item.bookings / item.capacity) * 100))
          : Math.round((item.bookings / maxBookings) * 100);

        return {
          name: item.name,
          value: percent,
          bookings: item.bookings,
        };
      })
      .sort((a, b) => b.value - a.value)
      .slice(0, 5);
  }, [bookingsList]);

  const bookingPath = useMemo(() => {
    const max = Math.max(...bookingsSeries.map((d) => d.value), 1);
    return bookingsSeries
      .map((point, idx) => {
        const x = idx * 48;
        const y = 120 - Math.round((point.value / max) * 90);
        return `${x},${y}`;
      })
      .join(" ");
  }, [bookingsSeries]);

  const revenueMax = Math.max(...revenueSeries.map((d) => d.value), 1);

  const statCards = [
    {
      icon: FiFilm,
      label: "Total Movies",
      value: stats.movies,
      color: "bg-purple-600",
      trend: periodDeltaLabel(
        moviesList,
        30,
        (m) => toDate(m?.createdAt),
        "this month",
      ),
    },
    {
      icon: FiMapPin,
      label: "Theaters",
      value: stats.theaters,
      color: "bg-blue-600",
      trend: periodDeltaLabel(
        theatersList,
        30,
        (t) => toDate(t?.createdAt),
        "this month",
      ),
    },
    {
      icon: FiCalendar,
      label: "Shows",
      value: stats.shows,
      color: "bg-green-600",
      trend: periodDeltaLabel(
        showsList,
        30,
        (s) => toDate(s?.createdAt || s?.date),
        "this month",
      ),
    },
    {
      icon: FiUsers,
      label: "Users",
      value: stats.users,
      color: "bg-orange-600",
      trend: periodDeltaLabel(
        usersList,
        30,
        (u) => toDate(u?.createdAt),
        "this month",
      ),
    },
    {
      icon: FiActivity,
      label: "Total Bookings",
      value: stats.bookings,
      color: "bg-blue-600",
      trend: periodDeltaLabel(bookingsList, 7, bookingDate, "vs last week"),
    },
    {
      icon: FiDollarSign,
      label: "Total Revenue",
      value: `INR ${stats.revenue.toLocaleString()}`,
      color: "bg-green-600",
      trend: `${revenueSeries[revenueSeries.length - 1]?.value?.toLocaleString() || 0} today`,
    },
  ];

  const apiOnline = !error;
  const databaseConnected =
    bookingsList.length > 0 || moviesList.length > 0 || theatersList.length > 0;
  const realtimeActive = loading ? false : true;

  return (
    <div className="space-y-6 md:space-y-8">
      {error && (
        <div className="admin-card rounded-xl border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
          {error}
        </div>
      )}

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {statCards.map((card) => (
          <StatCard
            key={card.label}
            icon={card.icon}
            label={card.label}
            value={card.value}
            color={card.color}
            trend={card.trend}
            loading={loading}
          />
        ))}
      </section>

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="admin-card p-6 xl:col-span-2">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-lg font-semibold admin-heading">
              Quick Actions
            </h2>
            <span className="admin-label">Fast access modules</span>
          </div>

          <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
            <NavLink
              to="/admin/movies"
              className="admin-btn-glow rounded-xl border border-slate-200 bg-white px-4 py-4 text-slate-900"
            >
              <div className="flex items-center gap-3">
                <span className="rounded-lg bg-slate-100 p-2 text-slate-700">
                  <FiFilm size={18} />
                </span>
                <div>
                  <p className="text-sm font-medium text-slate-500">Content</p>
                  <p className="text-base font-semibold">Manage Movies</p>
                </div>
              </div>
            </NavLink>

            <NavLink
              to="/admin/theaters"
              className="admin-btn-glow rounded-xl border border-slate-200 bg-white px-4 py-4 text-slate-900"
            >
              <div className="flex items-center gap-3">
                <span className="rounded-lg bg-slate-100 p-2 text-slate-700">
                  <FiMapPin size={18} />
                </span>
                <div>
                  <p className="text-sm font-medium text-slate-500">
                    Operations
                  </p>
                  <p className="text-base font-semibold">Manage Theaters</p>
                </div>
              </div>
            </NavLink>

            <NavLink
              to="/admin/shows"
              className="admin-btn-glow rounded-xl border border-slate-200 bg-white px-4 py-4 text-slate-900"
            >
              <div className="flex items-center gap-3">
                <span className="rounded-lg bg-slate-100 p-2 text-slate-700">
                  <FiCalendar size={18} />
                </span>
                <div>
                  <p className="text-sm font-medium text-slate-500">
                    Scheduling
                  </p>
                  <p className="text-base font-semibold">Manage Shows</p>
                </div>
              </div>
            </NavLink>
          </div>
        </div>

        <div className="admin-card p-6">
          <h2 className="mb-5 text-lg font-semibold admin-heading">
            System Status
          </h2>
          <div className="space-y-3">
            <div className="admin-surface flex items-center justify-between rounded-xl px-3 py-3">
              <span className="admin-label">API Status</span>
              <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700">
                <span
                  className={`h-2 w-2 rounded-full ${apiOnline ? "bg-slate-700" : "bg-slate-400"}`}
                />
                {apiOnline ? "Online" : "Unavailable"}
              </span>
            </div>
            <div className="admin-surface flex items-center justify-between rounded-xl px-3 py-3">
              <span className="admin-label">Database</span>
              <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700">
                <span
                  className={`h-2 w-2 rounded-full ${databaseConnected ? "bg-slate-700" : "bg-slate-400"}`}
                />
                {databaseConnected ? "Connected" : "Syncing"}
              </span>
            </div>
            <div className="admin-surface flex items-center justify-between rounded-xl px-3 py-3">
              <span className="admin-label">Real-time</span>
              <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700">
                <span
                  className={`h-2 w-2 rounded-full ${realtimeActive ? "bg-slate-700" : "bg-slate-400"}`}
                />
                {realtimeActive ? "Active" : "Loading"}
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <div className="admin-card p-6">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold admin-heading">
              Bookings Per Day
            </h3>
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-slate-700">
              <FiTrendingUp size={14} /> Last 7 days
            </span>
          </div>
          <div className="admin-surface admin-chart-grid rounded-xl p-3">
            {bookingsList.length === 0 ? (
              <p className="admin-label py-12 text-center">
                No booking data available
              </p>
            ) : (
              <svg viewBox="0 0 300 120" className="h-36 w-full">
                <polyline
                  fill="none"
                  stroke="#334155"
                  strokeWidth="4"
                  strokeLinecap="round"
                  points={bookingPath}
                />
              </svg>
            )}
          </div>
        </div>

        <div className="admin-card p-6">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold admin-heading">
              Revenue Analytics
            </h3>
            <span className="text-xs font-semibold text-slate-700">
              Last 7 days
            </span>
          </div>
          <div className="grid grid-cols-7 gap-2 rounded-xl admin-surface p-3">
            {revenueSeries.map((item, idx) => (
              <div key={item.key} className="flex flex-col items-center gap-2">
                <div className="relative flex h-24 w-full items-end justify-center rounded-lg bg-slate-100 px-1">
                  <div
                    className="w-full rounded-md bg-slate-700 transition-all duration-300"
                    style={{
                      height: `${Math.max(
                        6,
                        Math.round((item.value / revenueMax) * 84),
                      )}px`,
                    }}
                  />
                </div>
                <span className="text-[11px] admin-muted">
                  {item.label || `D${idx + 1}`}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="admin-card p-6">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold admin-heading">
              Top Performing Movies
            </h3>
            <FiBarChart2 className="text-slate-700" />
          </div>
          <div className="space-y-3">
            {topMovies.length === 0 ? (
              <p className="admin-label">No movie booking data available</p>
            ) : (
              topMovies.map((movie) => {
                const maxBookings = Math.max(
                  ...topMovies.map((m) => m.bookings),
                  1,
                );
                const width = Math.round((movie.bookings / maxBookings) * 100);
                return (
                  <div key={movie.title} className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium admin-heading">
                        {movie.title}
                      </p>
                      <span className="text-xs font-semibold admin-muted">
                        {movie.bookings} bookings
                      </span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                      <div
                        className="h-full rounded-full bg-slate-700 transition-all duration-300"
                        style={{ width: `${width}%` }}
                      />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        <div className="admin-card p-6">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold admin-heading">
              Theater Occupancy
            </h3>
            <span className="text-xs font-semibold text-slate-700">
              Live from bookings
            </span>
          </div>
          <div className="space-y-3">
            {theaterOccupancy.length === 0 ? (
              <p className="admin-label">No theater occupancy data available</p>
            ) : (
              theaterOccupancy.map((item) => (
                <div
                  key={item.name}
                  className="admin-surface rounded-xl px-3 py-3"
                >
                  <div className="mb-2 flex items-center justify-between text-sm">
                    <span className="font-medium admin-heading">
                      {item.name}
                    </span>
                    <span className="font-semibold admin-muted">
                      {item.value}%
                    </span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full bg-slate-700 transition-all duration-300"
                      style={{ width: `${item.value}%` }}
                    />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
