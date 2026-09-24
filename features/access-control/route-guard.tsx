"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, type ReactNode } from "react";

import {
  evaluateRouteAccess,
  type RouteAccessDecision,
} from "@/features/access-control/policy";
import { AccessDenied } from "@/features/access-control/access-denied";
import {
  useDemoSession,
  type DemoSessionState,
} from "@/features/auth/session/session-provider";

export type RouteGuardDecision =
  | { kind: "allowed" }
  | { kind: "denied"; reason: "forbidden" | "unknown-route" }
  | { kind: "loading" }
  | { href: string; kind: "redirect" };

function redirectToLogin(pathname: string) {
  return `/login?next=${encodeURIComponent(pathname)}`;
}

export function decideRouteGuard(
  state: DemoSessionState,
  pathname: string,
): RouteGuardDecision {
  if (state.status === "initializing") return { kind: "loading" };

  const access: RouteAccessDecision = evaluateRouteAccess(
    state.status === "authenticated" ? state.identity.role : null,
    pathname,
  );
  if (access.allowed) return { kind: "allowed" };
  if (access.reason === "anonymous") {
    return { kind: "redirect", href: redirectToLogin(pathname) };
  }
  return { kind: "denied", reason: access.reason };
}

export function RouteGuard({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { state } = useDemoSession();
  const decision = decideRouteGuard(state, pathname);

  useEffect(() => {
    if (decision.kind === "redirect") router.replace(decision.href);
  }, [decision, router]);

  if (decision.kind === "loading") {
    return (
      <main
        aria-busy="true"
        className="grid min-h-screen place-items-center px-6"
      >
        <p className="text-muted-foreground" role="status">
          Restoring the local demo session…
        </p>
      </main>
    );
  }
  if (decision.kind === "redirect") {
    return (
      <main className="grid min-h-screen place-items-center px-6">
        <p className="text-muted-foreground" role="status">
          Opening demo login…
        </p>
      </main>
    );
  }
  if (decision.kind === "denied") {
    return (
      <main>
        <AccessDenied reason={decision.reason} />
      </main>
    );
  }
  return children;
}
