import { z } from "zod";

const slugSchema = z
  .string()
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "must be a lowercase kebab-case ID");
const sha256Schema = z.string().regex(/^[a-f0-9]{64}$/);
const gitShaSchema = z.string().regex(/^[a-f0-9]{40}$/);

export const catalogueStatusSchema = z.enum([
  "discovered",
  "installed",
  "demo-ready",
  "verified",
  "blocked",
  "approved-exception",
]);

export const catalogueKindSchema = z.enum([
  "component",
  "block",
  "chart",
  "map",
  "foundation",
]);

export const catalogueItemSchema = z.object({
  id: slugSchema,
  title: z.string().min(1),
  description: z.string().min(1),
  scope: z.enum(["catalogue", "foundation"]),
  kind: catalogueKindSchema,
  categories: z.array(slugSchema).min(1),
  registryType: z.string().nullable(),
  status: catalogueStatusSchema,
  manifestUrl: z.url().nullable(),
  manifestEntrySha256: sha256Schema.nullable(),
  documentationUrl: z.url().nullable(),
  source: z.object({
    repository: z.url(),
    revision: gitShaSchema,
    path: z.string().nullable(),
    blobSha: gitShaSchema.nullable(),
    available: z.boolean(),
  }),
  dependencies: z.object({
    packages: z.array(z.string()),
    devPackages: z.array(z.string()),
    registryItems: z.array(slugSchema),
  }),
  targetPaths: z.array(z.string()),
  installedPaths: z.array(z.string()),
  demoRoute: z.string().startsWith("/ui-kit/"),
  requiredPermission: z.literal("showcase.view"),
  previewModule: z.string().nullable(),
  externalRequirements: z.array(z.string()),
  evidence: z.array(z.string()),
  adaptations: z.array(z.string()),
  gaps: z.array(z.string()),
});

export const catalogueSnapshotSchema = z.object({
  $schema: z.literal("./schema/snapshot.schema.json"),
  schemaVersion: z.literal(1),
  capturedAt: z.iso.datetime(),
  framework: z.literal("react"),
  upstreamRevision: gitShaSchema,
  summary: z.object({
    total: z.number().int().nonnegative(),
    catalogueTotal: z.number().int().nonnegative(),
    foundationTotal: z.number().int().nonnegative(),
    manifestAvailable: z.number().int().nonnegative(),
    manifestUnavailable: z.number().int().nonnegative(),
    publicSourceAvailable: z.number().int().nonnegative(),
    publicSourceUnavailable: z.number().int().nonnegative(),
    byKind: z.partialRecord(
      catalogueKindSchema,
      z.number().int().nonnegative(),
    ),
    byStatus: z.partialRecord(
      catalogueStatusSchema,
      z.number().int().nonnegative(),
    ),
    catalogueByStatus: z.partialRecord(
      catalogueStatusSchema,
      z.number().int().nonnegative(),
    ),
    foundationByStatus: z.partialRecord(
      catalogueStatusSchema,
      z.number().int().nonnegative(),
    ),
  }),
  items: z.array(catalogueItemSchema),
});

const sourceRecordSchema = z.object({
  id: slugSchema,
  url: z.url(),
  purpose: z.string().min(1),
  sha256: sha256Schema,
  bytes: z.number().int().positive(),
});

export const catalogueProvenanceSchema = z.object({
  $schema: z.literal("./schema/provenance.schema.json"),
  schemaVersion: z.literal(1),
  capturedAt: z.iso.datetime(),
  framework: z.literal("react"),
  repository: z.object({
    url: z.url(),
    revision: gitShaSchema,
    committedAt: z.iso.datetime(),
    treeSha: gitShaSchema,
  }),
  sources: z.array(sourceRecordSchema).min(1),
  reconciliation: z.object({
    registryIds: z.number().int().nonnegative(),
    llmsManifestIds: z.number().int().nonnegative(),
    documentation: z.object({
      components: z.number().int().nonnegative(),
      blocks: z.number().int().nonnegative(),
      charts: z.number().int().nonnegative(),
      maps: z.number().int().nonnegative(),
      union: z.number().int().nonnegative(),
    }),
    deduplicatedTotal: z.number().int().nonnegative(),
    manifestAvailable: z.number().int().nonnegative(),
    manifestUnavailable: z.number().int().nonnegative(),
    publicSourceAvailable: z.number().int().nonnegative(),
    missingManifestIds: z.array(slugSchema),
    undocumentedRegistryIds: z.array(slugSchema),
  }),
  knownGaps: z.array(z.string().min(1)),
});

