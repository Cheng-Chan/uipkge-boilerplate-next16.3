import { describe, expect, it, vi } from "vitest";

import { createCustomerService } from "@/features/customers/services/customer-service";
import { createVersionedStorageKey } from "@/lib/storage/versioned-storage";
import { CUSTOMER_FIXTURES } from "@/mocks/customers";
import { createTestStorage } from "@/tests/helpers/storage";

const validCustomer = {
  name: "Willow Demo House",
  contactName: "Sample Contact Five",
  contactEmail: "hello@willow-demo.invalid",
  status: "prospect" as const,
};

describe("customer service", () => {
  it("lists fixtures and returns detail or NOT_FOUND", async () => {
    const { storage } = createTestStorage();
    const service = createCustomerService({ getStorage: () => storage });

    await expect(service.list()).resolves.toEqual({
      ok: true,
      data: { value: CUSTOMER_FIXTURES, persistence: { source: "fixtures" } },
    });
    await expect(
      service.getById("customer-demo-northstar"),
    ).resolves.toMatchObject({
      ok: true,
      data: { value: { id: "customer-demo-northstar" } },
    });
    await expect(service.getById("customer-missing")).resolves.toEqual({
      ok: false,
      error: { code: "NOT_FOUND", message: "Customer was not found." },
    });
  });

  it("creates, updates, deletes, and reloads deterministic customers", async () => {
    const { storage } = createTestStorage();
    const firstService = createCustomerService({ getStorage: () => storage });

    const created = await firstService.create({
      ...validCustomer,
      name: "  Willow Demo House  ",
    });
    expect(created).toEqual({
      ok: true,
      data: {
        value: {
          ...validCustomer,
          id: "customer-local-1",
          createdAt: "2026-01-15T12:00:00.000Z",
          updatedAt: "2026-01-15T12:00:00.000Z",
        },
        persistence: { source: "persistent" },
      },
    });

    await expect(
      firstService.update("customer-local-1", {
        name: "Willow Demo Collective",
        status: "active",
      }),
    ).resolves.toMatchObject({
      ok: true,
      data: {
        value: {
          id: "customer-local-1",
          name: "Willow Demo Collective",
          status: "active",
          updatedAt: "2026-01-15T12:00:00.000Z",
        },
      },
    });

    const secondService = createCustomerService({ getStorage: () => storage });
    await expect(secondService.list()).resolves.toMatchObject({
      ok: true,
      data: {
        persistence: { source: "persistent" },
        value: expect.arrayContaining([
          expect.objectContaining({
            id: "customer-local-1",
            name: "Willow Demo Collective",
          }),
        ]),
      },
    });
    await expect(secondService.create(validCustomer)).resolves.toMatchObject({
      ok: true,
      data: { value: { id: "customer-local-2" } },
    });
    await expect(
      secondService.delete("customer-local-1"),
    ).resolves.toMatchObject({
      ok: true,
      data: { value: { id: "customer-local-1" } },
    });
    await expect(
      secondService.getById("customer-local-1"),
    ).resolves.toMatchObject({ ok: false, error: { code: "NOT_FOUND" } });
  });

  it("returns validation failures without persisting invalid input", async () => {
    const { storage } = createTestStorage();
    const service = createCustomerService({ getStorage: () => storage });

    const invalidEmail = "not-a-real-address";
    const created = await service.create({
      ...validCustomer,
      contactEmail: invalidEmail,
    });
    expect(created).toMatchObject({
      ok: false,
      error: {
        code: "VALIDATION_FAILED",
        message: "Customer input is invalid.",
      },
    });
    expect(JSON.stringify(created)).not.toContain(invalidEmail);
    await expect(
      service.update("customer-demo-northstar", {}),
    ).resolves.toMatchObject({
      ok: false,
      error: { code: "VALIDATION_FAILED" },
    });
    expect(storage.setItem).not.toHaveBeenCalled();
  });

  it("returns NOT_FOUND for missing update and delete targets", async () => {
    const { storage } = createTestStorage();
    const service = createCustomerService({ getStorage: () => storage });

    await expect(
      service.update("customer-missing", { status: "inactive" }),
    ).resolves.toMatchObject({ ok: false, error: { code: "NOT_FOUND" } });
    await expect(service.delete("customer-missing")).resolves.toMatchObject({
      ok: false,
      error: { code: "NOT_FOUND" },
    });
  });

  it("resets mutations to fresh fixture copies", async () => {
    const { storage } = createTestStorage();
    const service = createCustomerService({ getStorage: () => storage });
    await service.create(validCustomer);

    await expect(service.reset()).resolves.toEqual({
      ok: true,
      data: { value: CUSTOMER_FIXTURES, persistence: { source: "fixtures" } },
    });
    await expect(service.list()).resolves.toEqual({
      ok: true,
      data: { value: CUSTOMER_FIXTURES, persistence: { source: "fixtures" } },
    });
    expect(storage.removeItem).toHaveBeenCalledWith(
      createVersionedStorageKey("customers", 1),
    );
  });

  it("reports corrupt persistence and recovers through reset", async () => {
    const key = createVersionedStorageKey("customers", 1);
    const { storage } = createTestStorage({ [key]: "{corrupt" });
    const service = createCustomerService({ getStorage: () => storage });

    await expect(service.list()).resolves.toMatchObject({
      ok: false,
      error: {
        code: "VALIDATION_FAILED",
        details: { reason: "CORRUPT_JSON" },
      },
    });
    await expect(service.reset()).resolves.toMatchObject({ ok: true });
    await expect(service.list()).resolves.toMatchObject({
      ok: true,
      data: { value: CUSTOMER_FIXTURES },
    });
  });

  it("surfaces memory fallback and failed-reset recovery", async () => {
    const { storage } = createTestStorage();
    vi.mocked(storage.setItem).mockImplementation(() => {
      throw Object.assign(new Error("quota"), { name: "QuotaExceededError" });
    });
    const service = createCustomerService({ getStorage: () => storage });

    await expect(service.create(validCustomer)).resolves.toMatchObject({
      ok: true,
      data: {
        persistence: {
          source: "memory",
          warning: { reason: "QUOTA_EXCEEDED" },
        },
      },
    });

    vi.mocked(storage.removeItem).mockImplementation(() => {
      throw new Error("remove failed");
    });
    await expect(service.reset()).resolves.toMatchObject({
      ok: false,
      error: { code: "INTERNAL", details: { reason: "REMOVE_FAILED" } },
    });
    await expect(service.list()).resolves.toMatchObject({
      ok: true,
      data: {
        value: CUSTOMER_FIXTURES,
        persistence: {
          source: "memory",
          warning: { reason: "REMOVE_FAILED" },
        },
      },
    });
  });

  it("surfaces unavailable persistence while serving fixtures", async () => {
    const service = createCustomerService({ getStorage: () => undefined });

    await expect(service.list()).resolves.toEqual({
      ok: true,
      data: {
        value: CUSTOMER_FIXTURES,
        persistence: {
          source: "memory",
          warning: { reason: "STORAGE_UNAVAILABLE", operation: "read" },
        },
      },
    });
  });

  it("enforces the stored collection bound during creation", async () => {
    const key = createVersionedStorageKey("customers", 1);
    const fullCollection = Array.from({ length: 100 }, (_, index) => ({
      ...CUSTOMER_FIXTURES[0],
      id: `customer-seeded-${index + 1}`,
    }));
    const { storage } = createTestStorage({
      [key]: JSON.stringify({ data: fullCollection, version: 1 }),
    });
    const service = createCustomerService({ getStorage: () => storage });

    await expect(service.create(validCustomer)).resolves.toMatchObject({
      ok: false,
      error: {
        code: "VALIDATION_FAILED",
        details: { reason: "INVALID_VALUE", operation: "write" },
      },
    });
    expect(storage.setItem).not.toHaveBeenCalled();
  });
});
