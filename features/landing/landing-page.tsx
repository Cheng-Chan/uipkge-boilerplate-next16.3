import Link from "next/link";

import type { CatalogueSnapshot } from "@/catalogue/schema";
import { DemoAccountPanel } from "@/features/auth/demo-account-panel";

type LandingPageProps = {
  summary: CatalogueSnapshot["summary"];
};

const capabilities = [
  {
    marker: "01",
    title: "Inspect before install",
    description:
      "Every tracked ID keeps its upstream revision, dependencies, target paths, gaps, and exact implementation ticket together.",
  },
  {
    marker: "02",
    title: "Preview on demand",
    description:
      "Static item routes use an explicit lazy boundary, so browsing metadata never pulls the full component collection into one bundle.",
  },
  {
    marker: "03",
    title: "Simulate safely",
    description:
      "Public demo identities, deterministic fixtures, and local services demonstrate product states without pretending to be a backend.",
  },
] as const;

const workflow = [
  ["Discover", "Reconcile documentation, manifests, and public source."],
  ["Review", "Inspect exact writes, dependencies, and external boundaries."],
  ["Verify", "Exercise the real implementation before advancing its status."],
] as const;

function ArrowIcon() {
  return (
    <svg aria-hidden="true" className="size-4" fill="none" viewBox="0 0 16 16">
      <path
        d="M3 8h9M8.5 4.5 12 8l-3.5 3.5"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
    </svg>
  );
}

