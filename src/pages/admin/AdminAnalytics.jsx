

import { useState, useEffect } from "react";
import {
  FiTrendingUp,
  FiBarChart2,
  FiUsers,
  FiFilm,
  FiAlertTriangle,
} from "react-icons/fi";
import StatCard from "../../components/admin/StatCard";
import PageHeader from "../../components/admin/PageHeader";
import Badge from "../../components/admin/Badge";

export default function AdminAnalytics() {
  const [analytics, setAnalytics] = useState({
    topMovies: [],
    weeklyBookings: [0, 0, 0, 0, 0, 0, 0],
    movieGenres: [],
    theaterCities: [],
    error: null,
    loading: true,
  });

  useEffect(() => {
    
    setAnalytics({
      topMovies: [],
      weeklyBookings: [0, 0, 0, 0, 0, 0, 0],
      movieGenres: [],
      theaterCities: [],
      error: "Analytics endpoints not available on backend",
      loading: false,
    });
  }, []);

  if (analytics.loading) {
    return (
      <div className="p-8 max-w-7xl mx-auto bg-gray-50 min-h-screen">
        <PageHeader
          title="Analytics"
          description="Movie and booking insights"
        />
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin">
            <div className="w-8 h-8 border-4 border-purple-200 border-t-purple-600 rounded-full" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-7xl mx-auto bg-gray-50 min-h-screen">
      <PageHeader
        title="Analytics"
        description="Movie performance and booking insights."
      />

      
      <div className="grid sm:grid-cols-3 gap-6 mb-8">
        <StatCard
          icon={FiBarChart2}
          label="Total Bookings (Week)"
          value={analytics.weeklyBookings.reduce((a, b) => a + b, 0)}
          color="bg-purple-600"
        />
        <StatCard
          icon={FiTrendingUp}
          label="Avg Revenue"
          value={`₹${Math.floor(analytics.weeklyBookings.reduce((a, b) => a + b, 0) * 250)}`}
          color="bg-green-600"
        />
        <StatCard
          icon={FiFilm}
          label="Top Movie Bookings"
          value={analytics.topMovies[0]?.bookings || 0}
          color="bg-blue-600"
        />
      </div>

      
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        
        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Top Movies</h2>
          <div className="space-y-3">
            {analytics.topMovies.map((movie, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200"
              >
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 flex items-center justify-center bg-purple-100 text-purple-600 font-bold rounded-lg">
                    #{idx + 1}
                  </span>
                  <div>
                    <p className="font-semibold text-gray-900">{movie.name}</p>
                    <p className="text-xs text-gray-600">
                      {movie.bookings} bookings
                    </p>
                  </div>
                </div>
                <span className="font-bold text-green-600">
                  ₹{movie.revenue}
                </span>
              </div>
            ))}
          </div>
        </div>

        
        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900 mb-4">
            Weekly Bookings
          </h2>
          <div className="space-y-4">
            {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(
              (day, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <span className="w-12 font-medium text-gray-700">{day}</span>
                  <div className="flex-1 mx-4 bg-gray-200 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-purple-600 h-full rounded-full transition"
                      style={{
                        width: `${(analytics.weeklyBookings[idx] / Math.max(...analytics.weeklyBookings)) * 100}%`,
                      }}
                    />
                  </div>
                  <span className="w-12 text-right font-semibold text-gray-900">
                    {analytics.weeklyBookings[idx]}
                  </span>
                </div>
              ),
            )}
          </div>
        </div>
      </div>

      
      <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
        <h2 className="text-lg font-bold text-gray-900 mb-4">
          Genre Performance
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-gray-900">
                  Genre
                </th>
                <th className="text-left px-4 py-3 font-semibold text-gray-900">
                  Movies
                </th>
                <th className="text-left px-4 py-3 font-semibold text-gray-900">
                  Avg Rating
                </th>
                <th className="text-left px-4 py-3 font-semibold text-gray-900">
                  Performance
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {analytics.movieGenres.map((item, idx) => (
                <tr key={idx} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-900">
                    {item.genre}
                  </td>
                  <td className="px-4 py-3 text-gray-700">
                    {item.count} films
                  </td>
                  <td className="px-4 py-3">
                    <Badge status={`${item.avg_rating}/10`} variant="success" />
                  </td>
                  <td className="px-4 py-3">
                    <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="bg-green-500 h-full transition"
                        style={{ width: `${(item.avg_rating / 10) * 100}%` }}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
