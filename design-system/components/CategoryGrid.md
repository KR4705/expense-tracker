# CategoryGrid — Component Specification

**Version:** 0.1 (draft) | **Date:** 24 October 2026
**Sources:** `docs/PRODUCT_VISION.md` v1.1 · `design-system/STYLE_GUIDE.md` v0.1 · `design-system/tokens.json` v0.1.0 · `references/REFERENCE_CATALOG.md` v0.6
**Primary references:** REF-P01 (uniform icon + label grid), REF-G01 (2 × 2 grid of identical cards in "Select portfolio" sheet)
**Related:** contains [CategoryTile](CategoryTile.md); sits above [PrimaryActionButton](PrimaryActionButton.md) on Step 2.
**Status:** Implementation-ready specification. No code.

---

## 1. Purpose and role

CategoryGrid is the body of the Categories step (Step 2). It lays out CategoryTiles in equal columns, owns the **selection set** for the expense, applies the **Unknown exclusivity rule**, and shows a live **selection summary** so users can confirm what they chose without scrolling back.

It implements the product's "flexible tags, not forced buckets" model: zero, one or many tags; Unknown is valid; nothing is mandatory.

## 2. Relevant product requirements

| Requirement | Source |
|---|---|
| Zero, one or multiple tags per expense; an expense need not fit one category. | Vision §4.5 |
| Unknown and Miscellaneous are valid choices. | Vision §4.5 |
| Users can save expenses when the category is unclear. | Vision §4.1, §9 |
| Visual categorization with icon + label tiles. | Vision §4.4 |
| Progress and feedback; clearly acknowledge selection. | Vision §4.6 |
| Short flow: classification must not add steps. | Vision §4.2, §5 |

## 3. Visual anatomy

```
 Step header + ExpenseProgressIndicator (not part of this component)
 Heading: "What was it for?"            (1)
 Helper: "Choose any that fit — or skip" (2)
 ┌──────┐ ┌──────┐ ┌──────┐
 │ Tile │ │ Tile │ │ Tile │             (3) tiles, 3 equal columns
 └──────┘ └──────┘ └──────┘             (4) gap between tiles
 ┌──────┐ ┌──────┐ ┌──────┐
 │ Tile │ │ Misc │ │Unknwn│             (5) Unknown always last
 └──────┘ └──────┘ └──────┘
 "2 selected: Food, Charity"            (6) selection summary
 [ Review ]  ← PrimaryActionButton (not part of this component)
```

| # | Part | Description |
|---|---|---|
| 1 | Heading | Plain question for the step. |
| 2 | Helper text | States that categories are optional and multiple are allowed. |
| 3 | Tiles | CategoryTile instances in a uniform grid. |
| 4 | Gutters and gaps | Screen gutter outside, tile gap between. |
| 5 | Unknown position | Fixed as the last tile. |
| 6 | Selection summary | One line directly above the primary button; updates live. |

## 4. Properties and accepted values

| Property | Type | Accepted values | Default | Notes |
|---|---|---|---|---|
| `categories` | ordered list | Category records (`categoryId`, `label`, `icon`, `exclusive`) | — (required) | Must contain exactly one `exclusive` category (Unknown), which the grid always renders last. |
| `selectedIds` | set of identifiers | 0…n IDs from `categories` | empty | Controlled value; preserved when navigating back and forward (SG-30). |
| `onChange` | action | — | — (required) | Fires with the new selection set after exclusivity is applied. |
| `heading` | text | Plain question | `What was it for?` | Content proposal; wording to be confirmed. |
| `helperText` | text | One line | `Choose any that fit — or skip` | Content proposal. |

**Derived values (not inputs):**
- `summary` — e.g. "No category selected", "1 selected: Food", "2 selected: Food, Charity", "Unknown".
- `columns` — computed from available width and text size (see §8).

**Saved result:** zero selections are stored as **Uncategorized**; Unknown is stored as Unknown (SG-26).

## 5. States

| State | Description | Visual / token |
|---|---|---|
| **No selection** | Valid. Summary reads "No category selected — you can still continue". Primary button enabled. | `typography.body.default`, `color.text.secondary` |
| **One or more selected** | Tiles show selected state; summary lists labels in grid order. | Tile tokens; summary as above |
| **Unknown selected** | Only Unknown is selected; summary reads "Unknown". | Tile tokens |
| **Focused tile** | Delegated to CategoryTile focused state. | `component.categoryTile.focused.ringColor` |
| **Large text** | Grid reflows to 2 columns (see §8). | `component.categoryGrid.columnsLargeText` |
| **Disabled / loading / error** | Not applicable to the grid in MVP. Category list is local; if it ever loads remotely, a separate spec is needed. | — |

## 6. Interaction behavior and feedback

