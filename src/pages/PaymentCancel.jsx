import { useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { FiXCircle } from "react-icons/fi";
import { loadPendingPayment } from "../services/paymentService";

export default function PaymentCancel() {
  const [searchParams] = useSearchParams();
  const pending = useMemo(() => loadPendingPayment(), []);

  const bookingId =
    searchParams.get("booking_id") || searchParams.get("bookingId") || pending?.bookingId || "";

  return (
    <div className="min-h-screen bg-linear-to-b from-rose-50 to-white px-4 py-12">
      <div className="mx-auto max-w-2xl rounded-2xl border border-rose-200 bg-white p-8 shadow-sm">
        <div className="mb-6 flex items-center gap-3 text-rose-700">
          <FiXCircle size={30} />
          <h1 className="text-3xl font-bold text-gray-900">Payment cancelled</h1>
        </div>

        <p className="mb-6 text-sm text-gray-700">
          No charge was completed. You can retry using Stripe Checkout or Card
          Payment.
        </p>

        {bookingId && (
          <p className="mb-6 rounded-xl border border-gray-200 bg-gray-50 p-3 text-sm text-gray-700">
            <span className="font-semibold text-gray-900">Booking ID:</span>{" "}
            <span className="font-mono break-all">{bookingId}</span>
          </p>
        )}

        <div className="flex flex-wrap gap-3">
          {bookingId ? (
            <Link
              to={`/booking/${bookingId}`}
              className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-semibold text-white hover:bg-black"
            >
              Retry Payment
            </Link>
          ) : (
            <Link
              to="/dashboard"
              className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-semibold text-white hover:bg-black"
            >
              Back to Dashboard
            </Link>
          )}

          <Link
            to="/movies"
            className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-900 hover:bg-gray-50"
          >
            Back to Movies
          </Link>
        </div>
      </div>
    </div>
  );
}
