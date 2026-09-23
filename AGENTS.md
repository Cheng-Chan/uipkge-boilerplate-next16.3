<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Project rules

- This is a frontend-only, statically exported demonstration application. Do not add API routes,
  Server Actions, databases, server authentication, or an application HTTP mock server.
- Use pnpm exclusively and keep dependency versions pinned.
- Keep routes thin. Place reusable registry UI in `components`, domain behavior in `features`,
  synthetic data in `mocks`, and cross-cutting browser-safe utilities in `lib`.
- Treat demo authentication and RBAC as presentation behavior, never as a security boundary.
- Default builds and tests must not require credentials or unapproved external requests.
- Read the maintained decisions and safety boundaries in `docs/architecture.md` and
  `docs/demo-security.md` before changing application structure or data flow.
- Implement only the currently approved ticket and record verified progress in `docs/progress.md`.
