import Link from "next/link";

const signInUrl = (callback: string) =>
  `/api/auth/signin?callbackUrl=${encodeURIComponent(callback)}`;

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto flex min-h-screen max-w-4xl flex-col gap-12 px-4 pb-16 pt-10 sm:px-8 sm:pt-14">
        <header className="space-y-6 rounded-3xl border border-slate-200 bg-white px-6 py-10 shadow-sm sm:px-10 sm:py-14">
          <p className="text-sm font-medium uppercase tracking-[0.25em] text-slate-500">
            SaaS Starter
          </p>
          <div className="space-y-4">
            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              A small, focused{" "}
              <span className="text-sky-600">Next.js subscription dashboard</span>{" "}
              you can adapt to real SaaS products.
            </h1>
            <p className="max-w-2xl text-sm text-slate-700 sm:text-base">
              This project demonstrates how to structure a SaaS application with
              authentication, a protected dashboard, and a dedicated billing area
              ready for a Stripe-powered subscription flow.
            </p>
          </div>

          <div className="flex flex-col gap-4 sm:flex-row">
            <a
              href={signInUrl("/dashboard")}
              className="inline-flex items-center justify-center rounded-full bg-slate-900 px-6 py-2 text-sm font-medium text-slate-50 transition hover:bg-slate-800"
            >
              Sign in to dashboard
            </a>
            <a
              href={signInUrl("/billing")}
              className="inline-flex items-center justify-center rounded-full border border-slate-300 px-6 py-2 text-sm font-medium text-slate-800 transition hover:border-slate-400 hover:bg-slate-50"
            >
              Manage billing
            </a>
          </div>
        </header>

        <section className="grid gap-6 rounded-2xl border border-slate-200 bg-white p-6 sm:grid-cols-3 sm:p-8">
          <div className="space-y-1">
            <p className="text-xs font-medium text-slate-500">Auth ready</p>
            <p className="text-sm font-semibold text-slate-900">
              Designed for email + OAuth sign-in
            </p>
            <p className="text-xs text-slate-600">
              The layout and routing are set up for a future auth layer that
              protects the dashboard.
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-xs font-medium text-slate-500">Billing surface</p>
            <p className="text-sm font-semibold text-slate-900">
              Dedicated billing route
            </p>
            <p className="text-xs text-slate-600">
              A clear place to plug in Stripe Checkout and subscription status.
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-xs font-medium text-slate-500">Extendable</p>
            <p className="text-sm font-semibold text-slate-900">
              Dashboard-first structure
            </p>
            <p className="text-xs text-slate-600">
              The dashboard layout is ready to receive real metrics and project
              data.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
