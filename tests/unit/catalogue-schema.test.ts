import { describe, expect, it } from "vitest";

import provenanceJson from "@/catalogue/provenance.json";
import snapshotJson from "@/catalogue/snapshot.json";
import ticketsJson from "@/catalogue/tickets.json";
import {
  type CatalogueProvenance,
  type CatalogueSnapshot,
  type CatalogueTickets,
  validateCatalogueData,
} from "@/catalogue/schema";
import { PREVIEW_SLUGS } from "@/features/showcase/previews/preview-loaders";

function fixtures() {
  return {
    provenance: structuredClone(
      provenanceJson,
    ) as unknown as CatalogueProvenance,
    snapshot: structuredClone(snapshotJson) as unknown as CatalogueSnapshot,
    tickets: structuredClone(ticketsJson) as unknown as CatalogueTickets,
  };
}

function expectIssue(
  change: (data: ReturnType<typeof fixtures>) => void,
  message: string,
) {
  const data = fixtures();
  change(data);
  expect(() =>
    validateCatalogueData(data.snapshot, data.provenance, data.tickets, {
      previewSlugs: PREVIEW_SLUGS,
    }),
  ).toThrowError(new RegExp(message));
}

describe("catalogue schema and invariants", () => {
  it("accepts the tracked offline snapshot", () => {
    const data = fixtures();
    const parsed = validateCatalogueData(
      data.snapshot,
      data.provenance,
      data.tickets,
      { previewSlugs: PREVIEW_SLUGS },
    );
    expect(parsed.snapshot.summary).toMatchObject({
      total: 713,
      catalogueTotal: 704,
      manifestUnavailable: 38,
    });
    expect(parsed.tickets.summary.items).toBe(713);
  });

  it("rejects duplicate IDs and missing routes", () => {
    expectIssue(
      ({ snapshot }) => snapshot.items.push(structuredClone(snapshot.items[0])),
      "duplicate item IDs",
    );
    expectIssue(({ snapshot }) => {
      snapshot.items[0].demoRoute = "/ui-kit/wrong";
    }, "demoRoute must be");
  });

  it("rejects bad dependencies, references, and unsafe targets", () => {
    expectIssue(
      ({ snapshot }) =>
        snapshot.items[0].dependencies.registryItems.push("does-not-exist"),
      "unknown registry dependency",
    );
    expectIssue(({ tickets }) => {
      tickets.tickets[0].itemIds[0] = "does-not-exist";
    }, "references unknown item");
    expectIssue(
      ({ snapshot }) => snapshot.items[0].targetPaths.push("../outside.tsx"),
      "unsafe path",
    );
  });

  it("rejects unsupported demo and verification claims", () => {
    expectIssue(({ snapshot }) => {
      const item = snapshot.items.find(({ id }) => id === "init");
      if (!item) throw new Error("fixture missing init");
      item.status = "verified";
      item.installedPaths = ["lib/init.ts"];
      item.evidence = [];
    }, "verified status requires evidence");
    expectIssue(({ snapshot }) => {
      const item = snapshot.items.find(
        ({ scope, status }) => scope === "catalogue" && status === "discovered",
      );
      if (!item) throw new Error("fixture missing catalogue item");
      item.status = "demo-ready";
      item.installedPaths = ["components/demo.tsx"];
      item.evidence = ["tests/unit/demo.test.tsx"];
    }, "requires an explicit lazy preview module");
  });
});
