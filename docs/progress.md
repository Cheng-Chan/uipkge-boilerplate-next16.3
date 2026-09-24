# Progress and verification evidence

Last updated: 2026-09-24

## Status summary

| Ticket | Status   | Evidence summary                                                                                                                                    |
| ------ | -------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| T00    | Complete | Read-only workspace, toolchain, source, architecture, catalogue, route, and permission planning                                                     |
| F01    | Complete | Minimal Next.js 16.3.6 static application; lint, TypeScript 7 check, and production export passed                                                   |
| F02    | Complete | Vitest/RTL and Playwright baseline; static preview returned 200/404 correctly; 2 unit and 2 browser tests passed                                    |
| F03    | Complete | Zero-config Zod environment contract; 9 tests and default/valid static builds passed; invalid partial configuration failed as designed              |
| F04    | Complete | Architecture, security, reuse, dependency backlog, progress evidence, and catalogue caveats documented; aggregate check passed                      |
| D01    | Complete | Pinned shadcn CLI, schema-valid UIPKGE namespace, canonical paths, read-only resolution, and dry-run write plans verified                           |
| D02    | Complete | UIPKGE semantic tokens and canonical `cn` utility installed with offline-font, dependency, generated-CSS, and contrast adaptations                  |
| D03    | Complete | UIPKGE theme provider plus accessible light/dark/system control; hydration, persistence, keyboard, and system changes verified                      |
| P01    | Complete | Typed local service results and deterministic loading/empty/failure/rate-limited/success controls with cancellable timers verified                  |
| P02    | Complete | Versioned Zod-validated browser storage with typed recovery, memory fallback, reset seams, and prerender-safe access verified                       |
| P03    | Complete | Three schema-backed synthetic identities with stable IDs and explicitly public credentials separated from identity references verified              |
| P04    | Complete | Bounded synthetic customer/project fixtures and typed async CRUD/reset services with deterministic IDs, dates, validation, and persistence verified |
| P05    | Complete | Deterministic task movement/editing, calendar mutation, and read-only accessible activity contracts verified                                        |
| P06    | Complete | Local-only message simulation plus deterministic KPI and illustrative coordinate fixtures/services verified                                         |
| A01    | Complete | Typed permission matrix, any/all evaluators, segment-safe route matching, and deny-by-default decisions verified                                    |
| A02    | Complete | Versioned session identity restoration, expiry/recovery, derived permissions, login/logout, and no-auth-flash state verified                        |
| A03    | Complete | Accessible public-fixture login with React Hook Form/Zod and safe post-login destination validation verified                                        |
| A04    | Complete | Explicitly non-provisioning sign-up plus route-rechecking fixture-account switching verified                                                        |
| S01    | Complete | Centralized available-route navigation plus restoring/anonymous/allowed/forbidden/unknown client guard decisions verified                           |
| S02    | Complete | Responsive protected shell with filtered navigation, breadcrumbs, account controls, theme, role, skip link, and warning verified                    |
| S03    | Complete | Admin policy inspector and explicit frontend-only 403 states verified for admin, manager, and viewer                                                |
| LAB01  | Complete | Hash-backed 713-ID React snapshot/provenance plus 611 exact CAT tickets generated and reconciled                                                    |
| LAB02  | Complete | Typed schemas and offline registry gate reject route, dependency, path, reference, evidence, preview, and count drift                               |
| LAB03  | Complete | Searchable/filterable permission-aware catalogue browser exports from metadata without preview imports                                              |
| LAB04  | Complete | All tracked slugs export through an isolated explicit lazy-preview runtime with contained errors and honest unavailable states                      |
| FE01   | Complete | Responsive root composition links auth and UI-kit flows, renders live coverage, preserves warnings, and keeps lab code out of root payloads         |
| CAT001 | Complete | Theme Switch, Toggle, and Toggle Group installed with real lazy previews, interaction coverage, and dependency-only transitive tracking             |
| CAT002 | Complete | Charts meta-bundle installed with a real isolated ECharts preview, responsive/theme checks, and provider-safe default behavior                      |
| CAT003 | Complete | Button, Cascade Select, FAB, Float Label, and Input installed with real lazy previews, accessibility checks, and responsive interactions            |
| CAT004 | Complete | Password Input, Select, Signature Pad, Speed Dial, and Tree Select installed with local-only previews and interaction coverage                      |
| CAT005 | Complete | Board, Data Table, and Tree Table installed with isolated previews, real data interactions, and responsive verification                             |
| CAT006 | Complete | Attachment, Avatar, Badge, Carousel, and Chip installed with isolated previews and interaction coverage                                             |
| CAT007 | Complete | Code Block, Data List, Gantt, Icon Box, and Icons installed with local-only previews and interaction coverage                                       |
| CAT008 | Complete | Kanban, Kbd, Labeled Value, Lazy Image, and List installed with responsive previews and interaction coverage                                        |
| CAT009 | Complete | Payment Card, QR Code, Table, Timeline, and Transfer installed with synthetic/local-only previews and interaction coverage                          |
| CAT010 | Complete | Tree View and Virtual List installed with isolated previews, scrolling, and selection coverage                                                      |

“Complete” applies only to the named ticket. It does not mean the application, demo platform, or
catalogue is complete.

## Catalogue coverage

The dated 2026-09-24 React snapshot contains 713 deduplicated IDs: 704 visual catalogue items and 9
nonvisual foundation records. Of the visual items, 666 have live manifests; CAT001–CAT010 have
advanced 39 to `verified` and 77 transitive dependencies to `installed`, leaving 550 `discovered`.
Thirty-eight documentation-only map IDs are blocked because their raw manifests are unavailable.
Three additional verified records are previously completed nonvisual foundation items.

