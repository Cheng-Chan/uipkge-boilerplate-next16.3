# Dependency-aware backlog

This is the execution contract after T00. Only one ticket may be implemented after explicit
approval. `Complete` means its acceptance checks were observed; `Planned` is not authorization.
Catalogue batch tickets cannot be finalized until LAB01 persists the exact inventory.

Each ticket records the required goal, description, proposed files, dependencies, acceptance,
verification, and review focus. File paths for planned features are proposals and may be narrowed
after inspecting relevant registry manifests.

## Discovery and foundation

### T00 — discovery and architecture plan — Complete

- **Goal:** Resolve requirements and risks before modifying the workspace.
- **Description:** Inspect repository state, official sources, toolchain compatibility, published
  React catalogue, static architecture, routes, permissions, and dependency order.
- **Proposed files:** None; read-only ticket.
- **Dependencies:** None.
- **Acceptance:** Findings, gaps, catalogue working count, route/permission plan, backlog, and first
  ticket are reported without workspace mutation.
- **Verification:** Git status and source/version checks.
- **Review:** Confirm frontend-only scope, catalogue gaps, and ticket order.

### F01 — static application foundation — Complete

- **Goal:** Prove the requested framework/compiler combination before feature work.
- **Description:** Create the minimal static Next.js application, custom 404, pinned tooling, and
  visible demo warning.
- **Proposed files:** `app/*`, framework/tool configs, package manifest and lockfile, root README.
- **Dependencies:** T00.
- **Acceptance:** Turbopack development starts; lint, TypeScript 7 checking, and static build pass.
- **Verification:** `pnpm lint`, `pnpm typecheck`, `pnpm build`.
- **Review:** Inspect the root page, warning, exported routes, and pinned versions.

### F02 — test and static-preview foundation — Complete

- **Goal:** Establish portable automated checks against real exported output.
- **Description:** Add Vitest, Testing Library, coverage, Playwright, a Node static server, baseline
  unit/browser tests, and aggregate checks.
- **Proposed files:** `vitest.config.ts`, `playwright.config.ts`, `scripts/preview-static.mjs`,
  `tests/*`, package scripts.
- **Dependencies:** F01.
- **Acceptance:** Unit/coverage/browser suites pass; preview returns real 200 and 404 statuses.
- **Verification:** `pnpm check`, `pnpm test:coverage`, `pnpm test:e2e`, `pnpm start`.
- **Review:** Exercise the exported root and missing path; inspect cross-platform scripts.

### F03 — environment contract — Complete

- **Goal:** Fail early on invalid optional public configuration while keeping defaults credential-free.
- **Description:** Add Zod validation, a secret-free example, strict booleans, dependent Mapbox
  fields, and build-time configuration documentation.
- **Proposed files:** `.env.example`, `config/environment.ts`, `next.config.ts`, tests, README.
- **Dependencies:** F02.
- **Acceptance:** Empty/default and complete opt-in settings pass; partial, malformed, and secret-token
  settings fail with useful names but no leaked value.
- **Verification:** `pnpm check`, `pnpm test:coverage`, default/valid/invalid `pnpm build` variants.
- **Review:** Compare example, schema, errors, and static build-time documentation.

### F04 — maintained architecture and safety documentation — Complete

- **Goal:** Put project boundaries and future execution criteria under version control.
- **Description:** Document architecture, demo security, reuse/removal, dependency backlog, progress,
  and catalogue-count caveats.
- **Proposed files:** `AGENTS.md`, `README.md`, `docs/architecture.md`, `docs/demo-security.md`,
  `docs/reuse.md`, `docs/backlog.md`, `docs/progress.md`.
- **Dependencies:** F03.
- **Acceptance:** Documentation consistently separates current from planned behavior, links from the
  README, includes every future subsystem, and makes catalogue expansion a blocking gate.
- **Verification:** `pnpm format:check`, link/path inspection, `pnpm check`.
- **Review:** Check claims against the working tree and confirm the next ticket is D01.

## Design system

### D01 — UIPKGE registry and canonical paths — Complete

- **Goal:** Configure one inspectable UIPKGE installation path without installing catalogue batches.
- **Description:** Pin and inspect the shadcn CLI, validate its schema, configure the
  `@uipkge-react` endpoint, aliases, style target, and canonical component paths.
