# Catalogue discovery snapshot

## Captured scope

The tracked React snapshot was captured on 2026-09-24 from the live UIPKGE registry, the generated
React manifest/source export, the four published React catalogue pages, and public GitHub revision
`744eb7902473a05c42f8bf707847fc6c89b0096e`. Source URLs, byte sizes, and SHA-256 hashes are in
`catalogue/provenance.json`; normalized item metadata is in `catalogue/snapshot.json`.

The exact deduplicated inventory is **713 IDs**:

| Classification       |   Count | Notes                                                                            |
| -------------------- | ------: | -------------------------------------------------------------------------------- |
| Components           |     134 | 128 documentation entries plus 6 manifest-only component records                 |
| Blocks               |     436 | Every distinct React block page ID                                               |
| Charts               |      60 | Chart IDs after assigning the 6 chart/map overlaps to maps                       |
| Maps                 |      74 | Every distinct ID linked by the maps page, including Leaflet and Mapbox variants |
| Nonvisual foundation |       9 | Bootstrap, hook, data, style, and utility records tracked separately             |
| **Total**            | **713** | Each ID occurs once                                                              |

The visual catalogue total is **704**: 660 manifest-backed items are `discovered`, 3 transitive
dependencies are `installed`, 3 CAT001 action components are `verified`, and 38 documentation-only
items are `blocked` because their install manifests are absent. Three of the nine nonvisual
foundation records (`tailwind`, `utils`, and `use-theme`) are also `verified` through their prior
design-system tickets and retain their local evidence.

## Reconciliation

- The live aggregate registry and `llms-full-react.txt` independently contain the same 675 manifest
  IDs.
- The published pages contain 128 component, 436 block, 66 chart, and 74 map links. Their union is
  698 because six map IDs also appear under charts.
- Unioning documentation and manifest IDs produces 713 records. Thirty-eight linked map IDs have no
  raw manifest in the live registry, so they are retained with unknown targets/dependencies and an
  explicit upstream gap.
- Fifteen live manifest IDs have no dedicated catalogue-page link; nine are nonvisual foundation
  records and six are component/meta records.
- The public GitHub revision exposes matching registry-definition files for 210 IDs. Every other
  record names the absent public-source evidence rather than implying it was reviewed.
- The registry publishes no environment-variable/service metadata. The snapshot propagates only
  requirements provable from declared Mapbox or Leaflet dependencies. Installation review remains
  mandatory for every item.

The maps page's visible “40 maps” headline does not reconcile with its 74 distinct linked React IDs.
The snapshot preserves the links rather than trusting the marketing count. The previous 713 working
count is therefore no longer provisional: it is now an auditable union with 38 explicitly unavailable
manifests, not 713 installable items.

## Exact implementation tickets

`catalogue/tickets.json` assigns every snapshot ID exactly once across **611 exact CAT tickets**:

- 570 planned tickets;
- 38 one-item tickets blocked on an absent upstream manifest; and
- 3 completed tickets that account for the 3 verified CAT001 items and 3 previously verified
  foundation items.

Simple components/foundation records are grouped only when they share a primary category and status,
with a maximum of five items. Every block, chart, and map has its own one-item ticket. The offline
validator rejects duplicate or omitted allocations, mixed groups, oversized batches, and multi-item
complex tickets.

`CAT001`, covering exactly `theme-switch`, `toggle`, and `toggle-group`, is complete. The next
unblocked ticket is `CAT002`, covering exactly `charts`. Approving a family label or the full ledger
does not authorize installation; approve the exact ticket and item IDs after reviewing its current
manifest.

## Status semantics

`discovered` records metadata only. `installed` requires tracked local paths. `demo-ready` additionally
requires a real explicit lazy preview module and evidence. `verified` retains those requirements and
records completed verification. `blocked` and `approved-exception` must describe the unmet capability;
a local simulation cannot verify an external provider.
