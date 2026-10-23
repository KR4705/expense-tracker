# Category data

**Status:** IDs, most labels and the icon set are approved by the product owner (24 October 2026). The file as a whole stays **provisional** until the items under [Still to confirm](#still-to-confirm) are signed off.

| File | Purpose |
|---|---|
| `categories.json` | The category list for the Categories step (Step 2), in display order. |
| `category-icons.json` | Allowed icon identifiers (Lucide), and the icon reserved for Other. |
| `../../scripts/validate-categories.mjs` | Executable validator (`npm run categories:validate`). |
| `../../tests/categories.test.mjs` | Positive and negative tests (`npm test`). |

No UI uses this data yet.

## Current list

| Order | Label | ID | Icon (Lucide) | Status |
|---|---|---|---|---|
| 1 | Food | `food` | `utensils` | approved |
| 2 | Shop | `shopping` | `shopping-bag` | approved |
| 3 | Home | `housing` | `house` | provisional — label chosen to fit |
| 4 | Transit | `transport` | `car` | provisional — label chosen to fit |
| 5 | Fun | `entertainment` | `clapperboard` | approved |
| 6 | Health | `healthcare` | `heart-pulse` | approved |
| 7 | Travel | `travel` | `plane` | approved |
| 8 | Charity | `charity` | `hand-heart` | approved |
| 9 | Other | `other` | `circle-ellipsis` | provisional — combining behavior to confirm |

**Why IDs and labels differ.** IDs are the approved permanent keys; labels are what the user sees. A label can change later without migrating saved expenses.

**Fit at 320 px.** All nine labels fit on one line in a 3-column tile even at 320 px. The widest is "Charity" at 53 px, against 60 px of label space (Inter 15 px semibold; space = tile width − 2 × 12 px padding − 2 × 2 px selected border). Nine tiles make three full rows, with Other last.

## Product decisions (24 October 2026)

| # | Question | Decision | How it's applied |
|---|---|---|---|
| 1 | Miscellaneous was missing | Use **Other** | `other` added. |
| 2 | Labels too wide for a tile | Use shorter, simpler words | Shop, Fun, Health as directed. Home and Transit chosen to fit; see below. |
| 3 | Icon set | **Lucide** approved | `category-icons.json` status `approved`. Not installed until tiles are built. |
| 4 | Housing vs Bills | **Bills is part of Home** | `bills` removed; its scope moved into Home's description. |
| 5 | Display order | Biggest expenses first, from a major survey | Ranked by HCES 2023-24; see [Display order](#display-order). |
| 6 | Unknown | **Removed; Other replaces it** | `unknown` removed and reserved, so it can't be re-added by mistake. |
| 7 | Meaning of `active: false` | **Inaccessible, not hidden** | Inactive categories are still shown but can't be selected. |
| 8 | IDs | **Approved** | Existing IDs kept for surviving categories. |

## Display order

Order is by each category's share of **urban** household spending in the Ministry of Statistics and Programme Implementation's **Household Consumption Expenditure Survey (HCES) 2023-24**. This is India's official, nationally representative consumption survey.

Figures are the percentage of monthly per-capita consumption expenditure (MPCE):

- **Main source:** [HCES 2023-24 final report](https://mospi.gov.in/sites/default/files/publication_reports/Final_Report_HCES_2023-24L.pdf) (NSS Report 592), Table 3.5.
- **Clothing, bedding & footwear:** from the [HCES 2023-24 fact sheet press note](https://www.mospi.gov.in/sites/default/files/press_release/HCES_Press_Note_2023-24_27122024_rev.pdf), Figure 7.

| Order | Category | Survey item groups mapped | Urban share |
|---|---|---|---|
| 1 | Food | Food total | 39.68 % |
| 2 | Shop | Durable goods (6.87) + clothing, bedding & footwear (5.66) | 12.53 % |
| 3 | Home | Rent (6.58) + fuel and light (5.59) | 12.17 % |
| 4 | Transit | Conveyance | 8.46 % |
| 5 | Fun | Miscellaneous goods & entertainment | ≤ 6.92 % (upper bound) |
| 6 | Health | Medical | 5.85 % |
| 7 | Travel | No separate survey line | — |
| 8 | Charity | Not measured (donations are transfers, not consumption) | — |
| 9 | Other | Catch-all; always last | — |

Categories with no survey line come after those with one, in the order of the original list. Survey groups with no category (education 5.97 %, other consumer services 5.72 %, pan and tobacco 2.37 %) would be recorded under the closest category or Other.

**Caveats — the order is provisional:**

- **Shop vs Home are 0.36 points apart.** Phone, internet and subscriptions (now part of Home) sit inside the survey's "consumer services" group, which isn't broken down. Counting them would likely put Home above Shop.
- **Fun's figure is an upper bound.** The survey combines entertainment with miscellaneous goods such as toiletries, and doesn't publish entertainment alone (nor did the 2022-23 round). Entertainment by itself may be below Health's 5.85 %.
- **Survey population differs from the target users.** HCES describes the average urban household, not the high-spending audience in the Product Vision. High spenders likely put more into Travel and Shop. Revisit the order once real usage data exists.

## Category record

| Field | Type | Required | Rules |
|---|---|---|---|
| `id` | string | yes | Lower-case kebab-case, unique, approved and permanent once expenses are stored. Maps to `categoryId` in the CategoryTile / CategoryGrid specs. `uncategorized` and `unknown` are reserved. |
| `label` | string | yes | 1–2 words, sentence case, unique (case-insensitive) — SG-27. |
| `icon` | string | yes | An `id` from `category-icons.json`; each category uses a different icon (SG-21, SG-22). |
| `displayOrder` | integer ≥ 1 | yes | Unique. The file is kept sorted by it. Gaps are allowed. |
| `active` | boolean | yes | `false` = **inaccessible, not hidden**. The tile is shown in its disabled state and can't be selected (decision 7). |
| `status` | `"provisional"` \| `"approved"` | yes | Review state of this entry. |
| `description` | string | no | Intended scope, for reviewers and future help text. Not shown in the UI. |

File-level fields: `version` (semver), `status`, `categories`, and optional `note` and `orderBasis`. Unknown fields are rejected so typos can't slip through. The old `exclusive` flag is gone, because no category is exclusive any more.

## Rules the validator enforces

- **Required fields and types:** all fields above are present with the right types.
- **Uniqueness:** IDs, labels (case-insensitive), display orders and icons are all unique.
- **Ordering:** the list is sorted by ascending `displayOrder`.
- **Icons:** every icon exists in the registry, and the registry itself is valid.
- **Labels:** 1–2 words in sentence case (SG-27).
- **Reserved IDs:**
  - `uncategorized`: zero selections is saved as Uncategorized, which is a state, not a category.
  - `unknown`: removed by decision 6.
- **Other:**
  - It is present, labelled "Other" and always active.
  - It has the highest `displayOrder`, so it is always the last tile.
  - It uses `circle-ellipsis`, which no other category may use.
- **At least one active category besides Other.**

## Still to confirm

1. **Other's selection behavior.** Other is treated as an ordinary category that **combines** with others (e.g. Food + Other), as Miscellaneous did.
   - **Why:** the old "clears everything else" rule existed because "Unknown" contradicts any other tag; "Other" doesn't.
   - **If you want it exclusive** (selecting Other clears the rest), that's a small data and validator change.
2. **Labels Home and Transit.** These were chosen to fit at 320 px:
   - "Housing" is 59.5 of 60 px, too tight.
   - "Transport" (71 px) and "Commute" (69 px) don't fit.

   Alternatives that fit: "Rides" (40 px) for Transit.
3. **Display order.** See the caveats above, especially Shop vs Home and Fun vs Health.

## Documentation that now disagrees with these decisions

Decisions 1, 4, 6 and 7 change rules written in the Vision, Style Guide and component specs. Per this task's constraints, those documents were **not** edited here; they need a separate docs PR:

| Document | Current text | Needs updating to |
|---|---|---|
| Product Vision §4.5, §5 | "`Unknown` and `Miscellaneous` must be valid choices"; Step 2 mentions "select Unknown" | Other is the catch-all choice |
| Style Guide SG-26 | Unknown is always present and last, uses a question-mark icon, and is mutually exclusive; Miscellaneous combines freely | Other is always present and last, uses the "more" icon, and combines (pending item 1). Zero selections is still saved as Uncategorized. |
| Style Guide SG-41 | "Unknown, clears other categories" announcement | Remove (or adapt, if Other becomes exclusive) |
| Style Guide §A.3, Appendix B Q1–Q2 | Unknown flow; category list open | Update / close |
| CategoryTile §4, §7, acceptance 7 | `exclusive` property, Unknown variant and announcement | Drop the Unknown variant. Disabled state now has an MVP use: inactive categories. |
| CategoryGrid §4, §6.2, §7, acceptance 2, 3, 5 | Exactly one exclusive Unknown; exclusivity table and announcements | Other always last; no exclusivity (pending item 1) |
| Component README D-4, D-6 | Undo after Unknown clears; disabled tile has no MVP use | D-4 no longer applies; D-6 resolved by decision 7 |
