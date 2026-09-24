import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Application foundation | UIPKGE Boilerplate",
};

export default function DashboardPage() {
  return (
    <section className="space-y-6">
      <div className="space-y-2">
        <p className="text-primary text-sm font-semibold tracking-wide uppercase">
          Authenticated foundation
        </p>
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          Application shell
        </h1>
        <p className="text-muted-foreground max-w-3xl leading-7">
          This lightweight entry verifies the shared shell, local session, and
          permission-aware navigation. KPI cards, charts, and business content
          remain assigned to their separate feature tickets.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <article className="border-border bg-card rounded-xl border p-5">
          <h2 className="font-semibold">Local session</h2>
          <p className="text-muted-foreground mt-2 text-sm leading-6">
            Refresh restoration stores only a versioned synthetic identity
            reference in this browser tab.
          </p>
        </article>
        <article className="border-border bg-card rounded-xl border p-5">
          <h2 className="font-semibold">Presentation-only policy</h2>
          <p className="text-muted-foreground mt-2 text-sm leading-6">
            Navigation and page states demonstrate permissions but do not
            protect data on a static host.
          </p>
        </article>
      </div>
    </section>
  );
}
