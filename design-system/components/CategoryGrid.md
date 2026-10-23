# CategoryGrid — Component Specification

**Version:** 0.2 (draft) | **Date:** 24 October 2026
**Sources:** `docs/PRODUCT_VISION.md` v1.2 · `design-system/STYLE_GUIDE.md` v0.3 · `design-system/tokens.json` v0.1.0 · `references/REFERENCE_CATALOG.md` v0.7 · `src/data/categories.json` v1.0.0
**Primary reference:** REF-P01 (uniform icon + label grid)
**Related:** contains [CategoryTile](CategoryTile.md); sits above [PrimaryActionButton](PrimaryActionButton.md) on Step 2.
**Status:** Implementation-ready specification. No code.
**Change log:** 0.2 — approved category behavior (decisions D-15 – D-21): Unknown exclusivity removed; Other is a non-exclusive tile, always last; inactive categories shown disabled in place (SG-45); approved MVP order recorded. D-4 withdrawn. Token values unchanged.

---

## 1. Purpose and role

CategoryGrid is the body of the Categories step (Step 2). It lays out CategoryTiles in equal columns, owns the **selection set** for the expense, keeps **Other** last, renders **inactive categories** disabled in place, and shows a live **selection summary** so users can confirm what they chose without scrolling back.

It implements the product's "flexible tags, not forced buckets" model: zero, one or many tags; Other combines with any tag; zero tags is saved as Uncategorized; nothing is mandatory.

## 2. Relevant product requirements

| Requirement | Source |
|---|---|
| Zero, one or multiple tags per expense; an expense need not fit one category. | Vision §4.5 |
| Other is a valid choice and combines with other tags. | Vision §4.5; D-15 |
| Inactive categories are visible but cannot be selected. | D-18 |
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
 │ Tile │ │ Tile │ │Other │             (5) Other always last
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
| 5 | Other position | Fixed as the last tile. |
| 6 | Selection summary | One line directly above the primary button; updates live. |

## 4. Properties and accepted values

| Property | Type | Accepted values | Default | Notes |
|---|---|---|---|---|
| `categories` | ordered list | Category records (`categoryId`, `label`, `icon`, `active`) from `src/data/categories.json` | — (required) | Must contain exactly one Other category, always rendered last. Records with `active: false` render as disabled tiles (SG-45). |
| `selectedIds` | set of identifiers | 0…n IDs from `categories` | empty | Controlled value; preserved when navigating back and forward (SG-30). |
| `onChange` | action | — | — (required) | Fires with the new selection set. |
| `heading` | text | Plain question | `What was it for?` | Content proposal; wording to be confirmed. |
| `helperText` | text | One line | `Choose any that fit — or skip` | Content proposal. |

**Derived values (not inputs):**
- `summary` — e.g. "No category selected", "1 selected: Food", "2 selected: Food, Other".
- `columns` — computed from available width and text size (see §8).

**Saved result:** zero selections are stored as **Uncategorized**; Other is stored as a normal tag (SG-26).

## 5. States

| State | Description | Visual / token |
|---|---|---|
| **No selection** | Valid. Summary reads "No category selected — you can still continue". Primary button enabled. | `typography.body.default`, `color.text.secondary` |
| **One or more selected** | Tiles show selected state; summary lists labels in grid order. | Tile tokens; summary as above |
| **Inactive category** | Tile shown in the disabled state in its normal position; cannot be selected (SG-45). | `component.categoryTile.disabled.*` |
| **Focused tile** | Delegated to CategoryTile focused state. | `component.categoryTile.focused.ringColor` |
| **Large text** | Grid reflows to 2 columns (see §8). | `component.categoryGrid.columnsLargeText` |
| **Disabled / loading / error** | Not applicable to the grid in MVP. Category list is local; if it ever loads remotely, a separate spec is needed. | — |

## 6. Interaction behavior and feedback

### 6.1 Multi-select (SG-25)
- Tapping a standard tile toggles it; any number of standard tiles can be selected at once.
- Selection order does not matter; the summary always lists labels in grid order so it does not jump around.
- The grid never limits the number of selections and never forces at least one.

### 6.2 Other and inactive categories (SG-26, SG-45)
| Current selection | User action | Result |
|---|---|---|
| Food, Charity | Select **Other** | Food, Charity, Other (nothing cleared) |
| Other | Select **Food** | Food, Other |
| Other | Deselect **Other** | Empty (valid → Uncategorized) |
| Food | Tap an **inactive** tile | Food (no change; tile is disabled) |

No selection ever clears another; there is no exclusivity rule (D-15). D-4 (undo after clearing) is therefore withdrawn.

