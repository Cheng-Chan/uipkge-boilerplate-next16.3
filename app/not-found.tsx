import Link from "next/link";

export default function NotFoundPage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-xl items-center px-6 py-16">
      <section className="space-y-4">
        <p className="text-primary text-sm font-semibold">404</p>
        <h1 className="text-foreground text-3xl font-semibold">
          Page not found
        </h1>
        <p className="text-muted-foreground">
          The requested static page does not exist.
        </p>
        <Link
          className="text-primary font-medium underline underline-offset-4"
          href="/"
        >
          Return home
        </Link>
      </section>
    </main>
  );
}
