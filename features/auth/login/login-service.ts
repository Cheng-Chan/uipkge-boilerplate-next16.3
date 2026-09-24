import { z } from "zod";

import type { DemoIdentity, DemoRole } from "@/features/auth/types";
import { evaluateRouteAccess } from "@/features/access-control/policy";
import {
  serviceFailure,
  serviceSuccess,
  type ServiceResult,
} from "@/lib/service-result";
import { DEMO_USERS, PUBLIC_DEMO_CREDENTIALS } from "@/mocks/users";

export const loginInputSchema = z
  .object({
    username: z.string().trim().min(1, "Enter a demo username.").max(80),
    password: z.string().min(1, "Enter a demo password.").max(200),
  })
  .strict();

export type LoginInput = z.input<typeof loginInputSchema>;

export async function authenticateDemoCredentials(
  input: LoginInput,
): Promise<ServiceResult<DemoIdentity>> {
  const validated = loginInputSchema.safeParse(input);
  if (!validated.success) {
    return serviceFailure(
      "VALIDATION_FAILED",
      "Enter the displayed public demo credentials.",
    );
  }
  const credential = PUBLIC_DEMO_CREDENTIALS.find(
    (candidate) =>
      candidate.username === validated.data.username &&
      candidate.password === validated.data.password,
  );
  if (!credential) {
    return serviceFailure(
      "UNAUTHORIZED",
      "Those credentials do not match a public demo account.",
    );
  }
  const identity = DEMO_USERS.find(({ id }) => id === credential.userId);
  return identity
    ? serviceSuccess({ ...identity })
    : serviceFailure("INTERNAL", "The demo identity fixture is unavailable.");
}

export function resolveSafeNext(
  rawNext: string | null | undefined,
  role: DemoRole,
): string {
  if (!rawNext) return "/";

  let decoded: string;
  try {
    decoded = decodeURIComponent(rawNext);
  } catch {
    return "/";
  }
  if (
    !decoded.startsWith("/") ||
    decoded.startsWith("//") ||
    decoded.includes("\\") ||
    /[\u0000-\u001f\u007f]/.test(decoded)
  ) {
    return "/";
  }

  let destination: URL;
  try {
    destination = new URL(decoded, "https://demo.invalid");
  } catch {
    return "/";
  }
  if (destination.origin !== "https://demo.invalid") return "/";

  const pathname = destination.pathname.replace(/\/+$/, "") || "/";
  if (
    pathname === "/login" ||
    pathname.startsWith("/login/") ||
    pathname === "/signup" ||
    pathname.startsWith("/signup/")
  ) {
    return "/";
  }

  const access = evaluateRouteAccess(role, pathname);
  return access.allowed
    ? `${pathname}${destination.search}${destination.hash}`
    : "/";
}
