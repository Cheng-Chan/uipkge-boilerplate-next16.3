import { DEMO_ROLES, type DemoRole } from "@/features/auth/types";
import {
  hasPermission,
  PERMISSIONS,
  permissionsForRole,
} from "@/features/access-control/policy";
import { DEMO_USERS } from "@/mocks/users";

function roleLabel(role: DemoRole) {
  return role.charAt(0).toUpperCase() + role.slice(1);
}

export function AccessControlInspector() {
  return (
    <section className="space-y-8">
      <div className="space-y-2">
        <p className="text-primary text-sm font-semibold tracking-wide uppercase">
          Administration
        </p>
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          Demo access control
        </h1>
        <p className="text-muted-foreground max-w-3xl leading-7">
          Inspect the static fixture users and their effective browser-side
          permissions. This page describes UI behavior only; it does not provide
          server enforcement or protect confidential data.
        </p>
      </div>

      <section aria-labelledby="demo-users-heading" className="space-y-3">
        <h2 className="text-xl font-semibold" id="demo-users-heading">
          Fixture users
        </h2>
        <div className="border-border overflow-x-auto rounded-xl border">
          <table className="w-full min-w-[42rem] text-left text-sm">
            <caption className="sr-only">
              Public demo users and their effective permission counts
            </caption>
            <thead className="bg-muted">
              <tr>
                <th className="px-4 py-3" scope="col">
                  Display name
                </th>
                <th className="px-4 py-3" scope="col">
                  Username
                </th>
                <th className="px-4 py-3" scope="col">
                  Role
                </th>
                <th className="px-4 py-3" scope="col">
                  Effective permissions
                </th>
              </tr>
            </thead>
            <tbody>
              {DEMO_USERS.map((user) => (
                <tr className="border-border border-t" key={user.id}>
                  <th className="px-4 py-3 font-medium" scope="row">
                    {user.displayName}
                  </th>
                  <td className="px-4 py-3">{user.username}</td>
                  <td className="px-4 py-3 capitalize">{user.role}</td>
                  <td className="px-4 py-3">
                    {permissionsForRole(user.role).length}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section
        aria-labelledby="permission-matrix-heading"
        className="space-y-3"
      >
        <h2 className="text-xl font-semibold" id="permission-matrix-heading">
          Effective permission matrix
        </h2>
        <div className="border-border overflow-x-auto rounded-xl border">
          <table className="w-full min-w-[42rem] text-left text-sm">
            <caption className="sr-only">
              Effective permissions for admin, manager, and viewer demo roles
            </caption>
            <thead className="bg-muted">
              <tr>
                <th className="px-4 py-3" scope="col">
                  Permission
                </th>
                {DEMO_ROLES.map((role) => (
                  <th className="px-4 py-3" key={role} scope="col">
                    {roleLabel(role)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {PERMISSIONS.map((permission) => (
                <tr className="border-border border-t" key={permission}>
                  <th className="px-4 py-3 font-mono font-medium" scope="row">
                    {permission}
                  </th>
                  {DEMO_ROLES.map((role) => (
                    <td className="px-4 py-3" key={role}>
                      <span className="sr-only">{roleLabel(role)}: </span>
                      {hasPermission(role, permission) ? "Allowed" : "Denied"}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </section>
  );
}
