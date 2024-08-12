import Stripe from "stripe";

export default async function payment({
  stripe = new Stripe(process.env.STRIPE_SECRET_KEY),
  payment_method_types = ["card"],
  customer_email,
  metadata = {},
  mode = "payment",
  success_url,
  cancel_url,
  line_items = [],
  discounts = [],
}) {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types,
      customer_email,
      metadata,
      mode,
      success_url,
      cancel_url,
      line_items,
      discounts,
    });

    return session;
  } catch (error) {
    throw new Error(`Stripe session creation failed: ${error.message}`);
  }
}
