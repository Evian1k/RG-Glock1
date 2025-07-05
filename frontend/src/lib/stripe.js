// Stripe.js loader utility
import { loadStripe } from '@stripe/stripe-js';

let stripePromise;
export const getStripe = async () => {
  if (!stripePromise) {
    const res = await fetch('/api/payment/config');
    const { publishableKey } = await res.json();
    stripePromise = loadStripe(publishableKey);
  }
  return stripePromise;
};
