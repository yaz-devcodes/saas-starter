import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";

export async function POST() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.redirect(
      `${process.env.NEXTAUTH_URL ?? ""}/api/auth/signin?callbackUrl=/account`,
      { status: 302 },
    );
  }

  const subscription = await prisma.subscription.findUnique({
    where: { userId: session.user.id },
  });

  if (subscription?.stripeSubId) {
    try {
      await stripe.subscriptions.cancel(subscription.stripeSubId);
    } catch (error) {
      console.error("Error cancelling Stripe subscription", error);
    }
  }

  await prisma.subscription.update({
    where: { userId: session.user.id },
    data: {
      stripeSubId: null,
      stripePriceId: null,
      status: "free",
      currentPeriodEnd: null,
    },
  }).catch(async () => {
    // If no existing row, create a free-tier record
    await prisma.subscription.create({
      data: {
        userId: session.user.id,
        status: "free",
        stripeSubId: null,
        stripePriceId: null,
      },
    });
  });

  return NextResponse.redirect(
    `${process.env.NEXTAUTH_URL ?? ""}/account?success=1`,
    { status: 303 },
  );
}