| Visual status      | Count | Note                                                    |
| ------------------ | ----: | ------------------------------------------------------- |
| Discovered         |   550 | Manifest-backed but not installed                       |
| Installed          |    77 | Transitive source; own preview not yet verified         |
| Demo-ready         |     0 | No item currently stops at the intermediate status      |
| Verified           |    39 | Completed CAT001–CAT010 items                           |
| Blocked            |    38 | Published map links whose raw manifests are unavailable |
| Approved exception |     0 | No exceptions approved                                  |

## Verification log

### F01 — static application foundation

- Pinned Next.js 16.3.6, React 19.3.0, TypeScript 7 CLI, pnpm, Tailwind CSS v4, ESLint, and Prettier.
- `pnpm lint`, `pnpm typecheck`, and `pnpm build` passed.
- Static export generated `/` and the custom not-found route.

### F02 — test and preview foundation

- `pnpm install --frozen-lockfile` and `pnpm peers check` passed.
- `pnpm check` passed formatting, lint, typecheck, 2 unit tests, and static build.
- `pnpm test:coverage` passed.
- Two Chromium smoke tests passed against the production export with no landing-page console errors.
- Static preview checks observed `/` as 200 and an unknown path as 404.
- The verification host lacked three Chromium runtime libraries; tests passed with temporary official
  Ubuntu package extracts. Linux prerequisites are documented in the README.

### F03 — environment contract

- `pnpm check` passed formatting, lint, typecheck, 9 unit tests, and static build.
- `pnpm test:coverage` passed with 82.35% statement coverage overall and 100% statements for the
  environment parser.
- Default and valid opt-in builds passed.
- An enabled Mapbox mode without its public token stopped config loading with the expected variable
  name.
- Frozen installation and peer checks passed.

### F04 — maintained architecture and safety documentation

- Added maintained architecture, demo-security, reuse, backlog, and progress documents linked from
  the root README.
- Added concise project-specific rules to `AGENTS.md` without modifying the generated Next.js rules.
- Recorded the provisional nature of the 713-item working count and blocked exact catalogue batch
  approval on a dated, hash-backed snapshot.
- Inspected local Markdown links, required documentation paths, and backlog phase/ticket coverage.
- `pnpm check` passed formatting, lint, typecheck, 9 unit tests, and static build.
- Browser tests were not rerun because this ticket changes documentation only.

### D01 — UIPKGE registry and canonical paths

- Pinned `shadcn` 4.21.0 and added a `components.json` validated with that version's exported
  `rawConfigSchema`.
- Configured `@uipkge-react` as `https://uipkge.dev/r/react/{name}.json` with canonical component,
  UI, hook, library, and utility aliases.
- `pnpm exec shadcn view @uipkge-react/init` resolved the public namespace without applying source.
- `pnpm exec shadcn add --dry-run @uipkge-react/init` reported three creates, one stylesheet
  overwrite, `next-themes`, and 113 CSS variables; the proposed targets remained untouched.
- `pnpm exec shadcn add --dry-run @uipkge-react/button` resolved four files under the canonical
  `components/ui/button` path and two dependencies without applying them.
- `pnpm install --frozen-lockfile`, `pnpm peers check`, and `pnpm check` passed; the aggregate check
  included formatting, lint, typecheck, 9 unit tests, and static build.
- Browser tests were not rerun because no runtime source or rendered behavior changed.

### D02 — tokens and base utilities

- Inspected and installed only `@uipkge-react/tailwind` and `@uipkge-react/utils` through the pinned
  CLI after reviewing its overwrite diff.
- Recorded raw manifest SHA-256 hashes, installed paths, MIT source attribution, missing declared
  dependencies, and every local adaptation in `docs/registry.md`.
- Pinned `tw-animate-css`, `clsx`, and `tailwind-merge`, which the installed source imports but its
  raw manifests do not declare.
- Removed the external Google Fonts request, used local system stacks, removed a malformed generated
  radius variable, narrowed `lib/utils.ts` to `cn`, and moved the existing pages to semantic tokens.
- Audited eleven foreground/surface pairs in both modes. After adapting dark destructive, all were
  at least 4.68:1; light background/foreground measured 17.07:1 and dark measured 16.29:1.
- Three design-foundation tests cover complete light/dark token pairs, offline font behavior,
  generated variable validity, Tailwind theme/dark directives, and class merging.
- `pnpm install --frozen-lockfile`, `pnpm peers check`, `pnpm check`, and `pnpm test:coverage` passed;
  the final suite contains 12 tests across 3 files.
- Two Chromium smoke tests passed against the static production preview. Light and forced-dark
  screenshots were manually inspected, computed body colors/fonts changed as expected, and the page
  made zero external requests.

### D03 — three-state theme

- Re-inspected and installed only `@uipkge-react/use-theme` through pinned shadcn 4.21.0, recorded
  raw manifest SHA-256 `5390238e0be8bd57de05f6914228251bbcf82c463f684d837a61d5c601e1d42e`,
  and pinned its MIT-licensed `next-themes` dependency to exact version 0.4.6.
- Kept the root layout a Server Component while placing the required theme provider and switcher in
  localized client boundaries. The document opts into the narrow hydration suppression required for
  the provider's pre-paint class update.
- Added a three-button fieldset with an accessible group name, pressed-state semantics, native
  keyboard activation, semantic colors, and a visible focus ring in both color modes.
- Two focused switcher tests cover labels, selected-state semantics, and keyboard changes. The final
  unit suite contains 14 tests across 4 files; coverage passed at 82.35% statements overall and
  92.85% statements for the switcher.
