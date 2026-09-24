import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { catalogueItemById, catalogueSnapshot } from "@/catalogue/data";
import { CataloguePreview } from "@/features/showcase/previews/preview-runtime";

export const dynamicParams = false;

export function generateStaticParams() {
  return catalogueSnapshot.items.map(({ id }) => ({ slug: id }));
}

export async function generateMetadata({
  params,
}: PageProps<"/ui-kit/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const item = catalogueItemById(slug);
  return {
    title: item
      ? `${item.title} | UIPKGE catalogue`
      : "Catalogue item not found",
  };
}

export default async function CatalogueItemPage({
  params,
}: PageProps<"/ui-kit/[slug]">) {
  const { slug } = await params;
  const item = catalogueItemById(slug);
  if (!item) notFound();
  return (
    <article className="space-y-8">
      <div className="space-y-3">
        <Link
          className="text-primary text-sm font-semibold hover:underline"
          href="/ui-kit"
          prefetch={false}
        >
          ← Back to catalogue
        </Link>
        <p className="text-muted-foreground font-mono text-xs">{item.id}</p>
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            {item.title}
          </h1>
          <span className="bg-secondary text-secondary-foreground rounded-full px-2.5 py-1 text-xs font-medium">
            {item.status}
          </span>
        </div>
        <p className="text-muted-foreground max-w-3xl leading-7">
          {item.description}
        </p>
      </div>

      <CataloguePreview itemId={item.id} status={item.status} />

      <section className="border-border bg-card rounded-xl border p-5">
        <h2 className="text-lg font-semibold">Tracked record</h2>
        <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
          <Record label="Kind" value={item.kind} />
          <Record label="Categories" value={item.categories.join(", ")} />
          <Record
            label="Manifest hash"
            value={item.manifestEntrySha256 ?? "Unavailable"}
          />
          <Record
            label="Public source"
            value={item.source.path ?? "Unavailable at captured revision"}
          />
          <Record
            label="Target paths"
            value={item.targetPaths.join(", ") || "Unknown"}
          />
          <Record
            label="Registry dependencies"
            value={
              item.dependencies.registryItems.join(", ") || "None declared"
            }
          />
          <Record
            label="Package dependencies"
            value={item.dependencies.packages.join(", ") || "None declared"}
          />
          <Record
            label="External requirements"
            value={
              item.externalRequirements.join(", ") ||
              "None declared by manifest"
            }
          />
        </dl>
        {item.gaps.length ? (
          <div className="border-warning/30 bg-warning/10 mt-5 rounded-lg border p-4">
            <h3 className="font-medium">Known gaps</h3>
            <ul className="text-muted-foreground mt-2 list-disc space-y-1 pl-5 text-sm">
              {item.gaps.map((gap) => (
                <li key={gap}>{gap}</li>
              ))}
            </ul>
          </div>
        ) : null}
      </section>
    </article>
  );
}

function Record({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0">
      <dt className="font-medium">{label}</dt>
      <dd className="text-muted-foreground mt-1 break-words">{value}</dd>
    </div>
  );
}
