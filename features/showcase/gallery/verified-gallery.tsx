import Link from "next/link";

import type { CatalogueItem } from "@/catalogue/schema";

import { PreviewReveal } from "./preview-reveal";

type GalleryGroup = {
  id: string;
  label: string;
  items: CatalogueItem[];
};

function label(value: string) {
  return value
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export function groupVerifiedItems(
  items: readonly CatalogueItem[],
): GalleryGroup[] {
  const groups = new Map<string, CatalogueItem[]>();

  for (const item of items) {
    if (item.status !== "verified" || !item.previewModule) continue;
    const category = item.categories[0];
    const group = groups.get(category) ?? [];
    group.push(item);
    groups.set(category, group);
  }

  return [...groups.entries()]
    .map(([id, groupItems]) => ({
      id,
      label: label(id),
      items: groupItems.toSorted((a, b) => a.title.localeCompare(b.title)),
    }))
    .toSorted((a, b) => a.label.localeCompare(b.label));
}

export function VerifiedGallery({
  items,
}: {
  items: readonly CatalogueItem[];
}) {
  const groups = groupVerifiedItems(items);
  const itemCount = groups.reduce(
    (total, group) => total + group.items.length,
    0,
  );

  return (
    <div className="space-y-10">
      <header className="space-y-4">
        <p className="text-primary text-sm font-semibold tracking-wide uppercase">
          Live component gallery
        </p>
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            {itemCount} verified components, ready to try
          </h1>
          <p className="text-muted-foreground max-w-3xl leading-7">
            Every preview below is the installed component, not a screenshot.
            Load only the examples you want to inspect; each remains isolated in
            its own lazy boundary.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link
            className="bg-primary text-primary-foreground rounded-lg px-4 py-2 text-sm font-semibold"
            href="/ui-kit?status=verified"
            prefetch={false}
          >
            Browse verified records
          </Link>
          <Link
            className="border-input rounded-lg border px-4 py-2 text-sm font-semibold"
            href="/ui-kit"
            prefetch={false}
          >
            Browse all catalogue records
          </Link>
        </div>
      </header>

      <nav
        aria-label="Component groups"
        className="border-border bg-card rounded-xl border p-4"
      >
        <p className="text-sm font-semibold">Jump to a group</p>
        <ul className="mt-3 flex flex-wrap gap-2">
          {groups.map((group) => (
            <li key={group.id}>
              <a
                className="border-border text-muted-foreground hover:text-foreground inline-flex rounded-full border px-3 py-1.5 text-sm"
                href={`#group-${group.id}`}
              >
                {group.label} ({group.items.length})
              </a>
            </li>
          ))}
        </ul>
      </nav>

      {groups.map((group) => (
        <section
          aria-labelledby={`group-${group.id}-title`}
          className="scroll-mt-36 space-y-5"
          id={`group-${group.id}`}
          key={group.id}
        >
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-muted-foreground text-sm">
                {group.items.length} verified
              </p>
              <h2
                className="text-2xl font-semibold tracking-tight"
                id={`group-${group.id}-title`}
              >
                {group.label}
              </h2>
            </div>
            <a
              className="text-primary text-sm font-semibold hover:underline"
              href="#main-content"
            >
              Back to top
            </a>
          </div>

          <div className="space-y-4">
            {group.items.map((item) => (
              <article
                className="border-border bg-card min-w-0 space-y-5 rounded-xl border p-5"
                key={item.id}
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="space-y-1">
                    <p className="text-muted-foreground font-mono text-xs">
                      {item.id}
                    </p>
                    <h3 className="text-lg font-semibold">{item.title}</h3>
                    <p className="text-muted-foreground max-w-3xl text-sm leading-6">
                      {item.description}
                    </p>
                  </div>
                  <Link
                    className="text-primary text-sm font-semibold hover:underline"
                    href={item.demoRoute}
                    prefetch={false}
                  >
                    Open full record →
                  </Link>
                </div>
                <PreviewReveal itemId={item.id} title={item.title} />
              </article>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
