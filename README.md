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

Before the first end-to-end test run, install the pinned Playwright browser:

```bash
pnpm exec playwright install chromium
```

Linux hosts may also need Playwright's system packages, installed once with
`pnpm exec playwright install-deps chromium`.

TypeScript 7 is the application type checker. A separately aliased TypeScript 6 compatibility
package supplies the JavaScript compiler API currently required by ESLint tooling; it is not the
project type-check command.
