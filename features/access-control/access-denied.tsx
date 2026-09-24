import Link from "next/link";

export function AccessDenied({
  reason = "forbidden",
}: {
  reason?: "forbidden" | "unknown-route";
}) {
  return (
    <section className="mx-auto flex min-h-[60vh] max-w-2xl items-center px-6 py-12">
      <div className="border-border bg-card w-full space-y-5 rounded-2xl border p-8 shadow-sm">
        <p className="text-destructive text-sm font-semibold tracking-wide uppercase">
          403 · Access denied
        </p>
        <h1 className="text-3xl font-semibold tracking-tight">
          This demo role cannot open this page
        </h1>
        <p className="text-muted-foreground leading-7">
          {reason === "unknown-route"
            ? "The route is not mapped by the demo policy, so access is denied by default."
            : "Your current fixture identity does not have the permission required for this route."}
        </p>
        <aside
          aria-label="Frontend-only access limitation"
          className="border-warning/40 bg-warning/10 rounded-xl border p-4 text-sm leading-6"
        >
          This is frontend presentation behavior, not server authorization.
          Static files, fixtures, and policy code remain public and must not
          contain confidential data.
        </aside>
        <Link
          className="bg-primary text-primary-foreground inline-flex rounded-lg px-4 py-2 font-medium"
          href="/dashboard"
        >
          Return to dashboard
        </Link>
      </div>
    </section>
  );
}
