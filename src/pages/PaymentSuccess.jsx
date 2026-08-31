import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  FiAlertCircle,
  FiCheck,
  FiCheckCircle,
  FiClock,
  FiCopy,
  FiFilm,
  FiList,
  FiMapPin,
  FiPrinter,
  FiUser,
} from "react-icons/fi";
import {
  clearPendingPayment,
  confirmStripeCheckoutSession,
  confirmStripePaymentIntent,
  loadPendingPayment,
} from "../services/paymentService";
import { get } from "../api";
import { useAuth } from "../contexts/AuthContext";
import { formatCurrency, formatDate, formatTime } from "../utils/format";
import CinexaLogo from "../components/shared/CinexaLogo";

export default function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const [bookingStatus, setBookingStatus] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("");
  const [verifying, setVerifying] = useState(true);
  const [verificationError, setVerificationError] = useState("");

  const [booking, setBooking] = useState(null);
  const [movie, setMovie] = useState(null);
  const [theater, setTheater] = useState(null);
  const [show, setShow] = useState(null);
  const [copied, setCopied] = useState(false);

  const pending = useMemo(() => loadPendingPayment(), []);
  const initialBookingId =
    searchParams.get("booking_id") ||
    searchParams.get("bookingId") ||
    searchParams.get("id") ||
    pending?.bookingId ||
    searchParams.get("client_reference_id") ||
    "";
  const initialPaymentId = searchParams.get("payment_id") || pending?.paymentId || "";
  const sessionId = searchParams.get("session_id") || pending?.sessionId || "";
  const paymentIntent =
    searchParams.get("payment_intent") || pending?.paymentIntentId || "";

  useEffect(() => {
    clearPendingPayment();
  }, []);

  useEffect(() => {
    let active = true;

    const loadStatusForId = async (bId, pId) => {
      const checks = [];

      if (bId) checks.push(get(`/api/booking/${bId}`));
      else checks.push(Promise.resolve(null));

      if (pId) checks.push(get(`/api/payment/${pId}`));
      else checks.push(Promise.resolve(null));

      const [bookingRes, paymentRes] = await Promise.allSettled(checks);

      if (!active) return { done: true, failed: false };

      const latestBookingData =
        bookingRes.status === "fulfilled" ? bookingRes.value?.data : null;
      const latestBookingStatus = latestBookingData?.status || "";
      const latestPaymentStatus =
        paymentRes.status === "fulfilled"
          ? paymentRes.value?.data?.paymentStatus
          : "";

      if (latestBookingData) {
        setBooking(latestBookingData);
      }

      if (latestBookingStatus) setBookingStatus(latestBookingStatus);
      if (latestPaymentStatus) setPaymentStatus(latestPaymentStatus);

      const isSuccess =
        latestBookingStatus === "successfull" ||
        latestPaymentStatus === "SUCCESS";
      const isFailed =
        latestBookingStatus === "cancelled" ||
        latestBookingStatus === "expired" ||
        latestPaymentStatus === "FAILED";

      if (isSuccess || isFailed) {
        return { done: true, failed: isFailed };
      }

      return { done: false, failed: false };
    };

    const verify = async () => {
      setVerifying(true);
      setVerificationError("");

      let currentBookingId = initialBookingId;
      let currentPaymentId = initialPaymentId;

      try {
        if (sessionId) {
          const res = await confirmStripeCheckoutSession(sessionId);
          const data = res?.data || res;
          if (data?.bookingId) currentBookingId = data.bookingId;
          if (data?.paymentId) currentPaymentId = data.paymentId;
          if (data?.booking) setBooking(data.booking);
        } else if (paymentIntent) {
          const res = await confirmStripePaymentIntent(paymentIntent);
          const data = res?.data || res;
          if (data?.bookingId) currentBookingId = data.bookingId;
          if (data?.paymentId) currentPaymentId = data.paymentId;
          if (data?.booking) setBooking(data.booking);
        }
      } catch {
        // Keep polling below
      }

      // If no booking ID was provided in URL/session, attempt to load user's most recent confirmed booking
      if (!currentBookingId) {
        try {
          const userBookings = await get("/api/booking");
          const list = Array.isArray(userBookings?.data) ? userBookings.data : [];
          if (list.length > 0) {
            currentBookingId = list[0]._id;
            setBooking(list[0]);
            setBookingStatus(list[0].status);
          }
        } catch {
          // Ignore
        }
      }

      if (!currentBookingId && !currentPaymentId) {
        if (active) setVerifying(false);
        return;
      }

      const maxAttempts = 8;
      for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
        try {
          const result = await loadStatusForId(currentBookingId, currentPaymentId);
          if (result.done) {
            if (active) setVerifying(false);
            return;
          }
        } catch (error) {
          if (!active) return;
          if (attempt === maxAttempts - 1) {
            setVerificationError(
              error?.message || "Unable to verify payment status.",
            );
            setVerifying(false);
            return;
          }
        }

        await new Promise((resolve) => setTimeout(resolve, 2000));
      }

      if (active) {
        setVerifying(false);
      }
    };

    verify();

    return () => {
      active = false;
    };
  }, [initialBookingId, initialPaymentId, paymentIntent, sessionId]);

  // Fetch real movie, theater, and show records from DB
  useEffect(() => {
    if (!booking) return;

    // 1. Movie record
    const rawMovie = booking.movieId;
    const effectiveMovieId =
      typeof rawMovie === "object" ? rawMovie?._id : rawMovie;
    if (rawMovie && typeof rawMovie === "object" && rawMovie.name) {
      setMovie(rawMovie);
    } else if (effectiveMovieId) {
      get(`/api/movies/${effectiveMovieId}`)
        .then((res) => {
          if (res?.data) setMovie(res.data);
        })
        .catch(() => null);
    }

    // 2. Theater record
    const rawTheater = booking.theaterId;
    const effectiveTheaterId =
      typeof rawTheater === "object" ? rawTheater?._id : rawTheater;
    if (rawTheater && typeof rawTheater === "object" && rawTheater.name) {
      setTheater(rawTheater);
    } else if (effectiveTheaterId) {
      get(`/api/theaters/${effectiveTheaterId}`)
        .then((res) => {
          if (res?.data) setTheater(res.data);
        })
        .catch(() => null);
    }

    // 3. Show record (to get exact show price, screen format, and timing)
    const rawShow = booking.showId;
    const effectiveShowId =
      typeof rawShow === "object" ? rawShow?._id : rawShow;
    if (rawShow && typeof rawShow === "object" && rawShow.price) {
      setShow(rawShow);
    } else if (effectiveShowId) {
      get(`/api/show/${effectiveShowId}`)
        .then((res) => {
          if (res?.data) setShow(res.data);
        })
        .catch(() => null);
    }
  }, [booking]);

  const isFailed =
    bookingStatus === "cancelled" ||
    bookingStatus === "expired" ||
    paymentStatus === "FAILED";

  // Exact real data mapping from database
  const realMovieName =
    movie?.name ||
    (typeof booking?.movieId === "object" ? booking?.movieId?.name : null) ||
    show?.movieId?.name ||
    "";

  const realMoviePoster =
    movie?.poster ||
    (typeof booking?.movieId === "object" ? booking?.movieId?.poster : null) ||
    show?.movieId?.poster ||
    "";

  const realMovieLanguage = movie?.language || show?.movieId?.language || "";
  const realMovieGenre = movie?.genre || show?.movieId?.genre || "";
  const realMovieDuration = movie?.duration
    ? `${movie.duration} min`
    : show?.movieId?.duration
      ? `${show.movieId.duration} min`
      : "";

  const realTheaterName =
    theater?.name ||
    (typeof booking?.theaterId === "object" ? booking?.theaterId?.name : null) ||
    show?.theaterId?.name ||
    "";

  const realTheaterAddress =
    theater?.address ||
    (typeof booking?.theaterId === "object" ? booking?.theaterId?.address : null) ||
    show?.theaterId?.address ||
    "";

  const realTheaterCity =
    theater?.city ||
    (typeof booking?.theaterId === "object" ? booking?.theaterId?.city : null) ||
    show?.theaterId?.city ||
    "";

  const realScreenFormat = show?.format || "";

  const timing = booking?.timing || show?.timing || "";
  const hasTimingDate = timing && !Number.isNaN(Date.parse(timing));
  const timingDateText = hasTimingDate
    ? formatDate(timing)
    : booking?.createdAt
      ? formatDate(booking.createdAt)
      : "";
  const timingTimeText = hasTimingDate
    ? formatTime(timing)
    : timing || "";

  const seatString = booking?.seat || "";
  const seatList = useMemo(() => {
    if (!seatString) {
      const count = Number(booking?.noOfSeats || 1);
      return Array.from({ length: count }, (_, i) => `Seat ${i + 1}`);
    }
    return seatString
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
  }, [seatString, booking?.noOfSeats]);

  const noOfSeats = Number(booking?.noOfSeats || seatList.length || 1);

  // Exact real price calculation
  const realTotalCost = Number(booking?.totalCost || (show?.price ? show.price * noOfSeats : 0));
  const realUnitPrice = show?.price || (noOfSeats > 0 && realTotalCost > 0 ? Math.round(realTotalCost / noOfSeats) : 0);

  // Real Ticket Holder
  const ticketHolderName =
    (typeof booking?.userId === "object" ? booking.userId?.name : null) ||
    user?.name ||
    (typeof booking?.userId === "object" ? booking.userId?.email : null) ||
    user?.email ||
    "";

  const effectiveBookingId = booking?._id || initialBookingId;

  const copyBookingId = () => {
    if (!effectiveBookingId) return;
    navigator.clipboard?.writeText(effectiveBookingId).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }).catch(() => null);
  };

  // State 1: Verifying in progress
  if (verifying) {
    return (
      <div className="min-h-screen bg-gray-50/50 px-4 py-12 flex items-center justify-center">
        <div className="mx-auto max-w-md w-full rounded-2xl border border-gray-200/90 bg-white p-8 text-center shadow-xs animate-modal-pop">
          <div className="w-12 h-12 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-4">
            <FiClock size={24} className="animate-spin" />
          </div>
          <h1 className="text-xl font-bold tracking-tight text-gray-900 mb-2">
            Confirming Payment
          </h1>
          <p className="text-sm text-gray-500 leading-relaxed mb-6">
            We are confirming your payment status with Stripe and issuing your pass.
          </p>
          <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full bg-gray-950 rounded-full w-2/3 animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  // State 2: Failed payment
  if (isFailed) {
    return (
      <div className="min-h-screen bg-gray-50/50 px-4 py-12 flex items-center justify-center">
        <div className="mx-auto max-w-md w-full rounded-2xl border border-rose-200/90 bg-white p-8 text-center shadow-xs animate-modal-pop">
          <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto mb-4">
            <FiAlertCircle size={26} />
          </div>
          <h1 className="text-xl font-bold tracking-tight text-gray-900 mb-2">
            Payment Not Completed
          </h1>
          <p className="text-sm text-gray-600 leading-relaxed mb-6">
            {verificationError || "The transaction could not be completed or the reservation hold timed out."}
          </p>
          <div className="flex flex-col gap-2.5">
            {effectiveBookingId && (
              <Link
                to={`/booking/${effectiveBookingId}`}
                className="w-full inline-flex items-center justify-center px-5 py-2.5 bg-gray-950 hover:bg-gray-800 text-white rounded-xl text-sm font-medium active:scale-[0.98] transition duration-150 shadow-xs"
              >
                Return to Booking
              </Link>
            )}
            <Link
              to="/movies"
              className="w-full inline-flex items-center justify-center px-5 py-2.5 bg-white border border-gray-200 hover:bg-gray-50 text-gray-900 rounded-xl text-sm font-medium active:scale-[0.98] transition duration-150 shadow-2xs"
            >
              Browse Movies
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // State 3: No active booking found
  if (!booking) {
    return (
      <div className="min-h-screen bg-gray-50/50 px-4 py-12 flex items-center justify-center">
        <div className="mx-auto max-w-md w-full rounded-2xl border border-gray-200/90 bg-white p-8 text-center shadow-xs animate-modal-pop">
          <div className="w-12 h-12 rounded-full bg-gray-100 text-gray-500 flex items-center justify-center mx-auto mb-4">
            <FiFilm size={24} />
          </div>
          <h1 className="text-xl font-bold tracking-tight text-gray-900 mb-2">
            No Active Ticket Found
          </h1>
          <p className="text-sm text-gray-500 leading-relaxed mb-6">
            Please select a confirmed booking from your dashboard to view and print your cinema pass.
          </p>
          <div className="flex flex-col gap-2.5">
            <Link
              to="/dashboard"
              className="w-full inline-flex items-center justify-center px-5 py-2.5 bg-gray-950 hover:bg-gray-800 text-white rounded-xl text-sm font-medium active:scale-[0.98] transition duration-150 shadow-xs"
            >
              Go to My Bookings
            </Link>
            <Link
              to="/movies"
              className="w-full inline-flex items-center justify-center px-5 py-2.5 bg-white border border-gray-200 hover:bg-gray-50 text-gray-900 rounded-xl text-sm font-medium active:scale-[0.98] transition duration-150 shadow-2xs"
            >
              Browse Movies
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // State 4: Confirmed Cinema Ticket with real database entities
  return (
    <div className="min-h-screen bg-gray-50/50 px-4 py-8 sm:py-12">
      <div className="max-w-xl mx-auto">
        {/* On-screen success banner (hidden on print) */}
        <div className="no-print mb-6 text-center animate-slide-up">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold shadow-2xs">
            <FiCheckCircle size={15} className="text-emerald-600 shrink-0" />
            <span>Payment Confirmed • Ticket Issued</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900 mt-3">
            Your Cinema Pass
          </h1>
          <p className="text-gray-500 text-xs sm:text-sm mt-1">
            Show this electronic ticket at the theater usher counter for admission.
          </p>
        </div>

        {/* The Ticket Card */}
        <div className="ticket-print-container bg-white border border-gray-200/90 rounded-3xl shadow-sm overflow-hidden animate-modal-pop">
          {/* Header */}
          <div className="bg-gray-950 text-white px-6 sm:px-8 py-4 sm:py-5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CinexaLogo className="h-6 w-auto" color="#ffffff" />
              <span className="text-xs uppercase tracking-widest text-gray-400 font-semibold border-l border-gray-800 pl-3">
                Admit Pass
              </span>
            </div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-[11px] font-bold tracking-wide">
              <FiCheckCircle size={12} />
              <span>PAID</span>
            </div>
          </div>

          {/* Main Ticket Body */}
          <div className="p-6 sm:p-8 space-y-6">
            {/* Movie Details */}
            <div className="flex gap-4 sm:gap-5 items-start">
              {realMoviePoster ? (
                <img
                  src={realMoviePoster}
                  alt={realMovieName}
                  className="w-20 h-28 sm:w-22 sm:h-32 object-cover rounded-xl border border-gray-200 shadow-2xs shrink-0"
                />
              ) : (
                <div className="w-20 h-28 sm:w-22 sm:h-32 bg-gray-100 rounded-xl border border-gray-200 flex items-center justify-center text-gray-400 shrink-0">
                  <FiFilm size={26} />
                </div>
              )}

              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-1.5 mb-1.5">
                  {realMovieLanguage && (
                    <span className="px-2 py-0.5 rounded-md bg-gray-100 text-gray-700 text-[10px] font-bold uppercase tracking-wider">
                      {realMovieLanguage}
                    </span>
                  )}
                  {realScreenFormat && (
                    <span className="px-2 py-0.5 rounded-md bg-gray-100 text-gray-700 text-[10px] font-bold uppercase tracking-wider">
                      {realScreenFormat}
                    </span>
                  )}
                  {realMovieGenre && (
                    <span className="text-xs text-gray-500 font-medium">
                      {realMovieGenre}
                    </span>
                  )}
                </div>

                <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-gray-900 leading-snug">
                  {realMovieName || "Feature Film"}
                </h2>

                {realMovieDuration && (
                  <p className="text-xs text-gray-500 mt-1 flex items-center gap-1.5">
                    <FiClock size={12} className="text-gray-400" />
                    <span>{realMovieDuration}</span>
                  </p>
                )}

                {ticketHolderName && (
                  <p className="text-xs text-gray-600 mt-2 flex items-center gap-1.5 font-medium">
                    <FiUser size={13} className="text-gray-400 shrink-0" />
                    <span>Guest: {ticketHolderName}</span>
                  </p>
                )}
              </div>
            </div>

            {/* Event Meta Grid */}
            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-400 flex items-center gap-1">
                  <FiMapPin size={11} />
                  Theater
                </p>
                <p className="text-sm font-bold text-gray-900 mt-0.5 leading-snug">
                  {realTheaterName || "Partner Cinema"}
                </p>
                {(realTheaterAddress || realTheaterCity) && (
                  <p className="text-xs text-gray-500 mt-0.5 truncate">
                    {realTheaterAddress}{realTheaterCity ? `, ${realTheaterCity}` : ""}
                  </p>
                )}
              </div>

              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-400 flex items-center gap-1">
                  <FiClock size={11} />
                  Date & Time
                </p>
                <p className="text-sm font-bold text-gray-900 mt-0.5">
                  {timingDateText || "Show Date"}
                </p>
                <p className="text-xs font-semibold text-gray-700 mt-0.5">
                  {timingTimeText || "Scheduled Time"}
                </p>
              </div>
            </div>

            {/* Physical Seats Highlight */}
            <div className="rounded-2xl bg-gray-50 border border-gray-200/90 p-4">
              <div className="flex items-center justify-between text-xs text-gray-500 mb-2.5 font-medium">
                <span className="uppercase tracking-wider font-semibold text-gray-700">
                  Assigned Seat{noOfSeats !== 1 ? "s" : ""}
                </span>
                <span>{noOfSeats} Ticket{noOfSeats !== 1 ? "s" : ""}</span>
              </div>

              <div className="flex flex-wrap gap-2">
                {seatList.map((s, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center justify-center px-3 py-1.5 rounded-lg bg-gray-950 text-white font-mono text-sm font-bold tracking-wider shadow-2xs"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Ticket Perforation Notch */}
          <div className="relative flex items-center justify-between -my-1">
            <div className="w-5 h-5 -ml-2.5 rounded-full bg-gray-50/50 border-r border-gray-200" />
            <div className="flex-1 border-b-2 border-dashed border-gray-200 mx-2" />
            <div className="w-5 h-5 -mr-2.5 rounded-full bg-gray-50/50 border-l border-gray-200" />
          </div>

          {/* Ticket Stub & Receipt Summary */}
          <div className="p-6 sm:p-8 bg-gray-50/30 space-y-5">
            {/* Scannable Reference ID & Barcode Simulation */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-white border border-gray-200/90 shadow-2xs">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                  Ticket Reference
                </p>
                <p className="font-mono text-sm sm:text-base font-bold text-gray-900 mt-0.5 break-all">
                  {effectiveBookingId || "CINEXA-PASS"}
                </p>
                <p className="text-[11px] text-gray-400 mt-0.5">
                  Official Admission ID
                </p>
              </div>

              <div className="flex items-center gap-3 self-start sm:self-center">
                {/* Simulated Cinema Ticket Barcode */}
                <div
                  className="flex items-center gap-1 h-9 px-2 py-1 bg-gray-50 rounded-lg border border-gray-100 shrink-0"
                  aria-hidden="true"
                >
                  <div className="w-0.5 h-full bg-gray-900 rounded-full" />
                  <div className="w-1.5 h-full bg-gray-900 rounded-full" />
                  <div className="w-0.5 h-full bg-gray-300" />
                  <div className="w-1 h-full bg-gray-900 rounded-full" />
                  <div className="w-0.5 h-full bg-gray-900" />
                  <div className="w-1.5 h-full bg-gray-900 rounded-full" />
                  <div className="w-0.5 h-full bg-gray-300" />
                  <div className="w-1 h-full bg-gray-900 rounded-full" />
                  <div className="w-0.5 h-full bg-gray-900" />
                </div>

                <button
                  type="button"
                  onClick={copyBookingId}
                  className="no-print p-2 rounded-xl border border-gray-200 hover:bg-gray-50 text-gray-700 active:scale-95 transition cursor-pointer text-xs font-medium flex items-center gap-1.5"
                  title="Copy Reference ID"
                >
                  {copied ? (
                    <FiCheck className="text-emerald-600" size={16} />
                  ) : (
                    <FiCopy size={16} />
                  )}
                  <span className="hidden sm:inline">
                    {copied ? "Copied" : "Copy"}
                  </span>
                </button>
              </div>
            </div>

            {/* Financial Summary */}
            <div className="divide-y divide-gray-100 text-xs text-gray-600">
              <div className="flex justify-between py-2">
                <span>
                  Tickets ({noOfSeats} {realUnitPrice > 0 ? `× ${formatCurrency(realUnitPrice)}` : ""})
                </span>
                <span className="font-semibold text-gray-900">{formatCurrency(realTotalCost)}</span>
              </div>
              <div className="flex justify-between py-2 pt-3 items-center">
                <span className="text-sm font-bold text-gray-900">Total Paid</span>
                <div className="text-right">
                  <span className="text-lg font-extrabold text-gray-950">
                    {formatCurrency(realTotalCost)}
                  </span>
                  <p className="text-[10px] font-semibold text-emerald-600 uppercase tracking-wider">
                    Paid via Stripe
                  </p>
                </div>
              </div>
            </div>

            {/* Arrival Notice */}
            <p className="text-center text-[11px] text-gray-400 leading-relaxed border-t border-gray-100 pt-3">
              Please arrive 15 minutes before showtime. Keep this electronic pass or printed copy ready for cinema gate entry.
            </p>
          </div>
        </div>

        {/* Action Toolbar (no-print) */}
        <div className="no-print mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => window.print()}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-gray-950 hover:bg-gray-800 text-white rounded-xl text-sm font-medium active:scale-[0.98] transition duration-150 shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-950 focus-visible:ring-offset-2 cursor-pointer"
          >
            <FiPrinter size={16} />
            <span>Print / Save Ticket</span>
          </button>

          <Link
            to="/dashboard"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 bg-white border border-gray-200 hover:bg-gray-50 text-gray-900 rounded-xl text-sm font-medium active:scale-[0.98] transition duration-150 shadow-2xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-950 focus-visible:ring-offset-2"
          >
            <FiList size={16} />
            <span>My Bookings</span>
          </Link>

          <Link
            to="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 bg-white border border-gray-200 hover:bg-gray-50 text-gray-600 hover:text-gray-900 rounded-xl text-sm font-medium active:scale-[0.98] transition duration-150 shadow-2xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-950 focus-visible:ring-offset-2"
          >
            <span>Back to Home</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
