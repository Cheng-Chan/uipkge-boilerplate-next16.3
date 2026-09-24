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

The dated inventory, per-entry metadata hashes, source revision, reconciliation, and exact CAT
ticket allocation live in `catalogue/`. `pnpm registry:check` validates them entirely offline. See
[catalogue discovery](catalogue-discovery.md) for the 713-ID reconciliation and known upstream gaps.

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

| Item                      | Type             | Inspected targets                                   | Manifest dependencies |
| ------------------------- | ---------------- | --------------------------------------------------- | --------------------- |
| `@uipkge-react/tailwind`  | `registry:style` | `app/globals.css`                                   | None                  |
| `@uipkge-react/utils`     | `registry:lib`   | `lib/utils.ts`                                      | None                  |
| `@uipkge-react/use-theme` | `registry:hook`  | `components/theme-provider.tsx`, `lib/use-theme.ts` | `next-themes`         |
| `@uipkge-react/button`    | `registry:ui`    | `components/ui/button/*`                            | Radix Slot, CVA       |

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

## Installed nonvisual foundation

The following foundation items were installed through the pinned CLI on 2026-09-23. They are
tracked separately from the visual catalogue count.

| Item                      | Raw manifest SHA-256                                               | Installed path                                      | Local status                  |
| ------------------------- | ------------------------------------------------------------------ | --------------------------------------------------- | ----------------------------- |
| `@uipkge-react/tailwind`  | `19fe880ee9c5485cb394d2674280ede2bba7e8ef2cf422ac4ff78372eceea25f` | `app/globals.css`                                   | Installed and locally adapted |
| `@uipkge-react/utils`     | `55d16300c5431b80e332180498d2f4a8cee3a500fc023a5b9b38d742ce27af84` | `lib/utils.ts`                                      | Installed and locally adapted |
| `@uipkge-react/use-theme` | `5390238e0be8bd57de05f6914228251bbcf82c463f684d837a61d5c601e1d42e` | `components/theme-provider.tsx`, `lib/use-theme.ts` | Installed; formatting only    |

The `tailwind` and `utils` raw manifests declare no package dependencies even though their source
imports `tw-animate-css`, `clsx`, and `tailwind-merge`. Those three runtime dependencies are
therefore pinned explicitly in this project. The `use-theme` manifest correctly declares
`next-themes`.

Local adaptations are intentional and reviewable:

- Removed the Google Fonts import and replaced DM Sans, Anybody, and DM Mono with local system font
  stacks so the default runtime makes no font-provider request.
- Removed the CLI-generated invalid `--radius: var(----radius)` mapping.
- Added `color-scheme` declarations for native controls.
- Adjusted the dark destructive surface from `oklch(0.68 0.18 25)` to `oklch(0.57 0.18 25)` after
  contrast measurement; the foreground pair increased from 3.00:1 to approximately 4.68:1.
- Kept `lib/utils.ts` limited to the canonical `cn` helper. The upstream redirect helper is deferred
  because the auth ticket requires validation against this application's known routes.
- Updated the foundation landing and not-found pages to consume semantic color tokens.
- Pinned the `use-theme` manifest's `next-themes` dependency to exact version `0.4.6`; the registry
  source received formatting only.
- Integrated that provider beneath `<body>` with class-based light/dark styling, a system default,
  browser persistence under `theme`, and the intentional `<html>` hydration-warning suppression.
- Added a project-owned switcher under `components/shared` whose server snapshot stays neutral until
  hydration, avoiding theme-dependent server/client markup while preserving the pre-paint class.

## Installed visual catalogue items

CAT001 installed and verified the three approved action components on 2026-09-24. `theme-switch`
also required three reviewed registry dependencies; those dependencies are tracked as `installed`
only and do not claim previews or completion of their own CAT tickets.

| Item            | Role                | Raw manifest SHA-256                                               | Local status |
| --------------- | ------------------- | ------------------------------------------------------------------ | ------------ |
| `theme-switch`  | CAT001 item         | `fd2b579812b6b76029d157392ac080f2fc8449ed4383fdcf06fd15ee911a9aca` | Verified     |
| `toggle`        | CAT001 item         | `db915c541923acdba9edd8538a7e728ec3e98c0ae15e6337ca22fa58ea423cc9` | Verified     |
| `toggle-group`  | CAT001 item         | `2c4a31c65d822b87961cd3de67baaf99bcdc9be6e8e09f1fe33b261686ad9e43` | Verified     |
| `card`          | Transitive registry | `46e6615bd3281dc4158a3c024241e91912f374903ad93b9f4213b6303caffa01` | Installed    |
| `dropdown-menu` | Transitive registry | `953b8506fbf8e4255f5c9e8c13010157861021a46950d55b02bf2fe8fec56908` | Installed    |
| `section-card`  | Transitive registry | `0bfc12a7bb4acde6fb9bc5ec4d06cb0be75a7265387226d14e49fc0eba2777f2` | Installed    |

