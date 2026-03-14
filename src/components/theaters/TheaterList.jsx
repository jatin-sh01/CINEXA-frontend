import { useState } from "react";
import { get } from "../../api";
import useFetch from "../../hooks/useFetch";
import TheaterCard from "./TheaterCard";
import Spinner from "../shared/Spinner";
import { FiSearch, FiMapPin } from "react-icons/fi";

export default function TheaterList() {
  const [search, setSearch] = useState("");
  const [city, setCity] = useState("");
  const { data, loading, error } = useFetch(
    () =>
      get("/api/theaters", {
        name: search || undefined,
        city: city || undefined,
      }),
    [search, city],
  );

  const theaters = data?.data || [];

  return (
    <section className="min-h-screen bg-white px-4 py-12">
      <div className="max-w-7xl mx-auto">
        
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Theaters
          </h1>
          <p className="text-gray-600 text-sm">Discover cinemas near you</p>
        </div>

        
        <div className="flex gap-3 mb-8 flex-col sm:flex-row">
          <div className="flex-1 relative">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              placeholder="Search theater by name…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-xl bg-white border border-gray-300 text-gray-900 placeholder-gray-400 focus:border-gray-400 focus:ring-1 focus:ring-gray-400 outline-none transition-all text-sm shadow-sm"
            />
          </div>
          <div className="sm:w-56 relative">
            <FiMapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              placeholder="Filter by city…"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-xl bg-white border border-gray-300 text-gray-900 placeholder-gray-400 focus:border-gray-400 focus:ring-1 focus:ring-gray-400 outline-none transition-all text-sm shadow-sm"
            />
          </div>
        </div>

        
        {loading ? (
          <Spinner />
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
            <p className="text-red-700 font-medium">{error}</p>
          </div>
        ) : (
          <>
            {theaters.length > 0 && (
              <p className="text-gray-600 text-sm mb-6">
                Showing {theaters.length} theater{theaters.length !== 1 ? "s" : ""}
              </p>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {theaters.length ? (
                theaters.map((t) => <TheaterCard key={t._id} theater={t} />)
              ) : (
                <div className="col-span-full">
                  <div className="bg-white border border-gray-200 rounded-2xl p-12 text-center shadow-sm">
                    <FiMapPin className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-600 text-lg">No theaters found</p>
                    <p className="text-gray-500 text-sm mt-1">Try adjusting your search filters</p>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