- **Proposed files:** `components.json`, package manifest/lockfile, `docs/registry.md`.
- **Dependencies:** F04.
- **Acceptance:** Config matches the installed CLI schema; a dry inspection resolves the registry;
  no duplicate UI tree or unapproved item install exists.
- **Verification:** CLI/schema inspection, `pnpm check`, registry resolution without apply.
- **Review:** Inspect manifest, proposed writes, dependencies, aliases, and registry URL.

### D02 — tokens and base utilities — Complete

- **Goal:** Establish the canonical Tailwind v4 UIPKGE visual foundation.
- **Description:** Adopt verified OKLCH tokens and one class-merging utility; install only the
  minimal registry foundation required by the theme ticket.
- **Proposed files:** `app/globals.css`, `lib/utils.ts`, at most five inspected `components/ui/*`
  dependencies, package lockfile, attribution records.
- **Dependencies:** D01.
- **Acceptance:** Light/dark token pairs are complete, registry source and license are recorded, and
  no duplicate helper exists.
- **Verification:** `pnpm check`, token contrast/manual style inspection, production build.
- **Review:** Compare tokens with inspected upstream source and review every installed file.

### D03 — three-state theme — Complete

- **Goal:** Provide one accessible light/dark/system theme mechanism.
- **Description:** Add the pinned theme provider, localized client boundary, switcher, hydration-safe
  initialization, and persistence tests.
- **Proposed files:** inspected registry targets `components/theme-provider.tsx` and
  `lib/use-theme.ts`, project-authored `components/shared/theme-switcher.tsx`, root layout, tests,
  package lockfile.
- **Dependencies:** D02.
- **Acceptance:** All three states work without hydration warnings; system changes apply; keyboard
  labels and persistence are verified.
- **Verification:** `pnpm check`, focused unit tests, Playwright theme flow against static preview.
- **Review:** Toggle each state, refresh, change system preference, and inspect focus/contrast.

## Local demo platform

### P01 — service result and demo-state contracts — Planned

- **Goal:** Define reusable local async boundaries without inventing HTTP infrastructure.
- **Description:** Add `ServiceResult<T>`, error codes, cancellable deterministic state controls, and
  tests for loading/empty/failure/success.
- **Proposed files:** `lib/service-result.ts`, `features/demo-state/*`, unit tests.
- **Dependencies:** D02.
- **Acceptance:** Result narrowing is typed; timers clean up; `RATE_LIMITED` is explicitly simulated.
- **Verification:** `pnpm test`, `pnpm typecheck`, fake-timer cleanup tests.
- **Review:** Inspect error vocabulary and confirm there is no fetch/Axios/MSW/API route.

### P02 — versioned browser storage adapter — Planned

- **Goal:** Isolate safe, recoverable browser persistence.
- **Description:** Implement memory fallback, versioned keys, Zod decoding, corruption/quota handling,
  and reset seams without module-time browser access.
- **Proposed files:** `lib/storage/*`, unit tests.
- **Dependencies:** P01, F03.
- **Acceptance:** Unavailable, corrupt, unknown-version, and quota-failure cases return typed results
  and never crash prerendering.
- **Verification:** `pnpm test`, `pnpm build`, storage failure tests.
- **Review:** Inspect storage keys, recovery messages, SSR safety, and absence of sensitive values.

### P03 — demo identities and account fixtures — Planned

- **Goal:** Provide clearly public admin, manager, and viewer identities.
- **Description:** Add deterministic user fixtures and fake passwords separated from session state.
- **Proposed files:** `mocks/users.ts`, `features/auth/types.ts`, fixture tests.
- **Dependencies:** P01.
- **Acceptance:** Three roles exist with stable IDs; credentials are labeled public demo data; no real
  identity fields or secrets exist.
- **Verification:** Fixture schema/unit tests and `pnpm check`.
- **Review:** Inspect displayed values and search for accidental secret-like configuration.

### P04 — customer and project fixtures/services — Planned

- **Goal:** Supply deterministic local customer/project data behind typed interfaces.
- **Description:** Add schemas, fixtures, list/detail/create/update/delete contracts, validation, and
  reset behavior.
- **Proposed files:** `mocks/customers.ts`, `mocks/projects.ts`, `features/customers/services/*`,
  `features/projects/services/*`, tests.
- **Dependencies:** P01, P02.
- **Acceptance:** Stable IDs/dates, synthetic values, bounded data, and all success/failure paths test.
- **Verification:** Unit tests, `pnpm check`.
- **Review:** Exercise mutation/reset adapters and inspect fixture determinism.

