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
    <section className="min-h-screen bg-gray-50/50 px-4 py-8 sm:py-12">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900 mb-1">
            Theaters
          </h1>
          <p className="text-gray-500 text-sm">Discover partnered cinemas and screens near you</p>
        </div>

        <div className="flex gap-3 mb-8 flex-col sm:flex-row">
          <div className="flex-1 relative">
            <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
            <input
              placeholder="Search theater by name…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9.5 pr-4 py-2.5 rounded-xl bg-white border border-gray-200 text-gray-900 placeholder:text-gray-400 focus:border-gray-950 focus:ring-2 focus:ring-gray-950/10 outline-none transition text-sm shadow-2xs"
            />
          </div>
          <div className="sm:w-64 relative">
            <FiMapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
            <input
              placeholder="Filter by city…"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full pl-9.5 pr-4 py-2.5 rounded-xl bg-white border border-gray-200 text-gray-900 placeholder:text-gray-400 focus:border-gray-950 focus:ring-2 focus:ring-gray-950/10 outline-none transition text-sm shadow-2xs"
            />
          </div>
        </div>

        {loading ? (
          <Spinner />
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center">
            <p className="text-red-700 font-medium text-sm">{error}</p>
          </div>
        ) : (
          <>
            {theaters.length > 0 && (
              <p className="text-gray-500 text-xs mb-4 font-medium">
                Showing {theaters.length} theater
                {theaters.length !== 1 ? "s" : ""}
              </p>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {theaters.length ? (
                theaters.map((t) => <TheaterCard key={t._id} theater={t} />)
              ) : (
                <div className="col-span-full">
                  <div className="bg-white border border-gray-200/90 rounded-2xl p-10 sm:p-12 text-center shadow-xs">
                    <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 mx-auto mb-3">
                      <FiMapPin size={22} />
                    </div>
                    <h3 className="text-base font-semibold text-gray-900 mb-1">
                      No theaters found
                    </h3>
                    <p className="text-xs text-gray-500 max-w-sm mx-auto">
                      Try adjusting your search filters or searching for a different city
                    </p>
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