### 6.1 Multi-select (SG-25)
- Tapping a standard tile toggles it; any number of standard tiles can be selected at once.
- Selection order does not matter; the summary always lists labels in grid order so it does not jump around.
- The grid never limits the number of selections and never forces at least one.

### 6.2 Unknown exclusivity (SG-26)
| Current selection | User action | Result |
|---|---|---|
| Food, Charity | Select **Unknown** | Unknown only (Food, Charity cleared) |
| Unknown | Select **Food** | Food only (Unknown cleared) |
| Unknown | Deselect **Unknown** | Empty (valid → Uncategorized) |
| Food | Select **Miscellaneous** | Food, Miscellaneous (Miscellaneous is not exclusive) |

When selecting Unknown clears other tiles, the summary updates immediately and the change is announced (§7). There is no undo control in this version — see open decision D-4.

### 6.3 Continuing
- The PrimaryActionButton ("Review") is **always enabled** on this step, including with zero selections (SG-20).
- A **Skip** text button is optional (§G of the Style Guide); if present it behaves exactly like Review with an empty selection and must not compete visually (SG-02). See open decision D-5.

### 6.4 Preservation
- Selections survive back/forward navigation, app backgrounding and failed saves (SG-30, SG-32).
- Selected tags carry forward to the Review step, where each can be removed (SG-25).

### 6.5 Order and placement
- Category order is fixed by the category list, not by usage frequency, so tiles do not move between visits.
- Unknown is always the last tile (SG-26).

## 7. Accessibility requirements

| Requirement | Detail | Rule |
|---|---|---|
| Group semantics | The grid is a labelled group: "What was it for? Choose any that fit." Screen readers convey that multiple choices are allowed. | SG-25, SG-41 |
| Tile semantics | Each tile is a checkbox (see CategoryTile §7). | SG-25, SG-41 |
| Exclusivity announcements | Polite live-region message once per change: "Unknown selected. Food and Charity cleared." / "Food selected. Unknown cleared." | SG-26, SG-41 |
| Summary | The summary line is a polite live region and reads e.g. "2 selected: Food, Charity". Announcements are not duplicated when an exclusivity message is already spoken. | SG-25, SG-41 |
| Reading order | Heading → helper → tiles in visual order (row by row) → summary → primary button. | SG-41 |
| Unknown reachability | Unknown is visible without scrolling on 360 × 640, or reachable within one scroll; it is the last tile in reading order. | SG-26 |
| Touch spacing | 12 px between tiles (≥ 8 px minimum). | SG-17, SG-23 |
| Text scaling | Drops to 2 columns rather than shrinking text. | SG-43 |

**Verification status:** component-level accessibility is **unverified** until tested with VoiceOver, TalkBack and 200 % text.

## 8. Responsive behavior

Column count is chosen from the available content width (viewport width capped at `layout.screen.maxContentWidth`, minus two `layout.screen.gutter`s):

| Condition | Columns | Rule / token |
|---|---|---|
| Default, phones 320–430 px wide | **3** (≈ 88 px tiles at 320 px, ≈ 101 px at 360 px) | SG-23, `component.categoryGrid.columns` — C-1 decision |
| Viewport > 430 px **and** content width allows 4 tiles each ≥ 88 px | 4 | SG-23, `component.categoryTile.minWidthForFourColumns` |
| Large system text (labels would exceed 2 lines at 3 columns) | **2** | SG-43, `component.categoryGrid.columnsLargeText` — trigger: see open decision D-3 |
| Tablet / web | Content column capped at 480 px; 4 columns (≈ 103 px tiles) | SG-39, `layout.screen.maxContentWidth` |

- Tiles in a row always share the same width; the last row is left-aligned (not stretched).
- The grid scrolls above the docked primary button; the summary line stays directly above the button.

## 9. Design tokens used

| Token path | Resolved value |
|---|---|
| `component.categoryGrid.columns` | 3 |
| `component.categoryGrid.columnsLargeText` | 2 |
| `component.categoryGrid.gap` → `space.3` | 12 px |
| `component.categoryTile.minWidthForFourColumns` | 88 px |
| `layout.screen.gutter` → `space.4` | 16 px |
| `layout.screen.maxContentWidth` | 480 px |
| `layout.section.gap` → `space.6` | 24 px (heading block to grid; grid to summary) |
| `layout.control.minGap` → `space.2` | 8 px (summary to primary button, minimum) |
| `typography.heading.1` | Inter 24 px / 32 px, 600 (step heading) |
| `typography.body.default` | Inter 15 px / 22 px, 400 (helper text, summary) |
| `color.text.primary` | `#14161A` (heading) |
| `color.text.secondary` | `#4B5563` (helper, summary) |

