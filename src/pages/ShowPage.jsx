import { useParams, useNavigate } from "react-router-dom";
import { get } from "../api";
import useFetch from "../hooks/useFetch";
import Spinner from "../components/shared/Spinner";
import SeatSelector from "../components/SeatSelector";
import { useAuth } from "../contexts/AuthContext";
import { formatCurrency, formatTime } from "../utils/format";
import { useState } from "react";
import {
  FiClock,
  FiUsers,
  FiDollarSign,
  FiFilm,
  FiPlay,
} from "react-icons/fi";

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
    <div className="min-h-screen bg-linear-to-b from-white to-gray-50 px-4 py-12">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-purple-600 font-semibold">
            <FiFilm size={20} />
            <span>Select Your Seats</span>
          </div>
          <h1 className="text-4xl font-bold text-gray-900">{movieName}</h1>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm hover:shadow-md transition">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="flex flex-col items-start gap-3 p-4 bg-linear-to-br from-blue-50 to-blue-100/50 rounded-xl border border-blue-200">
              <div className="flex items-center gap-2 text-blue-700 font-semibold">
                <FiClock size={20} />
                <span>Show Time</span>
              </div>
              <p className="text-gray-900 font-bold text-lg">
                {formatTime(show.timing)}
              </p>
            </div>

            <div className="flex flex-col items-start gap-3 p-4 bg-linear-to-br from-purple-50 to-purple-100/50 rounded-xl border border-purple-200">
              <div className="flex items-center gap-2 text-purple-700 font-semibold">
                <FiUsers size={20} />
                <span>Available</span>
              </div>
              <p className="text-gray-900 font-bold text-lg">
                {show.noOfSeats} seats
              </p>
            </div>

            <div className="flex flex-col items-start gap-3 p-4 bg-linear-to-br from-orange-50 to-orange-100/50 rounded-xl border border-orange-200">
              <div className="flex items-center gap-2 text-orange-700 font-semibold">
                <FiDollarSign size={20} />
                <span>Per Seat</span>
              </div>
              <p className="text-gray-900 font-bold text-lg">
                {formatCurrency(show.price)}
              </p>
            </div>

            {show.format && (
              <div className="flex flex-col items-start gap-3 p-4 bg-linear-to-br from-green-50 to-green-100/50 rounded-xl border border-green-200">
                <div className="flex items-center gap-2 text-green-700 font-semibold">
                  <FiPlay size={20} />
                  <span>Format</span>
                </div>
                <p className="text-gray-900 font-bold text-lg">{show.format}</p>
              </div>
            )}
          </div>
        </div>

        <SeatSelector show={show} onSelect={setSeats} />

        <div className="space-y-3">
          <button
            onClick={handleBook}
            disabled={seats.length === 0}
            className="w-full py-4 rounded-xl bg-linear-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-bold text-lg shadow-lg hover:shadow-xl transition-all transform hover:scale-105 disabled:opacity-50 disabled:scale-100 disabled:cursor-not-allowed"
          >
            <div className="flex items-center justify-center gap-2">
              <FiPlay size={20} />
              {seats.length > 0 ? (
                <>
                  Book {seats.length} Seat{seats.length !== 1 ? "s" : ""} •{" "}
                  {formatCurrency(totalPrice)}
                </>
              ) : (
                "Select Seats to Continue"
              )}
            </div>
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
