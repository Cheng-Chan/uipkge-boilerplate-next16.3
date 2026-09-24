import fs from "node:fs";
import crypto from "node:crypto";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

import { validateCatalogueData } from "../catalogue/schema.ts";
import { PREVIEW_SLUGS } from "../features/showcase/previews/preview-loaders.ts";

const projectRoot = path.resolve(fileURLToPath(new URL("..", import.meta.url)));
const readText = (relativePath) =>
  fs.readFileSync(path.join(projectRoot, relativePath), "utf8");
const readJson = (relativePath) => JSON.parse(readText(relativePath));

try {
  const snapshotText = readText("catalogue/snapshot.json");
  const ticketData = readJson("catalogue/tickets.json");
  const expectedSnapshotHash = crypto
    .createHash("sha256")
    .update(snapshotText)
    .digest("hex");
  if (ticketData.generatedFrom?.snapshotSha256 !== expectedSnapshotHash) {
    throw new Error(
      "Catalogue ticket ledger references a stale snapshot hash.",
    );
  }
  for (const schemaPath of [
    "catalogue/schema/snapshot.schema.json",
    "catalogue/schema/provenance.schema.json",
    "catalogue/schema/tickets.schema.json",
  ]) {
    if (!fs.existsSync(path.join(projectRoot, schemaPath))) {
      throw new Error(`Catalogue schema reference is missing: ${schemaPath}`);
    }
  }
  const { snapshot, tickets } = validateCatalogueData(
    JSON.parse(snapshotText),
    readJson("catalogue/provenance.json"),
    ticketData,
    {
      previewSlugs: PREVIEW_SLUGS,
      pathExists: (relativePath) =>
        fs.existsSync(path.join(projectRoot, relativePath)),
    },
  );
  const statuses = Object.entries(snapshot.summary.catalogueByStatus)
    .map(([status, count]) => `${status}=${count}`)
    .join(", ");
  console.log(
    `Catalogue OK: ${snapshot.summary.total} tracked (${snapshot.summary.catalogueTotal} catalogue + ${snapshot.summary.foundationTotal} foundation); ${statuses}; ${tickets.summary.tickets} exact CAT tickets.`,
  );
} catch (error) {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
}
