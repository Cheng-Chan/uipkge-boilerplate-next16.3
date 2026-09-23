import { describe, expect, it } from "vitest";

import { createProjectService } from "@/features/projects/services/project-service";
import { createVersionedStorageKey } from "@/lib/storage/versioned-storage";
import { CUSTOMER_FIXTURES } from "@/mocks/customers";
import { PROJECT_FIXTURES } from "@/mocks/projects";
import { createTestStorage } from "@/tests/helpers/storage";

const validProject = {
  customerId: "customer-demo-northstar",
  name: "Willow Demo Platform",
  status: "planned" as const,
  startDate: "2026-02-02",
  endDate: "2026-08-28",
  budgetCents: 1_250_000,
};

describe("project service", () => {
  it("lists fixtures and returns detail or NOT_FOUND", async () => {
    const { storage } = createTestStorage();
    const service = createProjectService({ getStorage: () => storage });

    await expect(service.list()).resolves.toEqual({
      ok: true,
      data: { value: PROJECT_FIXTURES, persistence: { source: "fixtures" } },
    });
    await expect(
      service.getById("project-demo-lantern"),
    ).resolves.toMatchObject({
      ok: true,
      data: { value: { id: "project-demo-lantern" } },
    });
    await expect(service.getById("project-missing")).resolves.toMatchObject({
      ok: false,
      error: { code: "NOT_FOUND" },
    });
  });

  it("creates, updates, deletes, and reloads deterministic projects", async () => {
    const { storage } = createTestStorage();
    const service = createProjectService({ getStorage: () => storage });

    await expect(service.create(validProject)).resolves.toEqual({
      ok: true,
      data: {
        value: {
          ...validProject,
          id: "project-local-1",
          createdAt: "2026-01-15T12:00:00.000Z",
          updatedAt: "2026-01-15T12:00:00.000Z",
        },
        persistence: { source: "persistent" },
      },
    });
    await expect(
      service.update("project-local-1", {
        name: "Willow Demo Delivery",
        status: "active",
      }),
    ).resolves.toMatchObject({
      ok: true,
      data: {
        value: {
          id: "project-local-1",
          name: "Willow Demo Delivery",
          status: "active",
        },
      },
    });

    const reloaded = createProjectService({ getStorage: () => storage });
    await expect(reloaded.create(validProject)).resolves.toMatchObject({
      ok: true,
      data: { value: { id: "project-local-2" } },
    });
    await expect(reloaded.delete("project-local-1")).resolves.toMatchObject({
      ok: true,
      data: { value: { id: "project-local-1" } },
    });
  });

  it("validates dates, bounded values, and customer relationships", async () => {
    const { storage } = createTestStorage();
    const service = createProjectService({ getStorage: () => storage });

    await expect(
      service.create({
        ...validProject,
        startDate: "2026-09-01",
        endDate: "2026-08-01",
      }),
    ).resolves.toMatchObject({
      ok: false,
      error: {
        code: "VALIDATION_FAILED",
        message: "Project input is invalid.",
      },
    });
    await expect(
      service.create({ ...validProject, customerId: "customer-demo-unknown" }),
    ).resolves.toMatchObject({
      ok: false,
      error: {
        code: "VALIDATION_FAILED",
        details: { issues: [{ path: "customerId" }] },
      },
    });
    await expect(
      service.create({ ...validProject, budgetCents: 100_000_001 }),
    ).resolves.toMatchObject({
      ok: false,
      error: { code: "VALIDATION_FAILED" },
    });
    expect(storage.setItem).not.toHaveBeenCalled();
  });

  it("validates merged updates and supports injected customer lookup", async () => {
    const { storage } = createTestStorage();
    const service = createProjectService({
      getStorage: () => storage,
      customerExists: (id) =>
        id === "customer-local-1" ||
        CUSTOMER_FIXTURES.some((customer) => customer.id === id),
    });
    const created = await service.create({
      ...validProject,
      customerId: "customer-local-1",
    });
    expect(created).toMatchObject({ ok: true });

    await expect(
      service.update("project-local-1", { endDate: "2026-01-01" }),
    ).resolves.toMatchObject({
      ok: false,
      error: {
        code: "VALIDATION_FAILED",
        message: "Project update is invalid.",
      },
    });
    await expect(service.update("project-local-1", {})).resolves.toMatchObject({
      ok: false,
      error: { code: "VALIDATION_FAILED" },
    });
    await expect(
      service.update("project-local-1", {
        customerId: "customer-demo-unknown",
      }),
    ).resolves.toMatchObject({
      ok: false,
      error: { code: "VALIDATION_FAILED" },
    });
  });

  it("returns NOT_FOUND for missing update and delete targets", async () => {
    const { storage } = createTestStorage();
    const service = createProjectService({ getStorage: () => storage });

    await expect(
      service.update("project-missing", { status: "paused" }),
    ).resolves.toMatchObject({ ok: false, error: { code: "NOT_FOUND" } });
    await expect(service.delete("project-missing")).resolves.toMatchObject({
      ok: false,
      error: { code: "NOT_FOUND" },
    });
  });

  it("resets persisted projects to fixtures", async () => {
    const { storage } = createTestStorage();
    const service = createProjectService({ getStorage: () => storage });
    await service.create(validProject);

    await expect(service.reset()).resolves.toEqual({
      ok: true,
      data: { value: PROJECT_FIXTURES, persistence: { source: "fixtures" } },
    });
    expect(storage.removeItem).toHaveBeenCalledWith(
      createVersionedStorageKey("projects", 1),
    );
  });
});
