import { describe, expect, it } from "vitest";

import {
  customerListSchema,
  customerSchema,
} from "@/features/customers/schema";
import {
  projectCreateInputSchema,
  projectListSchema,
  projectSchema,
} from "@/features/projects/schema";
import { CUSTOMER_FIXTURES } from "@/mocks/customers";
import { PROJECT_FIXTURES } from "@/mocks/projects";

describe("customer and project fixtures", () => {
  it("uses stable, unique, schema-valid synthetic customer data", () => {
    expect(CUSTOMER_FIXTURES).toHaveLength(4);
    expect(new Set(CUSTOMER_FIXTURES.map(({ id }) => id)).size).toBe(4);

    for (const customer of CUSTOMER_FIXTURES) {
      expect(customerSchema.parse(customer)).toEqual(customer);
      expect(customer.id).toMatch(/^customer-demo-/);
      expect(customer.name).toContain("Demo");
      expect(customer.contactName).toMatch(/^Sample Contact /);
      expect(customer.contactEmail).toMatch(/\.invalid$/);
      expect(customer.createdAt).toMatch(/^2025-/);
      expect(customer.updatedAt).toMatch(/^2025-/);
    }
  });

  it("uses stable, relational, schema-valid synthetic project data", () => {
    const customerIds = new Set(CUSTOMER_FIXTURES.map(({ id }) => id));

    expect(PROJECT_FIXTURES).toHaveLength(5);
    expect(new Set(PROJECT_FIXTURES.map(({ id }) => id)).size).toBe(5);

    for (const project of PROJECT_FIXTURES) {
      expect(projectSchema.parse(project)).toEqual(project);
      expect(project.id).toMatch(/^project-demo-/);
      expect(project.name).toContain("Demo");
      expect(customerIds.has(project.customerId)).toBe(true);
      expect(project.startDate <= project.endDate).toBe(true);
      expect(project.createdAt).toMatch(/^2025-/);
      expect(project.updatedAt).toMatch(/^2025-/);
    }
  });

  it("bounds stored collections and rejects reversed project dates", () => {
    expect(
      customerListSchema.safeParse(
        Array.from({ length: 101 }, () => CUSTOMER_FIXTURES[0]),
      ).success,
    ).toBe(false);
    expect(
      projectListSchema.safeParse(
        Array.from({ length: 201 }, () => PROJECT_FIXTURES[0]),
      ).success,
    ).toBe(false);
    expect(
      projectCreateInputSchema.safeParse({
        customerId: CUSTOMER_FIXTURES[0].id,
        name: "Reversed Demo Project",
        status: "planned",
        startDate: "2026-06-01",
        endDate: "2026-05-01",
        budgetCents: 100_000,
      }).success,
    ).toBe(false);
    expect(
      projectCreateInputSchema.safeParse({
        customerId: CUSTOMER_FIXTURES[0].id,
        name: "Invalid Date Demo Project",
        status: "planned",
        startDate: "2026-99-01",
        endDate: "2026-99-02",
        budgetCents: 100_000,
      }).success,
    ).toBe(false);
  });
});
