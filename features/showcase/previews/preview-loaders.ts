import { lazy, type ComponentType, type LazyExoticComponent } from "react";

export type PreviewModule = { default: ComponentType };
export type PreviewLoader = () => Promise<PreviewModule>;
export type LazyPreview = LazyExoticComponent<ComponentType>;

// CAT tickets add one explicit `slug: () => import("./slug")` entry here.
// Keeping this map separate from snapshot metadata prevents the browser page
// from importing every preview and lets the registry checker compare claims
// with real lazy modules.
export const PREVIEW_COMPONENTS = {
  attachment: lazy(() => import("./attachment")),
  avatar: lazy(() => import("./avatar")),
  badge: lazy(() => import("./badge")),
  board: lazy(() => import("./board")),
  button: lazy(() => import("./button")),
  "cascade-select": lazy(() => import("./cascade-select")),
  charts: lazy(() => import("./charts")),
  carousel: lazy(() => import("./carousel")),
  chip: lazy(() => import("./chip")),
  "code-block": lazy(() => import("./code-block")),
  "data-list": lazy(() => import("./data-list")),
  "data-table": lazy(() => import("./data-table")),
  fab: lazy(() => import("./fab")),
  "float-label": lazy(() => import("./float-label")),
  gantt: lazy(() => import("./gantt")),
  "icon-box": lazy(() => import("./icon-box")),
  icons: lazy(() => import("./icons")),
  input: lazy(() => import("./input")),
  kanban: lazy(() => import("./kanban")),
  kbd: lazy(() => import("./kbd")),
  "labeled-value": lazy(() => import("./labeled-value")),
  "lazy-image": lazy(() => import("./lazy-image")),
  list: lazy(() => import("./list")),
  "payment-card": lazy(() => import("./payment-card")),
  "password-input": lazy(() => import("./password-input")),
  "qr-code": lazy(() => import("./qr-code")),
  select: lazy(() => import("./select")),
  "signature-pad": lazy(() => import("./signature-pad")),
  "speed-dial": lazy(() => import("./speed-dial")),
  table: lazy(() => import("./table")),
  "theme-switch": lazy(() => import("./theme-switch")),
  toggle: lazy(() => import("./toggle")),
  "toggle-group": lazy(() => import("./toggle-group")),
  timeline: lazy(() => import("./timeline")),
  transfer: lazy(() => import("./transfer")),
  "tree-select": lazy(() => import("./tree-select")),
  "tree-table": lazy(() => import("./tree-table")),
  "tree-view": lazy(() => import("./tree-view")),
  "virtual-list": lazy(() => import("./virtual-list")),
} satisfies Record<string, LazyPreview>;

export const PREVIEW_SLUGS = Object.freeze(Object.keys(PREVIEW_COMPONENTS));