- `pnpm install --frozen-lockfile`, `pnpm peers check`, and `pnpm check` passed; the production build
  remained a static export of `/` and `/_not-found`.
- Three Chromium tests passed against the static production preview. The theme flow covered the
  system default, explicit light/dark changes, Enter-key activation, local-storage persistence and
  reloads, live system-preference changes, and zero console, page, or hydration errors.
- Light and dark system-mode screenshots were manually inspected at 1280×800; the theme control,
  selected states, foregrounds, surfaces, borders, and warning treatment remained legible.

### P01 — service result and demo-state contracts

- Added the exact discriminated `ServiceResult<T>` envelope, its six-code error vocabulary, and
  small success/failure constructors in `lib/service-result.ts`.
- Added a dependency-free demo-state task in `features/demo-state/demo-state.ts`. It emits loading
  immediately and deterministically settles to empty, failure, explicit simulated rate limiting, or
  typed success after a validated delay.
- The returned cleanup handle is idempotent, clears pending timers, resolves cancellation
  explicitly, and prevents terminal state delivery after cancellation. Consumer-listener failures
  reject completion without retaining a timer.
- Twelve focused tests verify discriminant narrowing, all required states, the explicit
  `RATE_LIMITED` wording/code, invalid delays, cancellation, listener failures, and fake-timer
  cleanup. The final suite contains 26 tests across 6 files.
- `pnpm test:coverage` passed at 90.41% statements overall. `service-result.ts` reached 100%
  statement/branch/function/line coverage; `demo-state.ts` reached 97.22% statements, 80% branches,
  100% functions, and 100% lines.
- Source inspection found no fetch, Axios, MSW, `/api/`, application server, or added dependency.
- `pnpm install --frozen-lockfile`, `pnpm peers check`, `pnpm check`, and the focused test/typecheck
  commands passed. Browser tests were not rerun because P01 adds no rendered behavior.

### P02 — versioned browser storage adapter

- Added `lib/storage/versioned-storage.ts` with `uipkge.demo:<name>:v<version>` keys, matching
  versioned JSON envelopes, caller-supplied Zod schemas, and local/session storage provider seams.
- Reads distinguish missing values from stored values, including valid `null` data. Corrupt JSON,
  invalid envelopes, unsupported versions, and schema-invalid data return typed recoverable
  failures without deleting the stored value or echoing its contents.
- Writes validate before persistence and verify a JSON round trip. Unavailable storage, quota
  failures, and other write failures use an adapter-local memory mirror with a typed warning rather
  than claiming durable persistence.
- Reset always clears memory, explicitly attempts persistent removal, and reports when persistent
  data might remain. Storage-provider, read, write, and remove exceptions are contained.
- Twenty-four focused tests cover keys, envelopes, missing/corrupt/invalid/unknown-version values,
  sensitive-value-safe errors, validation, non-JSON values, memory fallback, quota/generic failures,
  reset recovery, provider exceptions, and Node/prerender operation without `window`.
- The final suite contains 50 tests across 8 files. `pnpm test:coverage` passed at 95.16% statements
  overall; the adapter reached 98.23% statements, 96.22% branches, and 100% functions/lines.
- No dependency, module-time browser access, fixture, identity, UI, or network behavior was added.
- `pnpm install --frozen-lockfile`, `pnpm peers check`, `pnpm check`, and focused storage/typecheck
  commands passed. Browser tests were not rerun because P02 adds no rendered behavior.

### P03 — demo identities and account fixtures

- Added strict Zod schemas and types for the admin/manager/viewer roles, three stable user IDs,
  public identity records, identity references, and deliberately public demo credentials in
  `features/auth/types.ts`.
- Added one deterministic `demo-*` identity per role in `mocks/users.ts`. Identities contain only
  ID, username, synthetic display name, and role—no password, email, phone, address, URL, or other
  real-person field.
- Fake passwords are isolated in `PUBLIC_DEMO_CREDENTIALS`. Every entry is tagged
  `public-demo-credential`, carries the exact “Public demo credential — not a secret.” label, and
  resolves to exactly one identity.
- The separate identity-reference schema accepts only `userId`; login behavior, session state,
  expiry, persistence, permissions, and UI remain deferred to their approved tickets.
- Four focused tests verify schema parsing, exact role/ID coverage, fixture uniqueness, credential
  linkage and labels, identity/reference separation, and rejection of unlabeled credentials.
- The final suite contains 54 tests across 9 files. `pnpm test:coverage` passed at 95.40% statements
  overall; the auth types and user fixture modules reached 100% statement/branch/function/line
  coverage.
- A targeted source scan found no API key, auth secret, private key, bearer token, or secret-token
  pattern in the new identity, fixture, or test files.
- `pnpm install --frozen-lockfile`, `pnpm peers check`, and `pnpm check` passed. Browser tests were not
  rerun because P03 adds no rendered behavior.

### P04 — customer and project fixtures/services

- Added four customer and five project fixtures with stable IDs, explicit ISO timestamps/date-only
  values, invented `Demo`/`Sample` names, reserved `.invalid` emails, bounded integer budgets, and
  valid customer relationships.
- Added strict Zod schemas for entities and create/update inputs. Stored customer/project arrays are
  capped at 100/200 records, project dates must be real calendar dates in order, and update payloads
  cannot be empty.
- Added asynchronous list/detail/create/update/delete/reset contracts for both domains. Successful
  results include persistence provenance; not-found and validation failures use the shared
  `ServiceResult` vocabulary without echoing rejected values.
