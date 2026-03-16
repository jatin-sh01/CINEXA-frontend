import { loadStripe } from "@stripe/stripe-js";

const publishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || "";

export const stripePromise = publishableKey ? loadStripe(publishableKey) : null;

export function hasStripeKey() {
  return Boolean(publishableKey);
}

export default stripePromise;
