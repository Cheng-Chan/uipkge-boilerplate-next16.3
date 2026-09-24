import { describe, expect, it } from "vitest";

import { createDemoSessionService } from "@/features/auth/session/session-service";
import { createVersionedStorageKey } from "@/lib/storage/versioned-storage";
import { createTestStorage } from "@/tests/helpers/storage";

const NOW = Date.parse("2026-01-15T12:00:00.000Z");

describe("demo session service", () => {
  it("restores missing and valid identity references", async () => {
    const { storage } = createTestStorage();
    const service = createDemoSessionService({
      getStorage: () => storage,
      now: () => NOW,
    });
    await expect(service.restore()).resolves.toMatchObject({
      ok: true,
      data: { identity: null },
    });
    await expect(
      service.signIn("demo-user-manager", "2026-01-15T13:00:00.000Z"),
    ).resolves.toMatchObject({
      ok: true,
      data: { identity: { role: "manager" } },
    });

    const restored = createDemoSessionService({
      getStorage: () => storage,
      now: () => NOW,
    });
    await expect(restored.restore()).resolves.toMatchObject({
      ok: true,
      data: { identity: { id: "demo-user-manager", role: "manager" } },
    });
    const serialized = storage.getItem(
      createVersionedStorageKey("demo-session", 1),
    );
    expect(serialized).not.toBeNull();
    expect(JSON.parse(serialized ?? "null").data).toEqual({
      userId: "demo-user-manager",
      expiresAt: "2026-01-15T13:00:00.000Z",
    });
    expect(serialized).not.toContain("permission");
    expect(serialized).not.toContain("password");
  });

  it("expires stale records and clears them", async () => {
    const key = createVersionedStorageKey("demo-session", 1);
    const { storage } = createTestStorage({
      [key]: JSON.stringify({
        version: 1,
        data: {
          userId: "demo-user-viewer",
          expiresAt: "2026-01-15T11:59:59.000Z",
        },
      }),
    });
    const service = createDemoSessionService({
      getStorage: () => storage,
      now: () => NOW,
    });
    await expect(service.restore()).resolves.toMatchObject({
      ok: true,
      data: { identity: null, notice: expect.stringContaining("expired") },
    });
    expect(storage.removeItem).toHaveBeenCalledWith(key);
  });

  it("recovers corrupt sessions to anonymous without exposing stored values", async () => {
    const key = createVersionedStorageKey("demo-session", 1);
    const { storage } = createTestStorage({ [key]: "private-looking-garbage" });
    const service = createDemoSessionService({ getStorage: () => storage });
    const restored = await service.restore();
    expect(restored).toMatchObject({
      ok: true,
      data: { identity: null, notice: expect.stringContaining("invalid") },
    });
    expect(JSON.stringify(restored)).not.toContain("private-looking-garbage");
  });

  it("rejects expired sign-in and logs out", async () => {
    const { storage } = createTestStorage();
    const service = createDemoSessionService({
      getStorage: () => storage,
      now: () => NOW,
    });
    await expect(
      service.signIn("demo-user-admin", "2026-01-15T11:00:00.000Z"),
    ).resolves.toMatchObject({
      ok: false,
      error: { code: "VALIDATION_FAILED" },
    });
    await service.signIn("demo-user-admin");
    await expect(service.signOut()).resolves.toMatchObject({
      ok: true,
      data: { identity: null },
    });
  });
});