- Added a shared local-collection seam justified by the two domain consumers. It lazy-loads versioned
  storage, clones mutable state, preserves memory/quota warnings, persists validated mutations, and
  restores fresh fixture copies through explicit reset behavior.
- Local creations use deterministic `customer-local-N`/`project-local-N` IDs and all mutations use
  fixed timestamp `2026-01-15T12:00:00.000Z`. Project services validate customer relationships and
  allow an injected lookup for locally created customers.
- Eighteen focused tests cover fixture validity/uniqueness/bounds/relationships, every CRUD success
  and validation/not-found failure, persistence reloads, corrupt storage, quota fallback,
  unavailable storage, failed reset recovery, fixed IDs/timestamps, and reset-to-fixtures behavior.
- The final suite contains 72 tests across 12 files. `pnpm test:coverage` passed at 94.04% statements
  overall; both service modules, schemas, fixtures, validation helper, and local collection reached
  100% line/function coverage.
- Source inspection found no current-time, random-ID, HTTP/API, Axios, or fetch behavior in the new
  domain implementation. No dependency was added.
- `pnpm install --frozen-lockfile`, `pnpm peers check`, and `pnpm check` passed. Browser tests were not
  rerun because P04 adds no rendered behavior.

### P05 — task, calendar, and activity fixtures/services

- Added five task fixtures across every planned workflow status, three timezone-explicit calendar
  events, and four reverse-chronological activity records. All relationships resolve to tracked
  synthetic project/user fixtures, and every calendar/activity item carries an accessible summary.
- Added strict bounded Zod schemas and asynchronous task, calendar, and activity services. Tasks
  support validated editing and deterministic cross-column movement/reindexing; calendar events
  support create/detail/update/delete/reset with merged date validation; activity remains read-only
  with optional project filtering.
- Task and calendar mutations persist through versioned keys, return persistence provenance, and
  use fixed timestamp `2026-01-15T12:00:00.000Z`. Invalid moves, reversed/equal dates, unknown
  relationships, empty updates, and missing targets return typed failures.
- Focused fixture/service tests cover relationships, explicit ordering/dates, accessible summaries,
  editing, movement, CRUD, persistence reload, validation failures, filtering, detail, and reset.

### P06 — messages, KPI, and coordinate fixtures/services

- Added two synthetic message threads, three KPI series, and marker/polyline/polygon coordinate
  fixtures. Message records use `local-simulation` plus the exact non-delivery notice; every
  coordinate record carries the exact illustrative/non-navigation notice.
- Added an asynchronous thread/detail/send/reset service with deterministic IDs/timestamps,
  participant enforcement, versioned storage, nested-state cloning, and no delivery mechanism.
  KPI and coordinate services are intentionally read-only and return cloned fixture data.
- Zod contracts bound thread/message sizes, validate authors and ordering, require ascending KPI
  dates, constrain coordinate ranges/geometry point counts, and make safety labels structural.
- P05/P06 brought the final suite to 95 tests across 18 files. `pnpm test:coverage` passed at 92.72%
  statements, 83.44% branches, 95.26% functions, and 97.69% lines overall.
- Source inspection found no current-time, random-ID, fetch, Axios, API-route, or external-URL
  behavior in either ticket. No dependency was added.
- `pnpm install --frozen-lockfile`, `pnpm peers check`, and `pnpm check` passed, including the static
  export of `/` and `/_not-found`. Browser tests were not rerun because neither ticket changes
  rendered behavior.

### A01 — typed permission and route policy

- Added 27 exact permission codes and typed admin, manager, and viewer mappings. Admin receives all
  defined permissions; manager receives business creation/update/movement/send/export without
  destructive or access-administration actions; viewer receives viewing only.
- Added public and protected policies for the dashboard, every business destination, UI kit,
  blocks, charts, maps, editor, settings, and access inspection. Matching uses complete path segment
  boundaries, and unknown routes/permissions plus empty requirements deny by default.
- Added `docs/permission-matrix.md` and focused tests that compare role behavior, any/all semantics,
  destination coverage, nested boundaries, and anonymous/forbidden/unknown decisions.

### A02 — demo session state

- Added a version-1 `uipkge.demo:demo-session:v1` session-storage record containing only `userId`
  and optional `expiresAt`. Roles and permissions are always re-derived from fixtures and A01.
- Added initializing, anonymous, and authenticated provider states plus asynchronous restoration,
  login, logout, switching, expiry, corruption recovery, unavailable-storage provenance, and effect
  cleanup. Browser storage remains unresolved until an operation runs.
- Service/provider tests cover missing, valid, expired, and corrupt records, exact persisted fields,
  permission derivation, no protected-state flash, login, logout, and rerendered states.

### A03 — login and safe next handling

- Added a static `/login` route with a localized search-parameter Suspense boundary and accessible
  React Hook Form/Zod form. It includes labels, required/invalid feedback, password visibility,
  pending state, keyboard submission, and all three deliberately public credential fixtures.
- Safe-next validation permits only known same-origin destinations allowed for the authenticated
  role. It rejects external and protocol-relative URLs, unsafe schemes, malformed encoding,
  backslashes/control characters, login/signup loops, unknown routes, and forbidden destinations.
- Added exact `react-hook-form` 7.88.0 after verifying its Node and React 19 compatibility; no
  resolver package or additional state library was introduced.

### A04 — signup simulation and account switching

- Added a static `/signup` form experiment whose result explicitly says no real account was created
  and that the password was not retained. The form sends no email, provisions nothing, and clears
  every submitted field after success.
- Added an authenticated landing account panel with current role, logout, and intentional fixture
  switching. Switching persists only the new identity reference, re-derives permissions, and
  redirects to `/` if the new role cannot view the current route.
