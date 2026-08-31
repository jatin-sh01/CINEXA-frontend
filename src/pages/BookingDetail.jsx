import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { get } from "../api";
import useFetch from "../hooks/useFetch";
import Spinner from "../components/shared/Spinner";
import PaymentForm from "../components/booking/PaymentForm";
import { reconcileStripeBookingStatus } from "../services/paymentService";
import { formatCurrency, formatDate, formatTime } from "../utils/format";
import {
  FiFilm,
  FiMapPin,
  FiClock,
  FiUsers,
  FiDollarSign,
  FiHash,
} from "react-icons/fi";

const BOOKING_HOLD_MS = 5 * 60 * 1000;

function formatRemaining(ms) {
  const clamped = Math.max(0, ms);
  const minutes = Math.floor(clamped / 60000);
  const seconds = Math.floor((clamped % 60000) / 1000);
  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}

export default function BookingDetail() {
  const { id } = useParams();
  const [remainingMs, setRemainingMs] = useState(0);
  const { data, loading, error, refetch } = useFetch(
    () => get(`/api/booking/${id}`),
    [id],
  );
  const booking = data?.data;

  useEffect(() => {
    if (!booking?._id || booking.status !== "processing") return;

    let active = true;

    const reconcile = async () => {
      try {
        const result = await reconcileStripeBookingStatus(booking._id);
        if (!active) return;

        const nextStatus = result?.bookingStatus;
        if (nextStatus && nextStatus !== "processing") {
          refetch();
        }
      } catch {
        // No-op. Booking page should still render current status.
      }
    };

    reconcile();

    return () => {
      active = false;
    };
  }, [booking?._id, booking?.status, refetch]);

  useEffect(() => {
    if (!booking?.createdAt || booking.status !== "processing") {
      setRemainingMs(0);
      return;
    }

    const expiryTime = new Date(booking.createdAt).getTime() + BOOKING_HOLD_MS;
    let refreshed = false;

    const updateRemaining = () => {
      const ms = Math.max(0, expiryTime - Date.now());
      setRemainingMs(ms);

      if (ms === 0 && !refreshed) {
        refreshed = true;
        reconcileStripeBookingStatus(booking._id)
          .catch(() => null)
          .finally(() => refetch());
      }
    };

    updateRemaining();
    const timer = setInterval(updateRemaining, 1000);

    return () => clearInterval(timer);
  }, [booking?._id, booking?.createdAt, booking?.status, refetch]);

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
  if (error)
    return (
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
    processing: "bg-amber-100 text-amber-800 border border-amber-200",
    successfull: "bg-emerald-100 text-emerald-800 border border-emerald-200",
    cancelled: "bg-rose-100 text-rose-800 border border-rose-200",
    expired: "bg-gray-100 text-gray-700 border border-gray-200",
  };

  const statusLabel = {
    processing: "Processing",
    successfull: "Confirmed",
    cancelled: "Cancelled",
    expired: "Expired",
  };

  const hasValidTiming =
    booking?.timing && !Number.isNaN(Date.parse(booking.timing));
  const showTimingText = hasValidTiming
    ? `${formatDate(booking.timing)} • ${formatTime(booking.timing)}`
    : booking?.timing || "-";

  const isHoldActive = booking.status === "processing" && remainingMs > 0;
  const holdLabel = formatRemaining(remainingMs);

  return (
    <div className="min-h-screen bg-gray-50/50 px-4 py-8 sm:py-12">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900 mb-1">
            Review Your Booking
          </h1>
          <p className="text-gray-500 text-sm">
            {booking.status === "processing"
              ? "Review and complete payment before the reservation hold expires"
              : "Review your confirmed cinema ticket details"}
          </p>
        </div>

        {booking.status === "processing" && (
          <div
            className={`mb-6 rounded-xl border px-4 py-3 text-sm font-medium ${
              isHoldActive
                ? "border-amber-200 bg-amber-50/90 text-amber-900"
                : "border-red-200 bg-red-50 text-red-700"
            }`}
          >
            {isHoldActive ? (
              <p>
                Complete your booking in{" "}
                <span className="font-bold">{holdLabel}</span> mins
              </p>
            ) : (
              <p>
                Booking hold time expired. Payment is disabled while status
                refreshes.
              </p>
            )}
          </div>
        )}

        <div className="bg-white border border-gray-200/90 rounded-2xl p-6 sm:p-8 mb-6 space-y-6 shadow-xs">
          <div className="flex items-start justify-between pb-6 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-gray-100 rounded-xl text-gray-700 shrink-0">
                <FiFilm size={22} />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                  {movieName}
                </h2>
                <p className="text-gray-500 text-xs mt-0.5">
                  Cinema reservation
                </p>
              </div>
            </div>
            <span
              className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap ${statusColor[booking.status] || ""}`}
            >
              {statusLabel[booking.status] || booking.status}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex gap-4">
              <FiMapPin className="text-gray-400 shrink-0 mt-1" size={20} />
              <div className="flex-1">
                <p className="text-gray-600 text-sm font-medium">Theater</p>
                <p className="text-gray-900 text-lg font-semibold mt-1">
                  {theaterName}
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <FiClock className="text-gray-400 shrink-0 mt-1" size={20} />
              <div className="flex-1">
                <p className="text-gray-600 text-sm font-medium">Show Timing</p>
                <p className="text-gray-900 text-lg font-semibold mt-1">
                  {showTimingText}
                </p>
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
                <p className="text-gray-900 text-lg font-bold mt-1">
                  {formatCurrency(booking.totalCost)}
                </p>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-gray-100">
            <div className="flex gap-4">
              <FiHash className="text-gray-400 shrink-0 mt-1" size={20} />
              <div className="flex-1">
                <p className="text-gray-600 text-sm font-medium">Booking ID</p>
                <p className="text-gray-900 font-mono text-sm mt-1 break-all">
                  {booking._id}
                </p>
              </div>
            </div>
          </div>
        </div>

        {booking.status === "processing" && isHoldActive && (
          <div className="bg-white border border-gray-200 rounded-xl p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">
              Complete Payment
            </h3>
            <PaymentForm booking={booking} onSuccess={refetch} />
          </div>
        )}

        {booking.status === "processing" && !isHoldActive && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-6">
            <p className="text-red-700 font-medium">
              This booking hold expired. Please create a new booking if payment
              is not confirmed.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
