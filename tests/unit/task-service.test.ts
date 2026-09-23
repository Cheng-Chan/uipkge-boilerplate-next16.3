import { describe, expect, it } from "vitest";

import { createTaskService } from "@/features/tasks/services/task-service";
import { createVersionedStorageKey } from "@/lib/storage/versioned-storage";
import { TASK_FIXTURES } from "@/mocks/tasks";
import { createTestStorage } from "@/tests/helpers/storage";

describe("task service", () => {
  it("lists fixtures and returns detail or NOT_FOUND", async () => {
    const { storage } = createTestStorage();
    const service = createTaskService({ getStorage: () => storage });

    await expect(service.list()).resolves.toEqual({
      ok: true,
      data: { value: TASK_FIXTURES, persistence: { source: "fixtures" } },
    });
    await expect(service.getById("task-demo-outline")).resolves.toMatchObject({
      ok: true,
      data: { value: { id: "task-demo-outline" } },
    });
    await expect(service.getById("task-missing")).resolves.toMatchObject({
      ok: false,
      error: { code: "NOT_FOUND" },
    });
  });

  it("edits and reloads a task with a fixed timestamp", async () => {
    const { storage } = createTestStorage();
    const service = createTaskService({ getStorage: () => storage });

    await expect(
      service.update("task-demo-outline", {
        title: "Outline the revised demo navigation",
        assigneeId: null,
      }),
    ).resolves.toMatchObject({
      ok: true,
      data: {
        persistence: { source: "persistent" },
        value: {
          title: "Outline the revised demo navigation",
          assigneeId: null,
          updatedAt: "2026-01-15T12:00:00.000Z",
        },
      },
    });
    const reloaded = createTaskService({ getStorage: () => storage });
    await expect(reloaded.getById("task-demo-outline")).resolves.toMatchObject({
      ok: true,
      data: { value: { title: "Outline the revised demo navigation" } },
    });
  });

  it("moves tasks and deterministically reindexes source and target columns", async () => {
    const { storage } = createTestStorage();
    const service = createTaskService({ getStorage: () => storage });

    await expect(
      service.move("task-demo-outline", { status: "in-progress", position: 0 }),
    ).resolves.toMatchObject({
      ok: true,
      data: {
        value: {
          id: "task-demo-outline",
          status: "in-progress",
          position: 0,
          updatedAt: "2026-01-15T12:00:00.000Z",
        },
      },
    });
    const listed = await service.list();
    expect(listed.ok && listed.data.value).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: "task-demo-outline", position: 0 }),
        expect.objectContaining({ id: "task-demo-tokens", position: 1 }),
      ]),
    );
  });

  it("rejects invalid edits, assignees, positions, and missing tasks", async () => {
    const { storage } = createTestStorage();
    const service = createTaskService({ getStorage: () => storage });

    await expect(
      service.update("task-demo-outline", {}),
    ).resolves.toMatchObject({
      ok: false,
      error: { code: "VALIDATION_FAILED" },
    });
    await expect(
      service.update("task-demo-outline", {
        assigneeId: "demo-user-unknown" as "demo-user-admin",
      }),
    ).resolves.toMatchObject({
      ok: false,
      error: { code: "VALIDATION_FAILED" },
    });
    await expect(
      service.move("task-demo-outline", { status: "done", position: 9 }),
    ).resolves.toMatchObject({
      ok: false,
      error: {
        code: "VALIDATION_FAILED",
        details: { issues: [{ path: "position" }] },
      },
    });
    await expect(
      service.move("task-missing", { status: "done", position: 0 }),
    ).resolves.toMatchObject({ ok: false, error: { code: "NOT_FOUND" } });
    await expect(
      service.update("task-missing", { priority: "low" }),
    ).resolves.toMatchObject({ ok: false, error: { code: "NOT_FOUND" } });
  });

  it("supports injected relationship lookups and rejects stale relations", async () => {
    const { storage } = createTestStorage();
    const missingAssignee = createTaskService({
      getStorage: () => storage,
      assigneeExists: () => false,
    });
    await expect(
      missingAssignee.update("task-demo-outline", {
        assigneeId: "demo-user-admin",
      }),
    ).resolves.toMatchObject({
      ok: false,
      error: {
        code: "VALIDATION_FAILED",
        details: { issues: [{ path: "assigneeId" }] },
      },
    });

    const missingProject = createTaskService({
      getStorage: () => storage,
      projectExists: () => false,
    });
    await expect(
      missingProject.update("task-demo-outline", { priority: "low" }),
    ).resolves.toMatchObject({
      ok: false,
      error: { code: "VALIDATION_FAILED" },
    });
  });

  it("resets persisted task movement to fixtures", async () => {
    const { storage } = createTestStorage();
    const service = createTaskService({ getStorage: () => storage });
    await service.move("task-demo-outline", {
      status: "in-progress",
      position: 0,
    });

    await expect(service.reset()).resolves.toEqual({
      ok: true,
      data: { value: TASK_FIXTURES, persistence: { source: "fixtures" } },
    });
    expect(storage.removeItem).toHaveBeenCalledWith(
      createVersionedStorageKey("tasks", 1),
    );
  });
});
