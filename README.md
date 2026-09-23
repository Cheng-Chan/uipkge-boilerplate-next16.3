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
pnpm build
```

`pnpm build` writes the static site to `out/`. This project does not use `next start`.

TypeScript 7 is the application type checker. A separately aliased TypeScript 6 compatibility
package supplies the JavaScript compiler API currently required by ESLint tooling; it is not the
project type-check command.
