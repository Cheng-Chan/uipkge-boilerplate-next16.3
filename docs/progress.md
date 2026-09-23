# Progress and verification evidence

Last updated: 2026-09-23

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

“Complete” applies only to the named ticket. It does not mean the application, demo platform, or
catalogue is complete.

## Catalogue coverage

The T00 working discovery count is 713 deduplicated React catalogue candidates. It is not yet a
tracked, dated, hash-backed snapshot, so category totals and item-level status are intentionally not
asserted here. LAB01 must reproduce and persist the inventory before catalogue implementation.

| Status             | Count | Note                                                        |
| ------------------ | ----: | ----------------------------------------------------------- |
| Discovered         |   713 | Provisional T00 working count; snapshot persistence pending |
| Installed          |     0 | No catalogue item installation approved yet                 |
| Demo-ready         |     0 | No catalogue preview implemented yet                        |
| Verified           |     0 | No catalogue evidence recorded yet                          |
| Blocked            |     0 | Item-level classification awaits the snapshot               |
| Approved exception |     0 | No exceptions approved                                      |

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

## Known constraints

- ESLint 9 remains pinned because the installed Next.js ESLint peer stack does not accept ESLint 10.
- Playwright Chromium on Linux needs its documented system packages.
- The catalogue count is provisional until LAB01 records provenance and content hashes.
- No demo authentication behavior, RBAC, visual catalogue components, feature pages, or workbenches
  exist yet. Installed nonvisual registry foundation is tracked separately in `docs/registry.md`.

Append ticket evidence here only after commands have actually run. Link richer evidence from the
future catalogue manifest rather than converting planned checks into claims.