The local Theme Switch intentionally supports the project's established `light`, `dark`, and
`system` contract. The upstream `black` value and `pill-4` variant were omitted rather than adding an
unapproved fourth global theme. Package additions are pinned exactly. Full hashes, paths,
adaptations, and command evidence are recorded in `catalogue/evidence/CAT001.json` and the snapshot.

CAT002 installed and verified the `charts` meta-item on 2026-09-24. The live meta-manifest delegates
to 62 chart wrappers; their shared map primitive is also installed. Those 63 dependency records stay
`installed`, not `verified`, until their own exact tickets exercise their complete APIs and any
provider behavior.

| Item              | Role                | Raw manifest SHA-256 or evidence                                   | Local status |
| ----------------- | ------------------- | ------------------------------------------------------------------ | ------------ |
| `charts`          | CAT002 item         | `29b19ff835ecfccf47d7d9e27a71a6fb0f2d0aa79a8330aabe1f3476e86989a5` | Verified     |
| 62 chart wrappers | Transitive registry | `catalogue/evidence/CAT002-manifests.json`                         | Installed    |
| `map`             | Transitive registry | `catalogue/evidence/CAT002-manifests.json`                         | Installed    |

The reconciled dependency graph declared 238 files and produced 130 unique in-repository targets;
its only two target collisions were byte-identical shared chart helpers. CAT002 pins ECharts
6.1.0, echarts-for-react 3.0.6, react-map-gl 8.1.3, and mapbox-gl 3.31.0. The preview imports five
local chart components and makes no map or provider request. Mapbox-backed sources honor the
project's explicit public environment opt-in, retain attribution, and remain dependency-only until
separate provider-aware verification. Full audit, license, adaptation, bundle, and verification
evidence is in `catalogue/evidence/CAT002.json`.

CAT003 installed and verified five control components on 2026-09-24. Cascade Select required the
reviewed Popover registry dependency, which remains `installed` without claiming completion of its
own ticket.

| Item             | Role                | Raw manifest SHA-256                                               | Local status |
| ---------------- | ------------------- | ------------------------------------------------------------------ | ------------ |
| `button`         | CAT003 item         | `bab403f66bbcf6526646e5ea8079b838775f3dfe5540720abd0e2cffbad5cc3c` | Verified     |
| `cascade-select` | CAT003 item         | `d039ec13dcb4d753fa73125558c0d533e56e244ed250ba70cecbd82645dd43bf` | Verified     |
| `fab`            | CAT003 item         | `281915b86affa1839c3413ed57ec3014593e9ba631b6c2acbf6bbeeb24a8befa` | Verified     |
| `float-label`    | CAT003 item         | `f3ce747937137d431375ef8c0e69ba72204b90fdc56adc8dfe172763d8dfb5e5` | Verified     |
| `input`          | CAT003 item         | `bb5d78409546544cefe788d8b389fd2cb4887a723fd14fb68d607be70b2f4c39` | Verified     |
| `popover`        | Transitive registry | `282e2e0a79d937e8b775415f22c995d5073d2c26ff2dfcfc5dbd8eda27507a49` | Installed    |

The install adds exact Radix Popover 1.1.23 and Radix Slot 1.3.3 dependencies. Local adaptations add
stable Cascade Select naming/popup semantics, non-submitting FAB defaults, usable InputGroup addon
metadata, narrow-container input sizing, and correct opt-in Popover persistence state wiring. The
CAT003 preview does not enable persistence or perform any network request. Full hashes, paths,
adaptations, and verification are recorded in `catalogue/evidence/CAT003.json`.

CAT004 installed and verified five advanced control components on 2026-09-24. Speed Dial and Tree
Select reuse the already reviewed FAB and Popover sources; their five proposed dependency overwrites
were declined so the CAT003 adaptations remain intact.

| Item             | Role        | Raw manifest SHA-256                                               | Local status |
| ---------------- | ----------- | ------------------------------------------------------------------ | ------------ |
| `password-input` | CAT004 item | `8367419965888d54d3c83cfb2ea612644bb8a2a3bae669191876a7d63b3d4e67` | Verified     |
| `select`         | CAT004 item | `5c8465cac6f16306446c98f51d44f2dc0ff15c1e94102d194c9ccf4c66d23afa` | Verified     |
| `signature-pad`  | CAT004 item | `b5b20855a9d50d46270d7b34e724594993473cf602f364544af45a761165bbcd` | Verified     |
| `speed-dial`     | CAT004 item | `470d429185feee07bf9435a80405f9301721acc747dca8f84e86bb748caa8095` | Verified     |
| `tree-select`    | CAT004 item | `04cf366cea9b80912c16b0214d8b917c783ddfaceca7ec08d41c95922fa43690` | Verified     |

CAT004 adds exactly pinned Radix Select 2.3.7. Its previews keep all values transient and make no
external request; Signature Pad never stores or uploads its data URL. Responsive canvas sizing,
popup/menu semantics, dependency preservation, and complete verification are recorded in
`catalogue/evidence/CAT004.json`.

