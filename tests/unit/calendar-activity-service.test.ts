import { describe, expect, it } from "vitest";

import { createActivityService } from "@/features/activity/services/activity-service";
import { createCalendarEventService } from "@/features/calendar/services/calendar-event-service";
import { createVersionedStorageKey } from "@/lib/storage/versioned-storage";
import { ACTIVITY_FIXTURES } from "@/mocks/activity";
import { CALENDAR_EVENT_FIXTURES } from "@/mocks/calendar";
import { createTestStorage } from "@/tests/helpers/storage";

const validEvent = {
  projectId: "project-demo-lantern",
  title: "Local demo planning session",
  description: "Plan the fictional local-only demonstration.",
  kind: "focus" as const,
  startAt: "2026-02-02T09:00:00.000Z",
  endAt: "2026-02-02T10:00:00.000Z",
  allDay: false,
  accessibleSummary:
    "Local demo planning session on February 2 from 09:00 to 10:00 UTC.",
};

describe("calendar event service", () => {
  it("creates, updates, deletes, and reloads deterministic events", async () => {
    const { storage } = createTestStorage();
    const service = createCalendarEventService({ getStorage: () => storage });

    await expect(service.create(validEvent)).resolves.toMatchObject({
      ok: true,
      data: {
        value: {
          ...validEvent,
          id: "event-local-1",
          createdAt: "2026-01-15T12:00:00.000Z",
          updatedAt: "2026-01-15T12:00:00.000Z",
        },
      },
    });
    await expect(
      service.update("event-local-1", {
        title: "Revised local planning session",
      }),
    ).resolves.toMatchObject({
      ok: true,
      data: { value: { title: "Revised local planning session" } },
    });
    const reloaded = createCalendarEventService({ getStorage: () => storage });
    await expect(reloaded.getById("event-local-1")).resolves.toMatchObject({
      ok: true,
      data: { value: { id: "event-local-1" } },
    });
    await expect(reloaded.delete("event-local-1")).resolves.toMatchObject({
      ok: true,
      data: { value: { id: "event-local-1" } },
    });
  });

  it("rejects invalid dates, relationships, updates, and missing targets", async () => {
    const { storage } = createTestStorage();
    const service = createCalendarEventService({ getStorage: () => storage });

    await expect(
      service.create({ ...validEvent, endAt: validEvent.startAt }),
    ).resolves.toMatchObject({
      ok: false,
      error: { code: "VALIDATION_FAILED" },
    });
    await expect(
      service.create({ ...validEvent, projectId: "project-demo-unknown" }),
    ).resolves.toMatchObject({
      ok: false,
      error: {
        code: "VALIDATION_FAILED",
        details: { issues: [{ path: "projectId" }] },
      },
    });
    await expect(
      service.update("event-demo-kickoff", {}),
    ).resolves.toMatchObject({
      ok: false,
      error: { code: "VALIDATION_FAILED" },
    });
    await expect(
      service.update("event-demo-kickoff", {
        startAt: "2026-01-19T11:00:00.000Z",
      }),
    ).resolves.toMatchObject({
      ok: false,
      error: { code: "VALIDATION_FAILED" },
    });
    await expect(service.delete("event-missing")).resolves.toMatchObject({
      ok: false,
      error: { code: "NOT_FOUND" },
    });
  });

  it("lists and resets fixtures", async () => {
    const { storage } = createTestStorage();
    const service = createCalendarEventService({ getStorage: () => storage });
    await expect(service.list()).resolves.toEqual({
      ok: true,
      data: {
        value: CALENDAR_EVENT_FIXTURES,
        persistence: { source: "fixtures" },
      },
    });
    await service.create(validEvent);
    await expect(service.reset()).resolves.toEqual({
      ok: true,
      data: {
        value: CALENDAR_EVENT_FIXTURES,
        persistence: { source: "fixtures" },
      },
    });
    expect(storage.removeItem).toHaveBeenCalledWith(
      createVersionedStorageKey("calendar-events", 1),
    );
  });
});

describe("activity service", () => {
  it("returns cloned activity lists, filters, and details", async () => {
    const service = createActivityService();
    await expect(service.list()).resolves.toEqual({
      ok: true,
      data: ACTIVITY_FIXTURES,
    });
    await expect(service.list("project-demo-lantern")).resolves.toMatchObject({
      ok: true,
      data: [{ id: "activity-demo-task-review" }],
    });
    await expect(
      service.getById("activity-demo-event-added"),
    ).resolves.toMatchObject({ ok: true, data: { kind: "calendar" } });
    await expect(service.getById("activity-missing")).resolves.toMatchObject({
      ok: false,
      error: { code: "NOT_FOUND" },
    });
  });
});
