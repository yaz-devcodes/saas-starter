import Stripe from "stripe";

if (!process.env.STRIPE_SECRET_KEY) {
  // We don't throw here to avoid build-time crashes on environments without Stripe configured.
  // The API route that uses Stripe will validate and return a 500 with a helpful message instead.
  // eslint-disable-next-line no-console
  console.warn("STRIPE_SECRET_KEY is not set. Stripe checkout will not work.");
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? "", {
  apiVersion: "2024-06-20",
});

