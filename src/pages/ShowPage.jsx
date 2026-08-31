import { useParams, useNavigate } from "react-router-dom";
import { get } from "../api";
import useFetch from "../hooks/useFetch";
import Spinner from "../components/shared/Spinner";
import SeatSelector from "../components/SeatSelector";
import { useAuth } from "../contexts/AuthContext";
import { formatCurrency, formatTime } from "../utils/format";
import { useState } from "react";
import { FiClock, FiUsers, FiDollarSign, FiFilm, FiPlay } from "react-icons/fi";

export default function ShowPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data, loading, error } = useFetch(() => get(`/api/show/${id}`), [id]);
  const show = data?.data;
  const [seats, setSeats] = useState([]);

  if (loading) return <Spinner />;
  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-b from-gray-50 to-white px-4">
        <div className="bg-red-50 border border-red-200 rounded-xl p-8 text-center">
          <p className="text-red-700 font-semibold text-lg">{error}</p>
        </div>
      </div>
    );
  if (!show)
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-b from-gray-50 to-white px-4">
        <div className="bg-gray-100 border border-gray-300 rounded-xl p-8 text-center">
          <p className="text-gray-700 font-semibold text-lg">Show not found</p>
        </div>
      </div>
    );

  const movieName = show.movieId?.name || "Movie";
  const totalPrice = seats.length * show.price;

  const handleBook = () => {
    if (!user) {
      navigate("/login");
      return;
    }
    const params = new URLSearchParams({
      showId: show._id,
      movieId:
        show?.movieId && typeof show.movieId === "object"
          ? show.movieId._id
          : show?.movieId,
      theaterId:
        show?.theaterId && typeof show.theaterId === "object"
          ? show.theaterId._id
          : show?.theaterId,
      timing: show.timing,
      noOfSeats: String(seats.length || 1),
      seat: seats.join(","),
      price: String(show.price),
    });
    navigate(`/booking?${params.toString()}`);
  };

  return (
    <div className="min-h-screen bg-gray-50/50 px-4 py-8 md:py-12">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-gray-500">
            <FiFilm size={14} className="text-gray-900" />
            <span>Select Your Seats</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{movieName}</h1>
        </div>

        <div className="bg-white border border-gray-200/90 rounded-2xl p-4 sm:p-5 shadow-xs">
          <div className={`grid grid-cols-2 ${show.format ? "sm:grid-cols-4" : "sm:grid-cols-3"} gap-4`}>
            <div className="flex items-center gap-3 p-2 rounded-xl bg-gray-50/80">
              <div className="w-9 h-9 rounded-lg bg-white border border-gray-200 flex items-center justify-center text-gray-700 shrink-0">
                <FiClock size={16} />
              </div>
              <div>
                <span className="block text-xs text-gray-500">Show Time</span>
                <span className="text-sm font-semibold text-gray-900">
                  {formatTime(show.timing)}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3 p-2 rounded-xl bg-gray-50/80">
              <div className="w-9 h-9 rounded-lg bg-white border border-gray-200 flex items-center justify-center text-gray-700 shrink-0">
                <FiUsers size={16} />
              </div>
              <div>
                <span className="block text-xs text-gray-500">Availability</span>
                <span className="text-sm font-semibold text-gray-900">
                  {show.noOfSeats} seats
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3 p-2 rounded-xl bg-gray-50/80">
              <div className="w-9 h-9 rounded-lg bg-white border border-gray-200 flex items-center justify-center text-gray-700 shrink-0">
                <FiDollarSign size={16} />
              </div>
              <div>
                <span className="block text-xs text-gray-500">Per Seat</span>
                <span className="text-sm font-semibold text-gray-900">
                  {formatCurrency(show.price)}
                </span>
              </div>
            </div>

            {show.format && (
              <div className="flex items-center gap-3 p-2 rounded-xl bg-gray-50/80">
                <div className="w-9 h-9 rounded-lg bg-white border border-gray-200 flex items-center justify-center text-gray-700 shrink-0">
                  <FiPlay size={16} />
                </div>
                <div>
                  <span className="block text-xs text-gray-500">Format</span>
                  <span className="text-sm font-semibold text-gray-900">{show.format}</span>
                </div>
              </div>
            )}
          </div>
        </div>

        <SeatSelector show={show} onSelect={setSeats} />

        <div className="space-y-3">
          <button
            onClick={handleBook}
            disabled={seats.length === 0}
            className="w-full py-3.5 rounded-xl bg-gray-950 hover:bg-gray-800 text-white font-medium text-base shadow-sm hover:shadow active:scale-[0.98] transition duration-150 flex items-center justify-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-950 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100 cursor-pointer"
          >
            <FiPlay size={18} />
            {seats.length > 0 ? (
              <>
                Book {seats.length} Seat{seats.length !== 1 ? "s" : ""} •{" "}
                {formatCurrency(totalPrice)}
              </>
            ) : (
              "Select Seats to Continue"
            )}
          </button>
          {seats.length === 0 && (
            <p className="text-center text-gray-600 text-sm">
              Select at least one seat to proceed with booking
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
