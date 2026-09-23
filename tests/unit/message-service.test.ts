import { describe, expect, it } from "vitest";

import {
  LOCAL_MESSAGE_NOTICE,
  messageThreadListSchema,
} from "@/features/messages/schema";
import { createMessageService } from "@/features/messages/services/message-service";
import { createVersionedStorageKey } from "@/lib/storage/versioned-storage";
import { MESSAGE_THREAD_FIXTURES } from "@/mocks/messages";
import { createTestStorage } from "@/tests/helpers/storage";

describe("message service", () => {
  it("lists local threads and returns detail or NOT_FOUND", async () => {
    const { storage } = createTestStorage();
    const service = createMessageService({ getStorage: () => storage });

    await expect(service.listThreads()).resolves.toEqual({
      ok: true,
      data: {
        value: MESSAGE_THREAD_FIXTURES,
        persistence: { source: "fixtures" },
      },
    });
    await expect(
      service.getThread("thread-demo-lantern"),
    ).resolves.toMatchObject({
      ok: true,
      data: { value: { subject: "Lantern demo review" } },
    });
    await expect(service.getThread("thread-missing")).resolves.toMatchObject({
      ok: false,
      error: { code: "NOT_FOUND" },
    });
  });

  it("does not expose mutable nested collection state", async () => {
    const { storage } = createTestStorage();
    const service = createMessageService({ getStorage: () => storage });
    const listed = await service.listThreads();
    if (!listed.ok) throw new Error("Expected message fixtures.");
    listed.data.value[0].messages[0].body = "Changed outside the service";

    const detail = await service.getThread("thread-demo-lantern");
    expect(detail.ok && detail.data.value.messages[0].body).toBe(
      "The fictional Lantern review notes are ready in this local demo.",
    );
  });

  it("simulates deterministic local sending and persistence", async () => {
    const { storage } = createTestStorage();
    const service = createMessageService({ getStorage: () => storage });
    const input = {
      threadId: "thread-demo-lantern",
      authorId: "demo-user-manager" as const,
      body: "This fictional reply stays in local browser storage.",
    };

    await expect(service.send(input)).resolves.toEqual({
      ok: true,
      data: {
        value: {
          id: "message-local-1",
          authorId: "demo-user-manager",
          body: input.body,
          sentAt: "2026-01-15T12:00:00.000Z",
          delivery: "local-simulation",
          deliveryNotice: LOCAL_MESSAGE_NOTICE,
        },
        persistence: { source: "persistent" },
      },
    });
    const reloaded = createMessageService({ getStorage: () => storage });
    await expect(reloaded.send(input)).resolves.toMatchObject({
      ok: true,
      data: { value: { id: "message-local-2" } },
    });
  });

  it("rejects invalid, missing-thread, and nonparticipant sends", async () => {
    const { storage } = createTestStorage();
    const service = createMessageService({ getStorage: () => storage });

    await expect(
      service.send({
        threadId: "thread-demo-lantern",
        authorId: "demo-user-manager",
        body: "   ",
      }),
    ).resolves.toMatchObject({
      ok: false,
      error: { code: "VALIDATION_FAILED" },
    });
    await expect(
      service.send({
        threadId: "thread-missing",
        authorId: "demo-user-manager",
        body: "Local test message",
      }),
    ).resolves.toMatchObject({ ok: false, error: { code: "NOT_FOUND" } });
    await expect(
      service.send({
        threadId: "thread-demo-lantern",
        authorId: "demo-user-viewer",
        body: "Local test message",
      }),
    ).resolves.toMatchObject({ ok: false, error: { code: "FORBIDDEN" } });
    expect(storage.setItem).not.toHaveBeenCalled();
  });

  it("rejects corrupt stored threads and resets to fixtures", async () => {
    const key = createVersionedStorageKey("message-threads", 1);
    const { storage } = createTestStorage({
      [key]: JSON.stringify({ version: 1, data: [{ id: "not-a-thread" }] }),
    });
    const corrupt = createMessageService({ getStorage: () => storage });
    await expect(corrupt.listThreads()).resolves.toMatchObject({
      ok: false,
      error: { code: "VALIDATION_FAILED" },
    });
    await expect(corrupt.reset()).resolves.toEqual({
      ok: true,
      data: {
        value: MESSAGE_THREAD_FIXTURES,
        persistence: { source: "fixtures" },
      },
    });
    expect(
      messageThreadListSchema.safeParse(MESSAGE_THREAD_FIXTURES).success,
    ).toBe(true);
  });
});
