// @vitest-environment node

import { z } from "zod";
import { describe, expect, it } from "vitest";

import { createVersionedStorage } from "@/lib/storage/versioned-storage";

describe("versioned storage outside a browser", () => {
  it("imports and operates through memory without window access", () => {
    const adapter = createVersionedStorage({
      name: "prerender-check",
      version: 1,
      schema: z.object({ ready: z.boolean() }),
    });

    expect(adapter.read()).toEqual({
      ok: true,
      data: {
        found: false,
        source: "memory",
        warning: { reason: "STORAGE_UNAVAILABLE", operation: "read" },
      },
    });
    expect(adapter.write({ ready: true })).toEqual({
      ok: true,
      data: {
        source: "memory",
        value: { ready: true },
        warning: { reason: "STORAGE_UNAVAILABLE", operation: "write" },
      },
    });
    expect(adapter.read()).toMatchObject({
      ok: true,
      data: {
        found: true,
        source: "memory",
        value: { ready: true },
      },
    });
  });
});
