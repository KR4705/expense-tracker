# Category data

**Status: provisional.** Nothing in this folder is approved product scope yet. Every category and the icon set are marked `"status": "provisional"` until the product owner approves them (Style Guide Appendix B, question 2). See [Open decisions](#open-decisions).

| File | Purpose |
|---|---|
| `categories.json` | The category list shown on the Categories step (Step 2), in display order. |
| `category-icons.json` | Registry of allowed icon identifiers, the proposed icon set, and the icon reserved for Unknown. |
| `../../scripts/validate-categories.mjs` | Executable validator (`npm run categories:validate`). |
| `../../tests/categories.test.mjs` | Positive and negative tests (`npm test`). |

No UI uses this data yet.

## Category record

| Field | Type | Required | Rules |
|---|---|---|---|
| `id` | string | yes | Lower-case kebab-case, unique, stable. Saved with expenses, so it must never change once data is stored. Maps to the `categoryId` property in the CategoryTile / CategoryGrid specs. `uncategorized` is reserved. |
| `label` | string | yes | 1–2 words, sentence case, unique (case-insensitive) — SG-27. |
| `icon` | string | yes | An `id` from `category-icons.json`; each category uses a different icon (SG-21, SG-22). |
| `displayOrder` | integer ≥ 1 | yes | Unique. The file is kept sorted by it. Gaps are allowed. |
| `active` | boolean | yes | `false` hides a category from the picker while keeping it valid for existing expenses (provisional meaning — see decision 7). |
| `exclusive` | boolean | yes | `true` only for Unknown (SG-26). |
| `status` | `"provisional"` \| `"approved"` | yes | Review state of this entry. |
| `description` | string | no | Intended scope, for reviewers and future help text. Not shown in the UI. |

Unknown fields are rejected so typos (e.g. `dispalyOrder`) can't slip through.

## Rules the validator enforces

- **Required fields and types:** all of the above, plus file-level `version` (semver), `status` and a non-empty `categories` array.
- **Uniqueness:** IDs, labels (case-insensitive), display orders, and icons.
- **Ordering:** the list is sorted by ascending `displayOrder`.
- **Icons:** every icon exists in the registry, and the registry is itself valid (unique IDs, `unknownIcon` listed).
- **Unknown (SG-26):**
  - Exactly one category is `exclusive`, and it is `unknown`, labelled `Unknown`.
  - It is always active.
  - It has the highest `displayOrder`, so it is always the last tile.
  - It uses the neutral question-mark icon, which no other category may use.
- **Uncategorized:** zero selections is saved as Uncategorized (SG-26). It is a state, not a category, so `uncategorized` can't be used as an ID.
- At least one active, non-exclusive category exists.

**Not enforced here:** the selection behavior itself — selecting Unknown clears other categories, and selecting another category clears Unknown. That logic belongs to CategoryGrid and will be implemented and tested with it. The data only marks which category is exclusive.

## Icon set (provisional)

Icon identifiers are [Lucide](https://lucide.dev) canonical names (ISC licence).

- **Why Lucide:** it matches the Style Guide's icon proposal (outline style, 2 px stroke, rounded joins, 24 px grid).
- **Checked:** every identifier was confirmed to exist in `lucide-static` 1.61.0.
- **Not decided:** Lucide is **not installed and not approved**. If another set is chosen, only `category-icons.json` and the `icon` values change.

| Category | Icon | Alternatives considered |
|---|---|---|
| Food | `utensils` | — |
| Shopping | `shopping-bag` | — |
| Transport | `car` | `bus` |
| Housing | `house` | — |
| Entertainment | `clapperboard` | `ticket`, `film` |
| Healthcare | `heart-pulse` | `stethoscope` |
| Travel | `plane` | — |
| Charity | `hand-heart` | — |
| Bills | `receipt` | — |
| Unknown | `circle-question-mark` | — (SG-26: neutral question mark) |

## Open decisions

These need product-owner approval. Until then the data stays `provisional`.

1. **Miscellaneous is missing.**
   - **Conflict:** Product Vision §4.5 says "`Unknown` and `Miscellaneous` must be valid choices", and SG-26 and CategoryGrid (§6.2, acceptance criterion 3) describe Miscellaneous as a normal, combinable category. The requested list doesn't include it, so it has not been added.
   - **Option A:** add it as a standard, non-exclusive category just before Unknown.
   - **Option B:** amend the Vision and specs to drop it.
   - **Watch out:** the label "Miscellaneous" is 105 px wide, so it has the same fit problem as decision 2; a shorter label such as "Other" (40 px) would fit.
2. **Some labels don't fit a tile.** Measured in Inter 15 px semibold (the selected-tile weight) against the label space inside a 3-column tile (tile width − 2 × 12 px padding − 2 × 2 px selected border):

   | Viewport | Label space | Labels that overflow |
   |---|---|---|
   | 320 px | 60 px | Entertainment, Healthcare, Shopping, Transport, Housing, **Unknown** |
   | 360 px | 73 px | Entertainment (102 px), Healthcare (80 px) |
   | 390 px | 83 px | Entertainment |
   | 430 px | 97 px | Entertainment |

   - **Why it matters:** single words can't wrap, and SG-27 forbids shrinking or truncating; the CategoryTile spec (§8) says such a category should be renamed.
   - **Option A — rename:** e.g. "Entertainment" → "Leisure" (53 px), "Fun" (27 px) or "Outings" (57 px), and "Healthcare" → "Health" (48 px) or "Medical" (57 px).
   - **Option B — hyphenate:** allow automatic hyphenation inside tiles.
   - **The 320 px case** affects the required label "Unknown", so renaming alone can't fix it. It needs a design-system decision on tile padding or the 2-column fallback (open decision D-3). No tokens or rules were changed here.
3. **Icon set and icon choices.** Approve Lucide (or another single set) and the icon per category; alternatives are listed above.
4. **Category boundaries.** The `description` fields propose scopes for pairs that users may confuse:
   - **Transport vs Travel:** day-to-day travel vs trips away from home.
   - **Housing vs Bills:** rent and upkeep vs recurring utilities and subscriptions.

   Confirm or adjust. Overlap is allowed by design (multi-tag), but clear scopes help users choose.
5. **Display order.** The order follows the requested list; there is no usage data to justify another.
   - **Layout:** with 10 tiles in 3 columns, Unknown sits alone on the 4th row.
   - **Fit at 360 × 640:** it will likely need one scroll, which SG-26's acceptance criterion allows ("reachable within one scroll").
6. **Unknown exclusivity.** The data marks Unknown `exclusive: true`, following SG-26 and the CategoryGrid spec. The Style Guide still lists this as needing confirmation (SG-26 basis note; Appendix B, question 1).
7. **Meaning of `active: false`.** Proposed meaning: hidden from the picker, still valid on existing expenses. Confirm before the save workflow is specified.
8. **IDs become permanent once expenses are stored.** Approve the IDs (`food`, `shopping`, `transport`, `housing`, `entertainment`, `healthcare`, `travel`, `charity`, `bills`, `unknown`) before any persistence work. A label can be renamed later without changing its ID.
