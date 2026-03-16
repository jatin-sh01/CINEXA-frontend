import { getToken, post, setToken } from "../api";
import { loadToken } from "../utils/storage";

const PAYMENT_STATE_KEY = "cinexa_pending_payment";

function getAuthTokenOrThrow() {
  const inMemoryToken = getToken();
  if (inMemoryToken) return inMemoryToken;

  const persistedToken = loadToken();
  if (persistedToken) {
    setToken(persistedToken);
    return persistedToken;
  }

  const err = new Error("Please log in to continue payment.");
  err.status = 401;
  throw err;
}

function normalizePaymentError(error, fallbackMessage) {
  if (error?.status === 401) {
    return "Your session has expired. Please log in again.";
  }

  if (error?.status === 403) {
    return "You are not allowed to pay for this booking.";
  }

  if (error?.status === 404) {
    return "Booking was not found.";
  }

  if (error?.status === 409) {
    return "This booking is already paid.";
  }

  if (error?.status === 410) {
    return "This booking has expired. Please create a new booking.";
  }

  return error?.message || fallbackMessage;
}

export async function createStripeCheckoutSession(bookingId) {
  getAuthTokenOrThrow();

  try {
    const response = await post("/api/payments/create-checkout-session", {
      bookingId,
    });
    return response?.data;
  } catch (error) {
    throw new Error(
      normalizePaymentError(error, "Failed to create Stripe checkout session."),
    );
  }
}

export async function createStripePaymentIntent(bookingId) {
  getAuthTokenOrThrow();

  try {
    const response = await post("/api/payments/create-payment-intent", {
      bookingId,
    });
    return response?.data;
  } catch (error) {
    throw new Error(
      normalizePaymentError(error, "Failed to initialize card payment."),
    );
  }
}

export async function confirmStripeCheckoutSession(sessionId) {
  getAuthTokenOrThrow();

  try {
    const response = await post("/api/payments/confirm-checkout-session", {
      sessionId,
    });
    return response?.data;
  } catch (error) {
    throw new Error(
      normalizePaymentError(error, "Failed to verify Stripe checkout payment."),
    );
  }
}

export async function confirmStripePaymentIntent(paymentIntentId) {
  getAuthTokenOrThrow();

  try {
    const response = await post("/api/payments/confirm-payment-intent", {
      paymentIntentId,
    });
    return response?.data;
  } catch (error) {
    throw new Error(
      normalizePaymentError(error, "Failed to verify Stripe card payment."),
    );
  }
}

export async function reconcileStripeBookingStatus(bookingId) {
  getAuthTokenOrThrow();

  try {
    const response = await post("/api/payments/reconcile-booking-status", {
      bookingId,
    });
    return response?.data;
  } catch (error) {
    throw new Error(
      normalizePaymentError(error, "Failed to reconcile booking status."),
    );
  }
}

export function savePendingPayment(data) {
  if (!data) return;
  sessionStorage.setItem(PAYMENT_STATE_KEY, JSON.stringify(data));
}

export function loadPendingPayment() {
  const raw = sessionStorage.getItem(PAYMENT_STATE_KEY);
  if (!raw) return null;

  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function clearPendingPayment() {
  sessionStorage.removeItem(PAYMENT_STATE_KEY);
}
