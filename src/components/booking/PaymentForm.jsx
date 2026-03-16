import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Elements, PaymentElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { useToast } from "../Toast";
import {
  clearPendingPayment,
  createStripeCheckoutSession,
  createStripePaymentIntent,
  savePendingPayment,
} from "../../services/paymentService";
import { hasStripeKey, stripePromise } from "../../services/stripeClient";

function StripeCardForm({ bookingId, paymentId, onPaymentDone }) {
  const stripe = useStripe();
  const elements = useElements();
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements || submitting) return;

    setSubmitting(true);
    setFormError("");

    const returnUrl = `${window.location.origin}/success?booking_id=${bookingId}&payment_id=${paymentId}`;

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: returnUrl,
      },
      redirect: "if_required",
    });

    if (error) {
      setFormError(error.message || "Payment could not be completed.");
      setSubmitting(false);
      return;
    }

    if (paymentIntent?.status === "succeeded" || paymentIntent?.status === "processing") {
      onPaymentDone?.(paymentIntent.id);
      return;
    }

    setFormError("Payment is pending. Please check status in your dashboard.");
    setSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="rounded-xl border border-gray-200 bg-white p-4">
        <PaymentElement />
      </div>

      {formError && (
        <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {formError}
        </p>
      )}

      <button
        type="submit"
        disabled={!stripe || !elements || submitting}
        className="w-full rounded-lg bg-gray-900 px-4 py-3 text-sm font-semibold text-white hover:bg-black disabled:cursor-not-allowed disabled:opacity-60"
      >
        {submitting ? "Processing payment..." : "Pay with Card"}
      </button>
    </form>
  );
}

export default function PaymentForm({ booking, onSuccess }) {
  const toast = useToast();
  const navigate = useNavigate();
  const [checkoutBusy, setCheckoutBusy] = useState(false);
  const [intentBusy, setIntentBusy] = useState(false);
  const [intentError, setIntentError] = useState("");
  const [intentPayload, setIntentPayload] = useState(null);
  const [stripeLoadError, setStripeLoadError] = useState("");

  const stripeReady = hasStripeKey();
  const elementOptions = useMemo(
    () => ({
      clientSecret: intentPayload?.clientSecret || "",
      appearance: {
        theme: "stripe",
      },
    }),
    [intentPayload?.clientSecret],
  );

  const bookingId = booking?._id;

  useEffect(() => {
    let mounted = true;

    if (!stripeReady || !stripePromise) return () => {};

    stripePromise
      .then((stripe) => {
        if (!mounted) return;
        if (!stripe) {
          setStripeLoadError(
            "Stripe could not be initialized in this browser session.",
          );
        }
      })
      .catch(() => {
        if (!mounted) return;
        setStripeLoadError(
          "Card checkout is blocked by browser privacy settings or an extension. Use Stripe Checkout or allow js.stripe.com.",
        );
      });

    return () => {
      mounted = false;
    };
  }, [stripeReady]);

  const handleHostedCheckout = async () => {
    if (!bookingId || checkoutBusy) return;

    setCheckoutBusy(true);
    try {
      const data = await createStripeCheckoutSession(bookingId);
      savePendingPayment({
        bookingId: data?.bookingId,
        paymentId: data?.paymentId,
        sessionId: data?.sessionId,
        flow: "hosted",
      });

      if (!data?.url) {
        throw new Error("Stripe checkout link was not returned.");
      }

      window.location.assign(data.url);
    } catch (err) {
      toast(err.message || "Payment failed", "error");
      setCheckoutBusy(false);
    }
  };

  const handleInitializeCardPayment = async () => {
    if (!bookingId || intentBusy || intentPayload?.clientSecret) return;

    if (!stripeReady) {
      toast("Stripe client key is missing. Please contact support.", "error");
      return;
    }

    if (stripeLoadError) {
      toast(stripeLoadError, "error");
      return;
    }

    setIntentBusy(true);
    setIntentError("");

    try {
      const data = await createStripePaymentIntent(bookingId);
      if (!data?.clientSecret) {
        throw new Error("Unable to start card payment.");
      }

      setIntentPayload(data);
      savePendingPayment({
        bookingId: data?.bookingId,
        paymentId: data?.paymentId,
        paymentIntentId: data?.paymentIntentId,
        flow: "custom",
      });
    } catch (err) {
      setIntentError(err.message || "Unable to initialize card payment.");
      toast(err.message || "Unable to initialize card payment.", "error");
    } finally {
      setIntentBusy(false);
    }
  };

  const handleCardPaymentDone = (paymentIntentId) => {
    clearPendingPayment();
    onSuccess?.();
    navigate(
      `/success?booking_id=${intentPayload?.bookingId || bookingId}&payment_id=${intentPayload?.paymentId || ""}&payment_intent=${paymentIntentId || intentPayload?.paymentIntentId || ""}`,
    );
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h3 className="text-2xl font-bold text-gray-900">Choose Payment Method</h3>
        <p className="text-sm text-gray-600">
          Amount payable:{" "}
          <strong className="text-gray-900">
          {Number(booking.totalCost).toLocaleString("en-IN", {
            style: "currency",
            currency: "INR",
          })}
          </strong>
        </p>
      </div>

      <button
        onClick={handleHostedCheckout}
        disabled={checkoutBusy}
        className="w-full rounded-lg bg-indigo-600 px-4 py-3 text-sm font-semibold text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {checkoutBusy ? "Redirecting to Stripe..." : "Pay with Stripe Checkout"}
      </button>

      <div className="relative py-1 text-center text-xs uppercase tracking-wider text-gray-400">
        <span className="relative z-10 bg-white px-3">Or pay directly with card</span>
        <div className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2 bg-gray-200" />
      </div>

      {!intentPayload?.clientSecret && (
        <button
          onClick={handleInitializeCardPayment}
          disabled={intentBusy}
          className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm font-semibold text-gray-900 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {intentBusy ? "Preparing secure card form..." : "Pay with Card"}
        </button>
      )}

      {!stripeReady && (
        <p className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-700">
          Card payments are unavailable because Stripe publishable key is missing.
        </p>
      )}

      {stripeLoadError && (
        <p className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-700">
          {stripeLoadError}
        </p>
      )}

      {intentError && (
        <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {intentError}
        </p>
      )}

      {intentPayload?.clientSecret && stripeReady && stripePromise && !stripeLoadError && (
        <Elements stripe={stripePromise} options={elementOptions}>
          <StripeCardForm
            bookingId={intentPayload?.bookingId || bookingId}
            paymentId={intentPayload?.paymentId}
            onPaymentDone={handleCardPaymentDone}
          />
        </Elements>
      )}
    </div>
  );
}
