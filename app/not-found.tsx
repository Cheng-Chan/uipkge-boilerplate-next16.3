import Link from "next/link";

export default function NotFoundPage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-xl items-center px-6 py-16">
      <section className="space-y-4">
        <p className="text-sm font-semibold text-blue-700">404</p>
        <h1 className="text-3xl font-semibold text-slate-950">
          Page not found
        </h1>
        <p className="text-slate-600">
          The requested static page does not exist.
        </p>
        <Link
          className="font-medium text-blue-700 underline underline-offset-4"
          href="/"
        >
          Return home
        </Link>
      </section>
    </main>
  );
}