### P05 — task, calendar, and activity fixtures/services — Planned

- **Goal:** Supply deterministic workflow and time-series domain data.
- **Description:** Add task movement/editing, event mutation, and read-only activity contracts using
  explicit dates and accessible summaries.
- **Proposed files:** `mocks/tasks.ts`, `mocks/calendar.ts`, `mocks/activity.ts`, corresponding feature
  services and tests.
- **Dependencies:** P01, P02.
- **Acceptance:** No current-time/random hydration differences; invalid moves/dates fail predictably.
- **Verification:** Unit tests with fixed dates and `pnpm check`.
- **Review:** Inspect time zones, stable ordering, and failure/reset behavior.

### P06 — messages, KPI, and coordinate fixtures/services — Planned

- **Goal:** Complete synthetic data required by dashboard, messaging, chart, and map work.
- **Description:** Add local thread/send simulation, KPI series, and illustrative coordinates with
  explicit non-delivery/non-navigation labels.
- **Proposed files:** `mocks/messages.ts`, `mocks/kpis.ts`, `mocks/coordinates.ts`, services and tests.
- **Dependencies:** P01, P02.
- **Acceptance:** Sends remain local; series and coordinates are deterministic; no live provider or
  real geography claim exists.
- **Verification:** Unit tests, network-free build, `pnpm check`.
- **Review:** Inspect synthetic content, deterministic ordering, and offline behavior.

## Authentication, permission policy, and shell

### A01 — typed permission and route policy — Planned

- **Goal:** Centralize exact permissions before guards or navigation exist.
- **Description:** Define permission codes, role matrix, known routes, any/all evaluators,
  segment-aware matching, and deny-by-default behavior.
- **Proposed files:** `features/access-control/policy.ts`, `docs/permission-matrix.md`, unit tests.
- **Dependencies:** P03.
- **Acceptance:** Dashboard, all business/showcase/workbench routes, access inspection, export, and
  reset are accounted for; unknowns deny; nested boundaries test.
- **Verification:** Focused policy/route tests, `pnpm check`.
- **Review:** Compare the documented matrix with typed mappings and test admin/manager/viewer cases.

### A02 — demo session state — Planned

- **Goal:** Restore and expire a browser-local demo identity without protected-state flashes.
- **Description:** Implement initializing/anonymous/authenticated states, versioned session identity,
  expiry, corruption handling, login/logout, and permission derivation.
- **Proposed files:** `features/auth/session/*`, hooks/provider, unit tests.
- **Dependencies:** P02, P03, A01.
- **Acceptance:** Only identity reference/expiry persist; stale/unknown/corrupt sessions become
  anonymous; permissions never come from storage.
- **Verification:** Unit/component tests for restoration, expiry, errors, logout, and rerender.
- **Review:** Refresh each state and inspect sessionStorage contents.

### A03 — login and safe next handling — Planned

- **Goal:** Build an accessible demo login with safe post-login navigation.
- **Description:** Use React Hook Form/Zod, displayed fake credentials, password visibility, pending
  state, invalid feedback, keyboard submit, and known-route `next` validation.
- **Proposed files:** `app/login/page.tsx`, `features/auth/login/*`, tests, dependencies.
- **Dependencies:** A02, D03.
- **Acceptance:** Valid demo accounts enter the app; invalid credentials fail; unsafe, external,
  malformed, looped, and forbidden destinations are rejected/rechecked.
- **Verification:** Unit/component tests and Playwright account/deep-link flows.
- **Review:** Try all accounts, keyboard flow, refresh, and malicious `next` values.

### A04 — signup simulation and account switching — Planned

- **Goal:** Demonstrate form and role switching states without creating accounts.
- **Description:** Add an explicit no-account-created signup result and intentional switcher using
  public fixtures; never simulate OAuth/email verification.
- **Proposed files:** `app/signup/page.tsx`, signup/switcher feature modules, tests.
- **Dependencies:** A03.
- **Acceptance:** Signup clearly reports simulation; passwords are not retained; switching rechecks
  open-route/action permissions.
- **Verification:** Form/component tests and Playwright switch/refresh flow.
- **Review:** Inspect messages, storage, open protected pages, and role badge changes.

### S01 — centralized navigation and client route guards — Planned