CAT005 installed and verified three data components on 2026-09-24. Its 17 reviewed manifests
proposed 53 unique targets: 37 new files were accepted and 16 overwrites of previously adapted
Button, Dropdown Menu, Input, Popover, and Select files were declined.

| Item             | Role        | Raw manifest SHA-256                                               | Local status |
| ---------------- | ----------- | ------------------------------------------------------------------ | ------------ |
| `board`          | CAT005 item | `ad0439b2e3b694ecf1d27d07056a90d4de3c8c91db7671fe95c80a24204b74ba` | Verified     |
| `data-table`     | CAT005 item | `e4657c979f6018e9233d0e8786fb5f700c3e2e3428c66ba02aea894b90d8d478` | Verified     |
| `tree-table`     | CAT005 item | `f1135ed4fdd7a3f6a07f67086d579d1e8222fed9b0ec2f96c115114b0ed2924e` | Verified     |
| `badge`          | Dependency  | `d77e1550edc6307fd01dd9d995843be7341d400040d425451a07cf443cea02fd` | Installed    |
| `checkbox`       | Dependency  | `5348557d099c6c8e25e7a1afa86d1a83f8c3699bf780c4fba7ec9d86aaf9c311` | Installed    |
| `command`        | Dependency  | `81754ca535b55d7b81a81850c9b0990dcc7f2a9712b4c838ee98d2481d8bfc20` | Installed    |
| `label`          | Dependency  | `997abc437941e6520b24fe7f1bcbe4dae31b10f90566ff67113131ed472bab5a` | Installed    |
| `range-calendar` | Dependency  | `3ee474878b5544fbd65eb22167b6da756fda55541a32dbc83cc2ed20f923d0b7` | Installed    |
| `separator`      | Dependency  | `b2bff791da166e49734d717af40010798c2991ace3072617cb47656d1c0b333e` | Installed    |
| `sheet`          | Dependency  | `852281106e3404bf461d9e70d5ce2998dfe8022658ccc9b18682d2346e7fd51c` | Installed    |
| `spinner`        | Dependency  | `51def49b7a2aec99d535608526d322d8532b9adb68407ea7ddf75c5ced324c55` | Installed    |
| `table`          | Dependency  | `91750049257fa006d714be213fff31542164f758615f71d7e62ab4e128113246` | Installed    |

CAT005 adds exact Radix Checkbox 1.3.11, Dialog 1.1.23, Label 2.1.15, Separator 1.1.15, TanStack
React Table 8.21.3, cmdk 1.1.1, and React Day Picker 10.0.1 dependencies. The previews retain data
in local component state; export uses a short-lived local Blob URL and explicit copy can use the
clipboard. Full path decisions, adaptations, and verification are recorded in
`catalogue/evidence/CAT005.json`.

CAT006 through CAT010 installed and verified 22 display components on 2026-09-24. All 28 approved
and transitive manifests were inspected before installation; their 80 unique targets comprised 63
new files and 17 preserved reviewed files.

| Ticket | Verified items                                             | Dependency-only items |
| ------ | ---------------------------------------------------------- | --------------------- |
| CAT006 | `attachment`, `avatar`, `badge`, `carousel`, `chip`        | None                  |
| CAT007 | `code-block`, `data-list`, `gantt`, `icon-box`, `icons`    | `context-menu`        |
| CAT008 | `kanban`, `kbd`, `labeled-value`, `lazy-image`, `list`     | `skeleton`            |
| CAT009 | `payment-card`, `qr-code`, `table`, `timeline`, `transfer` | `scroll-area`         |
| CAT010 | `tree-view`, `virtual-list`                                | None                  |

The batch adds exact Radix Avatar 1.2.6, Context Menu 2.3.7, and Scroll Area 1.2.18; TanStack React
Virtual 3.14.13; Embla Carousel React 8.6.0; QR Code 1.5.4 and its types 1.5.6; and Shiki 4.4.3.
All are MIT-licensed. Previews use only transient local state and local/synthetic data; explicit
copy actions may access the clipboard, but no preview requires an external request. Full raw hashes,
target decisions, adaptations, bundle measurements, and verification are recorded in
`catalogue/evidence/CAT006-manifests.json` through `CAT010-manifests.json` and
`catalogue/evidence/CAT006.json` through `CAT010.json`.

## Sources and licensing

- UIPKGE React registry: <https://uipkge.dev/r/react/{name}.json>
- UIPKGE public source: <https://github.com/uday-a/uipkge-registry>
- next-themes source and usage guidance: <https://github.com/pacocoursey/next-themes>
- shadcn configuration schema: <https://ui.shadcn.com/schema.json>
- shadcn CLI documentation: <https://ui.shadcn.com/docs/cli>

UIPKGE registry source is MIT-licensed, but each installed dependency retains its own license.
Mapbox-dependent items additionally carry provider terms and token/network requirements. Preserve
applicable notices and verify every item rather than treating the registry-wide license as a license
for all transitive dependencies or hosted data.
