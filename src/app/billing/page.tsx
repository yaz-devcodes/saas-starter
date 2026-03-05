import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

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
    tierValue: "free",
  },
  {
    id: "hobby",
    name: "Hobby",
    price: "$19",
    period: "month",
    description: "For small side projects that need real billing.",
    features: [
      "Everything in Free",
      "Up to 5 projects",
      "Stripe-powered subscription",
      "Email support",
    ],
    tierValue: "hobby",
    highlighted: true,
  },
  {
    id: "pro",
    name: "Pro",
    price: "$49",
    period: "month",
    description: "For teams and production apps with higher usage.",
    features: [
      "Everything in Hobby",
      "Unlimited projects",
      "Team access",
      "Priority support",
    ],
    tierValue: "pro",
  },
];

interface BillingSearchParams {
  success?: string;
  canceled?: string;
}

export default async function BillingPage(props: {
  searchParams: Promise<BillingSearchParams>;
}) {
  const searchParams = await props.searchParams;
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/api/auth/signin?callbackUrl=/billing");
  }

  const subscription = await prisma.subscription.findUnique({
    where: { userId: session.user.id },
  });

  const currentTier = subscription?.tier ?? "free";

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto max-w-5xl px-4 py-12 sm:px-8 sm:py-16">
        <header className="space-y-2">
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            Billing &amp; Plan
          </h1>
          <p className="max-w-2xl text-sm text-slate-700 sm:text-base">
            Manage your current subscription and change plans.
          </p>
        </header>

        {searchParams?.success && (
          <div className="mt-6 rounded-xl border border-emerald-500/40 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
            Payment successful in Stripe test mode.
          </div>
        )}
        {searchParams?.canceled && (
          <div className="mt-6 rounded-xl border border-amber-500/40 bg-amber-50 px-4 py-3 text-sm text-amber-700">
            Checkout canceled. You can try changing plans again at any time.
          </div>
        )}

        <section className="mt-8 grid gap-6 md:grid-cols-[2fr,1fr]">
          <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6">
            <h2 className="text-sm font-semibold text-slate-900">
              Available plans
            </h2>

            <div className="mt-4 grid gap-4 md:grid-cols-3">
              {tiers.map((tier) => {
                const isCurrent = currentTier === tier.tierValue;
                return (
                  <article
                    key={tier.id}
                    className={`flex flex-col rounded-xl border bg-white p-4 text-xs shadow-sm ${
                      tier.highlighted
                        ? "border-slate-900 ring-1 ring-slate-900/10"
                        : "border-slate-200"
                    }`}
                  >
                    <div className="space-y-1">
                      <h3 className="text-sm font-semibold text-slate-900">
                        {tier.name}
                      </h3>
                      {isCurrent && (
                        <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-emerald-600">
                          Current plan
                        </p>
                      )}
                      <p className="text-[11px] text-slate-600">
                        {tier.description}
                      </p>
                    </div>
                    <div className="mt-3 flex items-baseline gap-1">
                      <p className="text-xl font-semibold text-slate-900">
                        {tier.price}
                      </p>
                      <span className="text-[11px] font-normal text-slate-500">
                        / {tier.period}
                      </span>
                    </div>
                    <ul className="mt-3 space-y-1 text-[11px] text-slate-700">
                      {tier.features.map((feature) => (
                        <li key={feature}>• {feature}</li>
                      ))}
                    </ul>
                    <div className="mt-4">
                      {tier.id === "free" ? (
                        <span className="inline-flex w-full items-center justify-center rounded-full border border-slate-300 px-3 py-1.5 text-[11px] font-medium text-slate-700">
                          {isCurrent ? "Current plan" : "Included"}
                        </span>
                      ) : (
                        <form
                          action="/api/billing/checkout"
                          method="POST"
                          className="w-full"
                        >
                          <input
                            type="hidden"
                            name="tier"
                            value={tier.tierValue}
                          />
                          <button
                            type="submit"
                            disabled={isCurrent}
                            className={`inline-flex w-full items-center justify-center rounded-full px-3 py-1.5 text-[11px] font-medium transition ${
                              tier.highlighted
                                ? "bg-slate-900 text-slate-50 hover:bg-slate-800 disabled:bg-slate-300 disabled:text-slate-600"
                                : "border border-slate-300 text-slate-800 hover:border-slate-400 hover:bg-slate-50 disabled:bg-slate-100 disabled:text-slate-500"
                            }`}
                          >
                            {isCurrent ? "Current plan" : "Change to this plan"}
                          </button>
                        </form>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
          </div>

          <aside className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 text-sm">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-500">
                Current status
              </p>
              <p className="mt-2 text-sm font-semibold text-slate-900">
                {currentTier === "hobby"
                  ? "Hobby plan"
                  : currentTier === "pro"
                  ? "Pro plan"
                  : "Free plan"}
              </p>
            </div>
          </aside>
        </section>
      </div>
    </main>
  );
}

