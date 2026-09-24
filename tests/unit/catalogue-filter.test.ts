import { describe, expect, it } from "vitest";

import { catalogueSnapshot } from "@/catalogue/data";
import { filterCatalogueItems } from "@/features/showcase/catalogue/filter-catalogue";

describe("catalogue filters", () => {
  it("combines query, kind, status, and category predictably", () => {
    const result = filterCatalogueItems(catalogueSnapshot.items, {
      category: "action",
      kind: "component",
      query: "toggle",
      status: "verified",
    });
    expect(result.map(({ id }) => id)).toEqual([
      "theme-switch",
      "toggle",
      "toggle-group",
    ]);
  });

  it("searches IDs, names, descriptions, and dependencies", () => {
    expect(
      filterCatalogueItems(catalogueSnapshot.items, { query: "mapbox-gl" })
        .length,
    ).toBeGreaterThan(0);
    expect(
      filterCatalogueItems(catalogueSnapshot.items, {
        query: "map-standard-3d",
      }).map(({ id }) => id),
    ).toContain("map-standard-3d");
  });

  it("reports no matches without mutating the snapshot", () => {
    const before = catalogueSnapshot.items.length;
    expect(
      filterCatalogueItems(catalogueSnapshot.items, {
        query: "not-a-real-uipkge-id",
      }),
    ).toEqual([]);
    expect(catalogueSnapshot.items).toHaveLength(before);
  });

  it("supports every tracked category, status, and kind", () => {
    const categories = new Set(
      catalogueSnapshot.items.flatMap(({ categories }) => categories),
    );
    const statuses = new Set(
      catalogueSnapshot.items.map(({ status }) => status),
    );
    const kinds = new Set(catalogueSnapshot.items.map(({ kind }) => kind));
    for (const category of categories) {
      expect(
        filterCatalogueItems(catalogueSnapshot.items, { category }),
      ).not.toHaveLength(0);
    }
    for (const status of statuses) {
      expect(
        filterCatalogueItems(catalogueSnapshot.items, { status }),
      ).not.toHaveLength(0);
    }
    for (const kind of kinds) {
      expect(
        filterCatalogueItems(catalogueSnapshot.items, { kind }),
      ).not.toHaveLength(0);
    }
  });
});