- **Goal:** Apply the route policy consistently to links and direct navigation.
- **Description:** Add route/navigation metadata, permission filtering, anonymous redirect behavior,
  and authenticated 403 presentation.
- **Proposed files:** `config/navigation.ts`, `features/access-control/route-guard.tsx`, route tests.
- **Dependencies:** A01, A02.
- **Acceptance:** Unknown protected routes deny, hidden links match direct guards, and static deep
  links/refresh resolve.
- **Verification:** Route unit tests, build, static-preview Playwright deep links.
- **Review:** Navigate directly as each role and compare visible navigation.

### S02 — responsive application shell — Planned

- **Goal:** Provide a coherent, accessible shell without loading heavy experiments.
- **Description:** Add responsive navigation, breadcrumbs, user menu, role badge, theme switcher, and
  persistent demo warning.
- **Proposed files:** `app/(app)/layout.tsx`, `components/shared/app-shell/*`, tests.
- **Dependencies:** D03, A04, S01.
- **Acceptance:** Keyboard/mobile/desktop navigation works; current role and warning remain visible;
  shared bundle excludes charts/maps/editor/catalogue previews.
- **Verification:** Component tests, responsive Playwright checks, bundle inspection.
- **Review:** Inspect focus order, collapsed navigation, breadcrumbs, warning, and logout.

### S03 — access-control inspection and denied states — Planned

- **Goal:** Make effective demo policy inspectable without implying server enforcement.
- **Description:** Add admin-only users/roles/permissions matrix, 403 state, and action explanations.
- **Proposed files:** `app/(app)/access-control/*`, shared denied components, tests.
- **Dependencies:** S02, A01.
- **Acceptance:** Admin sees complete effective matrix; manager/viewer see 403; copy states the
  frontend-only limitation.
- **Verification:** Policy/component tests and three-role Playwright flow.
- **Review:** Compare rendered matrix to source policy and verify denied navigation.

## Catalogue laboratory

### LAB01 — dated catalogue snapshot and provenance — Planned

- **Goal:** Replace the provisional count with an auditable exact React inventory.
- **Description:** Re-discover published docs, registry manifests, and public source; deduplicate by
  verified ID; record URL, revision/hash, dependencies, target paths, external requirements, and
  gaps. Expand the catalogue section below into exact tickets: no more than five related simple
  items per ticket and one complex block/map/editor/feature per ticket.
- **Proposed files:** `catalogue/snapshot.json`, `catalogue/provenance.json`, generated catalogue
  backlog entries, discovery documentation.
- **Dependencies:** D01.
- **Acceptance:** Every discovered React item is represented exactly once; category totals reconcile;
  hashes/provenance exist; missing/unavailable items are explicit; exact batch tickets are reviewed
  before installation.
- **Verification:** Independent total/dedup/reference checks and schema validation.
- **Review:** Compare sources, counts, hashes, React-only classification, and generated batch sizes.

### LAB02 — catalogue schema and registry checks — Planned

- **Goal:** Make invalid coverage claims fail locally and in CI.
- **Description:** Add typed schema, `registry:check`, route/import/evidence validation, and count
  reporting without network access.
- **Proposed files:** `catalogue/schema.ts`, `scripts/registry-check.mjs`, package scripts, tests.
- **Dependencies:** LAB01.
- **Acceptance:** Missing routes, duplicate IDs, bad dependencies, invalid references, unsafe paths,
  and `verified` without evidence fail; normal checks remain offline.
- **Verification:** Fixture-based failure tests, `pnpm registry:check`, `pnpm check`.
- **Review:** Deliberately trigger each invariant and inspect actionable errors.

### LAB03 — searchable catalogue browser — Planned

- **Goal:** Navigate the tracked snapshot without eagerly loading previews.
- **Description:** Add category/status/search filters, coverage summary, provenance/install details,
  and permission-aware links based only on manifest metadata.
- **Proposed files:** `app/(app)/ui-kit/*`, `features/showcase/catalogue/*`, tests.
- **Dependencies:** LAB02, S02.
- **Acceptance:** Filters combine predictably, URLs/deep links survive export, counts match the
  manifest, and no preview module enters the listing bundle.
- **Verification:** Unit tests, Playwright filter/deep-link checks, bundle inspection.
- **Review:** Search by ID/name, filter every status/category, and compare counts.

### LAB04 — isolated lazy preview runtime — Planned

