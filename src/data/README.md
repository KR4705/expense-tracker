# Category data

**Status: approved for the initial MVP** by the product owner on 24 October 2026. The display order will be revisited once real user behavior has been collected.

| File | Purpose |
|---|---|
| `categories.json` | The category list for the Categories step (Step 2), in display order. |
| `category-icons.json` | Allowed icon identifiers (Lucide), and the icon reserved for Other. |
| `../../scripts/validate-categories.mjs` | Executable validator (`npm run categories:validate`). |
| `../../tests/categories.test.mjs` | Positive and negative tests (`npm test`). |

No UI uses this data yet.

## Approved list

| Order | Label | ID | Icon (Lucide) | Scope |
|---|---|---|---|---|
| 1 | Food | `food` | `utensils` | Groceries, restaurants, cafés, food delivery |
| 2 | Home | `housing` | `house` | Rent, upkeep, and household bills (electricity, gas, water, phone, internet, subscriptions) |
| 3 | Shop | `shopping` | `shopping-bag` | Clothing, footwear, electronics, appliances, household items |
| 4 | Transit | `transport` | `car` | Day-to-day travel: fuel, cabs, autos, parking, public transport |
| 5 | Health | `healthcare` | `heart-pulse` | Doctors, medicines, tests, hospital bills, health insurance |
| 6 | Fun | `entertainment` | `clapperboard` | Films, events, streaming, hobbies, outings |
| 7 | Travel | `travel` | `plane` | Trips away from home: flights, trains, hotels |
| 8 | Charity | `charity` | `hand-heart` | Donations and giving |
| 9 | Other | `other` | `circle-ellipsis` | Anything else; always last |

**Why IDs and labels differ.** IDs are stable keys stored with expenses; labels are what users see. A label can change later without migrating saved data.

**Fit at 320 px.** All labels fit on one line in a 3-column tile even at 320 px. The widest is "Charity" at 53 px, against 60 px of label space (Inter 15 px semibold; space = tile width − 2 × 12 px padding − 2 × 2 px selected border). Nine tiles make three full rows, with Other last.

## Approved behavior

| # | Decision |
|---|---|
| 1 | **Other** is a normal category. It can be selected alongside any other category and is not exclusive. It replaces both Unknown and Miscellaneous. |
| 2 | Labels **Home** and **Transit** are approved; they keep their stable IDs `housing` and `transport`. |
| 3 | Display order is **Food, Home, Shop, Transit, Health, Fun, Travel, Charity, Other**. |
| 4 | **Inactive categories stay visible but disabled.** `active: false` shows the tile in its disabled state, and it can't be selected. |
| 5 | **Zero selected categories is valid** and is saved as **Uncategorized**. Uncategorized is a save state, not a category. |
| 6 | **Bills is part of Home.** There is no separate Bills category. |
| 7 | **Lucide** is the icon set (ISC licence). It isn't installed yet; that happens when the tiles are built. |
| 8 | These decisions apply to the initial MVP. **Ordering may be revisited** after collecting actual user behavior. |

## Evidence behind the display order

The approved order was informed by each category's share of **urban** household spending in the Ministry of Statistics and Programme Implementation's **Household Consumption Expenditure Survey (HCES) 2023-24**. Figures are the percentage of monthly per-capita consumption expenditure:

- **Main source:** [HCES 2023-24 final report](https://mospi.gov.in/sites/default/files/publication_reports/Final_Report_HCES_2023-24L.pdf), Table 3.5.
- **Clothing, bedding & footwear:** from the [HCES 2023-24 fact sheet](https://www.mospi.gov.in/sites/default/files/press_release/HCES_Press_Note_2023-24_27122024_rev.pdf), Figure 7.

| Category | Survey item groups | Urban share |
|---|---|---|
| Food | Food total | 39.68 % |
| Home | Rent (6.58) + fuel and light (5.59), plus phone/internet inside an unsplit "consumer services" group | ≥ 12.17 % |
| Shop | Durable goods (6.87) + clothing, bedding & footwear (5.66) | 12.53 % |
| Transit | Conveyance | 8.46 % |
| Health | Medical | 5.85 % |
| Fun | Miscellaneous goods & entertainment (entertainment not published separately) | ≤ 6.92 % |
| Travel | No separate survey line | — |
| Charity | Not measured (donations are transfers) | — |

The product owner placed **Home above Shop** and **Health above Fun** because of the qualifiers shown above. HCES describes the average urban household rather than the high-spending target audience, which is one reason to revisit the order with real usage data.

## Category record

| Field | Type | Required | Rules |
|---|---|---|---|
| `id` | string | yes | Lower-case kebab-case, unique, stable once expenses are stored. Maps to `categoryId` in the CategoryTile / CategoryGrid specs. `uncategorized` and `unknown` are reserved. |
| `label` | string | yes | 1–2 words, sentence case, unique (case-insensitive) — SG-27. |
| `icon` | string | yes | An `id` from `category-icons.json`; each category uses a different icon (SG-21, SG-22). |
| `displayOrder` | integer ≥ 1 | yes | Unique. The file is kept sorted by it. Gaps are allowed. |
| `active` | boolean | yes | `false` = visible but disabled; it can't be selected. |
| `status` | `"provisional"` \| `"approved"` | yes | Review state of this entry. |
| `description` | string | no | Intended scope, for reviewers and future help text. Not shown in the UI. |

File-level fields: `version` (semver), `status`, `categories`, and optional `note` and `orderBasis`. Unknown fields are rejected, including the retired `exclusive` flag, because no category is exclusive.

## Rules the validator enforces

- **Required fields and types:** all fields above are present with the right types.
- **Uniqueness:** IDs, labels (case-insensitive), display orders and icons are all unique.
- **Ordering:** the list is sorted by ascending `displayOrder`.
- **Icons:** every icon exists in the registry, and the registry itself is valid.
- **Labels:** 1–2 words in sentence case (SG-27).
- **Reserved IDs:**
  - `uncategorized`: zero selections is saved as Uncategorized, which is a state, not a category.
  - `unknown`: Unknown was removed in favour of Other.
- **Other:**
  - It is present, labelled "Other" and always active.
  - It has the highest `displayOrder`, so it is always the last tile.
  - It uses `circle-ellipsis`, which no other category may use.
- **At least one active category besides Other.**

**Not enforced here:** selection behavior (multi-select, zero selections, disabled tiles can't be toggled). That belongs to CategoryGrid and CategoryTile and will be tested with those components.

## Related documentation

The Product Vision, Style Guide (SG-26 and related rules) and the CategoryTile / CategoryGrid specifications are updated to match these decisions in a separate documentation pull request.
