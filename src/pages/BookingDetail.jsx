import { useParams, useSearchParams } from "react-router-dom";
import { get } from "../api";
import useFetch from "../hooks/useFetch";
import Spinner from "../components/shared/Spinner";
import PaymentForm from "../components/booking/PaymentForm";
import { formatCurrency, capitalize } from "../utils/format";
import { FiFilm, FiMapPin, FiClock, FiUsers, FiDollarSign, FiHash } from "react-icons/fi";

export default function BookingDetail() {
  const { id } = useParams();
  const [sp] = useSearchParams();
  const showId = sp.get("showId") || "";
  const { data, loading, error, refetch } = useFetch(
    () => get(`/api/booking/${id}`),
    [id],
  );
  const booking = data?.data;

  
  const movieId = booking
    ? typeof booking.movieId === "object"
      ? booking.movieId?._id
      : booking.movieId
    : null;
  const theaterId = booking
    ? typeof booking.theaterId === "object"
      ? booking.theaterId?._id
      : booking.theaterId
    : null;

  const { data: movieRes } = useFetch(
    () => (movieId ? get(`/api/movies/${movieId}`) : Promise.resolve(null)),
    [movieId],
  );
  const { data: theaterRes } = useFetch(
    () =>
      theaterId ? get(`/api/theaters/${theaterId}`) : Promise.resolve(null),
    [theaterId],
  );

  const movieName =
    (typeof booking?.movieId === "object" ? booking.movieId?.name : null) ||
    movieRes?.data?.name ||
    "Movie";
  const theaterName =
    (typeof booking?.theaterId === "object" ? booking.theaterId?.name : null) ||
    theaterRes?.data?.name ||
    "Theater";

  if (loading) return <Spinner />;
  if (error) return (
    <div className="min-h-screen bg-white px-4 py-12">
      <div className="max-w-2xl mx-auto bg-red-50 border border-red-200 rounded-xl p-8 text-center">
        <p className="text-red-700 font-medium text-lg">{error}</p>
      </div>
    </div>
  );
  if (!booking)
    return (
      <div className="min-h-screen bg-white px-4 py-12">
        <div className="max-w-2xl mx-auto bg-gray-50 border border-gray-200 rounded-xl p-8 text-center">
          <p className="text-gray-700 font-medium text-lg">Booking not found</p>
        </div>
      </div>
    );

  const statusColor = {
    processing: "bg-yellow-100 text-yellow-700 border border-yellow-200",
    successfull: "bg-green-100 text-green-700 border border-green-200",
    cancelled: "bg-red-100 text-red-700 border border-red-200",
    expired: "bg-gray-100 text-gray-700 border border-gray-200",
  };

  return (
    <div className="min-h-screen bg-white px-4 py-12">
      <div className="max-w-2xl mx-auto">
        
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-gray-900 mb-1">Booking Details</h1>
          <p className="text-gray-600 text-sm">Review your cinema ticket reservation</p>
        </div>

        
        <div className="bg-white border border-gray-200 rounded-xl p-8 mb-8 space-y-8">
          
          <div className="flex items-start justify-between pb-6 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <FiFilm className="text-gray-400 shrink-0" size={32} />
              <div>
                <h2 className="text-3xl font-bold text-gray-900">{movieName}</h2>
                <p className="text-gray-600 text-sm mt-1">Your cinema booking</p>
              </div>
            </div>
            <span
              className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap ${statusColor[booking.status] || ""}`}
            >
              {capitalize(booking.status)}
            </span>
          </div>

          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            <div className="flex gap-4">
              <FiMapPin className="text-gray-400 shrink-0 mt-1" size={20} />
              <div className="flex-1">
                <p className="text-gray-600 text-sm font-medium">Theater</p>
                <p className="text-gray-900 text-lg font-semibold mt-1">{theaterName}</p>
              </div>
            </div>

            
            <div className="flex gap-4">
              <FiClock className="text-gray-400 shrink-0 mt-1" size={20} />
              <div className="flex-1">
                <p className="text-gray-600 text-sm font-medium">Show Timing</p>
                <p className="text-gray-900 text-lg font-semibold mt-1">{booking.timing}</p>
              </div>
            </div>

            
            <div className="flex gap-4">
              <FiUsers className="text-gray-400 shrink-0 mt-1" size={20} />
              <div className="flex-1">
                <p className="text-gray-600 text-sm font-medium">Seats</p>
                <p className="text-gray-900 text-lg font-semibold mt-1">
                  {booking.noOfSeats} {booking.seat ? `(${booking.seat})` : ""}
                </p>
              </div>
            </div>

            
            <div className="flex gap-4">
              <FiDollarSign className="text-gray-400 shrink-0 mt-1" size={20} />
              <div className="flex-1">
                <p className="text-gray-600 text-sm font-medium">Total Cost</p>
                <p className="text-gray-900 text-lg font-bold mt-1">{formatCurrency(booking.totalCost)}</p>
              </div>
            </div>
          </div>

          
          <div className="pt-6 border-t border-gray-100">
            <div className="flex gap-4">
              <FiHash className="text-gray-400 shrink-0 mt-1" size={20} />
              <div className="flex-1">
                <p className="text-gray-600 text-sm font-medium">Booking ID</p>
                <p className="text-gray-900 font-mono text-sm mt-1 break-all">{booking._id}</p>
              </div>
            </div>
          </div>
        </div>

        
        {booking.status === "processing" && showId && (
          <div className="bg-white border border-gray-200 rounded-xl p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Complete Payment</h3>
            <PaymentForm booking={booking} showId={showId} onSuccess={refetch} />
          </div>
        )}
      </div>
    </div>
  );
}