const catalogueTicketSchema = z.object({
  id: z.string().regex(/^CAT\d{3}$/),
  status: z.enum(["planned", "blocked-upstream", "complete"]),
  kind: catalogueKindSchema,
  category: slugSchema,
  complex: z.boolean(),
  itemIds: z.array(slugSchema).min(1).max(5),
  dependencies: z.array(z.string()).min(1),
  title: z.string().min(1),
  acceptance: z.array(z.string().min(1)).min(1),
});

export const catalogueTicketsSchema = z.object({
  $schema: z.literal("./schema/tickets.schema.json"),
  schemaVersion: z.literal(1),
  generatedFrom: z.object({
    capturedAt: z.iso.datetime(),
    upstreamRevision: gitShaSchema,
    snapshotSha256: sha256Schema,
  }),
  summary: z.object({
    tickets: z.number().int().nonnegative(),
    planned: z.number().int().nonnegative(),
    blockedUpstream: z.number().int().nonnegative(),
    complete: z.number().int().nonnegative(),
    items: z.number().int().nonnegative(),
  }),
  tickets: z.array(catalogueTicketSchema),
});

export type CatalogueItem = z.infer<typeof catalogueItemSchema>;
export type CatalogueSnapshot = z.infer<typeof catalogueSnapshotSchema>;
export type CatalogueProvenance = z.infer<typeof catalogueProvenanceSchema>;
export type CatalogueTickets = z.infer<typeof catalogueTicketsSchema>;
export type CatalogueKind = z.infer<typeof catalogueKindSchema>;
export type CatalogueStatus = z.infer<typeof catalogueStatusSchema>;

type ValidationOptions = {
  previewSlugs?: readonly string[];
  pathExists?: (path: string) => boolean;
};

export class CatalogueValidationError extends Error {
  readonly issues: readonly string[];

  constructor(issues: readonly string[]) {
    super(`Catalogue validation failed:\n- ${issues.join("\n- ")}`);
    this.name = "CatalogueValidationError";
    this.issues = issues;
  }
}

function parseWithIssues<T>(
  label: string,
  schema: z.ZodType<T>,
  input: unknown,
  issues: string[],
): T | null {
  const result = schema.safeParse(input);
  if (result.success) return result.data;
  for (const issue of result.error.issues) {
    issues.push(`${label}.${issue.path.join(".") || "root"}: ${issue.message}`);
  }
  return null;
}

function countBy<T extends string>(
  values: readonly T[],
): Record<string, number> {
  return values.reduce<Record<string, number>>((counts, value) => {
    counts[value] = (counts[value] ?? 0) + 1;
    return counts;
  }, {});
}

function sameCounts(
  expected: Record<string, number>,
  actual: Record<string, number>,
) {
  const keys = new Set([...Object.keys(expected), ...Object.keys(actual)]);
  return [...keys].every((key) => (expected[key] ?? 0) === (actual[key] ?? 0));
}

function isSafeProjectPath(value: string) {
  return (
    !value.startsWith("/") &&
    !value.includes("\\") &&
    !value.split("/").includes("..") &&
    ["app", "components", "hooks", "lib", "styles"].includes(
      value.split("/")[0] ?? "",
    )
  );
}

