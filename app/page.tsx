export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-3xl items-center px-6 py-16">
      <section className="space-y-6">
        <p className="text-sm font-semibold tracking-wide text-blue-700 uppercase">
          Frontend-only foundation
        </p>
        <h1 className="text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
          UIPKGE boilerplate and component laboratory
        </h1>
        <p className="max-w-2xl text-lg leading-8 text-slate-600">
          This compatibility shell uses Next.js static export. Application data
          and operations will remain local to the browser.
        </p>
        <aside
          aria-label="Demo security warning"
          className="rounded-xl border border-amber-300 bg-amber-50 p-4 text-sm leading-6 text-amber-950"
        >
          <strong>Demo only.</strong> Authentication, permissions, and data are
          simulated in your browser. Do not enter real credentials or sensitive
          information.
        </aside>
      </section>
    </main>
  );
}
