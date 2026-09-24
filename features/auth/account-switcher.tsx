"use client";

import { usePathname, useRouter } from "next/navigation";
import { useState, type ChangeEvent } from "react";

import { evaluateRouteAccess } from "@/features/access-control/policy";
import { useDemoSession } from "@/features/auth/session/session-provider";
import type { DemoUserId } from "@/features/auth/types";
import { DEMO_USERS } from "@/mocks/users";

export function AccountSwitcher() {
  const pathname = usePathname();
  const router = useRouter();
  const { state, switchIdentity } = useDemoSession();
  const [error, setError] = useState<string | null>(null);

  if (state.status !== "authenticated") return null;

  async function onChange(event: ChangeEvent<HTMLSelectElement>) {
    const userId = event.target.value as DemoUserId;
    const identity = DEMO_USERS.find((user) => user.id === userId);
    if (!identity) {
      setError("That demo identity is unavailable.");
      return;
    }
    const switched = await switchIdentity(identity.id);
    if (!switched.ok) {
      setError(switched.error.message);
      return;
    }
    setError(null);
    if (!evaluateRouteAccess(identity.role, pathname).allowed) {
      router.replace("/");
    }
  }

  return (
    <div className="space-y-1">
      <label className="text-sm font-medium" htmlFor="demo-account-switcher">
        Demo account
      </label>
      <select
        className="border-input bg-background rounded-lg border px-3 py-2 text-sm"
        id="demo-account-switcher"
        onChange={(event) => void onChange(event)}
        value={state.identity.id}
      >
        {DEMO_USERS.map((identity) => (
          <option key={identity.id} value={identity.id}>
            {identity.displayName} ({identity.role})
          </option>
        ))}
      </select>
      {error ? (
        <p className="text-destructive text-sm" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
