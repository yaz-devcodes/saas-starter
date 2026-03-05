"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signIn, signOut, useSession } from "next-auth/react";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/pricing", label: "Pricing" },
  { href: "/dashboard", label: "Dashboard" },
];

export function TopNav() {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (!menuRef.current) return;
      if (menuRef.current.contains(event.target as Node)) return;
      setMenuOpen(false);
    }

    if (menuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuOpen]);

  const isActive = (href: string) =>
    href === "/"
      ? pathname === "/"
      : pathname === href || pathname.startsWith(`${href}/`);

  const userInitial =
    session?.user?.name?.[0] ??
    session?.user?.email?.[0] ??
    session?.user?.id?.[0] ??
    "?";

  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-3 sm:px-8">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex items-center gap-1 rounded-full bg-slate-900 px-3 py-1 shadow-sm">
              <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-sky-300">
                SaaS
              </span>
              <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-50">
                Starter
              </span>
            </div>
          </Link>

          <nav className="hidden items-center gap-4 text-xs text-slate-500 sm:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`transition hover:text-slate-900 ${
                  isActive(link.href) ? "text-slate-900 font-medium" : ""
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-3">
          {status === "loading" ? (
            <span className="text-xs text-slate-500">Loading…</span>
          ) : !session ? (
            <button
              type="button"
              onClick={() => signIn("github", { callbackUrl: "/dashboard" })}
                className="inline-flex items-center justify-center rounded-full bg-slate-900 px-4 py-1.5 text-xs font-medium text-slate-50 transition hover:bg-slate-800"
            >
              Sign in with GitHub
            </button>
          ) : (
            <div ref={menuRef} className="relative flex items-center gap-3">
              <button
                type="button"
                onClick={() => setMenuOpen((open) => !open)}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-900 text-xs font-semibold text-slate-50 ring-1 ring-slate-800 hover:bg-slate-800 sm:h-9 sm:w-9"
                aria-label="Open profile menu"
              >
                {userInitial.toUpperCase()}
              </button>
              {menuOpen && (
                <div className="absolute right-0 top-10 w-48 rounded-xl border border-slate-200 bg-white p-2 text-xs shadow-lg">
                  <Link
                    href="/billing"
                    className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-slate-800 hover:bg-slate-100"
                    onClick={() => setMenuOpen(false)}
                  >
                    <span>Manage subscription</span>
                  </Link>
                  <button
                    type="button"
                    onClick={() => {
                      setMenuOpen(false);
                      void signOut({ callbackUrl: "/" });
                    }}
                    className="mt-1 flex w-full items-center justify-between rounded-lg px-3 py-2 text-slate-700 hover:bg-slate-100"
                  >
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