- **Goal:** Render real item previews without cross-preview interference or eager imports.
- **Description:** Generate static preview slugs, explicit lazy mapping, isolation boundaries,
  interactive-state conventions, error states, and evidence hooks.
- **Proposed files:** `app/(app)/ui-kit/[slug]/*`, `features/showcase/previews/*`, manifest validation,
  browser tests.
- **Dependencies:** LAB03.
- **Acceptance:** All approved slugs export; direct refresh works; one preview loads at a time; errors
  remain local; empty placeholders cannot count as demo-ready.
- **Verification:** Static build, representative browser tests, chunk/network inspection.
- **Review:** Direct-link several light/heavy items and inspect loaded modules and isolation.

## Feature pages

Each row below is an independently approved ticket. “Tests” means focused unit/component tests plus
the named static-preview interaction; every ticket also runs `pnpm check`.

| ID / title                 | Goal and description                                                                                                                                   | Proposed files                                                                    | Dependencies        | Acceptance                                                                                   | Verification and review                                                         |
| -------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------- | ------------------- | -------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------- |
| FE01 — landing composition | Build a responsive UIPKGE-informed marketing landing with working login/lab links while keeping its bundle light.                                      | `app/page.tsx`, `features/landing/*`, inspected assets/components                 | D03, LAB04          | Real responsive composition, warning preserved, links work, no heavy lab imports.            | Tests + mobile/desktop Playwright; review content, keyboard flow, and bundle.   |
| FE02 — form laboratory     | Demonstrate text/password/textarea/number/select/combobox/date/checkbox/radio/switch/file preview with validation and disabled/read-only states.       | form route/feature, at most five primitive-install tickets as dependencies, tests | D03, LAB04          | Accessible labels/errors, local-only submit, object URLs revoked, no upload claim.           | Tests + keyboard/file Playwright; review every field/state.                     |
| FE03 — dashboard           | Compose deterministic KPIs, trends, recent activity, and links without pulling the full chart lab into the shell.                                      | dashboard route/feature, KPI/activity consumers                                   | P05, P06, S02, WB01 | Accessible summaries, stable data, responsive loading/empty/failure/success states.          | Tests + responsive Playwright; review bundle and chart rendering.               |
| FE04 — customers           | Provide searchable/sortable/filterable/paginated customer table, visibility, selection, details, and permission-controlled local CRUD.                 | customer route/feature and tests                                                  | P04, S02, FE11      | Invalid pages reset; mutations enforce policy; viewer cannot mutate/export.                  | Tests + three-role Playwright; review table/forms/empty states.                 |
| FE05 — projects            | Provide local project list, filters, details, forms, and permission-controlled mutations.                                                              | project route/feature and tests                                                   | P04, S02, FE02      | Validation and all demo states work; denied/stale controls cannot mutate.                    | Tests + three-role Playwright; review create/update/delete restrictions.        |
| FE06 — kanban              | Integrate the real approved kanban block with local task editing/movement and an accessible non-drag alternative.                                      | kanban route/feature, one exact complex registry ticket, tests                    | P05, S02, LAB04     | Keyboard/non-drag movement works; permission checks run in handlers; drag cleanup is safe.   | Tests + pointer/keyboard Playwright; review all roles and responsive layout.    |
| FE07 — calendar            | Implement date navigation, local event dialogs/context menus/details, and permitted CRUD.                                                              | calendar route/feature, one exact complex registry ticket, tests                  | P05, S02, FE02      | Stable dates/time zones; keyboard menus/dialogs; role-correct mutations and cleanup.         | Tests + three-role Playwright; review date transitions and denied actions.      |
| FE08 — activity            | Render deterministic heatmap/timeline views with accessible summaries and filters.                                                                     | activity route/feature and tests                                                  | P05, S02            | Visual and text summaries agree; filters and empty/failure states work.                      | Tests + browser rendering; review contrast, labels, and mobile behavior.        |
| FE09 — messages            | Add local thread selection, composition, and simulated send without delivery claims.                                                                   | messages route/feature and tests                                                  | P06, S02, FE02      | Send is local, pending/failure/success deterministic, viewer restrictions enforced.          | Tests + role/keyboard Playwright; review copy and storage behavior.             |
| FE10 — settings            | Add local profile/preferences experiments, theme controls, and permission-gated reset.                                                                 | settings route/feature and tests                                                  | P02, D03, S02       | Validation/storage failures recover; destructive reset requires confirmation and permission. | Tests + Playwright persistence/reset; review unavailable storage and each role. |
| FE11 — table laboratory    | Establish reusable TanStack table patterns: search, column filters, sort, pagination, selection, visibility, empty results, row actions, and safe CSV. | table feature/shared components, dependencies, tests                              | D03, A01            | Bounded rows, page reset, formula-neutralized editable export, accessible controls.          | Tests + keyboard/interaction Playwright; review CSV samples and empty states.   |