- The final unit suite contains 126 tests across 26 files. `pnpm test:coverage` passed at 91.82%
  statements, 82.91% branches, 95.47% functions, and 95.96% lines overall.
- Five Chromium tests passed against the static production preview, including login, exact session
  storage inspection, refresh restoration, account switching, logout, sign-up non-retention, theme,
  root smoke, and real 404 behavior. The host again required temporary official Ubuntu extracts for
  its three missing Chromium runtime libraries.
- `pnpm install --frozen-lockfile`, `pnpm peers check`, and `pnpm check` passed. The aggregate gate
  included formatting, lint, TypeScript 7, all 126 unit tests, and the static export of `/`,
  `/login`, `/signup`, and `/_not-found`.

### S01 — centralized navigation and client route guards

- Added typed navigation metadata for all planned destinations while marking only exported routes
  available. Visible links use the same role permissions as direct-route decisions, so unavailable
  feature routes never appear as broken placeholders.
- Added a client route guard with explicit restoring, redirecting, allowed, forbidden, and
  unknown-route decisions. Protected content stays hidden during restoration, anonymous navigation
  preserves an encoded known pathname, and segment-safe unknowns deny by default.
- Unit and production-preview flows cover nested boundary matching, filtered links, anonymous deep
  links, post-login restoration, refresh, role changes, forbidden routes, and real static 404s.

### S02 — responsive application shell

- Added a protected route-group layout and shared shell with a keyboard skip link, mobile menu,
  permission-aware navigation, active state, breadcrumbs, current-role badge, theme switcher,
  account switcher, user menu/logout, and the persistent exact demo warning.
- Added `/dashboard` as a deliberately lightweight shell entry; it does not claim completion of the
  later KPI/chart dashboard ticket. Planned business/laboratory destinations remain metadata-only
  until their static pages exist.
- Source and built-chunk inspection found no ECharts, Leaflet, Mapbox, Tiptap, editor, catalogue
  preview, or business-feature import in the shell path.

### S03 — access-control inspection and denied states

- Added the static `/access-control` inspector with all three fixture users, effective permission
  counts, and all 27 permissions rendered directly from the tracked policy. Only admin can render
  it; manager and viewer receive a 403-style state.
- Added a static `/403` route and reusable denied presentation explaining that client RBAC is not
  server authorization. Forbidden and unknown policy outcomes do not render protected children.
- The final unit suite contains 140 tests across 31 files. `pnpm test:coverage` passed at 91.38%
  statements, 83.42% branches, 93.97% functions, and 95.20% lines overall.
- Eight Chromium tests passed against the production static preview. They cover anonymous deep-link
  redirect/return, admin inspection, manager/viewer denial, mobile navigation/account controls,
  login/session/switch/logout, simulated signup, themes, root smoke, and real 404 behavior.
- `pnpm install --frozen-lockfile`, `pnpm peers check`, and `pnpm check` passed. The final static
  export contains `/`, `/login`, `/signup`, `/dashboard`, `/access-control`, `/403`, and the custom
  not-found output. Chromium used temporary official Ubuntu extracts for the host's three missing
  runtime libraries.

### LAB01–LAB04 — catalogue laboratory

- Captured and hashed the live React aggregate registry, `llms-full-react.txt`, components, blocks,
  charts, maps, and public GitHub tree at revision
  `744eb7902473a05c42f8bf707847fc6c89b0096e`. Their union contains 713 IDs: 675 live manifests plus
  38 documentation-only map IDs. The classification is 134 components, 436 blocks, 60 charts, 74
  maps, and 9 nonvisual foundation records.
- Recorded package/registry dependencies, target and installed paths, per-entry hashes, public source
  paths/blob hashes, external Mapbox/Leaflet requirements, routes, adaptations, evidence, and exact
  gaps. Only 210 matching public source definitions exist at the captured revision; absent evidence
  is explicit.
- Generated 611 exact CAT tickets: simple related records use batches of at most five; every block,
  chart, and map uses a one-item ticket. The ledger has 571 planned, 38 upstream-blocked, and 2
  already-complete foundation tickets, allocating all 713 records exactly once.
- Added typed Zod schemas and `pnpm registry:check`. Fixture tests deliberately reject duplicate IDs,
  missing/wrong routes, unknown dependencies/references, unsafe paths, and unsupported demo-ready or
  verified claims. The gate also validates the formatted snapshot hash, schema files, evidence paths,
  lazy preview keys, totals, and ticket constraints without network access.
- Added the protected `/ui-kit` browser with combined search, category, kind, and status filters,
  URL-persisted pagination, coverage counts, provenance/install details, permission-aware links, and
  disabled prefetch. All 713 item routes are statically generated from tracked metadata.
- Added an explicit lazy-component map, Suspense state, isolation marker, and local error boundary.
  Since no visual CAT ticket is approved, every visual record truthfully renders “Preview not
  installed”; the validator prevents that state from counting as demo-ready or verified.
- `pnpm install --frozen-lockfile` and `pnpm peers check` passed. Final `pnpm check` passed formatting,
  lint, generated route types, 151 tests across 34 files, the offline registry gate, and a 722-page
  static build containing all 713 slugs.
- `pnpm test:coverage` passed at 85.81% statements, 75.16% branches, 85.10% functions, and 88.99%
  lines. All 9 Chromium tests passed against the production static preview; catalogue search,
  query persistence, direct item navigation, refresh, and local-origin-only requests were observed.
  The host required temporary official Ubuntu extracts for its missing Chromium runtime libraries.
