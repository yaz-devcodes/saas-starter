import { headers } from "next/headers";
import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

async function upsertSubscriptionFromStripe(args: {
  stripeSubId: string;
  userId?: string | null;
  customerEmail?: string | null;
  priceId?: string | null;
  status: string;
  currentPeriodStart?: number | null;
  currentPeriodEnd?: number | null;
  tier?: string | null;
}) {
  const {
    stripeSubId,
    userId,
    customerEmail,
    priceId,
    status,
    currentPeriodStart,
    currentPeriodEnd,
    tier,
  } = args;

  let user = null;

  if (userId) {
    user = await prisma.user.findUnique({ where: { id: userId } });
  }

  if (!user && customerEmail) {
    user = await prisma.user.findUnique({ where: { email: customerEmail } });
  }

  if (!user) {
    console.warn(
      "Stripe webhook: could not find user for subscription",
      stripeSubId,
    );
    return;
  }

  await prisma.subscription.upsert({
    where: { userId: user.id },
    update: {
      stripeSubId,
      stripePriceId: priceId ?? undefined,
      status,
      tier: tier ?? undefined,
      currentPeriodStart: currentPeriodStart
        ? new Date(currentPeriodStart * 1000)
        : null,
      currentPeriodEnd: currentPeriodEnd
        ? new Date(currentPeriodEnd * 1000)
        : null,
    },
    create: {
      userId: user.id,
      stripeSubId,
      stripePriceId: priceId ?? undefined,
      status,
      tier: tier ?? undefined,
      currentPeriodStart: currentPeriodStart
        ? new Date(currentPeriodStart * 1000)
        : null,
      currentPeriodEnd: currentPeriodEnd
        ? new Date(currentPeriodEnd * 1000)
        : null,
    },
  });
}

async function downgradeSubscriptionToFreeFromStripe(
  subscription: Stripe.Subscription,
) {
  const userId = subscription.metadata.userId as string | undefined;

  if (userId) {
    await prisma.subscription.updateMany({
      where: { userId },
      data: {
        stripeSubId: null,
        stripePriceId: null,
        status: "free",
        tier: "free",
        currentPeriodStart: null,
        currentPeriodEnd: null,
      },
    });
  } else {
    await prisma.subscription.updateMany({
      where: { stripeSubId: subscription.id },
      data: {
        stripeSubId: null,
        stripePriceId: null,
        status: "free",
        tier: "free",
        currentPeriodStart: null,
        currentPeriodEnd: null,
      },
    });
  }
}

export async function POST(req: Request) {
  const body = await req.text();
  const hdrs = await headers();
  const sig = hdrs.get("stripe-signature");

  if (!sig || !process.env.STRIPE_WEBHOOK_SECRET) {
    return new NextResponse("Webhook signature or secret missing", {
      status: 400,
    });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET,
    );
  } catch (err) {
    console.error("Stripe webhook signature verification failed", err);
    return new NextResponse("Invalid signature", { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const subId = session.subscription as string | null;

        if (subId) {
          const subscription = await stripe.subscriptions.retrieve(subId);
          const firstItem = subscription.items.data[0];

          await upsertSubscriptionFromStripe({
            stripeSubId: subscription.id,
            userId:
              (subscription.metadata.userId as string | undefined) ??
              (session.client_reference_id ?? undefined),
            customerEmail:
              session.customer_email ??
              session.customer_details?.email ??
              null,
            priceId: firstItem?.price.id ?? null,
            status: subscription.status,
            currentPeriodStart: subscription.current_period_start,
            currentPeriodEnd: subscription.current_period_end,
            tier:
              (subscription.metadata.tier as string | undefined) ??
              (session.metadata?.tier as string | undefined) ??
              null,
          });
        }
        break;
      }
      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;
        const firstItem = subscription.items.data[0];

        if (subscription.status === "canceled") {
          await downgradeSubscriptionToFreeFromStripe(subscription);
          break;
        }

        await upsertSubscriptionFromStripe({
          stripeSubId: subscription.id,
          userId: (subscription.metadata.userId as string | undefined) ?? null,
          customerEmail: null,
          priceId: firstItem?.price.id ?? null,
          status: subscription.status,
          currentPeriodStart: subscription.current_period_start,
          currentPeriodEnd: subscription.current_period_end,
          tier: (subscription.metadata.tier as string | undefined) ?? null,
        });
        break;
      }
      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        await downgradeSubscriptionToFreeFromStripe(subscription);
        break;
      }
      default:
        // Ignore other event types for this starter.
        break;
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Error handling Stripe webhook", error);
    return new NextResponse("Webhook handler error", { status: 500 });
  }
}

