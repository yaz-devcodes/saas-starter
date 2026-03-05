import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/api/auth/signin?callbackUrl=/dashboard");
  }

  const subscription = await prisma.subscription.findUnique({
    where: { userId: session.user.id },
  });

  const planLabel =
    subscription?.status === "active" || subscription?.status === "trialing"
      ? "Starter"
      : "Free";

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto max-w-5xl px-4 py-12 sm:px-8 sm:py-16">
        <header className="space-y-2">
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            Dashboard
          </h1>
          <p className="max-w-2xl text-sm text-slate-700 sm:text-base">
            Signed in as{" "}
            <span className="font-medium text-slate-900">
              {session.user?.email ?? session.user?.name ?? "Unknown"}
            </span>
            . This is your application surface; data here will be scoped to your
            account once the database is connected.
          </p>
        </header>

        <section className="mt-8 grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-4">
            <p className="text-xs font-medium text-slate-500">Current plan</p>
            <p className="mt-2 text-sm font-semibold text-slate-900">
              {planLabel}
            </p>
            <p className="mt-1 text-xs text-slate-600">
              {planLabel === "Free"
                ? "Upgrade to unlock additional features and higher limits."
                : "You have access to the full Starter feature set."}
            </p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-4">
            <p className="text-xs font-medium text-slate-500">Projects</p>
            <p className="mt-2 text-sm font-semibold text-slate-900">0</p>
            <p className="mt-1 text-xs text-slate-600">
              This section will show a quick overview of recent activity.
            </p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-4">
            <p className="text-xs font-medium text-slate-500">Status</p>
            <p className="mt-2 text-sm font-semibold text-emerald-600">
              All systems nominal
            </p>
            <p className="mt-1 text-xs text-slate-600">
              A placeholder area for status and notifications.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}


