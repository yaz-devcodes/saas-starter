"use client";

import { useState } from "react";
import { signOut } from "next-auth/react";

export function AccountActions() {
  const [deleteInput, setDeleteInput] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  return (
    <div className="space-y-4 border-t border-slate-200 pt-4">
      <div className="space-y-2">
        <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
          Account actions
        </h3>
        <button
          type="button"
          onClick={() => {
            void signOut({ callbackUrl: "/" });
          }}
          className="inline-flex items-center justify-center rounded-full border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-800 transition hover:border-slate-400 hover:bg-slate-50"
        >
          Logout
        </button>
      </div>

      <div className="space-y-2 rounded-xl border border-red-200 bg-red-50 p-3">
        <p className="text-xs font-semibold text-red-700">Danger zone</p>
        <p className="text-[11px] text-red-700">
          Deleting your account will remove your user data and any active
          subscription. This action cannot be undone.
        </p>
        <p className="text-[11px] text-red-700">
          To confirm, type{" "}
          <span className="font-semibold text-red-800">Agree</span> and click
          Confirm.
        </p>
        <input
          type="text"
          value={deleteInput}
          onChange={(event) => setDeleteInput(event.target.value)}
          className="mt-2 w-full rounded-md border border-red-200 px-2 py-1.5 text-xs text-red-900 outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
          placeholder="Type Agree to confirm"
        />
        <div className="mt-2 flex justify-end">
          <button
            type="button"
            disabled={deleteInput !== "Agree" || isDeleting}
            onClick={async () => {
              if (deleteInput !== "Agree") {
                return;
              }
              try {
                setIsDeleting(true);
                const response = await fetch("/api/account/delete", {
                  method: "POST",
                });
                if (!response.ok) {
                  // eslint-disable-next-line no-console
                  console.error("Failed to delete account");
                }
              } finally {
                setIsDeleting(false);
                setDeleteInput("");
                void signOut({ callbackUrl: "/" });
              }
            }}
            className="inline-flex items-center justify-center rounded-full bg-red-600 px-3 py-1.5 text-xs font-medium text-white transition enabled:hover:bg-red-700 disabled:bg-red-300"
          >
            {isDeleting ? "Deleting..." : "Confirm"}
          </button>
        </div>
      </div>
    </div>
  );
}