- Built-output inspection found 713 slug directories with none missing and no ECharts, Mapbox,
  Tiptap, or React Leaflet marker in emitted JavaScript. `git diff --check` passed.

### FE01 — landing composition

- Replaced the foundation-only root with a project-authored, UIPKGE-informed marketing composition:
  sticky navigation, metric-led hero, persistent demo warning, capabilities, snapshot-backed
  coverage bars, evidence workflow, demo-account CTA, and footer.
- `/ui-kit`, `/login`, and `/signup` links work from the public page. UI-kit links disable prefetch,
  and the only client behavior retained is the existing local account panel and global theme control.
- Snapshot counts render from tracked metadata: 713 total records, 675 live manifests, 38 blocked
  upstream, and the exact component/block/chart/map totals. No duplicate count constant was added.
- Unit coverage verifies the hero, current counts, links, and warning. Production-browser coverage
  verifies the public route without browser errors, 390px/1440px layouts, no horizontal overflow,
  navigation visibility, and the existing login/session flows.
- Root-output inspection found no distant catalogue ID, preview-runtime copy, ECharts, Mapbox,
  Tiptap, or React Leaflet marker in any linked script, `index.html`, or route payload.
- `pnpm install --frozen-lockfile`, `pnpm peers check`, and `pnpm check` passed. The aggregate gate
  included formatting, lint, TypeScript, 152 tests across 34 files, the offline registry gate, and
  the unchanged 722-page static export.
- `pnpm test:coverage` passed at 85.97% statements, 74.83% branches, 85.46% functions, and 89.12%
  lines. All 10 Chromium tests passed against the production static preview. The host used temporary
  official Ubuntu extracts for its missing Chromium runtime libraries.
- Desktop and mobile full-page visual inspection confirmed readable hierarchy, intact coverage bars,
  visible safety copy, responsive stacking, and no horizontal overflow.

### CAT001 — Theme Switch, Toggle, Toggle Group catalogue coverage

- Inspected the exact live manifests, source, dependencies, and 14 proposed writes for
  `theme-switch`, `toggle`, and `toggle-group`. Captured raw manifest hashes before installation.
- Installed the three approved components with the pinned CLI. Their reviewed transitive registry
  dependencies (`card`, `dropdown-menu`, and `section-card`) are tracked as `installed` only; their
  own CAT tickets remain planned.
- Added explicit lazy preview modules. Theme Switch renders all six locally supported variants,
  Toggle covers both variants, three sizes, pressed state, and disabled state, and Toggle Group
  covers controlled single and multiple selection with its animated indicator.
- Preserved the D03 light/dark/system contract by omitting upstream `black` and `pill-4`. Also
  avoided unnecessary `matchMedia` work when view transitions are disabled and removed the
  dropdown's duplicate selection callback. All five new package dependencies are exactly pinned.
- Advanced only the three CAT001 items to `verified`, advanced the three required dependency items
  to `installed`, completed CAT001 in the ledger, and reconciled the visual catalogue to 660
  discovered, 3 installed, 3 verified, and 38 blocked records.
- `pnpm check` passed formatting, lint, TypeScript, 155 unit tests across 35 files, offline registry
  reconciliation, and all 722 static pages. Frozen offline install, peer checks, and
  `git diff --check` also passed.
- `pnpm test:coverage` passed at 82.13% statements, 69.50% branches, 77.80% functions, and 84.90%
  lines. All 11 Chromium tests passed against the production static preview using the existing
  temporary official Ubuntu runtime-library workaround.
- Desktop review at 1440px confirmed every Theme Switch variant and Toggle state is readable and
  aligned. Mobile review at 390px confirmed both Toggle Group modes stack within the content
  viewport. Built-output inspection found CAT001 markers only in dedicated chunks, not root-linked
  scripts.

### CAT002 — Charts catalogue coverage

- Audited the live `charts` meta-manifest plus its 62 chart-wrapper dependencies and shared `map`
  dependency before applying them. The 64 manifests declared 238 files resolving to 130 unique,
  repository-contained targets; the only two collisions were byte-identical shared helpers. Raw
  manifest hashes and target mappings are preserved in `catalogue/evidence/CAT002-manifests.json`.
- Installed the approved meta-bundle through pinned shadcn 4.21.0 and pinned ECharts 6.1.0,
  echarts-for-react 3.0.6, react-map-gl 8.1.3, and mapbox-gl 3.31.0 exactly. Mapbox's provider terms,
  public-token requirement, and external-network boundary remain explicit.
- Added an isolated lazy preview using real Area, Bar, Pie, Segmented Gauge, and Category
  Distribution components. Seven-/30-day range and overlaid/stacked series controls update visible
  state and the chart's accessible label; the preview does not import either Mapbox-backed wrapper.
- Adapted the shared theme/option helpers, accessibility forwarding, hook dependencies, and map
  readiness handling for this React/TypeScript/lint contract. The map primitive uses the existing
  explicit `NEXT_PUBLIC_MAPBOX_ENABLED` opt-in, requires a `pk.` public token, and retains provider
  attribution. Registry-specific `any` interoperability is narrowly exempted only within the
  installed charts/map directories.
- Advanced only `charts` to `verified`; its 62 wrapper dependencies plus `map` remain `installed`
  pending their own tickets. Visual coverage is now 596 discovered, 66 installed, 4 verified, and
  38 blocked. The ledger now has 569 planned, 38 blocked-upstream, and 4 complete tickets.
- `pnpm check` passed formatting, lint, TypeScript, 157 tests across 36 files, offline registry
  reconciliation, and the 722-page static export. Frozen offline installation, peer checks, and
  `git diff --check` passed. A repeated instrumented run passed at 38.50% statements, 26.94%
  branches, 33.68% functions, and 39.33% lines; its first run had one unrelated five-second timeout.
