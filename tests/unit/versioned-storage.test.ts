import { z } from "zod";
import { describe, expect, expectTypeOf, it, vi } from "vitest";

import type { ServiceResult } from "@/lib/service-result";
import {
  createVersionedStorage,
  createVersionedStorageKey,
  getBrowserLocalStorage,
  getBrowserSessionStorage,
  type StorageLike,
  type StorageRead,
} from "@/lib/storage/versioned-storage";

const preferencesSchema = z.object({
  density: z.enum(["compact", "comfortable"]),
});

type Preferences = z.infer<typeof preferencesSchema>;

function createStorage(initial: Record<string, string> = {}) {
  const values = new Map(Object.entries(initial));
  const storage: StorageLike = {
    getItem: vi.fn((key: string) => values.get(key) ?? null),
    removeItem: vi.fn((key: string) => {
      values.delete(key);
    }),
    setItem: vi.fn((key: string, value: string) => {
      values.set(key, value);
    }),
  };

  return { storage, values };
}

function createPreferencesStorage(storage: StorageLike) {
  return createVersionedStorage({
    name: "preferences",
    version: 2,
    schema: preferencesSchema,
    getStorage: () => storage,
  });
}

describe("createVersionedStorageKey", () => {
  it("creates a namespaced key with an explicit version", () => {
    expect(createVersionedStorageKey("demo-session", 3)).toBe(
      "uipkge.demo:demo-session:v3",
    );
  });

  it.each(["", "Preferences", "bad--name", "bad_name"])(
    "rejects the invalid storage name %s",
    (name) => {
      expect(() => createVersionedStorageKey(name, 1)).toThrow(
        "Storage name must contain lowercase letters, numbers, and single hyphens only.",
      );
    },
  );

  it.each([0, -1, 1.5, Number.POSITIVE_INFINITY])(
    "rejects the invalid storage version %s",
    (version) => {
      expect(() => createVersionedStorageKey("preferences", version)).toThrow(
        "Storage version must be a positive safe integer.",
      );
    },
  );
});