## Complex workbenches

### WB01 — ECharts workbench — Planned

- **Goal:** Verify real responsive chart behavior independently of dashboard composition.
- **Description:** Add area, line, bar, pie, radar, and sparkline examples with token-derived themes,
  legends/tooltips, resize handling, empty states, and accessible summaries.
- **Proposed files:** chart route/feature, pinned `echarts`/`echarts-for-react`, tests.
- **Dependencies:** D03, P06, LAB04.
- **Acceptance:** Actual canvas/SVG renders in both themes, resizes, disposes, and avoids unsupported
  CSS color expressions; no duplicate chart library without approved exception.
- **Verification:** Unit tests, browser rendering/interactions, screenshot evidence, bundle inspection.
- **Review:** Inspect every chart type, theme, tooltip, empty state, summary, and loaded chunk.

### WB02 — Tiptap editor workbench — Planned

- **Goal:** Demonstrate safe local rich-text editing as an isolated heavy feature.
- **Description:** Add formatting, links, placeholders, task lists, alignment, read-only mode, versioned
  local draft, and JSON inspect/export without HTML injection or paid/network features.
- **Proposed files:** editor route/feature, pinned extensions, tests.
- **Dependencies:** D03, P02, LAB04.
- **Acceptance:** Unsafe URL schemes reject; drafts validate/recover; read-only and keyboard behavior
  work; editor code stays out of shared bundles.
- **Verification:** Unit tests, persistence/keyboard Playwright, bundle/network inspection.
- **Review:** Exercise each extension, corrupt draft recovery, URL validation, and JSON output.

### WB03 — offline Leaflet workbench — Planned

- **Goal:** Provide a useful map experiment without external services.
- **Description:** Use the approved renderer with locally authored GeoJSON or owned image overlay,
  synthetic markers/popups/lines/polygons, controls, fit-bounds, theme handling, and summaries.
- **Proposed files:** Leaflet route/feature, local assets/provenance, pinned dependencies, tests.
- **Dependencies:** D03, P06, LAB04.
- **Acceptance:** No tile/geolocation/routing/geocoding/telemetry request; containers size correctly;
  instances/listeners dispose; geography is labeled illustrative.
- **Verification:** Intercepted-network browser tests, real rendering evidence, cleanup tests.
- **Review:** Inspect geometry, controls, fallback, attribution, resizing, themes, and zero external calls.

### WB04 — opt-in Mapbox workbench — Planned

- **Goal:** Demonstrate catalogue-required Mapbox behavior with explicit external boundaries.
- **Description:** Lazy-load only when enabled and configured; show informative unavailable state;
  disclose token exposure, provider, attribution, request behavior, restrictions, and possible cost.
- **Proposed files:** Mapbox route/feature, environment consumer, pinned dependency, tests/docs.
- **Dependencies:** F03, P06, LAB04.
- **Acceptance:** Default build/test/runtime needs no token and performs no provider request; missing
  config does not crash; only public tokens are accepted; provider behavior is verified separately.
- **Verification:** Disabled/missing/intercepted opt-in tests, lazy-bundle and network inspection.
- **Review:** Compare default vs opted-in network, unavailable UI, attribution, and cleanup.

## Complete catalogue coverage gate

### CAT-EXPAND — exact item implementation tickets — Blocked on LAB01

- **Goal:** Account for every persisted snapshot item without representative-only shortcuts.
- **Description:** LAB01 replaces this gate with exact `CAT-*` entries containing item IDs. Each
  ticket groups at most five closely related simple primitives. Each complex block, map, editor,
  feature composition, or external capability receives its own ticket. Items unavailable for local
  execution remain `blocked` or require an explicit `approved-exception`; a simulation cannot verify
  an external capability.
- **Proposed files:** Exact registry targets, isolated preview modules, manifest records, focused
  tests, evidence artifacts, lockfile only where dependencies change.
