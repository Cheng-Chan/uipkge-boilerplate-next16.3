import { DemoAccountPanel } from "@/features/auth/demo-account-panel";

export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-3xl items-center px-6 py-16">
      <section className="space-y-6">
        <p className="text-primary text-sm font-semibold tracking-wide uppercase">
          Frontend-only foundation
        </p>
        <h1 className="text-foreground text-4xl font-semibold tracking-tight sm:text-5xl">
          UIPKGE boilerplate and component laboratory
        </h1>
        <p className="text-muted-foreground max-w-2xl text-lg leading-8">
          This compatibility shell uses Next.js static export. Application data
          and operations will remain local to the browser.
        </p>
        <aside
          aria-label="Demo security warning"
          className="border-warning/40 bg-warning/10 text-foreground rounded-xl border p-4 text-sm leading-6"
        >
          <strong>Demo only.</strong> Authentication, permissions, and data are
          simulated in your browser. Do not enter real credentials or sensitive
          information.
        </aside>
        <DemoAccountPanel />
      </section>
    </main>
  );
}