export function LandingPage({ summary }: LandingPageProps) {
  const coverage = [
    ["Blocks", summary.byKind.block ?? 0],
    ["Components", summary.byKind.component ?? 0],
    ["Maps", summary.byKind.map ?? 0],
    ["Charts", summary.byKind.chart ?? 0],
  ] as const;
  const largestCoverage = Math.max(...coverage.map(([, count]) => count));

  return (
    <div className="min-h-screen overflow-hidden">
      <a
        className="bg-primary text-primary-foreground focus-visible:ring-ring fixed top-2 left-2 z-[60] -translate-y-20 rounded-lg px-4 py-2 text-sm font-medium focus:translate-y-0 focus-visible:ring-2"
        href="#main-content"
      >
        Skip to content
      </a>

      <header className="border-border/80 bg-background/90 sticky top-0 z-40 border-b backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-5 pr-28 sm:px-8 sm:pr-32 lg:px-10 lg:pr-36">
          <Link
            className="flex items-center gap-2.5 font-semibold tracking-tight"
            href="/"
          >
            <span
              aria-hidden="true"
              className="bg-primary text-primary-foreground grid size-8 place-items-center rounded-lg font-mono text-xs shadow-sm"
            >
              UI
            </span>
            <span>UIPKGE Lab</span>
          </Link>
          <nav
            aria-label="Landing navigation"
            className="hidden items-center gap-7 text-sm md:flex"
          >
            <a
              className="text-muted-foreground hover:text-foreground"
              href="#capabilities"
            >
              Capabilities
            </a>
            <a
              className="text-muted-foreground hover:text-foreground"
              href="#coverage"
            >
              Coverage
            </a>
            <a
              className="text-muted-foreground hover:text-foreground"
              href="#workflow"
            >
              Workflow
            </a>
          </nav>
        </div>
      </header>

      <main id="main-content">
        <section className="relative mx-auto grid max-w-7xl items-center gap-12 px-5 py-16 sm:px-8 sm:py-24 lg:grid-cols-[1.05fr_0.95fr] lg:px-10 lg:py-32">
          <div
            aria-hidden="true"
            className="bg-primary/10 absolute top-0 left-1/2 -z-10 size-[36rem] -translate-x-1/2 rounded-full blur-3xl"
          />
          <div className="space-y-7">
            <div className="border-primary/20 bg-primary/5 text-primary inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold tracking-wide uppercase">
              <span className="bg-primary size-1.5 rounded-full" />
              React catalogue · static by design
            </div>
            <div className="space-y-5">
              <h1 className="max-w-3xl text-5xl leading-[1.02] font-semibold tracking-[-0.045em] text-balance sm:text-6xl lg:text-7xl">
                Explore the system.{" "}
                <span className="text-primary">Own every component.</span>
              </h1>
              <p className="text-muted-foreground max-w-2xl text-lg leading-8 sm:text-xl">
                A frontend-only application foundation and auditable UIPKGE
                laboratory. Inspect provenance, permissions, and local product
                states before any component earns a verified badge.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                className="bg-primary text-primary-foreground inline-flex items-center gap-2 rounded-lg px-5 py-3 font-semibold shadow-sm"
                href="/ui-kit/gallery"
                prefetch={false}
              >
                View {summary.catalogueByStatus.verified ?? 0} live components{" "}
                <ArrowIcon />
              </Link>
              <Link
                className="border-input bg-background inline-flex items-center gap-2 rounded-lg border px-5 py-3 font-semibold"
                href="/ui-kit"
                prefetch={false}
              >
                Explore UI kit <ArrowIcon />
              </Link>
              <Link
                className="text-muted-foreground hover:text-foreground inline-flex items-center px-2 py-3 font-semibold"
                href="/login"
              >
                View demo accounts
              </Link>
            </div>
            <p className="text-muted-foreground flex items-center gap-2 text-sm">
              <span aria-hidden="true" className="text-success">
                ●
              </span>
              No backend, private credentials, or required external services.
            </p>
          </div>

          <figure className="border-border bg-card relative mx-auto w-full max-w-xl overflow-hidden rounded-2xl border p-3 shadow-xl">
            <div className="border-border bg-muted/50 flex items-center justify-between rounded-xl border px-4 py-3">
              <div className="flex gap-1.5" aria-hidden="true">
                <span className="bg-destructive/70 size-2.5 rounded-full" />
                <span className="bg-warning/80 size-2.5 rounded-full" />
                <span className="bg-success/70 size-2.5 rounded-full" />
              </div>
              <span className="text-muted-foreground font-mono text-[0.65rem]">
                catalogue/snapshot.json
              </span>
              <span className="text-success text-xs">verified source</span>
            </div>
            <div className="grid gap-3 p-3 sm:grid-cols-2">
              <div className="bg-foreground text-background overflow-hidden rounded-xl p-5 sm:row-span-2">
                <p className="text-background/60 font-mono text-xs">
                  $ pnpm registry:check
                </p>
                <div className="mt-8 space-y-4 font-mono text-xs">
                  <p>
                    <span className="text-success">✓</span> IDs deduplicated
                  </p>
                  <p>
                    <span className="text-success">✓</span> routes reconciled
                  </p>
                  <p>
                    <span className="text-success">✓</span> evidence enforced
                  </p>
                </div>
                <p className="text-background/60 mt-9 border-t border-current/15 pt-4 text-xs leading-5">
                  Offline checks protect coverage claims without contacting the
                  registry.
                </p>
              </div>
              <div className="border-border rounded-xl border p-4">
                <p className="text-muted-foreground text-xs">Tracked records</p>
                <p className="mt-2 text-3xl font-semibold tabular-nums">
                  {summary.total}
                </p>
                <div className="bg-muted mt-4 h-1.5 overflow-hidden rounded-full">
                  <div className="bg-primary h-full w-[95%] rounded-full" />
                </div>
              </div>
              <div className="border-border rounded-xl border p-4">
                <p className="text-muted-foreground text-xs">
                  Current visual status
                </p>
                <div className="mt-3 flex items-end justify-between gap-3">
                  <p className="font-semibold">Discovery</p>
                  <p className="text-primary font-mono text-xs">
                    {summary.catalogueByStatus.discovered ?? 0} ready to review
                  </p>
                </div>
                <div className="mt-4 grid grid-cols-7 gap-1" aria-hidden="true">
                  {Array.from({ length: 21 }, (_, index) => (
                    <span
                      className={[
                        "h-5 rounded-sm",
                        index < 19 ? "bg-primary/70" : "bg-warning/60",
                      ].join(" ")}
                      key={index}
                    />
                  ))}
                </div>
              </div>
            </div>
            <figcaption className="text-muted-foreground px-4 pb-3 text-center text-xs">
              Live counts from the tracked, hash-backed snapshot.
            </figcaption>
          </figure>
        </section>

        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
          <aside
            aria-label="Demo security warning"
            className="border-warning/30 bg-warning/10 flex flex-col gap-2 rounded-xl border px-5 py-4 text-sm leading-6 sm:flex-row sm:items-center sm:justify-between"
          >
            <p>
              <strong>Demo only.</strong> Authentication, permissions, and data
              are simulated in your browser. Do not enter real credentials or
              sensitive information.
            </p>
            <span className="text-muted-foreground shrink-0 font-mono text-xs">
              frontend presentation ≠ security boundary
            </span>
          </aside>
        </div>

        <section
          className="mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-28 lg:px-10"
          id="capabilities"
        >
          <div className="max-w-2xl space-y-3">
            <p className="text-primary text-sm font-semibold tracking-wide uppercase">
              Built for scrutiny
            </p>
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              A laboratory, not a screenshot gallery.
            </h2>
            <p className="text-muted-foreground leading-7">
              The useful part is not how many cards fit on a page. It is whether
              each implementation can be traced, isolated, exercised, and
              removed.
            </p>
          </div>
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {capabilities.map((capability) => (
              <article
                className="border-border bg-card rounded-xl border p-6 transition-[transform,box-shadow]"
                data-slot="card"
                key={capability.title}
              >
                <div className="text-primary border-primary/20 bg-primary/5 grid size-10 place-items-center rounded-lg border font-mono text-xs font-semibold">
                  {capability.marker}
                </div>
                <h3 className="mt-8 text-lg font-semibold">
                  {capability.title}
                </h3>
                <p className="text-muted-foreground mt-3 text-sm leading-6">
                  {capability.description}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section className="border-y-border bg-muted/40 border-y" id="coverage">
          <div className="mx-auto grid max-w-7xl gap-12 px-5 py-20 sm:px-8 sm:py-28 lg:grid-cols-[0.8fr_1.2fr] lg:px-10">
            <div className="space-y-5">
              <p className="text-primary text-sm font-semibold tracking-wide uppercase">
                Dated coverage
              </p>
              <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                Every discovered React ID has a record.
              </h2>
              <p className="text-muted-foreground leading-7">
                The snapshot separates what exists upstream from what has
                actually been installed and verified here.
              </p>
              <Link
                className="text-primary inline-flex items-center gap-2 font-semibold hover:underline"
                href="/ui-kit"
                prefetch={false}
              >
                Browse all records <ArrowIcon />
              </Link>
            </div>
            <div className="border-border bg-card rounded-2xl border p-6 shadow-sm sm:p-8">
              <div className="space-y-6">
                {coverage.map(([name, count]) => (
                  <div key={name}>
                    <div className="mb-2 flex items-center justify-between gap-4 text-sm">
                      <span className="font-medium">{name}</span>
                      <span className="text-muted-foreground font-mono tabular-nums">
                        {count}
                      </span>
                    </div>
                    <div className="bg-muted h-2 overflow-hidden rounded-full">
                      <div
                        className="bg-primary h-full rounded-full"
                        style={{
                          width:
                            ((count / largestCoverage) * 100).toString() + "%",
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
              <div className="border-border mt-8 grid grid-cols-2 gap-4 border-t pt-6">
                <div>
                  <p className="text-2xl font-semibold tabular-nums">
                    {summary.manifestAvailable}
                  </p>
                  <p className="text-muted-foreground mt-1 text-xs">
                    Live manifests
                  </p>
                </div>
                <div>
                  <p className="text-warning text-2xl font-semibold tabular-nums">
                    {summary.manifestUnavailable}
                  </p>
                  <p className="text-muted-foreground mt-1 text-xs">
                    Blocked upstream
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section
          className="mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-28 lg:px-10"
          id="workflow"
        >
          <div className="grid gap-12 lg:grid-cols-[0.7fr_1.3fr]">
            <div className="space-y-3">
              <p className="text-primary text-sm font-semibold tracking-wide uppercase">
                Review workflow
              </p>
              <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                Progress is evidence, not optimism.
              </h2>
            </div>
            <ol className="border-border divide-border overflow-hidden rounded-2xl border sm:grid sm:grid-cols-3 sm:divide-x">
              {workflow.map(([title, description], index) => (
                <li className="bg-card p-6" key={title}>
                  <span className="text-muted-foreground font-mono text-xs">
                    0{index + 1}
                  </span>
                  <h3 className="mt-6 font-semibold">{title}</h3>
                  <p className="text-muted-foreground mt-2 text-sm leading-6">
                    {description}
                  </p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-5 pb-20 sm:px-8 sm:pb-28 lg:px-10">
          <div className="bg-foreground text-background relative overflow-hidden rounded-2xl px-6 py-10 sm:px-10 sm:py-12">
            <div
              aria-hidden="true"
              className="bg-primary/30 absolute -top-24 -right-24 size-72 rounded-full blur-3xl"
            />
            <div className="relative grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
              <div className="max-w-2xl">
                <p className="text-background/60 text-sm font-semibold tracking-wide uppercase">
                  Enter the local demo
                </p>
                <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
                  Choose a public role, then inspect the system from the inside.
                </h2>
                <p className="text-background/70 mt-4 leading-7">
                  Nothing is provisioned, delivered, or protected by a server.
                  The experience is deliberately transparent.
                </p>
              </div>
              <Link
                className="bg-background text-foreground inline-flex w-fit items-center gap-2 rounded-lg px-5 py-3 font-semibold"
                href="/login"
              >
                Choose demo account <ArrowIcon />
              </Link>
            </div>
          </div>
          <div className="mt-6">
            <DemoAccountPanel />
          </div>
        </section>
      </main>

      <footer className="border-border border-t">
        <div className="text-muted-foreground mx-auto flex max-w-7xl flex-col gap-3 px-5 py-8 text-sm sm:flex-row sm:items-center sm:justify-between sm:px-8 lg:px-10">
          <p>UIPKGE laboratory · frontend-only static demonstration</p>
          <div className="flex gap-5">
            <Link
              className="hover:text-foreground"
              href="/ui-kit"
              prefetch={false}
            >
              UI kit
            </Link>
            <Link className="hover:text-foreground" href="/signup">
              Simulated sign-up
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
