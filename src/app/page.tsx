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
              Production-ready{" "}
              <span className="text-sky-600">Next.js SaaS starter</span> with
              auth, billing, and an app shell.
            </h1>
            <p className="max-w-2xl text-sm text-slate-700 sm:text-base">
              This project shows how to assemble the pieces of a real SaaS:
              GitHub authentication, a protected app surface, and Stripe-backed
              subscriptions wired to a PostgreSQL database.
            </p>
          </div>

          <div className="flex flex-col gap-4 sm:flex-row">
            <a
              href={signInUrl("/app")}
              className="inline-flex items-center justify-center rounded-full bg-slate-900 px-6 py-2 text-sm font-medium text-slate-50 transition hover:bg-slate-800"
            >
              Sign in to app
            </a>
            <a
              href="/pricing"
              className="inline-flex items-center justify-center rounded-full border border-slate-300 px-6 py-2 text-sm font-medium text-slate-800 transition hover:border-slate-400 hover:bg-slate-50"
            >
              View pricing
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
              The layout and routing are wired to NextAuth so only authenticated
              users can access the main app.
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-xs font-medium text-slate-500">Billing surface</p>
            <p className="text-sm font-semibold text-slate-900">
              Stripe-powered subscription flow
            </p>
            <p className="text-xs text-slate-600">
              A clear place to plug in Stripe Checkout, subscriptions, and plan
              management.
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-xs font-medium text-slate-500">Extendable</p>
            <p className="text-sm font-semibold text-slate-900">
              App shell you can adapt
            </p>
            <p className="text-xs text-slate-600">
              The application shell is intentionally minimal so you can plug in
              your actual product components.
            </p>
          </div>
        </section>

        <section className="grid gap-4 rounded-2xl border border-dashed border-slate-300 bg-slate-100/60 p-6 sm:p-8">
          <h2 className="text-sm font-semibold text-slate-900">
            Demo area (placeholder)
          </h2>
          <p className="text-sm text-slate-700">
            This section is reserved for a future interactive demo of the main
            application. For now, it simply explains that guests could be given
            limited, read-only access to the app experience without creating a
            real account.
          </p>
          <p className="text-xs text-slate-600">
            In a client project, this might be a safe, sandboxed view of the
            app so prospects can explore the interface before signing up.
          </p>
        </section>
      </div>
    </main>
  );
}
