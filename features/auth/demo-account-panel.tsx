"use client";

import Link from "next/link";

import { AccountSwitcher } from "@/features/auth/account-switcher";
import { useDemoSession } from "@/features/auth/session/session-provider";

export function DemoAccountPanel() {
  const { logout, state } = useDemoSession();

  if (state.status === "initializing") {
    return (
      <p className="text-muted-foreground text-sm" role="status">
        Restoring the local demo session…
      </p>
    );
  }

  if (state.status === "anonymous") {
    return (
      <div className="flex flex-wrap gap-3">
        <Link
          className="bg-primary text-primary-foreground rounded-lg px-4 py-2 font-medium"
          href="/login"
        >
          Open demo login
        </Link>
        <Link
          className="border-input rounded-lg border px-4 py-2 font-medium"
          href="/signup"
        >
          Try simulated sign-up
        </Link>
      </div>
    );
  }

  return (
    <section
      aria-label="Current demo account"
      className="border-border bg-card space-y-4 rounded-xl border p-4"
    >
      <p className="text-sm">
        Signed in locally as <strong>{state.identity.displayName}</strong>.
        Role:{" "}
        <span className="bg-secondary text-secondary-foreground rounded-full px-2 py-1 font-medium">
          {state.identity.role}
        </span>
      </p>
      <div className="flex flex-wrap items-end gap-3">
        <AccountSwitcher />
        <button
          className="border-input rounded-lg border px-3 py-2 text-sm font-medium"
          onClick={() => void logout()}
          type="button"
        >
          Log out
        </button>
      </div>
    </section>
  );
}
