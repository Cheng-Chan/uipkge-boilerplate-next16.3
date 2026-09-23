# Architecture

## Purpose and status

This repository has two deliberately separated responsibilities:

1. A reusable frontend application foundation with local demo authentication, presentation-only
   RBAC, deterministic synthetic data, and replaceable service interfaces.
2. A component laboratory for the approved UIPKGE React catalogue snapshot.

The static foundation, quality tooling, design system, environment contract, and initial local
service/demo-state contracts exist today. Directories marked **planned** below describe approved
boundaries, not implemented features.

## Non-negotiable boundaries

- One Next.js application; no monorepo.
- Static export through `output: "export"` with trailing slashes.
- No application backend, Route Handlers, Server Actions, middleware authentication, database,
  OAuth, email, billing, or HTTP mock service.
- Business data and mutations stay in the browser and use synthetic fixtures.
- Default development, build, preview, and tests require no credentials or business network.
- Server Components remain the default. Client boundaries are limited to interactive leaves and
  providers that genuinely need browser APIs.
- Browser APIs such as `window`, storage, canvas, and map/editor constructors are not accessed at
  module initialization or during prerendering.

## Target source layout

```text
app/                         routes, layouts, static route generation
components/
  ui/                        canonical registry primitives
  blocks/                    canonical full-page registry blocks
  shared/                    reusable application compositions
config/                      validated build-time configuration
features/
  auth/                      demo identity and session behavior
  access-control/            permission policy and guards
  showcase/                  catalogue metadata and lazy previews
  <domain>/                  page-specific state, UI, and services
lib/                         cross-cutting browser-safe utilities
mocks/                       deterministic fixtures and local adapters
public/                      owned or license-compatible static assets
scripts/                     maintenance and static-preview tools
tests/
  unit/                      focused logic and component tests
  e2e/                       exported-site browser tests
docs/                        decisions, safety, backlog, and evidence
```

Most target directories are intentionally absent until their implementation ticket is approved.
Empty scaffolding does not count as progress.

## Dependency direction

Routes compose features; features may consume shared UI, local service contracts, configuration,
and fixtures. Reusable UI must not import route modules or domain features.

```text
app routes
  -> features
      -> components/shared
      -> components/ui | components/blocks
      -> lib + config + mocks

features/showcase -> catalogue metadata -> lazy preview modules
```

Circular feature dependencies are not allowed. Cross-domain behavior belongs in a small shared
contract only after two real consumers justify it.

## Canonical component paths

- `components/ui` is the single canonical primitive tree.
- `components/blocks` holds registry blocks whose manifests prescribe block-level files.
- `components/shared` holds project-authored compositions.
- Registry bootstrap files with explicit targets remain at those targets. In particular, UIPKGE's
  installed theme provider belongs at `components/theme-provider.tsx`; it is not duplicated under
  `components/shared`.
- `features/showcase` owns demo wrappers and examples; registry source is not edited merely to
  insert showcase controls.
- Do not create `app/components`, a second `ui` tree, or competing `cn` and theme helpers.

Registry manifests and target paths must still be inspected before each installation. Exact
bootstrap targets and the review workflow are recorded in [the registry guide](registry.md). If an
item requires a different path, record that exception in the catalogue manifest rather than
silently duplicating source.

## Rendering and routing

- Route files perform composition and route-level metadata only; feature logic stays outside
  `app`.
- All approved catalogue slugs are generated at build time from a tracked manifest.
- Browser-created records use dialogs, local state, or query-string selection rather than dynamic
  paths that a static host cannot generate.
- Query readers that require client navigation are placed behind a localized client/Suspense
  boundary.
- Heavy charts, maps, editors, and full-page blocks use explicit lazy preview imports and do not
  enter the shared shell bundle.
- The exported `out` directory is served by `scripts/preview-static.mjs`; `next start` is not used.

## Local data flow

Planned domain UI calls typed asynchronous service interfaces. Local adapters validate inputs and
stored values, enforce the same presentation policy as controls, then update memory or versioned
browser storage. UI code does not manipulate storage directly.

The common result is the discriminated `ServiceResult<T>` in `lib/service-result.ts`, with its exact
local error vocabulary. `features/demo-state/demo-state.ts` supplies deterministic loading, empty,
failure, rate-limited, and success scenarios through a cancellable timer task. Consumers retain and
invoke the task's cleanup handle when their lifecycle ends.

`RATE_LIMITED` only represents the explicit `rate-limited` demo scenario. It is not evidence of real
rate limiting.

## Authentication and access control

Authentication will persist only a versioned demo identity reference and optional expiry in
`sessionStorage`. Roles and permissions are derived from tracked fixtures and a centralized policy,
never trusted from storage. Guards, navigation, controls, and mutation handlers consume the same
policy.

These controls demonstrate application states. Static assets, fixtures, credentials, and code are
public, so they cannot protect confidential data. See [demo security](demo-security.md).

## Catalogue model

The future snapshot separates metadata from preview modules. Every item record will include its
verified ID, category, upstream URL and revision/hash, registry dependencies, installed paths,
route, adaptations, external requirements, status, and evidence.

Allowed statuses are `discovered`, `installed`, `demo-ready`, `verified`, `blocked`, and
`approved-exception`. Status only advances when its evidence exists; installation alone is never
verification.

## External network policy

The default runtime uses local assets and fixtures. External Mapbox behavior is explicitly enabled,
lazy-loaded, and browser-visible; the offline Leaflet experiment uses locally authored geography.
No automatic geolocation, public tile scraping, telemetry, live tracking, routing, or geocoding is
permitted. Provider access and cost implications must be documented before opt-in use.

## Decision record

| Decision                        | Reason                                                                    |
| ------------------------------- | ------------------------------------------------------------------------- |
| Static export                   | Matches the frontend-only deployment boundary and makes hosting portable. |
| Local service interfaces        | Preserves replaceable seams without inventing an HTTP backend.            |
| Session identity reference only | Avoids treating browser storage as an authorization source.               |
| Manifest-driven catalogue       | Makes coverage, routes, provenance, and evidence auditable.               |
| Explicit lazy previews          | Prevents the complete catalogue and heavy tools entering shared bundles.  |
| Node static preview             | Keeps preview behavior consistent across Windows, macOS, and Linux.       |
