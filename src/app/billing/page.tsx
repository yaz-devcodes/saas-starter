import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";

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

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto max-w-5xl px-4 py-12 sm:px-8 sm:py-16">
        <header className="space-y-2">
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            Billing &amp; Plan
          </h1>
          <p className="max-w-2xl text-sm text-slate-700 sm:text-base">
            This page is where users manage their subscription. The Starter plan
            uses a Stripe test-mode checkout flow and will later reflect real
            subscription status.
          </p>
        </header>

        {searchParams?.success && (
          <div className="mt-6 rounded-xl border border-emerald-500/40 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
            Payment successful in Stripe test mode. In a real app, this is where
            your subscription status would be updated from a webhook.
          </div>
        )}
        {searchParams?.canceled && (
          <div className="mt-6 rounded-xl border border-amber-500/40 bg-amber-50 px-4 py-3 text-sm text-amber-700">
            Checkout canceled. You can try upgrading again at any time.
          </div>
        )}

        <section className="mt-8 grid gap-6 md:grid-cols-[2fr,1fr]">
          <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6">
            <h2 className="text-sm font-semibold text-slate-900">Starter plan</h2>
            <p className="text-3xl font-semibold text-slate-900">
              $19{" "}
              <span className="align-middle text-xs font-normal text-slate-500">
                / month
              </span>
            </p>
            <ul className="mt-2 space-y-1 text-sm text-slate-700">
              <li>• Access to the main dashboard</li>
              <li>• Higher limits for projects and events</li>
              <li>• Priority support</li>
            </ul>
            <form
              action="/api/billing/checkout"
              method="POST"
              className="mt-4"
            >
              <button
                type="submit"
                className="inline-flex items-center justify-center rounded-full bg-slate-900 px-6 py-2 text-sm font-medium text-slate-50 transition hover:bg-slate-800"
              >
                Upgrade to Starter (Stripe test mode)
              </button>
            </form>
          </div>

          <aside className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 text-sm">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-500">
                Current status
              </p>
              <p className="mt-2 text-sm font-semibold text-slate-900">
                Free plan
              </p>
              <p className="mt-1 text-xs text-slate-700">
                When Stripe is connected, this section will show the user&apos;s
                active subscription and renewal date.
              </p>
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-500">
                Implementation notes
              </p>
              <p className="mt-2 text-xs text-slate-700">
                The next steps are to integrate Stripe Checkout for the upgrade
                button, handle webhooks to update subscription status, and expose
                this information in the dashboard.
              </p>
            </div>
          </aside>
        </section>
      </div>
    </main>
  );
}


