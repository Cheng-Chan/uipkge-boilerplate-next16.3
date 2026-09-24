import { lazy, type ComponentType, type LazyExoticComponent } from "react";

export type PreviewModule = { default: ComponentType };
export type PreviewLoader = () => Promise<PreviewModule>;
export type LazyPreview = LazyExoticComponent<ComponentType>;

// CAT tickets add one explicit `slug: () => import("./slug")` entry here.
// Keeping this map separate from snapshot metadata prevents the browser page
// from importing every preview and lets the registry checker compare claims
// with real lazy modules.
export const PREVIEW_COMPONENTS = {} satisfies Record<string, LazyPreview>;

export const PREVIEW_SLUGS = Object.freeze(Object.keys(PREVIEW_COMPONENTS));

// Keep `lazy` used in this intentionally empty initial map. The first CAT
// ticket replaces this sentinel with `slug: lazy(() => import("./slug"))`.
void lazy;
