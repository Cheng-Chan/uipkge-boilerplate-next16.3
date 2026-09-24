import {
  hasPermission,
  type Permission,
} from "@/features/access-control/policy";
import type { DemoRole } from "@/features/auth/types";

export type NavigationGroup = "Workspace" | "Laboratory" | "Administration";

export type NavigationItem = {
  available: boolean;
  group: NavigationGroup;
  label: string;
  path: string;
  permission: Permission;
};

export const NAVIGATION_ITEMS = [
  {
    path: "/dashboard",
    label: "Dashboard",
    group: "Workspace",
    permission: "dashboard.view",
    available: true,
  },
  {
    path: "/customers",
    label: "Customers",
    group: "Workspace",
    permission: "customers.view",
    available: false,
  },
  {
    path: "/projects",
    label: "Projects",
    group: "Workspace",
    permission: "projects.view",
    available: false,
  },
  {
    path: "/kanban",
    label: "Kanban",
    group: "Workspace",
    permission: "kanban.view",
    available: false,
  },
  {
    path: "/calendar",
    label: "Calendar",
    group: "Workspace",
    permission: "calendar.view",
    available: false,
  },
  {
    path: "/activity",
    label: "Activity",
    group: "Workspace",
    permission: "activity.view",
    available: false,
  },
  {
    path: "/messages",
    label: "Messages",
    group: "Workspace",
    permission: "messages.view",
    available: false,
  },
  {
    path: "/settings",
    label: "Settings",
    group: "Workspace",
    permission: "settings.view",
    available: false,
  },
  {
    path: "/ui-kit",
    label: "UI kit",
    group: "Laboratory",
    permission: "showcase.view",
    available: false,
  },
  {
    path: "/blocks",
    label: "Blocks",
    group: "Laboratory",
    permission: "showcase.view",
    available: false,
  },
  {
    path: "/charts",
    label: "Charts",
    group: "Laboratory",
    permission: "charts.view",
    available: false,
  },
  {
    path: "/maps",
    label: "Maps",
    group: "Laboratory",
    permission: "maps.view",
    available: false,
  },
  {
    path: "/editor",
    label: "Editor",
    group: "Laboratory",
    permission: "editor.view",
    available: false,
  },
  {
    path: "/access-control",
    label: "Access control",
    group: "Administration",
    permission: "access-control.view",
    available: true,
  },
] as const satisfies readonly NavigationItem[];

export function navigationForRole(role: DemoRole): readonly NavigationItem[] {
  return NAVIGATION_ITEMS.filter(
    (item) => item.available && hasPermission(role, item.permission),
  );
}

export function navigationItemForPath(pathname: string): NavigationItem | null {
  return (
    [...NAVIGATION_ITEMS]
      .sort((a, b) => b.path.length - a.path.length)
      .find(
        ({ path }) => pathname === path || pathname.startsWith(`${path}/`),
      ) ?? null
  );
}
