"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useMemo, useTransition } from "react";

import type { CatalogueItem, CatalogueSnapshot } from "@/catalogue/schema";
import { hasPermission } from "@/features/access-control/policy";
import { useDemoSession } from "@/features/auth/session/session-provider";

import { filterCatalogueItems } from "./filter-catalogue";

const PAGE_SIZE = 48;
const kinds = [
  "all",
  "component",
  "block",
  "chart",
  "map",
  "foundation",
] as const;
const statuses = [
  "all",
  "discovered",
  "installed",
  "demo-ready",
  "verified",
  "blocked",
  "approved-exception",
] as const;

type CatalogueBrowserProps = {
  items: readonly CatalogueItem[];
  summary: CatalogueSnapshot["summary"];
};

function label(value: string) {
  return value
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export function CatalogueBrowser({ items, summary }: CatalogueBrowserProps) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { state } = useDemoSession();
  const [isPending, startTransition] = useTransition();
  const query = searchParams.get("q") ?? "";
  const requestedKind = searchParams.get("kind") ?? "all";
  const kind = kinds.includes(requestedKind as (typeof kinds)[number])
    ? (requestedKind as (typeof kinds)[number])
    : "all";
  const requestedStatus = searchParams.get("status") ?? "all";
  const status = statuses.includes(requestedStatus as (typeof statuses)[number])
    ? (requestedStatus as (typeof statuses)[number])
    : "all";
  const category = searchParams.get("category") ?? "all";
  const requestedPage = Number.parseInt(searchParams.get("page") ?? "1", 10);
  const categories = useMemo(
    () => [...new Set(items.flatMap((item) => item.categories))].sort(),
    [items],
  );
  const filtered = useMemo(
    () => filterCatalogueItems(items, { category, kind, query, status }),
    [category, items, kind, query, status],
  );
  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const page = Number.isFinite(requestedPage)
    ? Math.min(Math.max(requestedPage, 1), pageCount)
    : 1;
  const visibleItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const canOpenPreviews =
    state.status === "authenticated" &&
    hasPermission(state.identity.role, "showcase.view");

  function setParameter(name: string, value: string) {
    const next = new URLSearchParams(searchParams.toString());
    if (!value || value === "all" || (name === "page" && value === "1")) {
      next.delete(name);
    } else {
      next.set(name, value);
    }
    if (name !== "page") next.delete("page");
    const suffix = next.toString();
    startTransition(() =>
      router.replace(suffix ? `${pathname}?${suffix}` : pathname),
    );
  }

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <p className="text-primary text-sm font-semibold tracking-wide uppercase">
          Manifest-driven laboratory
        </p>
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          UIPKGE React catalogue
        </h1>
        <p className="text-muted-foreground max-w-3xl leading-7">
          This browser reflects the dated local snapshot. Discovered is not
          installed, and only real previews with recorded evidence can advance
          to demo-ready or verified.
        </p>
      </div>

      <section
        aria-label="Catalogue coverage"
        className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4"
      >
        {[
          ["Tracked", summary.total],
          ["Visual catalogue", summary.catalogueTotal],
          ["Manifest unavailable", summary.manifestUnavailable],
          ["Verified visual", summary.catalogueByStatus.verified ?? 0],
        ].map(([name, value]) => (
          <article
            className="border-border bg-card rounded-xl border p-4"
            key={name}
          >
            <p className="text-muted-foreground text-sm">{name}</p>
            <p className="mt-1 text-2xl font-semibold tabular-nums">{value}</p>
          </article>
        ))}
      </section>

      <section
        className="border-border bg-card rounded-xl border p-4"
        aria-label="Catalogue filters"
      >
        <div className="grid gap-4 lg:grid-cols-4">
          <label className="space-y-1 text-sm font-medium">
            <span>Search</span>
            <input
              className="border-input bg-background w-full rounded-lg border px-3 py-2 font-normal"
              onChange={(event) => setParameter("q", event.currentTarget.value)}
              placeholder="ID, name, dependency…"
              type="search"
              value={query}
            />
          </label>
          <FilterSelect
            label="Kind"
            onChange={(value) => setParameter("kind", value)}
            options={kinds}
            value={kind}
          />
          <FilterSelect
            label="Status"
            onChange={(value) => setParameter("status", value)}
            options={statuses}
            value={status}
          />
          <FilterSelect
            label="Category"
            onChange={(value) => setParameter("category", value)}
            options={["all", ...categories]}
            value={category}
          />
        </div>
        <p aria-live="polite" className="text-muted-foreground mt-3 text-sm">
          {isPending
            ? "Updating results…"
            : `${filtered.length} matching items`}
        </p>
      </section>

      {visibleItems.length ? (
        <ul className="grid gap-4 xl:grid-cols-2">
          {visibleItems.map((item) => (
            <li
              className="border-border bg-card rounded-xl border p-5"
              key={item.id}
            >
              <article className="space-y-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-muted-foreground font-mono text-xs">
                      {item.id}
                    </p>
                    <h2 className="mt-1 text-lg font-semibold">{item.title}</h2>
                  </div>
                  <span className="bg-secondary text-secondary-foreground rounded-full px-2.5 py-1 text-xs font-medium">
                    {label(item.status)}
                  </span>
                </div>
                <p className="text-muted-foreground line-clamp-3 text-sm leading-6">
                  {item.description}
                </p>
                <div className="flex flex-wrap gap-2 text-xs">
                  <span className="border-border rounded-full border px-2 py-1">
                    {label(item.kind)}
                  </span>
                  {item.categories.slice(0, 3).map((value) => (
                    <span
                      className="border-border rounded-full border px-2 py-1"
                      key={value}
                    >
                      {label(value)}
                    </span>
                  ))}
                </div>
                <details className="text-sm">
                  <summary className="cursor-pointer font-medium">
                    Provenance and install details
                  </summary>
                  <dl className="text-muted-foreground mt-3 grid gap-2 break-words">
                    <div>
                      <dt className="text-foreground inline font-medium">
                        Manifest:{" "}
                      </dt>
                      <dd className="inline">
                        {item.manifestEntrySha256 ?? "Unavailable"}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-foreground inline font-medium">
                        Source:{" "}
                      </dt>
                      <dd className="inline">
                        {item.source.path ??
                          "Not present in the public revision"}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-foreground inline font-medium">
                        Targets:{" "}
                      </dt>
                      <dd className="inline">
                        {item.targetPaths.join(", ") ||
                          "Unknown until a manifest is published"}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-foreground inline font-medium">
                        Packages:{" "}
                      </dt>
                      <dd className="inline">
                        {item.dependencies.packages.join(", ") ||
                          "None declared"}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-foreground inline font-medium">
                        External:{" "}
                      </dt>
                      <dd className="inline">
                        {item.externalRequirements.join(", ") ||
                          "None declared by the manifest"}
                      </dd>
                    </div>
                  </dl>
                </details>
                {canOpenPreviews ? (
                  <Link
                    className="text-primary inline-flex text-sm font-semibold hover:underline"
                    href={item.demoRoute}
                    prefetch={false}
                  >
                    Open item record <span aria-hidden="true">→</span>
                  </Link>
                ) : (
                  <p className="text-muted-foreground text-sm">
                    Your current demo role cannot open showcase routes.
                  </p>
                )}
              </article>
            </li>
          ))}
        </ul>
      ) : (
        <div className="border-border rounded-xl border border-dashed p-10 text-center">
          <h2 className="font-semibold">No matching items</h2>
          <p className="text-muted-foreground mt-2 text-sm">
            Try a broader search or clear one of the filters.
          </p>
        </div>
      )}

      <nav
        aria-label="Catalogue pages"
        className="flex items-center justify-between gap-4"
      >
        <button
          className="border-input rounded-lg border px-3 py-2 text-sm font-medium disabled:opacity-50"
          disabled={page === 1}
          onClick={() => setParameter("page", String(page - 1))}
          type="button"
        >
          Previous
        </button>
        <p className="text-muted-foreground text-sm">
          Page {page} of {pageCount}
        </p>
        <button
          className="border-input rounded-lg border px-3 py-2 text-sm font-medium disabled:opacity-50"
          disabled={page === pageCount}
          onClick={() => setParameter("page", String(page + 1))}
          type="button"
        >
          Next
        </button>
      </nav>
    </div>
  );
}

function FilterSelect({
  label: selectLabel,
  onChange,
  options,
  value,
}: {
  label: string;
  onChange: (value: string) => void;
  options: readonly string[];
  value: string;
}) {
  return (
    <label className="space-y-1 text-sm font-medium">
      <span>{selectLabel}</span>
      <select
        className="border-input bg-background w-full rounded-lg border px-3 py-2 font-normal"
        onChange={(event) => onChange(event.currentTarget.value)}
        value={value}
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {label(option)}
          </option>
        ))}
      </select>
    </label>
  );
}
