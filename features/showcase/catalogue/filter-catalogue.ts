import type {
  CatalogueItem,
  CatalogueKind,
  CatalogueStatus,
} from "@/catalogue/schema";

export type CatalogueFilters = {
  category?: string;
  kind?: CatalogueKind | "all";
  query?: string;
  status?: CatalogueStatus | "all";
};

export function filterCatalogueItems(
  items: readonly CatalogueItem[],
  filters: CatalogueFilters,
) {
  const query = filters.query?.trim().toLocaleLowerCase() ?? "";
  return items.filter((item) => {
    if (filters.kind && filters.kind !== "all" && item.kind !== filters.kind) {
      return false;
    }
    if (
      filters.status &&
      filters.status !== "all" &&
      item.status !== filters.status
    ) {
      return false;
    }
    if (
      filters.category &&
      filters.category !== "all" &&
      !item.categories.includes(filters.category)
    ) {
      return false;
    }
    if (!query) return true;
    const searchable = [
      item.id,
      item.title,
      item.description,
      item.kind,
      item.status,
      ...item.categories,
      ...item.dependencies.packages,
      ...item.dependencies.registryItems,
    ]
      .join(" ")
      .toLocaleLowerCase();
    return searchable.includes(query);
  });
}