### 6.3 Continuing
- The PrimaryActionButton ("Review") is **always enabled** on this step, including with zero selections (SG-20).
- A **Skip** text button is optional (§G of the Style Guide); if present it behaves exactly like Review with an empty selection and must not compete visually (SG-02). See open decision D-5.

### 6.4 Preservation
- Selections survive back/forward navigation, app backgrounding and failed saves (SG-30, SG-32).
- Selected tags carry forward to the Review step, where each can be removed (SG-25).

### 6.5 Order and placement
- Category order is fixed by the category list, not by usage frequency, so tiles do not move between visits.
- Approved MVP order: Food, Home, Shop, Transit, Health, Fun, Travel, Charity, Other (D-17). It may be revised later from real user behavior, by changing the category list.
- Other is always the last tile (SG-26). Inactive categories keep their position (SG-45).

## 7. Accessibility requirements

| Requirement | Detail | Rule |
|---|---|---|
| Group semantics | The grid is a labelled group: "What was it for? Choose any that fit." Screen readers convey that multiple choices are allowed. | SG-25, SG-41 |
| Tile semantics | Each tile is a checkbox (see CategoryTile §7). | SG-25, SG-41 |
| Disabled tiles | Inactive tiles stay in reading order and are announced as unavailable (see CategoryTile §7). | SG-41, SG-45 |
| Summary | The summary line is a polite live region and reads e.g. "2 selected: Food, Charity". | SG-25, SG-41 |
| Reading order | Heading → helper → tiles in visual order (row by row) → summary → primary button. | SG-41 |
| Other reachability | Other is visible without scrolling on 360 × 640, or reachable within one scroll; it is the last tile in reading order. | SG-26 |
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
| SG-26 Other and Uncategorized Are First-Class Choices | Other last and non-exclusive; Uncategorized when empty. |
| SG-30 Back Navigation Preserves Everything | Selection preserved. |
| SG-32 Error Recovery Without Data Loss | Selection survives failed save. |
| SG-38 4-Point Spacing Scale | Gaps and section spacing. |
| SG-39 Mobile-First Layout Frame | Gutters and width cap. |
| SG-41 Screen Reader Semantics | Group label, live announcements. |
| SG-43 Text Scaling | Two-column fallback. |
| SG-45 Inactive Categories Are Visible but Disabled | Inactive records rendered disabled, in place. |

## 11. Acceptance criteria

1. Selecting two standard tiles keeps both selected; the summary reads "2 selected: …" with both labels. *(SG-25)*
2. With Food and Charity selected, selecting Other leaves all three selected. *(SG-26)*
3. An inactive category appears in the disabled state in its normal position, and tapping it does not change the selection. *(SG-45)*
4. With zero selections, Review is enabled and the saved expense is recorded as Uncategorized. *(SG-20, SG-26)*
5. Other is the last tile and is visible without scrolling on a 360 × 640 viewport, or reachable within one scroll for long lists. *(SG-26)*
6. At 360 px width and default text size, the grid shows 3 columns of tiles ≥ 96 × 96 px with 12 px gaps. *(SG-23)*
7. Each selection change is announced once through the summary live region. *(SG-25, SG-41)*
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
| Inactive shown disabled, in place | `component.categoryTile.disabled.*` | SG-45 | — |
| Other last position | — (behavioral) | SG-26 | — |
| Empty selection → Uncategorized | — (behavioral) | SG-26 | — |
| Primary never disabled here | — (behavioral) | SG-20 | — |
| Selection preserved | — (behavioral) | SG-30, SG-32 | — |
| Group label and announcements | — (behavioral) | SG-41 | — |
| Equal-weight layout | — (behavioral) | SG-21 | REF-P01 |

**Complete chain example:**
REF-P01 (uniform rows of identical icon + label choices) ⟶ **SG-23** Tile Dimensions and Grid ⟶ `space.3` ⟶ `component.categoryGrid.gap` ⟶ CategoryGrid gap between tiles 12 px.

*(⟶ reads "is the source of". In the token tables above, → means "aliases".)*

### Contradiction resolved (SG-23 clarified in Style Guide v0.2)

- **C-1 — 3 vs 4 columns at 420–430 px.** SG-23 says "3 columns on phones 360–430 px wide" and also "move to 4 columns only when each tile can still be ≥ 88 px wide". With 16 px gutters and 12 px gaps, four tiles reach 88 px at a viewport of 420 px, so the clauses conflict between 420 and 430 px. **Decision (approved): three columns across the documented phone range (320–430 px)**, subject to two constraints: tiles keep their 96 px minimum height and ≥ 48 px touch area, and if labels would exceed two lines (large text), the grid falls back to 2 columns (SG-43, trigger per D-3). Four columns only above 430 px with tiles ≥ 88 px. SG-23 was clarified to this wording in Style Guide v0.2.
