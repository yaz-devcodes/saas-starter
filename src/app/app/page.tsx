import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";

export default async function AppPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/api/auth/signin?callbackUrl=/app");
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto max-w-5xl px-4 py-12 sm:px-8 sm:py-16">
        <header className="space-y-2">
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            App home
          </h1>
          <p className="max-w-2xl text-sm text-slate-700 sm:text-base">
            This is the main surface for your SaaS product. Replace the sections
            below with your own components and data.
          </p>
        </header>

        <section className="mt-8 grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-4">
            <h2 className="text-sm font-semibold text-slate-900">
              Primary workspace area
            </h2>
            <p className="mt-2 text-xs text-slate-600">
              Use this card for your main product experience, such as an editor,
              board, or dashboard specific to your app domain.
            </p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-4">
            <h2 className="text-sm font-semibold text-slate-900">
              Secondary panel
            </h2>
            <p className="mt-2 text-xs text-slate-600">
              A good place for recent activity, navigation, or contextual
              details that support the primary workspace.
            </p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-4">
            <h2 className="text-sm font-semibold text-slate-900">
              Custom widget
            </h2>
            <p className="mt-2 text-xs text-slate-600">
              Add any additional widget here: quick actions, shortcuts, or
              anything that helps users get to value faster.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}

