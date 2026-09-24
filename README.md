# UIPKGE Boilerplate and Component Laboratory

Frontend-only Next.js 16.3 application foundation and component laboratory. The deployment
target is a static export; business data and operations remain in the browser.

> **Demo only.** Authentication, permissions, and data are simulated in your browser. Do not
> enter real credentials or sensitive information.

## Requirements

- Node.js 24.18.0
- pnpm 11.17.0

## Commands

```bash
pnpm dev
pnpm lint
pnpm typecheck
pnpm format:check
pnpm test
pnpm test:coverage
pnpm test:e2e
pnpm check
pnpm build
pnpm preview
```

`pnpm build` writes the static site to `out/`. Both `pnpm preview` and `pnpm start` serve
that directory; this project does not use `next start`.

The current export includes `/`, `/login`, `/signup`, `/dashboard`, `/access-control`, and `/403`.
Login uses the deliberately public demo accounts shown on the page and stores only a versioned
fixture identity reference in `sessionStorage`. Sign-up is a form simulation and does not create an
account. Protected routes and permissions demonstrate browser-side presentation behavior only.

Before the first end-to-end test run, install the pinned Playwright browser:

```bash
pnpm exec playwright install chromium
```

Linux hosts may also need Playwright's system packages, installed once with
`pnpm exec playwright install-deps chromium`.

## Environment

The default frontend-only demo needs no environment variables, credentials, or backend URL.
Copy `.env.example` to `.env.local` only when configuring an optional feature.

`NEXT_PUBLIC_MAPBOX_ENABLED` accepts only `true` or `false`. When it is `true`,
`NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN` must contain a public `pk.` Mapbox token. A token without the
explicit opt-in, a missing token, or a secret `sk.` token fails configuration validation. These
settings reserve the contract for the later opt-in map workbench; they do not enable external
requests in the current foundation.

All `NEXT_PUBLIC_*` values are browser-visible and are frozen into the static output by
`pnpm build`. Changing a static host's environment after deployment does not reconfigure an
existing `out/` directory; rebuild the application instead. Never put secrets in public variables.

## Project documentation

- [Architecture](docs/architecture.md)
- [Demo security](docs/demo-security.md)
- [Demo permission matrix](docs/permission-matrix.md)
- [UIPKGE registry](docs/registry.md)
- [Backlog](docs/backlog.md)
- [Progress and verification evidence](docs/progress.md)
- [Reusing the application foundation](docs/reuse.md)

TypeScript 7 is the application type checker. A separately aliased TypeScript 6 compatibility
package supplies the JavaScript compiler API currently required by ESLint tooling; it is not the
project type-check command.
