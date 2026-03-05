import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";

function formatPrice(amount: number | null | undefined, currency: string) {
  if (amount == null) return "$0";
  const value = (amount / 100).toFixed(0);
  const upper = currency.toUpperCase();
  return `${upper === "USD" ? "$" : ""}${value}`;
}

export default async function PricingPage() {
  const session = await getServerSession(authOptions);

  let currentTier: string | null = null;

  if (session?.user?.id) {
    const subscription = await prisma.subscription.findUnique({
      where: { userId: session.user.id },
    });
    currentTier = subscription?.tier ?? null;
  }

  const hobbyPriceId = process.env.STRIPE_PRICE_ID;
  const proPriceId = process.env.STRIPE_PRICE_ID_PRO;

  const [hobbyPrice, proPrice] = await Promise.all([
    hobbyPriceId ? stripe.prices.retrieve(hobbyPriceId) : null,
    proPriceId ? stripe.prices.retrieve(proPriceId) : null,
  ]);

  const tiers = [
    {
      id: "free",
      name: "Free",
      price: "$0",
      period: "month",
      description: "Get started with a basic dashboard and GitHub login.",
      features: [
        "GitHub authentication",
        "Access to main dashboard",
        "Up to 1 project",
      ],
      ctaLabel: "Start for free",
      tierValue: "free",
    },
    {
      id: "hobby",
      name: "Hobby",
      price: formatPrice(
        typeof hobbyPrice?.unit_amount === "number"
          ? hobbyPrice.unit_amount
          : null,
        hobbyPrice?.currency ?? "usd",
      ),
      period: "month",
      description: "For small side projects that need real billing.",
      features: [
        "Everything in Free",
        "Up to 5 projects",
        "Stripe-powered subscription",
        "Email support",
      ],
      ctaLabel: "Choose Hobby",
      tierValue: "hobby",
      highlighted: true,
    },
    {
      id: "pro",
      name: "Pro",
      price: formatPrice(
        typeof proPrice?.unit_amount === "number" ? proPrice.unit_amount : null,
        proPrice?.currency ?? "usd",
      ),
      period: "month",
      description: "For teams and production apps with higher usage.",
      features: [
        "Everything in Hobby",
        "Unlimited projects",
        "Team access",
        "Priority support",
      ],
      ctaLabel: "Choose Pro",
      tierValue: "pro",
    },
  ];

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto max-w-5xl px-4 py-12 sm:px-8 sm:py-16">
        <header className="space-y-3 text-center sm:text-left">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
            Pricing
          </p>
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Simple pricing for serious side projects
          </h1>
          <p className="mx-auto max-w-2xl text-sm text-slate-700 sm:mx-0 sm:text-base">
            Start for free, then upgrade when you&apos;re ready to add billing
            and higher limits. All plans run through Stripe in test mode for this
            starter.
          </p>
        </header>

        <section className="mt-10 grid gap-6 md:grid-cols-3">
          {tiers.map((tier) => {
            const isCurrent = currentTier === tier.tierValue;
            return (
            <article
              key={tier.id}
              className={`flex flex-col rounded-2xl border bg-white p-6 text-sm shadow-sm ${
                tier.highlighted
                  ? "border-slate-900 ring-1 ring-slate-900/10"
                  : "border-slate-200"
              }`}
            >
              <div className="space-y-1">
                <h2 className="text-sm font-semibold text-slate-900">
                  {tier.name}
                </h2>
                {isCurrent && (
                  <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-emerald-600">
                    Current plan
                  </p>
                )}
                <p className="text-xs text-slate-600">{tier.description}</p>
              </div>
              <div className="mt-4 flex items-baseline gap-1">
                <p className="text-3xl font-semibold text-slate-900">
                  {tier.price}
                </p>
                <span className="text-xs font-normal text-slate-500">
                  / {tier.period}
                </span>
              </div>
              <ul className="mt-4 space-y-1 text-xs text-slate-700">
                {tier.features.map((feature) => (
                  <li key={feature}>• {feature}</li>
                ))}
              </ul>

              <div className="mt-5">
                {tier.id === "free" ? (
                  <a
                    href="/app"
                    className="inline-flex w-full items-center justify-center rounded-full border border-slate-300 px-4 py-2 text-xs font-medium text-slate-800 transition hover:border-slate-400 hover:bg-slate-50"
                  >
                    {tier.ctaLabel}
                  </a>
                ) : (
                  <form
                    action="/api/billing/checkout"
                    method="POST"
                    className="w-full"
                  >
                    <input type="hidden" name="tier" value={tier.tierValue} />
                    <button
                      type="submit"
                      disabled={isCurrent}
                      className={`inline-flex w-full items-center justify-center rounded-full px-4 py-2 text-xs font-medium transition ${
                        tier.highlighted
                          ? "bg-slate-900 text-slate-50 hover:bg-slate-800 disabled:bg-slate-300 disabled:text-slate-600"
                          : "border border-slate-300 text-slate-800 hover:border-slate-400 hover:bg-slate-50 disabled:bg-slate-100 disabled:text-slate-500"
                      }`}
                    >
                      {isCurrent ? "Current plan" : tier.ctaLabel}
                    </button>
                  </form>
                )}
              </div>
            </article>
          );
          })}
        </section>
      </div>
    </main>
  );
}

