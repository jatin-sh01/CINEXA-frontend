import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { FiAlertCircle, FiCheckCircle, FiClock } from "react-icons/fi";
import {
  clearPendingPayment,
  confirmStripeCheckoutSession,
  confirmStripePaymentIntent,
  loadPendingPayment,
} from "../services/paymentService";
import { get } from "../api";

export default function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const [bookingStatus, setBookingStatus] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("");
  const [verifying, setVerifying] = useState(true);
  const [verificationError, setVerificationError] = useState("");

  const pending = useMemo(() => loadPendingPayment(), []);
  const bookingId =
    searchParams.get("booking_id") ||
    pending?.bookingId ||
    searchParams.get("client_reference_id") ||
    "";
  const paymentId = searchParams.get("payment_id") || pending?.paymentId || "";
  const sessionId = searchParams.get("session_id") || pending?.sessionId || "";
  const paymentIntent =
    searchParams.get("payment_intent") || pending?.paymentIntentId || "";

  useEffect(() => {
    clearPendingPayment();
  }, []);

  useEffect(() => {
    let active = true;

    const hasIds = Boolean(bookingId || paymentId);
    if (!hasIds) {
      setVerifying(false);
      return () => {
        active = false;
      };
    }

    const loadStatus = async () => {
      const checks = [];

      if (bookingId) checks.push(get(`/api/booking/${bookingId}`));
      else checks.push(Promise.resolve(null));

      if (paymentId) checks.push(get(`/api/payment/${paymentId}`));
      else checks.push(Promise.resolve(null));

      const [bookingRes, paymentRes] = await Promise.allSettled(checks);

      if (!active) return { done: true, failed: false };

      const latestBookingStatus =
        bookingRes.status === "fulfilled" ? bookingRes.value?.data?.status : "";
      const latestPaymentStatus =
        paymentRes.status === "fulfilled"
          ? paymentRes.value?.data?.paymentStatus
          : "";

      setBookingStatus(latestBookingStatus || "");
      setPaymentStatus(latestPaymentStatus || "");

      const isSuccess =
        latestBookingStatus === "successfull" || latestPaymentStatus === "SUCCESS";
      const isFailed =
        latestBookingStatus === "cancelled" ||
        latestBookingStatus === "expired" ||
        latestPaymentStatus === "FAILED";

      if (isSuccess || isFailed) {
        setVerifying(false);
        return { done: true, failed: isFailed };
      }

      return { done: false, failed: false };
    };

    const verify = async () => {
      setVerifying(true);
      setVerificationError("");

      try {
        if (sessionId) {
          await confirmStripeCheckoutSession(sessionId);
        } else if (paymentIntent) {
          await confirmStripePaymentIntent(paymentIntent);
        }
      } catch {
        // Keep polling below for eventual consistency when immediate confirmation fails.
      }

      const maxAttempts = 8;
      for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
        try {
          const result = await loadStatus();
          if (result.done) return;
        } catch (error) {
          if (!active) return;
          if (attempt === maxAttempts - 1) {
            setVerificationError(error?.message || "Unable to verify payment status.");
            setVerifying(false);
            return;
          }
        }

        await new Promise((resolve) => setTimeout(resolve, 2500));
      }

      if (active) {
        setVerifying(false);
      }
    };

    verify();

    return () => {
      active = false;
    };
  }, [bookingId, paymentId, paymentIntent, sessionId]);

  const isSuccess =
    bookingStatus === "successfull" || paymentStatus === "SUCCESS";
  const isFailed =
    bookingStatus === "cancelled" ||
    bookingStatus === "expired" ||
    paymentStatus === "FAILED";

  const heading = verifying
    ? "Payment received, confirming..."
    : isSuccess
      ? "Payment successful"
      : isFailed
        ? "Payment failed"
        : "Payment submitted";

  const subText = verifying
    ? "We are waiting for Stripe webhook confirmation. This can take a few seconds."
    : isSuccess
      ? "Your payment is confirmed and your booking should now be finalized."
      : isFailed
        ? "Payment could not be finalized. Please retry from your booking page."
        : "Your payment request has been submitted to Stripe. Please verify status from booking details.";

  return (
    <div className="min-h-screen bg-linear-to-b from-emerald-50 to-white px-4 py-12">
      <div className="mx-auto max-w-2xl rounded-2xl border border-emerald-200 bg-white p-8 shadow-sm">
        <div className="mb-6 flex items-center gap-3 text-emerald-700">
          {verifying ? (
            <FiClock size={30} />
          ) : isFailed ? (
            <FiAlertCircle size={30} />
          ) : (
            <FiCheckCircle size={30} />
          )}
          <h1 className="text-3xl font-bold text-gray-900">{heading}</h1>
        </div>

        <p className="mb-6 text-sm text-gray-700">{subText}</p>

        {verificationError && (
          <p className="mb-6 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-700">
            {verificationError}
          </p>
        )}

        {(bookingStatus || paymentStatus) && (
          <p className="mb-6 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-700">
            Latest status: {bookingStatus || "-"} / {paymentStatus || "-"}
          </p>
        )}

        <div className="space-y-3 rounded-xl border border-gray-200 bg-gray-50 p-4 text-sm text-gray-700">
          <p>
            <span className="font-semibold text-gray-900">Booking ID:</span>{" "}
            <span className="font-mono break-all">{bookingId || "Not available"}</span>
          </p>
          <p>
            <span className="font-semibold text-gray-900">Payment ID:</span>{" "}
            <span className="font-mono break-all">{paymentId || "Not available"}</span>
          </p>
          {sessionId && (
            <p>
              <span className="font-semibold text-gray-900">Checkout Session:</span>{" "}
              <span className="font-mono break-all">{sessionId}</span>
            </p>
          )}
          {paymentIntent && (
            <p>
              <span className="font-semibold text-gray-900">Payment Intent:</span>{" "}
              <span className="font-mono break-all">{paymentIntent}</span>
            </p>
          )}
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          {bookingId ? (
            <Link
              to={`/booking/${bookingId}`}
              className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
            >
              View Booking
            </Link>
          ) : (
            <Link
              to="/dashboard"
              className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
            >
              Go to Dashboard
            </Link>
          )}

          <Link
            to="/movies"
            className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-900 hover:bg-gray-50"
          >
            Continue Browsing
          </Link>
        </div>
      </div>
    </div>
  );
}
