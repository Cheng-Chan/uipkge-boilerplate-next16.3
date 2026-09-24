import { lazy, type ComponentType, type LazyExoticComponent } from "react";

export type PreviewModule = { default: ComponentType };
export type PreviewLoader = () => Promise<PreviewModule>;
export type LazyPreview = LazyExoticComponent<ComponentType>;

// CAT tickets add one explicit `slug: () => import("./slug")` entry here.
// Keeping this map separate from snapshot metadata prevents the browser page
// from importing every preview and lets the registry checker compare claims
// with real lazy modules.
export const PREVIEW_COMPONENTS = {
  "theme-switch": lazy(() => import("./theme-switch")),
  toggle: lazy(() => import("./toggle")),
  "toggle-group": lazy(() => import("./toggle-group")),
} satisfies Record<string, LazyPreview>;

export const PREVIEW_SLUGS = Object.freeze(Object.keys(PREVIEW_COMPONENTS));