All tile appearance tokens are listed in [CategoryTile §9](CategoryTile.md#9-design-tokens-used).

## 10. Applicable Style Guide rules

| Rule | How it applies |
|---|---|
| SG-02 Secondary Actions Never Compete | Optional Skip stays a text button. |
| SG-17 Minimum Touch Targets | 12 px gap ≥ 8 px minimum. |
| SG-20 Disabled Primary Explains Itself | Review never disabled on this step. |
| SG-21 Equal-Weight Category Tiles | Uniform columns and tiles. |
| SG-23 Tile Dimensions and Grid | Column count, gap, 4-column threshold. |
| SG-25 Multi-Select Behavior | Toggle set, no limits, live summary, carry to Review. |
| SG-26 Unknown Is a First-Class Choice | Exclusivity, last position, Uncategorized when empty. |
| SG-30 Back Navigation Preserves Everything | Selection preserved. |
| SG-32 Error Recovery Without Data Loss | Selection survives failed save. |
| SG-38 4-Point Spacing Scale | Gaps and section spacing. |
| SG-39 Mobile-First Layout Frame | Gutters and width cap. |
| SG-41 Screen Reader Semantics | Group label, live announcements. |
| SG-43 Text Scaling | Two-column fallback. |

## 11. Acceptance criteria

1. Selecting two standard tiles keeps both selected; the summary reads "2 selected: …" with both labels. *(SG-25)*
2. With Food and Charity selected, selecting Unknown leaves exactly one selection (Unknown); selecting Food afterwards leaves exactly Food. *(SG-26)*
3. Miscellaneous combines with other categories without clearing them. *(SG-26)*
4. With zero selections, Review is enabled and the saved expense is recorded as Uncategorized. *(SG-20, SG-26)*
5. Unknown is the last tile and is visible without scrolling on a 360 × 640 viewport, or reachable within one scroll for long lists. *(SG-26)*
6. At 360 px width and default text size, the grid shows 3 columns of tiles ≥ 96 × 96 px with 12 px gaps. *(SG-23)*
7. Exclusivity changes are announced once by screen readers, naming what was cleared. *(SG-26, SG-41)*
8. Navigating back to Amount and forward again restores the same selection. *(SG-30)*
9. At 200 % text, the grid shows 2 columns and no label is truncated. *(SG-43)*
10. The category order is identical across visits. *(SG-21)*

## 12. Traceability

| Component property | Design token | Style Guide rule | Reference |
|---|---|---|---|
| Default column count | `component.categoryGrid.columns` | SG-23 | REF-P01 (adapted) |
| Large-text column count | `component.categoryGrid.columnsLargeText` | SG-43 | — |
| Tile gap | `component.categoryGrid.gap` | SG-23 | REF-P01 |
| 4-column threshold | `component.categoryTile.minWidthForFourColumns` | SG-23 | — |
| Side gutters | `layout.screen.gutter` | SG-39 | — |
| Max content width | `layout.screen.maxContentWidth` | SG-39 | — |
| Section spacing | `layout.section.gap` | SG-38 | — |
| Summary-to-button spacing | `layout.control.minGap` | SG-17 | — |
| Heading style | `typography.heading.1`, `color.text.primary` | SG-13 | — |
| Helper / summary style | `typography.body.default`, `color.text.secondary` | SG-13, SG-25 | — |
| Multi-select set (0…n) | — (behavioral) | SG-25 | — |
| Live selection summary | — (behavioral) | SG-25 | — |
| Unknown exclusivity | — (behavioral) | SG-26 | — |
| Unknown last position | — (behavioral) | SG-26 | — |
| Empty selection → Uncategorized | — (behavioral) | SG-26 | — |
| Primary never disabled here | — (behavioral) | SG-20 | — |
| Selection preserved | — (behavioral) | SG-30, SG-32 | — |
| Group label and announcements | — (behavioral) | SG-41 | — |
| Equal-weight layout | — (behavioral) | SG-21 | REF-P01, REF-G01 |

**Complete chain example:**
REF-P01 (uniform rows of identical icon + label choices) ⟶ **SG-23** Tile Dimensions and Grid ⟶ `space.3` ⟶ `component.categoryGrid.gap` ⟶ CategoryGrid gap between tiles 12 px.

*(⟶ reads "is the source of". In the token tables above, → means "aliases".)*

### Contradiction resolved in this spec (Style Guide clarification pending)

- **C-1 — 3 vs 4 columns at 420–430 px.** SG-23 says "3 columns on phones 360–430 px wide" and also "move to 4 columns only when each tile can still be ≥ 88 px wide". With 16 px gutters and 12 px gaps, four tiles reach 88 px at a viewport of 420 px, so the clauses conflict between 420 and 430 px. **Decision (approved): three columns across the documented phone range (320–430 px)**, subject to two constraints: tiles keep their 96 px minimum height and ≥ 48 px touch area, and if labels would exceed two lines (large text), the grid falls back to 2 columns (SG-43, trigger per D-3). Four columns only above 430 px with tiles ≥ 88 px. Recommended SG-23 clarification: README §8.
