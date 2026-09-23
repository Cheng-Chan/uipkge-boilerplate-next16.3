# Progress and verification evidence

Last updated: 2026-09-23

## Status summary

| Ticket | Status   | Evidence summary                                                                                                                       |
| ------ | -------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| T00    | Complete | Read-only workspace, toolchain, source, architecture, catalogue, route, and permission planning                                        |
| F01    | Complete | Minimal Next.js 16.3.6 static application; lint, TypeScript 7 check, and production export passed                                      |
| F02    | Complete | Vitest/RTL and Playwright baseline; static preview returned 200/404 correctly; 2 unit and 2 browser tests passed                       |
| F03    | Complete | Zero-config Zod environment contract; 9 tests and default/valid static builds passed; invalid partial configuration failed as designed |
| F04    | Complete | Architecture, security, reuse, dependency backlog, progress evidence, and catalogue caveats documented; aggregate check passed         |

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

## Known constraints

- ESLint 9 remains pinned because the installed Next.js ESLint peer stack does not accept ESLint 10.
- Playwright Chromium on Linux needs its documented system packages.
- The catalogue count is provisional until LAB01 records provenance and content hashes.
- No demo auth, RBAC, business fixtures, registry components, feature pages, or workbenches exist yet.

Append ticket evidence here only after commands have actually run. Link richer evidence from the
future catalogue manifest rather than converting planned checks into claims.