describe("createVersionedStorage", () => {
  it("resolves browser storage only when its getter is called", () => {
    expect(getBrowserLocalStorage()).toBe(window.localStorage);
    expect(getBrowserSessionStorage()).toBe(window.sessionStorage);
  });

  it("writes and reads a schema-validated versioned envelope", () => {
    const { storage, values } = createStorage();
    const adapter = createPreferencesStorage(storage);

    expect(adapter.key).toBe("uipkge.demo:preferences:v2");
    expect(adapter.version).toBe(2);
    expect(adapter.write({ density: "compact" })).toEqual({
      ok: true,
      data: {
        source: "persistent",
        value: { density: "compact" },
      },
    });
    expect(JSON.parse(values.get(adapter.key) ?? "")).toEqual({
      data: { density: "compact" },
      version: 2,
    });

    const result = adapter.read();
    expectTypeOf(result).toMatchTypeOf<
      ServiceResult<StorageRead<Preferences>>
    >();
    expect(result).toEqual({
      ok: true,
      data: {
        found: true,
        source: "persistent",
        value: { density: "compact" },
      },
    });
  });

  it("returns an explicit missing result", () => {
    const { storage } = createStorage();

    expect(createPreferencesStorage(storage).read()).toEqual({
      ok: true,
      data: { found: false, source: "persistent" },
    });
  });

  it("distinguishes a stored null value from a missing value", () => {
    const { storage } = createStorage();
    const adapter = createVersionedStorage({
      name: "nullable-value",
      version: 1,
      schema: z.null(),
      getStorage: () => storage,
    });

    expect(adapter.write(null)).toMatchObject({
      ok: true,
      data: { source: "persistent", value: null },
    });
    expect(adapter.read()).toEqual({
      ok: true,
      data: { found: true, source: "persistent", value: null },
    });
  });

  it("reports corrupt JSON without echoing stored content", () => {
    const secretLikeValue = "do-not-echo-this-value";
    const key = createVersionedStorageKey("preferences", 2);
    const { storage } = createStorage({
      [key]: `{broken:${secretLikeValue}`,
    });

    const result = createPreferencesStorage(storage).read();

    expect(result).toMatchObject({
      ok: false,
      error: {
        code: "VALIDATION_FAILED",
        details: { reason: "CORRUPT_JSON", operation: "read" },
      },
    });
    expect(JSON.stringify(result)).not.toContain(secretLikeValue);
  });

  it("distinguishes invalid envelopes, unknown versions, and invalid data", () => {
    const key = createVersionedStorageKey("preferences", 2);
    const cases = [
      [JSON.stringify({ data: {}, version: "2" }), "INVALID_ENVELOPE"],
      [
        JSON.stringify({ data: { density: "compact" }, version: 1 }),
        "UNKNOWN_VERSION",
      ],
      [
        JSON.stringify({
          data: { density: "secret-invalid-value" },
          version: 2,
        }),
        "INVALID_DATA",
      ],
    ] as const;

    for (const [serialized, reason] of cases) {
      const { storage } = createStorage({ [key]: serialized });
      const result = createPreferencesStorage(storage).read();

      expect(result).toMatchObject({
        ok: false,
        error: { code: "VALIDATION_FAILED", details: { reason } },
      });
      expect(JSON.stringify(result)).not.toContain("secret-invalid-value");
    }
  });

  it("rejects invalid and non-JSON-compatible values before persistence", () => {
    const { storage } = createStorage();
    const adapter = createPreferencesStorage(storage);
    const invalidValue = "secret-invalid-write-value";

    const invalidResult = adapter.write({
      density: invalidValue,
    } as unknown as Preferences);
    expect(invalidResult).toMatchObject({
      ok: false,
      error: {
        code: "VALIDATION_FAILED",
        details: { reason: "INVALID_VALUE", operation: "write" },
      },
    });
    expect(JSON.stringify(invalidResult)).not.toContain(invalidValue);
    expect(storage.setItem).not.toHaveBeenCalled();

    const cycle: { self?: unknown } = {};
    cycle.self = cycle;
    const unknownAdapter = createVersionedStorage({
      name: "unknown-value",
      version: 1,
      schema: z.unknown(),
      getStorage: () => storage,
    });
    expect(unknownAdapter.write(cycle)).toMatchObject({
      ok: false,
      error: {
        code: "VALIDATION_FAILED",
        details: { reason: "NOT_JSON_COMPATIBLE", operation: "write" },
      },
    });

    const undefinedAdapter = createVersionedStorage({
      name: "undefined-value",
      version: 1,
      schema: z.undefined(),
      getStorage: () => storage,
    });
    expect(undefinedAdapter.write(undefined)).toMatchObject({
      ok: false,
      error: {
        code: "VALIDATION_FAILED",
        details: { reason: "NOT_JSON_COMPATIBLE", operation: "write" },
      },
    });
    expect(storage.setItem).not.toHaveBeenCalled();
  });

  it("uses the memory fallback when persistent storage is unavailable", () => {
    const adapter = createVersionedStorage({
      name: "preferences",
      version: 2,
      schema: preferencesSchema,
      getStorage: () => undefined,
    });

    expect(adapter.write({ density: "comfortable" })).toEqual({
      ok: true,
      data: {
        source: "memory",
        value: { density: "comfortable" },
        warning: { reason: "STORAGE_UNAVAILABLE", operation: "write" },
      },
    });
    expect(adapter.read()).toEqual({
      ok: true,
      data: {
        found: true,
        source: "memory",
        value: { density: "comfortable" },
        warning: { reason: "STORAGE_UNAVAILABLE", operation: "write" },
      },
    });

    expect(adapter.reset()).toMatchObject({
      ok: false,
      error: {
        code: "INTERNAL",
        details: { reason: "STORAGE_UNAVAILABLE", operation: "reset" },
      },
    });
    expect(adapter.read()).toEqual({
      ok: true,
      data: {
        found: false,
        source: "memory",
        warning: { reason: "STORAGE_UNAVAILABLE", operation: "reset" },
      },
    });
  });

  it("contains provider access exceptions for every operation", () => {
    const adapter = createVersionedStorage({
      name: "preferences",
      version: 2,
      schema: preferencesSchema,
      getStorage: () => {
        throw new Error("storage getter failed");
      },
    });

    expect(adapter.read()).toMatchObject({
      ok: true,
      data: {
        found: false,
        source: "memory",
        warning: { reason: "STORAGE_UNAVAILABLE", operation: "read" },
      },
    });
    expect(adapter.write({ density: "compact" })).toMatchObject({
      ok: true,
      data: {
        source: "memory",
        warning: { reason: "STORAGE_UNAVAILABLE", operation: "write" },
      },
    });
    expect(adapter.reset()).toMatchObject({
      ok: false,
      error: {
        code: "INTERNAL",
        details: { reason: "STORAGE_UNAVAILABLE", operation: "reset" },
      },
    });
  });

  it.each([
    ["QuotaExceededError", "QUOTA_EXCEEDED"],
    ["UnknownError", "WRITE_FAILED"],
  ] as const)(
    "falls back to memory when a write raises %s",
    (errorName, reason) => {
      const { storage } = createStorage({
        [createVersionedStorageKey("preferences", 2)]: JSON.stringify({
          data: { density: "compact" },
          version: 2,
        }),
      });
      vi.mocked(storage.setItem).mockImplementation(() => {
        throw Object.assign(new Error("storage write failed"), {
          name: errorName,
        });
      });
      const adapter = createPreferencesStorage(storage);

      expect(adapter.write({ density: "comfortable" })).toMatchObject({
        ok: true,
        data: { source: "memory", warning: { reason, operation: "write" } },
      });
      expect(adapter.read()).toMatchObject({
        ok: true,
        data: {
          found: true,
          source: "memory",
          value: { density: "comfortable" },
          warning: { reason },
        },
      });
    },
  );

  it("uses its validated mirror when a persistent read fails", () => {
    const { storage } = createStorage();
    const adapter = createPreferencesStorage(storage);
    adapter.write({ density: "compact" });
    vi.mocked(storage.getItem).mockImplementation(() => {
      throw new Error("storage read failed");
    });

    expect(adapter.read()).toEqual({
      ok: true,
      data: {
        found: true,
        source: "memory",
        value: { density: "compact" },
        warning: { reason: "READ_FAILED", operation: "read" },
      },
    });
  });

  it("resets persistent and in-memory values through an explicit seam", () => {
    const { storage } = createStorage();
    const adapter = createPreferencesStorage(storage);
    adapter.write({ density: "compact" });

    expect(adapter.reset()).toEqual({
      ok: true,
      data: { cleared: true, source: "persistent" },
    });
    expect(storage.removeItem).toHaveBeenCalledWith(adapter.key);
    expect(adapter.read()).toEqual({
      ok: true,
      data: { found: false, source: "persistent" },
    });
  });

  it("reports failed persistent removal while clearing the memory fallback", () => {
    const { storage } = createStorage();
    const adapter = createPreferencesStorage(storage);
    adapter.write({ density: "compact" });
    vi.mocked(storage.removeItem).mockImplementation(() => {
      throw new Error("storage remove failed");
    });

    expect(adapter.reset()).toMatchObject({
      ok: false,
      error: {
        code: "INTERNAL",
        details: { reason: "REMOVE_FAILED", operation: "reset" },
      },
    });
    expect(adapter.read()).toEqual({
      ok: true,
      data: {
        found: false,
        source: "memory",
        warning: { reason: "REMOVE_FAILED", operation: "reset" },
      },
    });
  });
});
