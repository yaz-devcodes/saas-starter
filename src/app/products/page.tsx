export default function ProductsPage() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-8 sm:py-16">
        <header className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
            Products
          </p>
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Subscription-ready SaaS starter for your next project
          </h1>
          <p className="max-w-2xl text-sm text-slate-700 sm:text-base">
            This starter gives you authenticated dashboards, subscription billing
            with Stripe test mode, and a clean layout you can adapt to real
            client work. It&apos;s intentionally small and focused so it&apos;s
            easy to extend.
          </p>
        </header>

        <section className="mt-8 grid gap-6 rounded-2xl border border-slate-200 bg-white p-6 sm:grid-cols-2 sm:p-8">
          <div className="space-y-2">
            <h2 className="text-sm font-semibold text-slate-900">
              Starter subscription dashboard
            </h2>
            <p className="text-sm text-slate-700">
              Includes GitHub login, a protected dashboard, and a dedicated
              billing area. The data model is wired up with Prisma and PostgreSQL
              so you can start modeling your own domain immediately.
            </p>
          </div>
          <div className="space-y-2">
            <h2 className="text-sm font-semibold text-slate-900">
              Ideal for client projects
            </h2>
            <p className="text-sm text-slate-700">
              This is the kind of foundation you can show in Upwork proposals to
              demonstrate experience with auth, Stripe, and real-world SaaS
              structure.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}

