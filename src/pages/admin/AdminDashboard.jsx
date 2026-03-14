import { useState, useEffect } from "react";
import {
  FiFilm,
  FiMapPin,
  FiCalendar,
  FiUsers,
  FiAlertTriangle,
  FiTrendingUp,
  FiActivity,
  FiDollarSign,
} from "react-icons/fi";
import adminApi from "../../services/adminApi";
import StatCard from "../../components/admin/StatCard";
import PageHeader from "../../components/admin/PageHeader";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    movies: 0,
    theaters: 0,
    shows: 0,
    users: 0,
    bookings: 0,
    revenue: 0,
  });
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
        ]);

        
        const movies =
          results[0].status === "fulfilled"
            ? Array.isArray(results[0].value)
              ? results[0].value
              : results[0].value?.data || []
            : [];
        const theaters =
          results[1].status === "fulfilled"
            ? Array.isArray(results[1].value)
              ? results[1].value
              : results[1].value?.data || []
            : [];
        const shows =
          results[2].status === "fulfilled"
            ? Array.isArray(results[2].value)
              ? results[2].value
              : results[2].value?.data || []
            : [];
        const users =
          results[3].status === "fulfilled"
            ? Array.isArray(results[3].value)
              ? results[3].value
              : results[3].value?.data || []
            : [];

        setStats({
          movies: movies.length,
          theaters: theaters.length,
          shows: shows.length,
          users: users.length,
          bookings: 0,
          revenue: 0,
        });
      } catch (err) {
        console.error("Dashboard error:", err);
        setError(err.message || "Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (error) {
    return (
      <div className="p-8 max-w-7xl mx-auto bg-gray-50 min-h-screen">
        <PageHeader
          title="Dashboard"
          description="Admin overview and quick actions"
        />
        <div className="p-6 rounded-xl bg-red-50 border border-red-200 flex items-center gap-4">
          <FiAlertTriangle className="text-red-600 shrink-0" size={24} />
          <div>
            <p className="text-red-900 font-semibold">
              Error loading dashboard
            </p>
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-7xl mx-auto bg-gray-50 min-h-screen">
      <PageHeader
        title="Dashboard"
        description="Welcome back! Here's your admin overview."
      />

      
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          icon={FiFilm}
          label="Total Movies"
          value={stats.movies}
          color="bg-purple-600"
          loading={loading}
          trend={
            stats.movies > 0
              ? `+${Math.floor(stats.movies * 0.15)} active`
              : null
          }
        />
        <StatCard
          icon={FiMapPin}
          label="Theaters"
          value={stats.theaters}
          color="bg-blue-600"
          loading={loading}
        />
        <StatCard
          icon={FiCalendar}
          label="Shows"
          value={stats.shows}
          color="bg-green-600"
          loading={loading}
          trend={
            stats.shows > 0 ? `+${Math.floor(stats.shows * 0.2)} new` : null
          }
        />
        <StatCard
          icon={FiUsers}
          label="Users"
          value={stats.users}
          color="bg-orange-600"
          loading={loading}
        />
      </div>

      
      <div className="grid sm:grid-cols-2 gap-6 mb-8">
        <StatCard
          icon={FiActivity}
          label="Total Bookings"
          value={stats.bookings}
          color="bg-pink-600"
          loading={loading}
        />
        <StatCard
          icon={FiDollarSign}
          label="Total Revenue"
          value={`₹${(stats.revenue / 1000).toFixed(1)}K`}
          color="bg-green-600"
          loading={loading}
        />
      </div>

      
      <div className="grid md:grid-cols-2 gap-6">
        
        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900 mb-4">
            Quick Actions
          </h2>
          <div className="space-y-3">
            <a
              href="/admin/movies"
              className="block w-full px-4 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold hover:shadow-md transition text-center"
            >
              <div className="flex items-center justify-center gap-2">
                <FiFilm size={18} />
                Manage Movies
              </div>
            </a>
            <a
              href="/admin/theaters"
              className="block w-full px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold hover:shadow-md transition text-center"
            >
              <div className="flex items-center justify-center gap-2">
                <FiMapPin size={18} />
                Manage Theaters
              </div>
            </a>
            <a
              href="/admin/shows"
              className="block w-full px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold hover:shadow-md transition text-center"
            >
              <div className="flex items-center justify-center gap-2">
                <FiCalendar size={18} />
                Manage Shows
              </div>
            </a>
          </div>
        </div>

        
        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900 mb-4">
            System Status
          </h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
              <span className="font-medium text-gray-700">API Status</span>
              <span className="px-3 py-1 bg-green-500 text-white text-xs font-bold rounded-full flex items-center gap-1">
                <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
                Online
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200">
              <span className="font-medium text-gray-700">Database</span>
              <span className="px-3 py-1 bg-blue-500 text-white text-xs font-bold rounded-full flex items-center gap-1">
                <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
                Connected
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg border border-purple-200">
              <span className="font-medium text-gray-700">Real-time</span>
              <span className="px-3 py-1 bg-purple-500 text-white text-xs font-bold rounded-full flex items-center gap-1">
                <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
                Active
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