- All 12 Chromium tests passed against the production static preview. The CAT002 flow observed real
  canvas output, changed both controls, retained accessible summaries, emitted no browser errors,
  and made no external requests.
- Light/dark desktop inspection and a live resize to 390px confirmed clear rendering and canvas
  widths changing from 934/434px to 316px. The 1,017,317-byte chart preview chunk was requested by
  `/ui-kit/charts` but not `/`; no Mapbox environment/provider marker was emitted in built chunks.

### CAT003 — Button, Cascade Select, FAB, Float Label, Input catalogue coverage

- Audited the five approved live manifests plus Cascade Select's required Popover dependency before
  installation. The six manifests resolved to 19 unique, repository-contained targets with no
  collisions, external requests, unsafe evaluation, geolocation, or server behavior. Raw hashes and
  path mappings are preserved in `catalogue/evidence/CAT003-manifests.json`.
- Installed all source through pinned shadcn 4.21.0 and pinned the new Radix Popover 1.1.23 and
  Radix Slot 1.3.3 dependencies exactly. Popover remains dependency-only and its optional storage
  persistence is not enabled by CAT003.
- Added five explicit lazy previews covering Button variants, sizes, disabled and attached groups;
  searchable/clearable Cascade Select plus disabled/loading states; FAB variants, sizes, extended
  and contained positioning; empty, prefilled, required, and disabled Float Labels; and Input
  variants, validation, clear, password, count, addon, and group behavior.
- Added stable Cascade Select naming and controlled-popup semantics, non-submitting FAB defaults,
  observable InputGroup addon alignment, fixed optional Popover persistence wiring, and narrow
  Input/InputGroup flex sizing. The latter was found during the 390px visual review and removed a
  51px overflow from the preview.
- Advanced only the five approved items to `verified`; Popover remains `installed`. Visual coverage
  is now 590 discovered, 67 installed, 9 verified, and 38 blocked. The ledger now has 568 planned,
  38 blocked-upstream, and 5 complete tickets.
- Focused component/runtime verification passed 7 tests across 2 files. It covers non-submitting
  defaults, click behavior, Cascade Select search and selection, popup relationships, Float Label
  association/floating, controlled Input clearing, and password visibility.
- `pnpm check` passed formatting, lint, TypeScript, 161 tests across 37 files, offline registry
  reconciliation, and the 722-page static export. Coverage passed at 41.46% statements, 31.24%
  branches, 35.71% functions, and 42.49% lines overall. All 13 production Chromium tests passed;
  the CAT003 flow exercised all five routes, retained local-only behavior, and observed no browser
  or external-network errors.
- Desktop light and dark inspection confirmed readable states and contained FAB positioning. At
  390px, all five preview isolation containers fit their 358px content width after the Input sizing
  correction.

### CAT004 — Password Input, Select, Signature Pad, Speed Dial, Tree Select catalogue coverage

- Audited all five approved live manifests and 16 own targets. Speed Dial and Tree Select proposed
  five additional FAB/Popover dependency writes; those reviewed CAT003 files were explicitly
  preserved rather than overwritten. Raw hashes and target mappings are retained in
  `catalogue/evidence/CAT004-manifests.json`.
- Installed the five approved sources through pinned shadcn 4.21.0 and pinned the only new package,
  Radix Select 2.3.7, exactly. The controls and previews use transient browser state only; the
  Signature Pad PNG data URL is neither stored nor uploaded.
- Added five explicit lazy previews covering password strength/visibility and states; custom and
  native selection; real pointer-driven canvas drawing/clearing; click Speed Dial actions; and
  searchable single/multiple Tree Select behavior.
- Adapted Signature Pad for narrow responsive rendering while retaining logical/high-DPI drawing,
  aligned Speed Dial's menu semantics, and gave Tree Select stable naming/dialog relationships
  without a nested interactive clear control.
- Advanced only the five approved items to `verified`. Visual coverage is now 585 discovered, 67
  installed, 14 verified, and 38 blocked. The ledger now has 567 planned, 38 blocked-upstream, and
  6 complete tickets.
- Focused component/runtime verification passed 8 tests across 2 files. `pnpm check` passed
  formatting, lint, TypeScript, 166 tests across 38 files, offline registry reconciliation, and all
  722 static pages. Coverage passed at 44.81% statements, 35.36% branches, 38.04% functions, and
  46.09% lines.
- All 14 Chromium tests passed. CAT004 exercised all five routes, actual pointer drawing and clear,
  popup/menu selection, password state, local-only requests, and browser-error capture. At 390px,
  all five preview containers matched their 358px content width; the responsive Signature Pad was
  also inspected visually.
- Built-output inspection found five independent preview chunks of 9,829, 29,033, 9,094, 28,082,
  and 32,377 bytes, with their identifying markers absent from root-linked chunks.

### CAT005 — Board, Data Table, Tree Table catalogue coverage

- Audited the three approved manifests plus 14 transitive manifests before installation. Their 53
  unique repository-contained targets had no collisions or unsafe paths; 37 were new and all 16
  proposed overwrites of reviewed Button, Dropdown Menu, Input, Popover, and Select files were
  declined. Full hashes and path decisions are in `catalogue/evidence/CAT005-manifests.json`.
- Installed Board, Data Table, and Tree Table plus nine dependency-only registry items through
  pinned shadcn 4.21.0. Added seven exact package dependencies; TanStack React Table is deliberately
  pinned to compatible v8.21.3 because the upstream manifest's unbounded range resolved to a
  source-incompatible v9 release.