export function validateCatalogueData(
  snapshotInput: unknown,
  provenanceInput: unknown,
  ticketsInput: unknown,
  options: ValidationOptions = {},
) {
  const issues: string[] = [];
  const snapshot = parseWithIssues(
    "snapshot",
    catalogueSnapshotSchema,
    snapshotInput,
    issues,
  );
  const provenance = parseWithIssues(
    "provenance",
    catalogueProvenanceSchema,
    provenanceInput,
    issues,
  );
  const tickets = parseWithIssues(
    "tickets",
    catalogueTicketsSchema,
    ticketsInput,
    issues,
  );
  if (!snapshot || !provenance || !tickets) {
    throw new CatalogueValidationError(issues);
  }

  const itemIds = snapshot.items.map(({ id }) => id);
  const itemIdSet = new Set(itemIds);
  if (itemIdSet.size !== itemIds.length)
    issues.push("snapshot contains duplicate item IDs");

  const previewSlugSet = new Set(options.previewSlugs ?? []);
  if (previewSlugSet.size !== (options.previewSlugs ?? []).length) {
    issues.push("preview loader map contains duplicate slugs");
  }

  for (const item of snapshot.items) {
    if (item.demoRoute !== `/ui-kit/${item.id}`) {
      issues.push(`${item.id}: demoRoute must be /ui-kit/${item.id}`);
    }
    for (const dependency of item.dependencies.registryItems) {
      if (!itemIdSet.has(dependency)) {
        issues.push(`${item.id}: unknown registry dependency ${dependency}`);
      }
    }
    for (const target of [...item.targetPaths, ...item.installedPaths]) {
      if (!isSafeProjectPath(target))
        issues.push(`${item.id}: unsafe path ${target}`);
    }
    if (item.manifestUrl === null) {
      if (item.manifestEntrySha256 !== null) {
        issues.push(
          `${item.id}: unavailable manifest cannot have a manifest hash`,
        );
      }
      if (item.gaps.length === 0) {
        issues.push(
          `${item.id}: unavailable manifest must record an explicit gap`,
        );
      }
    } else if (item.manifestEntrySha256 === null) {
      issues.push(`${item.id}: available manifest is missing its content hash`);
    }
    if (
      item.source.available !== Boolean(item.source.path && item.source.blobSha)
    ) {
      issues.push(
        `${item.id}: public source availability disagrees with path/blob evidence`,
      );
    }
    if (
      ["installed", "demo-ready", "verified"].includes(item.status) &&
      item.installedPaths.length === 0
    ) {
      issues.push(`${item.id}: ${item.status} requires installed paths`);
    }
    if (
      ["demo-ready", "verified"].includes(item.status) &&
      item.scope === "catalogue"
    ) {
      if (!item.previewModule || !previewSlugSet.has(item.id)) {
        issues.push(
          `${item.id}: ${item.status} requires an explicit lazy preview module`,
        );
      }
      if (item.evidence.length === 0) {
        issues.push(
          `${item.id}: ${item.status} requires verification evidence`,
        );
      }
    }
    if (item.status === "verified" && item.evidence.length === 0) {
      issues.push(`${item.id}: verified status requires evidence`);
    }
    for (const evidence of item.evidence) {
      if (
        !/^https?:\/\//.test(evidence) &&
        options.pathExists &&
        !options.pathExists(evidence)
      ) {
        issues.push(`${item.id}: evidence path does not exist: ${evidence}`);
      }
    }
    if (
      item.previewModule &&
      options.pathExists &&
      !options.pathExists(item.previewModule)
    ) {
      issues.push(
        `${item.id}: preview module does not exist: ${item.previewModule}`,
      );
    }
  }

  const catalogueItems = snapshot.items.filter(
    ({ scope }) => scope === "catalogue",
  );
  const foundationItems = snapshot.items.filter(
    ({ scope }) => scope === "foundation",
  );
  const calculatedSummary = {
    total: snapshot.items.length,
    catalogueTotal: catalogueItems.length,
    foundationTotal: foundationItems.length,
    manifestAvailable: snapshot.items.filter(({ manifestUrl }) => manifestUrl)
      .length,
    manifestUnavailable: snapshot.items.filter(
      ({ manifestUrl }) => !manifestUrl,
    ).length,
    publicSourceAvailable: snapshot.items.filter(
      ({ source }) => source.available,
    ).length,
    publicSourceUnavailable: snapshot.items.filter(
      ({ source }) => !source.available,
    ).length,
  };
  for (const [key, value] of Object.entries(calculatedSummary)) {
    if (snapshot.summary[key as keyof typeof calculatedSummary] !== value) {
      issues.push(`summary.${key} does not reconcile (expected ${value})`);
    }
  }
  if (
    !sameCounts(
      snapshot.summary.byKind,
      countBy(snapshot.items.map(({ kind }) => kind)),
    )
  ) {
    issues.push("summary.byKind does not reconcile");
  }
  if (
    !sameCounts(
      snapshot.summary.byStatus,
      countBy(snapshot.items.map(({ status }) => status)),
    )
  ) {
    issues.push("summary.byStatus does not reconcile");
  }
  if (
    !sameCounts(
      snapshot.summary.catalogueByStatus,
      countBy(catalogueItems.map(({ status }) => status)),
    )
  ) {
    issues.push("summary.catalogueByStatus does not reconcile");
  }
  if (
    !sameCounts(
      snapshot.summary.foundationByStatus,
      countBy(foundationItems.map(({ status }) => status)),
    )
  ) {
    issues.push("summary.foundationByStatus does not reconcile");
  }

  if (
    snapshot.capturedAt !== provenance.capturedAt ||
    snapshot.upstreamRevision !== provenance.repository.revision
  ) {
    issues.push("snapshot and provenance capture/revision references disagree");
  }
  if (provenance.reconciliation.deduplicatedTotal !== snapshot.items.length) {
    issues.push("provenance deduplicated total does not reconcile");
  }
  const missingManifestIds = snapshot.items
    .filter(({ manifestUrl }) => !manifestUrl)
    .map(({ id }) => id);
  if (
    JSON.stringify(missingManifestIds) !==
    JSON.stringify(provenance.reconciliation.missingManifestIds)
  ) {
    issues.push("provenance missing-manifest IDs do not reconcile");
  }

  const ticketIds = tickets.tickets.map(({ id }) => id);
  if (new Set(ticketIds).size !== ticketIds.length)
    issues.push("ticket ledger contains duplicate ticket IDs");
  const allocations = tickets.tickets.flatMap(({ itemIds }) => itemIds);
  const allocationCounts = countBy(allocations);
  for (const itemId of itemIds) {
    if ((allocationCounts[itemId] ?? 0) !== 1) {
      issues.push(`${itemId}: must be allocated to exactly one CAT ticket`);
    }
  }
  for (const allocatedId of allocations) {
    if (!itemIdSet.has(allocatedId))
      issues.push(`ticket ledger references unknown item ${allocatedId}`);
  }
  for (const ticket of tickets.tickets) {
    if (ticket.complex && ticket.itemIds.length !== 1) {
      issues.push(
        `${ticket.id}: complex tickets must contain exactly one item`,
      );
    }
    const ticketItems = ticket.itemIds.map((id) =>
      snapshot.items.find((item) => item.id === id),
    );
    if (ticketItems.some((item) => !item)) continue;
    if (
      ticketItems.some(
        (item) =>
          item?.kind !== ticket.kind || item.categories[0] !== ticket.category,
      )
    ) {
      issues.push(
        `${ticket.id}: grouped items must share kind and primary category`,
      );
    }
    if (
      ticket.status === "complete" &&
      ticketItems.some((item) => item?.status !== "verified")
    ) {
      issues.push(`${ticket.id}: complete ticket contains a non-verified item`);
    }
    if (
      ticket.status === "blocked-upstream" &&
      ticketItems.every((item) => item?.manifestUrl)
    ) {
      issues.push(
        `${ticket.id}: blocked-upstream ticket has no missing manifest`,
      );
    }
  }
  const ticketSummary = {
    tickets: tickets.tickets.length,
    planned: tickets.tickets.filter(({ status }) => status === "planned")
      .length,
    blockedUpstream: tickets.tickets.filter(
      ({ status }) => status === "blocked-upstream",
    ).length,
    complete: tickets.tickets.filter(({ status }) => status === "complete")
      .length,
    items: allocations.length,
  };
  for (const [key, value] of Object.entries(ticketSummary)) {
    if (tickets.summary[key as keyof typeof ticketSummary] !== value) {
      issues.push(
        `tickets.summary.${key} does not reconcile (expected ${value})`,
      );
    }
  }

  if (issues.length > 0) throw new CatalogueValidationError(issues);
  return { snapshot, provenance, tickets };
}
