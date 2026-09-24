# Architecture

## Purpose and status

This repository has two deliberately separated responsibilities:

1. A reusable frontend application foundation with local demo authentication, presentation-only
   RBAC, deterministic synthetic data, and replaceable service interfaces.
2. A component laboratory for the approved UIPKGE React catalogue snapshot.

The static foundation, quality tooling, design system, environment contract, local demo data
platform, browser-local session, and typed permission policy exist today. Directories marked
**planned** below describe approved boundaries, not implemented features.

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
- `app/(app)/layout.tsx` wraps exported protected routes with the shared client guard and responsive
  shell. The guard holds route content during session restoration, redirects anonymous users with a
  validated return path, and replaces forbidden content with an explicit frontend-only 403 state.
- Navigation metadata tracks planned destinations but renders only routes whose static pages exist.
  This avoids broken placeholder links while retaining one policy source for future feature work.
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

`lib/storage/versioned-storage.ts` is the single browser-persistence seam. Each adapter instance
uses a namespaced/versioned key and envelope, validates decoded and submitted values with its Zod
schema, and owns an in-memory fallback. Browser storage is resolved only when an operation runs,
never while the module loads. Corrupt or unsupported data remains intact until an explicit reset;
write fallbacks report their warning and do not pretend to be durable.

Customer and project domains expose asynchronous CRUD interfaces under `features/*/services`.
Their shared `lib/local-collection.ts` seam lazy-loads bounded, schema-validated arrays, keeps UI
away from storage, and returns persistence provenance with every successful result. Fixture data
uses explicit IDs/dates and reserved `.invalid` contact domains. Local mutations use deterministic
`*-local-N` IDs and the fixed timestamp `2026-01-15T12:00:00.000Z`; they never read the current time
or generate random values.

The task service separates editing from deterministic column movement and reindexes affected
columns. Calendar events use offset-aware timestamps and validate their merged start/end range.
Activity, KPI, and coordinate services are read-only; their fixtures provide accessible text
summaries, ordered series, bounded values, and explicit illustrative/non-navigation labels.
Messages persist nested local threads through a collection-specific deep clone and mark every send
as `local-simulation` with an explicit non-delivery notice. None of these contracts performs an HTTP
request or claims external delivery, live geography, or current data.

`RATE_LIMITED` only represents the explicit `rate-limited` demo scenario. It is not evidence of real
rate limiting.

## Authentication and access control

The three public synthetic identities and their Zod schemas live in `mocks/users.ts` and
`features/auth/types.ts`. Identity objects contain stable ID, username, display name, and role only.
Fake passwords live in a separate `public-demo-credential` fixture whose label states that it is not
a secret. The session-safe reference schema contains only `userId`.

Authentication persists only a versioned demo identity reference and optional expiry in
`sessionStorage`. Initializing, anonymous, and authenticated states prevent an authenticated-state
flash before restoration. Corrupt, unknown, and expired records recover to anonymous. Roles and
permissions are derived from tracked fixtures and `features/access-control/policy.ts`, never trusted
from storage.

The static `/login` route uses React Hook Form with direct Zod validation, displays all public demo
credentials, and validates `next` against known same-origin route policy after authentication. The
static `/signup` route explicitly reports that no account was created and clears its password field.
The landing account panel supports logout and intentional fixture-account switching; a switch
rechecks the current route before leaving it open. The protected route group applies the same policy
to direct navigation, filtered links, and live role changes. Its responsive shell owns breadcrumbs,
role/account controls, theme selection, a skip link, and the persistent demo warning.

`/dashboard` is intentionally a lightweight shell entry rather than the future KPI dashboard.
`/access-control` renders the exact tracked fixture users and permission matrix for admin; other
authenticated roles receive the 403 presentation. This remains browser-controlled UI behavior.

These controls demonstrate application states. Static assets, fixtures, credentials, and code are
public, so they cannot protect confidential data. See [demo security](demo-security.md).

## Catalogue model

The dated snapshot separates metadata from preview modules. Every item record includes its
verified ID, category, upstream URL and revision/hash, registry dependencies, installed paths,
route, adaptations, external requirements, status, and evidence.

Allowed statuses are `discovered`, `installed`, `demo-ready`, `verified`, `blocked`, and
`approved-exception`. Status only advances when its evidence exists; installation alone is never
verification.

`/ui-kit` reads snapshot metadata without importing preview modules. Every deduplicated ID has a
statically generated `/ui-kit/[slug]` record route. The client preview runtime consults one explicit
lazy-loader map only on that item route, contains module errors locally, and renders an honest
unavailable state until an exact CAT ticket supplies the real source and evidence. See
[catalogue discovery](catalogue-discovery.md) for counts and upstream gaps.

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
| Versioned validated storage     | Makes browser persistence recoverable without coupling it to UI code.     |
| Manifest-driven catalogue       | Makes coverage, routes, provenance, and evidence auditable.               |
| Explicit lazy previews          | Prevents the complete catalogue and heavy tools entering shared bundles.  |
| Node static preview             | Keeps preview behavior consistent across Windows, macOS, and Linux.       |
