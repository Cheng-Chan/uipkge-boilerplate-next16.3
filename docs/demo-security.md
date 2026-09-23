# Demo security

## Security statement

This project is a frontend demonstration, not a production security system. Authentication,
permissions, failures, and business operations are simulated in code running under the user's
control. A user can inspect or alter all shipped JavaScript, fixtures, credentials, storage, and
state.

The following warning must remain visible on login and throughout the future authenticated shell:

> Demo only. Authentication, permissions, and data are simulated in your browser. Do not enter
> real credentials or sensitive information.

Removing that warning does not make the application, its authentication, or its RBAC suitable for
production.

## Current guarantees

- The repository contains no application backend, database connection, production credentials, or
  secret-bearing environment example.
- The default static application makes no business-backend request.
- Environment validation rejects secret Mapbox tokens in browser-public configuration and does not
  include rejected values in its error messages.
- The initial page visibly warns users not to enter real credentials or sensitive information.

## Required future behavior

| Area          | Required behavior                                                    | Explicit non-guarantee                             |
| ------------- | -------------------------------------------------------------------- | -------------------------------------------------- |
| Demo accounts | Public synthetic accounts displayed on the login page                | Credentials are not secrets                        |
| Session       | Versioned identity reference and optional expiry in `sessionStorage` | No protected or encrypted session                  |
| RBAC          | Shared policy for routes, navigation, controls, and local mutations  | No server authorization boundary                   |
| Data          | Deterministic synthetic fixtures validated before use                | No persistence durability or tenant isolation      |
| Forms         | Local validation and simulation; passwords never stored or logged    | No account provisioning, email, or upload          |
| External maps | Explicit opt-in, public token, documented provider requests          | No private token or offline guarantee when enabled |

## Data handling

- Never enter, seed, copy, log, or transmit real customer data, credentials, email content,
  addresses, or coordinates.
- Submitted demo passwords are compared in memory and then discarded. They are never persisted,
  logged, placed in URLs, or included in analytics.
- Stored demo values use versioned keys and Zod schemas. Unknown, corrupted, or expired values fail
  closed to a safe default and provide recoverable feedback.
- Storage access must handle unavailable storage and quota errors. UI components do not access
  storage directly.
- Local file experiments create previews only. They do not upload files and must revoke object URLs.
- User-editable CSV exports must neutralize spreadsheet formula prefixes.

## Navigation and access behavior

- Anonymous redirects accept only known same-origin application routes.
- Protocol-relative URLs, external URLs, unsafe schemes, malformed encodings, and redirect loops are
  rejected.
- Unknown permissions and unmapped protected routes are denied by default.
- Segment-aware route matching is required; raw `startsWith` checks are insufficient.
- Permission checks run again in local mutation handlers. Hiding a button is not enough for
  consistent demo behavior.
- A 403 page is presentation feedback, not an HTTP authorization guarantee on a static host.

## Network boundary

Default startup, build, tests, and runtime must not contact a business backend or optional map
provider. Registry and package access are explicit development/maintenance actions, never startup
side effects.

The default map uses local, illustrative geography. External tile, style, routing, geocoding,
tracking, telemetry, or geolocation behavior is disabled. A future Mapbox mode must remain opt-in,
lazy-loaded, and visibly disclose network/provider behavior and token exposure.

## Review checklist

Before calling a feature verified, confirm:

- The demo warning remains visible where required.
- Fixtures and screenshots contain only synthetic information.
- No submitted password or file content is logged or persisted unexpectedly.
- Browser storage failures and corrupt data have tested outcomes.
- Route, navigation, action, and mutation checks agree.
- Unknown access fails closed.
- External requests are absent in the default mode and documented in opt-in modes.
- No secret appears in `NEXT_PUBLIC_*`, static output, source, test artifacts, or error messages.
