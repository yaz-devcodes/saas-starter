import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";

export async function POST() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.redirect(
      `${process.env.NEXTAUTH_URL ?? ""}/api/auth/signin?callbackUrl=/`,
      { status: 302 },
    );
  }

  const userId = session.user.id;

  const subscription = await prisma.subscription.findUnique({
    where: { userId },
  });

  if (subscription?.stripeSubId) {
    try {
      await stripe.subscriptions.cancel(subscription.stripeSubId);
    } catch (error) {
      console.error("Error cancelling Stripe subscription during account delete", error);
    }
  }

  try {
    await prisma.$transaction([
      prisma.session.deleteMany({ where: { userId } }),
      prisma.account.deleteMany({ where: { userId } }),
      prisma.subscription.deleteMany({ where: { userId } }),
      prisma.user.delete({ where: { id: userId } }),
    ]);
  } catch (error) {
    console.error("Error deleting user account", error);
    return new NextResponse("Failed to delete account", { status: 500 });
  }

  return new NextResponse(null, { status: 200 });
}

