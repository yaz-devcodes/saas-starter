import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { stripe } from "@/lib/stripe";

const PLAN_PRICE_ENV: Record<string, string | undefined> = {
  free: undefined,
  hobby: process.env.STRIPE_PRICE_ID,
  pro: process.env.STRIPE_PRICE_ID_PRO,
};

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.email) {
    return NextResponse.redirect(
      `${process.env.NEXTAUTH_URL ?? ""}/api/auth/signin?callbackUrl=/account`,
      { status: 302 },
    );
  }

  if (!process.env.NEXTAUTH_URL) {
    return new NextResponse(
      "Missing NEXTAUTH_URL. Set it to your site URL (e.g. http://localhost:3000).",
      { status: 500 },
    );
  }

  const formData = await request.formData().catch(() => undefined);
  const requestedTier = (formData?.get("tier") as string | null) ?? "hobby";
  const priceId = PLAN_PRICE_ENV[requestedTier] ?? PLAN_PRICE_ENV.hobby;

  if (!priceId) {
    return new NextResponse(
      "No Stripe price configured for this plan. Set STRIPE_PRICE_ID (and optionally STRIPE_PRICE_ID_PRO) in your environment.",
      { status: 500 },
    );
  }

  try {
    const checkoutSession = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      customer_email: session.user.email,
      client_reference_id: session.user.id,
      subscription_data: {
        metadata: {
          userId: session.user.id,
          tier: requestedTier,
        },
      },
      metadata: {
        userId: session.user.id,
        tier: requestedTier,
      },
      success_url: `${process.env.NEXTAUTH_URL}/account?success=1`,
      cancel_url: `${process.env.NEXTAUTH_URL}/account?canceled=1`,
    });

    if (!checkoutSession.url) {
      return new NextResponse("Stripe did not return a checkout URL.", {
        status: 500,
      });
    }

    return NextResponse.redirect(checkoutSession.url, { status: 303 });
  } catch (error) {
    console.error("Stripe checkout error", error);
    return new NextResponse("Unable to create checkout session.", {
      status: 500,
    });
  }
}