- Added explicit lazy previews for keyboard/pointer Board movement; Data Table search, sort, filter,
  density, visibility, pagination, row selection, and local export; and Tree Table expansion,
  selection, loading, and empty states. No network, server, geolocation, socket, or dynamic-code
  behavior was found or added.
- Added accessible region/table naming and treegrid/loading semantics, synchronized filter drafts
  on popover opening, and confined necessary TanStack interoperability/compiler exceptions to the
  registry table boundaries.
- Advanced only the three approved items to `verified`; nine new registry dependencies remain
  `installed`. Visual coverage is now 573 discovered, 76 installed, 17 verified, and 38 blocked.
  The ledger now has 566 planned, 38 blocked-upstream, and 7 complete tickets.
- Focused component/runtime verification passed 6 tests across 2 files. `pnpm check` passed
  formatting, lint, TypeScript, 169 tests across 39 files, offline registry reconciliation, and all
  722 static pages. Coverage passed at 43.79% statements, 34.85% branches, 37.33% functions, and
  45.23% lines. Frozen offline installation and peer checks also passed.
- All 15 Chromium tests passed. CAT005 exercised all three production routes and their meaningful
  interactions without external requests or browser errors. At 390px, every preview isolation
  container matched its 358px content width; the wide tables remain usable through intentional
  internal scrolling.
- Built-output inspection found independent Board, Data Table, and Tree Table preview chunks of
  10,073, 203,353, and 36,901 bytes, with their identifying markers absent from root-linked chunks.

### CAT006–CAT010 — display-component catalogue batch

- Audited all 28 approved and transitive manifests before installation. Their 80 unique,
  repository-contained targets had no collisions, unsafe paths, fetch/XHR, sockets, geolocation,
  dynamic-code evaluation, or server behavior. Sixty-three new targets were accepted and 17
  proposed overwrites of reviewed components were preserved. Per-ticket hashes and target decisions
  are in `catalogue/evidence/CAT006-manifests.json` through `CAT010-manifests.json`.
- CAT006 verified `attachment`, `avatar`, `badge`, `carousel`, and `chip`; CAT007 verified
  `code-block`, `data-list`, `gantt`, `icon-box`, and `icons`; CAT008 verified `kanban`, `kbd`,
  `labeled-value`, `lazy-image`, and `list`; CAT009 verified `payment-card`, `qr-code`, `table`,
  `timeline`, and `transfer`; CAT010 verified `tree-view` and `virtual-list`.
- Installed dependency-only `context-menu`, `skeleton`, and `scroll-area`. Pinned Radix Avatar
  1.2.6, Context Menu 2.3.7, and Scroll Area 1.2.18; TanStack React Virtual 3.14.13; Embla Carousel
  React 8.6.0; QR Code 1.5.4 and its types 1.5.6; and Shiki 4.4.3. All eight packages are MIT.
- Added 22 explicit lazy previews with transient local state. Lazy Image uses inline data URLs, QR
  Code encodes a reserved `.invalid` URL locally, and Payment Card uses fixed synthetic values; no
  preview requires credentials or an external request.
- Corrected Carousel lifecycle and semantics, rendered Gantt assignees, corrected disabled List
  propagation, narrowed Virtual List generics, and confined necessary state/ref/compiler lint
  exceptions to affected registry boundaries. Wide Gantt, Kanban, and Transfer content scrolls
  internally.
- Advanced only the 22 approved items to `verified`; three new registry dependencies remain
  `installed`. Visual coverage is now 550 discovered, 77 installed, 39 verified, and 38 blocked.
  The ledger now has 561 planned, 38 blocked-upstream, and 12 complete tickets.
- Focused component/runtime verification passed 8 tests across 2 files. `pnpm check` passed
  formatting, lint, TypeScript, 174 tests across 40 files, offline registry reconciliation, and all
  722 static pages. Coverage passed at 47.57% statements, 38.17% branches, 42.78% functions, and
  49.51% lines. Frozen offline installation and peer checks also passed.
- All 20 Chromium tests passed. The five CAT006–CAT010 flows exercised all 22 production routes and
  meaningful interactions without external requests or browser errors. At 390px, every preview
  isolation container matched its 358px content width; representative complex previews were also
  inspected visually.
- Built-output inspection found independent lazy chunks for all 22 previews, ranging from 1,289
  bytes for Kbd to 126,218 bytes for Code Block, with their identifying markers absent from
  root-linked chunks. Complete bundle measurements and verification evidence are in
  `catalogue/evidence/CAT006.json` through `CAT010.json`.

## Known constraints

- ESLint 9 remains pinned because the installed Next.js ESLint peer stack does not accept ESLint 10.
- Playwright Chromium on Linux needs its documented system packages.
- Thirty-eight published map IDs have no live raw manifest and remain blocked upstream.
- Thirty-nine visual catalogue items are verified through CAT001–CAT010; business feature pages and
  complex workbenches do not exist yet. CAT002's 62 chart wrappers and shared map source plus
  CAT003's Popover, CAT005's remaining dependency-only sources, and CAT007–CAT009's Context Menu,
  Skeleton, and Scroll Area are installed dependencies, not individually verified components.
  Installed foundation and catalogue dependencies are tracked in `docs/registry.md`.
- At 390px, the previously implemented protected-shell header extends 123px beyond the viewport;
  CAT001–CAT010 preview content remains responsive, but the shell overflow should be corrected under
  an explicitly approved shell-maintenance ticket.

Append ticket evidence here only after commands have actually run. Link richer evidence from the
future catalogue manifest rather than converting planned checks into claims.
