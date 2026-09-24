import { describe, expect, it } from "vitest";

import {
  authenticateDemoCredentials,
  resolveSafeNext,
} from "@/features/auth/login/login-service";
import { PUBLIC_DEMO_CREDENTIALS } from "@/mocks/users";

describe("demo login service", () => {
  it("authenticates every displayed public fixture", async () => {
    for (const credential of PUBLIC_DEMO_CREDENTIALS) {
      await expect(
        authenticateDemoCredentials({
          username: credential.username,
          password: credential.password,
        }),
      ).resolves.toMatchObject({
        ok: true,
        data: { id: credential.userId },
      });
    }
  });

  it("rejects empty and mismatched credentials without returning submitted values", async () => {
    await expect(
      authenticateDemoCredentials({ username: "", password: "" }),
    ).resolves.toMatchObject({
      ok: false,
      error: { code: "VALIDATION_FAILED" },
    });
    const rejected = await authenticateDemoCredentials({
      username: "demo-admin",
      password: "private-looking-value",
    });
    expect(rejected).toMatchObject({
      ok: false,
      error: { code: "UNAUTHORIZED" },
    });
    expect(JSON.stringify(rejected)).not.toContain("private-looking-value");
  });
});

describe("safe next resolution", () => {
  it("accepts known, permitted, same-origin paths", () => {
    expect(resolveSafeNext("/projects?status=active#list", "viewer")).toBe(
      "/projects?status=active#list",
    );
    expect(resolveSafeNext("%2Fcustomers%2Fcustomer-demo", "manager")).toBe(
      "/customers/customer-demo",
    );
    expect(resolveSafeNext(null, "admin")).toBe("/");
  });

  it.each([
    "https://example.com/projects",
    "//example.com/projects",
    "javascript:alert(1)",
    "/login?next=/projects",
    "/signup",
    "/access-control",
    "/unknown",
    "/projectship",
    "%E0%A4%A",
    "/projects\\redirect",
  ])(
    "rejects unsafe, looped, malformed, or forbidden next value %s",
    (next) => {
      expect(resolveSafeNext(next, "viewer")).toBe("/");
    },
  );
});