- **Dependencies:** LAB01, LAB02, LAB04 and any named foundation dependency.
- **Acceptance:** All 713 provisional candidates are reconciled to the final snapshot and then to one
  exact ticket/status; installed source, real preview, variants/interactions, provenance, routes,
  adaptations, and evidence agree.
- **Verification:** `pnpm registry:check`, focused tests, static build, manifest-driven smoke, manual
  accessibility/visual review; complex items require actual-render evidence.
- **Review:** Inspect upstream source/dependencies before apply, every written path after apply, real
  interactions, keyboard/focus behavior, network use, and evidence before status promotion.

No catalogue installation ticket may use this family label as approval. The exact LAB01-generated
ticket ID and listed item IDs must be approved.

## Maintenance and final validation

### M01 — safe registry refresh tool — Planned

- **Goal:** Refresh catalogue metadata/source without startup side effects or blind overwrites.
- **Description:** Add explicit `bootstrap:registry` with default dry-run, selected apply, hash and
  target validation, local-modification/conflict detection, path containment, provenance, and
  optional verified local source.
- **Proposed files:** `scripts/bootstrap-registry/*`, package script, fixtures/tests,
  `docs/registry-maintenance.md`.
- **Dependencies:** LAB01, LAB02, at least one reviewed CAT ticket.
- **Acceptance:** Dry-run changes nothing; apply requires exact selection; traversal/conflicts fail;
  customized files are preserved; snapshot refresh is separate from source update.
- **Verification:** Temporary-fixture tests for dry/apply/conflict/hash/traversal/local source;
  `pnpm check`.
- **Review:** Inspect plans and hashes, modified-file handling, recovery steps, and network boundary.

### M02 — manifest-driven browser matrix — Planned

- **Goal:** Smoke every locally runnable preview and critical role flow against production export.
- **Description:** Generate preview cases from the manifest and cover accounts, deep links, refresh,
  logout, 403, viewer restrictions, forms, tables, keyboard overlays, editor persistence, themes,
  map fallback, and responsive sizes.
- **Proposed files:** Playwright helpers/specs and evidence artifacts.
- **Dependencies:** All runnable feature, workbench, and CAT tickets.
- **Acceptance:** Every demo-ready local item has a passing smoke with error/hydration capture;
  complex visuals prove actual rendering; failures map to manifest IDs.
- **Verification:** `pnpm test:e2e` on the static preview and evidence reconciliation.
- **Review:** Inspect failures/screenshots and sample desktop/tablet/mobile interactions manually.

### M03 — network, bundle, and startup inspection — Planned

- **Goal:** Measure final offline defaults and loading boundaries.
- **Description:** Capture default network behavior, route chunks, shared bundle composition, preview
  lazy loading, startup errors, and accidental duplicate/heavy dependencies.
- **Proposed files:** analysis scripts/config only if justified, evidence in `docs`/catalogue records.
- **Dependencies:** M02.
- **Acceptance:** No business/unapproved third-party request by default; charts/maps/editor/full blocks
  are absent from shared shell chunks; measured results and approved exceptions are recorded.
- **Verification:** Production build stats, browser network traces, dependency inspection.
- **Review:** Compare measurements to architecture; do not substitute invented performance claims.

### M04 — final coverage and reuse acceptance — Planned

- **Goal:** Reconcile all requirements, evidence, exceptions, and extraction guidance.
- **Description:** Audit snapshot statuses, feature acceptance, documentation, attribution/licenses,
  static hosting behavior, and foundation reuse steps.
- **Proposed files:** Catalogue coverage/provenance, progress log, README and documentation corrections.
- **Dependencies:** M01, M02, M03 and every approved CAT/feature/workbench ticket.
- **Acceptance:** Every snapshot item is accounted for; all runnable approved items are demonstrated
  and verified; remaining exceptions are explicitly approved; docs match actual behavior.
- **Verification:** Frozen install, peer check, registry check, aggregate check, coverage, full E2E,
  static deep links, evidence/count reconciliation.
- **Review:** Independent final walkthrough of roles, routes, catalogue filters/previews, workbenches,
  network defaults, reuse instructions, and exception list.

## Next approval boundary

After F04 is verified, the next proposed ticket is **D01 — UIPKGE registry and canonical paths**.
Approval of D01 does not authorize D02 or any catalogue installation.
