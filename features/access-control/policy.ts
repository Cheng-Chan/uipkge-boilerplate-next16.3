import type { DemoRole } from "@/features/auth/types";

export const PERMISSIONS = [
  "dashboard.view",
  "customers.view",
  "customers.create",
  "customers.update",
  "customers.delete",
  "projects.view",
  "projects.create",
  "projects.update",
  "projects.delete",
  "kanban.view",
  "kanban.edit",
  "kanban.move",
  "calendar.view",
  "calendar.create",
  "calendar.update",
  "calendar.delete",
  "activity.view",
  "messages.view",
  "messages.send",
  "settings.view",
  "showcase.view",
  "charts.view",
  "maps.view",
  "editor.view",
  "data.export",
  "access-control.view",
  "demo.reset",
] as const;

export type Permission = (typeof PERMISSIONS)[number];

const businessViewPermissions = [
  "dashboard.view",
  "customers.view",
  "projects.view",
  "kanban.view",
  "calendar.view",
  "activity.view",
  "messages.view",
  "settings.view",
  "showcase.view",
  "charts.view",
  "maps.view",
  "editor.view",
] as const satisfies readonly Permission[];

export const ROLE_PERMISSIONS = {
  admin: PERMISSIONS,
  manager: [
    ...businessViewPermissions,
    "customers.create",
    "customers.update",
    "projects.create",
    "projects.update",
    "kanban.edit",
    "kanban.move",
    "calendar.create",
    "calendar.update",
    "messages.send",
    "data.export",
  ],
  viewer: businessViewPermissions,
} as const satisfies Record<DemoRole, readonly Permission[]>;

export type PermissionRequirement =
  | { mode: "all"; permissions: readonly Permission[] }
  | { mode: "any"; permissions: readonly Permission[] };

export type RoutePolicy = {
  path: string;
  access: "public" | "authenticated";
  requirement?: PermissionRequirement;
};

export const ROUTE_POLICIES = [
  { path: "/", access: "public" },
  { path: "/login", access: "public" },
  { path: "/signup", access: "public" },
  { path: "/403", access: "authenticated" },
  {
    path: "/dashboard",
    access: "authenticated",
    requirement: { mode: "all", permissions: ["dashboard.view"] },
  },
  {
    path: "/customers",
    access: "authenticated",
    requirement: { mode: "all", permissions: ["customers.view"] },
  },
  {
    path: "/projects",
    access: "authenticated",
    requirement: { mode: "all", permissions: ["projects.view"] },
  },
  {
    path: "/kanban",
    access: "authenticated",
    requirement: { mode: "all", permissions: ["kanban.view"] },
  },
  {
    path: "/calendar",
    access: "authenticated",
    requirement: { mode: "all", permissions: ["calendar.view"] },
  },
  {
    path: "/activity",
    access: "authenticated",
    requirement: { mode: "all", permissions: ["activity.view"] },
  },
  {
    path: "/messages",
    access: "authenticated",
    requirement: { mode: "all", permissions: ["messages.view"] },
  },
  {
    path: "/settings",
    access: "authenticated",
    requirement: { mode: "all", permissions: ["settings.view"] },
  },
  {
    path: "/ui-kit",
    access: "authenticated",
    requirement: { mode: "all", permissions: ["showcase.view"] },
  },
  {
    path: "/blocks",
    access: "authenticated",
    requirement: { mode: "all", permissions: ["showcase.view"] },
  },
  {
    path: "/charts",
    access: "authenticated",
    requirement: { mode: "all", permissions: ["charts.view"] },
  },
  {
    path: "/maps",
    access: "authenticated",
    requirement: { mode: "all", permissions: ["maps.view"] },
  },
  {
    path: "/editor",
    access: "authenticated",
    requirement: { mode: "all", permissions: ["editor.view"] },
  },
  {
    path: "/access-control",
    access: "authenticated",
    requirement: { mode: "all", permissions: ["access-control.view"] },
  },
] as const satisfies readonly RoutePolicy[];

const permissionSet = new Set<string>(PERMISSIONS);

export function isPermission(value: string): value is Permission {
  return permissionSet.has(value);
}

export function permissionsForRole(role: DemoRole): readonly Permission[] {
  return ROLE_PERMISSIONS[role];
}

export function hasPermission(role: DemoRole, permission: string): boolean {
  return (
    isPermission(permission) &&
    (ROLE_PERMISSIONS[role] as readonly Permission[]).includes(permission)
  );
}

export function satisfiesPermissionRequirement(
  role: DemoRole,
  requirement: PermissionRequirement,
): boolean {
  if (requirement.permissions.length === 0) return false;
  return requirement.mode === "all"
    ? requirement.permissions.every((permission) =>
        hasPermission(role, permission),
      )
    : requirement.permissions.some((permission) =>
        hasPermission(role, permission),
      );
}

function normalizePathname(pathname: string): string | null {
  if (!pathname.startsWith("/") || pathname.startsWith("//")) return null;
  const withoutTrailingSlash = pathname.replace(/\/+$/, "");
  return withoutTrailingSlash || "/";
}

function matchesSegmentBoundary(pathname: string, basePath: string) {
  return pathname === basePath || pathname.startsWith(`${basePath}/`);
}

export function matchRoutePolicy(pathname: string): RoutePolicy | null {
  const normalized = normalizePathname(pathname);
  if (!normalized) return null;

  return (
    [...ROUTE_POLICIES]
      .sort((a, b) => b.path.length - a.path.length)
      .find(({ path }) => matchesSegmentBoundary(normalized, path)) ?? null
  );
}

export type RouteAccessDecision =
  | { allowed: true; policy: RoutePolicy }
  | {
      allowed: false;
      policy: RoutePolicy | null;
      reason: "anonymous" | "forbidden" | "unknown-route";
    };

export function evaluateRouteAccess(
  role: DemoRole | null,
  pathname: string,
): RouteAccessDecision {
  const policy = matchRoutePolicy(pathname);
  if (!policy) return { allowed: false, policy: null, reason: "unknown-route" };
  if (policy.access === "public") return { allowed: true, policy };
  if (!role) return { allowed: false, policy, reason: "anonymous" };
  if (
    policy.requirement &&
    !satisfiesPermissionRequirement(role, policy.requirement)
  ) {
    return { allowed: false, policy, reason: "forbidden" };
  }
  return { allowed: true, policy };
}
