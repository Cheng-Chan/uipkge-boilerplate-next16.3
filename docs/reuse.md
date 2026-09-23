# Reusing the application foundation

## Choose the retained scope

The reusable foundation is the static Next.js configuration, quality tooling, environment
validation pattern, canonical shared components, and typed local-service seams. Demo accounts,
synthetic business domains, catalogue previews, workbenches, and showcase routes are optional
experiments.

Do not treat the future demo authentication or client RBAC as production security. Removing the
warning banner changes presentation only; it does not add a trusted server, secure sessions, or
authorization.

## Removal order

When adapting the repository, remove showcase behavior from the outside inward:

1. Remove showcase routes and their entries from centralized navigation and route policy.
2. Remove the corresponding manifest records and lazy preview mappings.
3. Remove feature modules under `features/showcase` and any isolated block wrappers.
4. Remove fixtures and owned assets used only by those features.
5. Use `pnpm remove <package>` for dependencies with no remaining importers.
6. Remove feature-specific environment variables and their schema/tests only after the feature is
   gone.
7. Run the complete check and static-preview smoke suite.

Do not delete registry primitives merely because no route imports them directly; another registry
component may depend on them. Consult the tracked catalogue dependency metadata first.

## Converting local services

Replace a local adapter behind its typed service interface rather than teaching components to call
an API directly. A production backend migration needs a separately designed trust boundary,
authentication/session model, authorization enforcement, request validation, error mapping,
privacy review, and operational controls. Those concerns are intentionally absent here.

Keep deterministic local adapters available for component previews and tests when practical. Never
describe a local `RATE_LIMITED` simulation as real traffic enforcement.

## Removing demo authentication

Remove login/signup routes, demo account fixtures, session restoration, account switching, access
inspection, guards, permission-aware navigation, and gated mutation behavior together. Leaving only
some of these layers creates misleading states.

If production authentication is required, design and approve it as a new subsystem. Do not reuse
public demo passwords, browser-controlled roles, or `sessionStorage` identity references.

## Removing external integrations

For Mapbox, remove the workbench, preview imports, provider dependency, public environment fields,
schema tests, and documentation together. Verify the built output no longer contains provider URLs
or public tokens. Local Leaflet assets may remain only when their license/provenance is retained.

## Verification after pruning

Run:

```bash
pnpm install --frozen-lockfile
pnpm peers check
pnpm check
pnpm test:coverage
pnpm test:e2e
```

Then inspect direct links and refresh behavior using `pnpm start`. Search navigation, policy,
catalogue metadata, tests, documentation, and the lockfile for the removed feature name. Report any
intentionally retained transitive dependency instead of deleting files blindly.
