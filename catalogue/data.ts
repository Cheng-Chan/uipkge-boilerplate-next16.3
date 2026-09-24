import snapshotJson from "./snapshot.json";

import type { CatalogueSnapshot } from "./schema";

export const catalogueSnapshot = snapshotJson as unknown as CatalogueSnapshot;

export function catalogueItemById(id: string) {
  return catalogueSnapshot.items.find((item) => item.id === id) ?? null;
}
