import { describe, expect, expectTypeOf, it } from "vitest";

import {
  DEMO_ROLES,
  DEMO_USER_IDS,
  PUBLIC_DEMO_CREDENTIAL_LABEL,
  demoIdentityReferenceSchema,
  demoIdentitySchema,
  publicDemoCredentialSchema,
  type DemoIdentity,
  type DemoRole,
  type PublicDemoCredential,
} from "@/features/auth/types";
import { DEMO_USERS, PUBLIC_DEMO_CREDENTIALS } from "@/mocks/users";

describe("demo identity fixtures", () => {
  it("provides one deterministic identity for every demo role", () => {
    expect(DEMO_USERS).toHaveLength(3);
    expect(DEMO_USERS.map(({ id }) => id)).toEqual(DEMO_USER_IDS);
    expect(DEMO_USERS.map(({ role }) => role)).toEqual(DEMO_ROLES);
    expect(new Set(DEMO_USERS.map(({ id }) => id)).size).toBe(3);
    expect(new Set(DEMO_USERS.map(({ username }) => username)).size).toBe(3);

    for (const user of DEMO_USERS) {
      expect(demoIdentitySchema.parse(user)).toEqual(user);
      expect(user.displayName).toMatch(/^Demo /);
      expect(user.username).toMatch(/^demo-/);
      expect(user.username).not.toContain("@");
    }

    expectTypeOf(DEMO_USERS).toMatchTypeOf<readonly DemoIdentity[]>();
    expectTypeOf<
      (typeof DEMO_USERS)[number]["role"]
    >().toEqualTypeOf<DemoRole>();
  });

  it("keeps every fake password in an explicitly public credential fixture", () => {
    expect(PUBLIC_DEMO_CREDENTIALS).toHaveLength(DEMO_USERS.length);
    expect(PUBLIC_DEMO_CREDENTIALS.map(({ userId }) => userId)).toEqual(
      DEMO_USER_IDS,
    );
    expect(
      new Set(PUBLIC_DEMO_CREDENTIALS.map(({ userId }) => userId)).size,
    ).toBe(3);

    for (const credential of PUBLIC_DEMO_CREDENTIALS) {
      expect(publicDemoCredentialSchema.parse(credential)).toEqual(credential);
      expect(credential.kind).toBe("public-demo-credential");
      expect(credential.label).toBe(PUBLIC_DEMO_CREDENTIAL_LABEL);

      const user = DEMO_USERS.find(({ id }) => id === credential.userId);
      expect(user).toBeDefined();
      expect(credential.username).toBe(user?.username);
      expect(credential.password).toContain("demo-");
    }

    expectTypeOf(PUBLIC_DEMO_CREDENTIALS).toMatchTypeOf<
      readonly PublicDemoCredential[]
    >();
  });

  it("keeps password data out of identities and session-safe references", () => {
    for (const user of DEMO_USERS) {
      expect(user).not.toHaveProperty("password");
      expect(user).not.toHaveProperty("email");
      expect(user).not.toHaveProperty("phone");
      expect(user).not.toHaveProperty("address");

      const reference = demoIdentityReferenceSchema.parse({ userId: user.id });
      expect(reference).toEqual({ userId: user.id });
      expect(Object.keys(reference)).toEqual(["userId"]);
      expect(JSON.stringify(reference)).not.toContain("password");
    }

    expect(() =>
      demoIdentitySchema.parse({
        ...DEMO_USERS[0],
        password: PUBLIC_DEMO_CREDENTIALS[0].password,
      }),
    ).toThrow();
  });

  it("rejects credentials that are not explicitly labeled public demo data", () => {
    expect(() =>
      publicDemoCredentialSchema.parse({
        ...PUBLIC_DEMO_CREDENTIALS[0],
        label: "Private credential",
      }),
    ).toThrow();
    expect(() =>
      publicDemoCredentialSchema.parse({
        ...PUBLIC_DEMO_CREDENTIALS[0],
        kind: "production-credential",
      }),
    ).toThrow();
  });
});
