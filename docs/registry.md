# UIPKGE registry

## Configured contract

The project uses the locally pinned `shadcn` CLI at version `4.21.0`. Its Node requirement is
compatible with the project engine. `components.json` uses the CLI's current public schema and the
following namespace:

```json
{
  "registries": {
    "@uipkge-react": "https://uipkge.dev/r/react/{name}.json"
  }
}
```

The default application does not contact this registry. Registry access is an explicit development
or maintenance action and is never part of `dev`, `build`, `test`, or `check`.

## Canonical paths

The shadcn aliases establish these project roots:

| Alias        | Canonical path  | Purpose                              |
| ------------ | --------------- | ------------------------------------ |
| `components` | `components`    | Registry and shared React components |
| `ui`         | `components/ui` | Registry primitives                  |
| `hooks`      | `hooks`         | Reusable hooks when prescribed       |
| `lib`        | `lib`           | Cross-cutting libraries              |
| `utils`      | `lib/utils`     | The single `cn` utility target       |

Registry items may contain explicit `target` paths, which take precedence over the general aliases.
The React manifests inspected on 2026-09-23 resolve as follows:

| Item                      | Type             | Inspected targets                                   | Dependencies    |
| ------------------------- | ---------------- | --------------------------------------------------- | --------------- |
| `@uipkge-react/tailwind`  | `registry:style` | `app/globals.css`                                   | None            |
| `@uipkge-react/utils`     | `registry:lib`   | `lib/utils.ts`                                      | None            |
| `@uipkge-react/use-theme` | `registry:hook`  | `components/theme-provider.tsx`, `lib/use-theme.ts` | `next-themes`   |
| `@uipkge-react/button`    | `registry:ui`    | `components/ui/button/*`                            | Radix Slot, CVA |

The `init` item contains no files of its own; it depends on `tailwind`, `utils`, and `use-theme`.
Installing it would therefore implement parts of D02 and D03 together and is not authorized by D01.

Full blocks may prescribe `components/blocks/<item>/*`. Keep those targets rather than copying them
into `components/ui`. Do not create `app/components`, a second `ui` tree, another `lib/utils`, or a
second theme provider.

## Read-only inspection workflow

Use the pinned local CLI and inspect an exact item before requesting installation approval:

```bash
pnpm exec shadcn view @uipkge-react/<item>
```

`view` resolves metadata, package dependencies, registry dependencies, files, content, CSS, and
environment requirements without applying the item. Review all of those fields plus licenses and
external behavior. Do not substitute `shadcn@latest` or a globally installed CLI, because that
bypasses the pinned toolchain.

After a later item ticket is approved:

1. Re-run `view` and record upstream URL/revision or content hash.
2. Confirm every destination remains inside the repository and does not overwrite customized work.
3. Add only the approved exact item with the pinned CLI.
4. Inspect the source diff and dependency/lockfile changes before executing the new code.
5. Run focused tests, `pnpm check`, the static preview, and the ticket's interaction review.
6. Record installed paths, adaptations, evidence, and status in the future catalogue manifest.

Bulk add, `init`, `-y`, and unreviewed dependency installation are not part of this workflow.

## Sources and licensing

- UIPKGE React registry: <https://uipkge.dev/r/react/{name}.json>
- UIPKGE public source: <https://github.com/uday-a/uipkge-registry>
- shadcn configuration schema: <https://ui.shadcn.com/schema.json>
- shadcn CLI documentation: <https://ui.shadcn.com/docs/cli>

UIPKGE registry source is MIT-licensed, but each installed dependency retains its own license.
Mapbox-dependent items additionally carry provider terms and token/network requirements. Preserve
applicable notices and verify every item rather than treating the registry-wide license as a license
for all transitive dependencies or hosted data.
